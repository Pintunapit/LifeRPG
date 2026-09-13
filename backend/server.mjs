/**
 * LifeRPG – Express backend
 * Handles all Supabase data operations using the service-role key
 * (bypasses RLS so writes are always trusted server-side).
 *
 * Auth verification uses the user's JWT (anon/user token) passed in
 * the Authorization header. We decode it with the Supabase admin client
 * to obtain the authenticated user_id before every mutation.
 *
 * Start: node backend/server.mjs
 */

import 'dotenv/config';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';

// ── Resolve .env from the backend/ directory ──────────────────────────────────
const __dirname = path.dirname(fileURLToPath(import.meta.url));
import dotenv from 'dotenv';
dotenv.config({ path: path.join(__dirname, '.env') });

// ── Supabase clients ──────────────────────────────────────────────────────────
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌  Missing Supabase env vars. Check backend/.env');
  process.exit(1);
}

// Admin client – bypasses RLS (server-side only, never sent to frontend)
const adminSupabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false }
});

// ── Express setup ─────────────────────────────────────────────────────────────
const app = express();
// Render injects PORT automatically; fall back to BACKEND_PORT for local dev
const PORT = Number(process.env.PORT || process.env.BACKEND_PORT || 4000);
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || 'http://localhost:3000';

app.use(cors({
  origin: (origin, callback) => {
    // Allow localhost (dev) and the configured production frontend origin
    const allowed = [FRONTEND_ORIGIN];
    if (
      !origin ||
      /^http:\/\/localhost:\d+$/.test(origin) ||
      allowed.some(o => origin === o || origin.endsWith('.vercel.app') || origin.endsWith('.onrender.com'))
    ) {
      callback(null, true);
    } else {
      callback(new Error(`CORS: origin ${origin} not allowed`));
    }
  },
  credentials: true
}));
app.use(express.json({ limit: '1mb' }));

// ── Auth middleware ───────────────────────────────────────────────────────────
/**
 * Extracts the bearer JWT from the Authorization header, verifies it with
 * Supabase Auth, and attaches req.userId + req.userEmail for route handlers.
 */
async function requireAuth(req, res, next) {
  const header = req.headers['authorization'] || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: 'Missing auth token.' });
  }

  const { data, error } = await adminSupabase.auth.getUser(token);
  if (error || !data?.user) {
    return res.status(401).json({ error: 'Invalid or expired session.' });
  }

  req.userId = data.user.id;
  req.userEmail = data.user.email ?? '';
  next();
}

// ── Helpers ───────────────────────────────────────────────────────────────────
const ok = (res, data) => res.json({ data });
const err = (res, status, message) => res.status(status).json({ error: message });
const dbErr = (res, e) => {
  console.error('[DB]', e?.message ?? e);
  return err(res, 500, e?.message ?? 'Database error');
};

// ─────────────────────────────────────────────────────────────────────────────
//  AUTH ROUTES
// ─────────────────────────────────────────────────────────────────────────────

/**
 * POST /api/auth/signup
 * Body: { name, email, password }
 */
app.post('/api/auth/signup', async (req, res) => {
  const { name, email, password } = req.body ?? {};
  if (!name || !email || !password) return err(res, 400, 'name, email and password are required.');

  const { data, error } = await adminSupabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { name }
  });
  if (error) return err(res, 400, error.message);

  ok(res, { user: data.user });
});

/**
 * POST /api/auth/login
 * Body: { email, password }
 * Returns: { session, user }
 */
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body ?? {};
  if (!email || !password) return err(res, 400, 'email and password are required.');

  // Use anon client for sign-in so Supabase returns a proper user session
  const anonClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: false }
  });
  const { data, error } = await anonClient.auth.signInWithPassword({ email, password });
  if (error) return err(res, 401, error.message);

  ok(res, { session: data.session, user: data.user });
});

/**
 * POST /api/auth/logout
 */
app.post('/api/auth/logout', requireAuth, async (req, res) => {
  // Server-side logout invalidates the token
  await adminSupabase.auth.admin.signOut(req.userId);
  ok(res, { message: 'Logged out.' });
});

// ─────────────────────────────────────────────────────────────────────────────
//  PLAYER ROUTES
// ─────────────────────────────────────────────────────────────────────────────

/** GET /api/player – fetch the player row for the authenticated user */
app.get('/api/player', requireAuth, async (req, res) => {
  const { data, error } = await adminSupabase
    .from('players')
    .select('*')
    .eq('user_id', req.userId)
    .single();

  if (error && error.code !== 'PGRST116') return dbErr(res, error);
  ok(res, data ?? null);
});

/** POST /api/player – create a brand-new player row */
app.post('/api/player', requireAuth, async (req, res) => {
  const p = req.body;
  const row = {
    user_id:          req.userId,
    name:             p.name ?? 'Hero',
    email:            p.email ?? req.userEmail,
    bio:              p.bio ?? '',
    title:            p.title ?? 'Newcomer',
    avatar:           p.avatar ?? '⚔️',
    level:            p.level ?? 1,
    current_xp:       p.currentXP ?? 0,
    gold:             p.gold ?? 100,
    attribute_points: p.attributePoints ?? 0,
    strength:         p.attributes?.Strength ?? 10,
    intellect:        p.attributes?.Intellect ?? 10,
    discipline:       p.attributes?.Discipline ?? 10,
    creativity:       p.attributes?.Creativity ?? 10,
    health:           p.attributes?.Health ?? 10,
    focus:            p.attributes?.Focus ?? 10,
    streak:           p.streak ?? 0,
    longest_streak:   p.longestStreak ?? 0,
    last_active_date: p.lastActiveDate ?? '',
    joined_date:      p.joinedDate ?? new Date().toISOString().split('T')[0],
    equipped_theme:   p.equippedTheme ?? 'dark-obsidian',
    equipped_badge:   p.equippedBadge ?? ''
  };

  const { data, error } = await adminSupabase
    .from('players')
    .insert(row)
    .select()
    .single();

  if (error) return dbErr(res, error);
  ok(res, data);
});

/** PUT /api/player – upsert (update or create) the player row */
app.put('/api/player', requireAuth, async (req, res) => {
  const p = req.body;
  const row = {
    user_id:          req.userId,
    name:             p.name,
    email:            p.email ?? req.userEmail,
    bio:              p.bio,
    title:            p.title,
    avatar:           p.avatar,
    level:            p.level,
    current_xp:       p.currentXP,
    gold:             p.gold,
    attribute_points: p.attributePoints,
    strength:         p.attributes?.Strength,
    intellect:        p.attributes?.Intellect,
    discipline:       p.attributes?.Discipline,
    creativity:       p.attributes?.Creativity,
    health:           p.attributes?.Health,
    focus:            p.attributes?.Focus,
    streak:           p.streak,
    longest_streak:   p.longestStreak,
    last_active_date: p.lastActiveDate,
    joined_date:      p.joinedDate,
    equipped_theme:   p.equippedTheme,
    equipped_badge:   p.equippedBadge
  };

  // Remove undefined keys so we don't overwrite valid DB values with null
  Object.keys(row).forEach(k => row[k] === undefined && delete row[k]);

  const { data, error } = await adminSupabase
    .from('players')
    .upsert(row, { onConflict: 'user_id' })
    .select()
    .single();

  if (error) return dbErr(res, error);
  ok(res, data);
});

// ─────────────────────────────────────────────────────────────────────────────
//  QUEST ROUTES
// ─────────────────────────────────────────────────────────────────────────────

app.get('/api/quests', requireAuth, async (req, res) => {
  const { data, error } = await adminSupabase
    .from('quests')
    .select('*')
    .eq('user_id', req.userId)
    .order('created_at', { ascending: false });

  if (error) return dbErr(res, error);
  ok(res, data ?? []);
});

app.post('/api/quests', requireAuth, async (req, res) => {
  const q = req.body;
  const row = {
    id:               q.id ?? `quest-${Date.now()}`,
    user_id:          req.userId,
    title:            q.title,
    description:      q.description ?? '',
    category:         q.category,
    difficulty:       q.difficulty,
    xp_reward:        q.xpReward,
    gold_reward:      q.goldReward,
    attribute_type:   q.attributeType,
    attribute_reward: q.attributeReward,
    is_daily:         q.isDaily ?? false,
    is_weekly:        q.isWeekly ?? false,
    completed:        q.completed ?? false,
    completed_at:     q.completedAt ?? null,
    deadline:         q.deadline ?? null
  };

  const { data, error } = await adminSupabase
    .from('quests')
    .insert(row)
    .select()
    .single();

  if (error) return dbErr(res, error);
  ok(res, data);
});

app.put('/api/quests/:id', requireAuth, async (req, res) => {
  const q = req.body;
  const updates = {};
  if (q.completed      !== undefined) updates.completed     = q.completed;
  if (q.completedAt    !== undefined) updates.completed_at  = q.completedAt;
  if (q.title          !== undefined) updates.title         = q.title;
  if (q.description    !== undefined) updates.description   = q.description;
  if (q.deadline       !== undefined) updates.deadline      = q.deadline;

  const { data, error } = await adminSupabase
    .from('quests')
    .update(updates)
    .eq('id', req.params.id)
    .eq('user_id', req.userId)
    .select()
    .single();

  if (error) return dbErr(res, error);
  ok(res, data);
});

app.delete('/api/quests/:id', requireAuth, async (req, res) => {
  const { error } = await adminSupabase
    .from('quests')
    .delete()
    .eq('id', req.params.id)
    .eq('user_id', req.userId);

  if (error) return dbErr(res, error);
  ok(res, { deleted: req.params.id });
});

/** POST /api/quests/seed – bulk-insert default quests for a brand-new user */
app.post('/api/quests/seed', requireAuth, async (req, res) => {
  const quests = req.body; // array
  if (!Array.isArray(quests)) return err(res, 400, 'Expected array of quests.');

  const rows = quests.map(q => ({
    id:               q.id,
    user_id:          req.userId,
    title:            q.title,
    description:      q.description ?? '',
    category:         q.category,
    difficulty:       q.difficulty,
    xp_reward:        q.xpReward,
    gold_reward:      q.goldReward,
    attribute_type:   q.attributeType,
    attribute_reward: q.attributeReward,
    is_daily:         q.isDaily ?? false,
    is_weekly:        q.isWeekly ?? false,
    completed:        q.completed ?? false,
    completed_at:     q.completedAt ?? null,
    deadline:         q.deadline ?? null
  }));

  const { data, error } = await adminSupabase
    .from('quests')
    .upsert(rows, { onConflict: 'id' })
    .select();

  if (error) return dbErr(res, error);
  ok(res, data);
});

// ─────────────────────────────────────────────────────────────────────────────
//  ACHIEVEMENT ROUTES
// ─────────────────────────────────────────────────────────────────────────────

app.get('/api/achievements', requireAuth, async (req, res) => {
  const { data, error } = await adminSupabase
    .from('achievements')
    .select('*')
    .eq('user_id', req.userId)
    .order('id');

  if (error) return dbErr(res, error);
  ok(res, data ?? []);
});

app.post('/api/achievements/seed', requireAuth, async (req, res) => {
  const achievements = req.body;
  if (!Array.isArray(achievements)) return err(res, 400, 'Expected array.');

  const rows = achievements.map(a => ({
    id:               a.id,
    user_id:          req.userId,
    title:            a.title,
    description:      a.description ?? '',
    icon:             a.icon ?? '🏆',
    category:         a.category ?? 'General',
    current_progress: a.currentProgress ?? 0,
    max_progress:     a.maxProgress ?? 1,
    unlocked:         a.unlocked ?? false,
    unlocked_at:      a.unlockedAt ?? null,
    reward_xp:        a.rewardXp ?? 0,
    reward_gold:      a.rewardGold ?? 0
  }));

  const { data, error } = await adminSupabase
    .from('achievements')
    .upsert(rows, { onConflict: 'id' })
    .select();

  if (error) return dbErr(res, error);
  ok(res, data);
});

app.put('/api/achievements/:id', requireAuth, async (req, res) => {
  const a = req.body;
  const updates = {};
  if (a.currentProgress !== undefined) updates.current_progress = a.currentProgress;
  if (a.unlocked        !== undefined) updates.unlocked         = a.unlocked;
  if (a.unlockedAt      !== undefined) updates.unlocked_at      = a.unlockedAt;

  const { data, error } = await adminSupabase
    .from('achievements')
    .update(updates)
    .eq('id', req.params.id)
    .eq('user_id', req.userId)
    .select()
    .single();

  if (error) return dbErr(res, error);
  ok(res, data);
});

/** PUT /api/achievements – bulk update the whole list */
app.put('/api/achievements', requireAuth, async (req, res) => {
  const achievements = req.body;
  if (!Array.isArray(achievements)) return err(res, 400, 'Expected array.');

  const rows = achievements.map(a => ({
    id:               a.id,
    user_id:          req.userId,
    title:            a.title,
    description:      a.description ?? '',
    icon:             a.icon ?? '🏆',
    category:         a.category ?? 'General',
    current_progress: a.currentProgress ?? 0,
    max_progress:     a.maxProgress ?? 1,
    unlocked:         a.unlocked ?? false,
    unlocked_at:      a.unlockedAt ?? null,
    reward_xp:        a.rewardXp ?? 0,
    reward_gold:      a.rewardGold ?? 0
  }));

  const { data, error } = await adminSupabase
    .from('achievements')
    .upsert(rows, { onConflict: 'id' })
    .select();

  if (error) return dbErr(res, error);
  ok(res, data);
});

// ─────────────────────────────────────────────────────────────────────────────
//  SHOP ITEMS ROUTES
// ─────────────────────────────────────────────────────────────────────────────

app.get('/api/shop', requireAuth, async (req, res) => {
  const { data, error } = await adminSupabase
    .from('shop_items')
    .select('*')
    .eq('user_id', req.userId)
    .order('id');

  if (error) return dbErr(res, error);
  ok(res, data ?? []);
});

app.post('/api/shop/seed', requireAuth, async (req, res) => {
  const items = req.body;
  if (!Array.isArray(items)) return err(res, 400, 'Expected array.');

  const rows = items.map(i => ({
    id:               i.id,
    user_id:          req.userId,
    name:             i.name,
    description:      i.description ?? '',
    category:         i.category,
    price:            i.price,
    icon:             i.icon ?? '🎁',
    value:            i.value ?? '',
    is_purchased:     i.isPurchased ?? false,
    is_equipped:      i.isEquipped ?? false,
    buff_description: i.buffDescription ?? null
  }));

  const { data, error } = await adminSupabase
    .from('shop_items')
    .upsert(rows, { onConflict: 'id' })
    .select();

  if (error) return dbErr(res, error);
  ok(res, data);
});

app.put('/api/shop/:id', requireAuth, async (req, res) => {
  const i = req.body;
  const updates = {};
  if (i.isPurchased !== undefined) updates.is_purchased = i.isPurchased;
  if (i.isEquipped  !== undefined) updates.is_equipped  = i.isEquipped;

  const { data, error } = await adminSupabase
    .from('shop_items')
    .update(updates)
    .eq('id', req.params.id)
    .eq('user_id', req.userId)
    .select()
    .single();

  if (error) return dbErr(res, error);
  ok(res, data);
});

// ─────────────────────────────────────────────────────────────────────────────
//  INVENTORY ROUTES
// ─────────────────────────────────────────────────────────────────────────────

app.get('/api/inventory', requireAuth, async (req, res) => {
  const { data, error } = await adminSupabase
    .from('inventory')
    .select('*')
    .eq('user_id', req.userId)
    .order('created_at');

  if (error) return dbErr(res, error);
  ok(res, data ?? []);
});

app.post('/api/inventory', requireAuth, async (req, res) => {
  const i = req.body;
  const row = {
    id:               i.id,
    user_id:          req.userId,
    name:             i.name,
    description:      i.description ?? '',
    category:         i.category,
    price:            i.price,
    icon:             i.icon ?? '🎁',
    value:            i.value ?? '',
    is_purchased:     true,
    is_equipped:      i.isEquipped ?? false,
    buff_description: i.buffDescription ?? null,
    purchased_at:     i.purchasedAt ?? new Date().toISOString()
  };

  const { data, error } = await adminSupabase
    .from('inventory')
    .insert(row)
    .select()
    .single();

  if (error) return dbErr(res, error);
  ok(res, data);
});

app.post('/api/inventory/seed', requireAuth, async (req, res) => {
  const items = req.body;
  if (!Array.isArray(items)) return err(res, 400, 'Expected array.');

  const rows = items.map(i => ({
    id:               i.id,
    user_id:          req.userId,
    name:             i.name,
    description:      i.description ?? '',
    category:         i.category,
    price:            i.price,
    icon:             i.icon ?? '🎁',
    value:            i.value ?? '',
    is_purchased:     true,
    is_equipped:      i.isEquipped ?? false,
    buff_description: i.buffDescription ?? null,
    purchased_at:     i.purchasedAt ?? new Date().toISOString()
  }));

  const { data, error } = await adminSupabase
    .from('inventory')
    .upsert(rows, { onConflict: 'id' })
    .select();

  if (error) return dbErr(res, error);
  ok(res, data);
});

app.put('/api/inventory/:id', requireAuth, async (req, res) => {
  const i = req.body;
  const updates = {};
  if (i.isEquipped !== undefined) updates.is_equipped = i.isEquipped;

  const { data, error } = await adminSupabase
    .from('inventory')
    .update(updates)
    .eq('id', req.params.id)
    .eq('user_id', req.userId)
    .select()
    .single();

  if (error) return dbErr(res, error);
  ok(res, data);
});

/** PUT /api/inventory – bulk upsert (used for equip/unequip category sweeps) */
app.put('/api/inventory', requireAuth, async (req, res) => {
  const items = req.body;
  if (!Array.isArray(items)) return err(res, 400, 'Expected array.');

  const rows = items.map(i => ({
    id:               i.id,
    user_id:          req.userId,
    name:             i.name,
    description:      i.description ?? '',
    category:         i.category,
    price:            i.price,
    icon:             i.icon ?? '🎁',
    value:            i.value ?? '',
    is_purchased:     true,
    is_equipped:      i.isEquipped ?? false,
    buff_description: i.buffDescription ?? null,
    purchased_at:     i.purchasedAt ?? new Date().toISOString()
  }));

  const { data, error } = await adminSupabase
    .from('inventory')
    .upsert(rows, { onConflict: 'id' })
    .select();

  if (error) return dbErr(res, error);
  ok(res, data);
});

// ─────────────────────────────────────────────────────────────────────────────
//  SKILLS ROUTES
// ─────────────────────────────────────────────────────────────────────────────

app.get('/api/skills', requireAuth, async (req, res) => {
  const { data, error } = await adminSupabase
    .from('skills')
    .select('*')
    .eq('user_id', req.userId)
    .order('tier');

  if (error) return dbErr(res, error);
  ok(res, data ?? []);
});

app.post('/api/skills/seed', requireAuth, async (req, res) => {
  const skills = req.body;
  if (!Array.isArray(skills)) return err(res, 400, 'Expected array.');

  const rows = skills.map(s => ({
    id:                   s.id,
    user_id:              req.userId,
    title:                s.title,
    branch:               s.branch,
    tier:                 s.tier,
    description:          s.description ?? '',
    icon:                 s.icon ?? '⭐',
    required_level:       s.requiredLevel,
    req_attr_type:        s.requiredAttribute?.type ?? 'Intellect',
    req_attr_value:       s.requiredAttribute?.value ?? 0,
    cost_attribute_points: s.costAttributePoints,
    cost_gold:            s.costGold,
    unlocked:             s.unlocked ?? false,
    unlocked_at:          s.unlockedAt ?? null,
    parent_id:            s.parentId ?? null,
    perk:                 s.perk ?? ''
  }));

  const { data, error } = await adminSupabase
    .from('skills')
    .upsert(rows, { onConflict: 'id' })
    .select();

  if (error) return dbErr(res, error);
  ok(res, data);
});

app.put('/api/skills/:id', requireAuth, async (req, res) => {
  const s = req.body;
  const updates = {};
  if (s.unlocked   !== undefined) updates.unlocked    = s.unlocked;
  if (s.unlockedAt !== undefined) updates.unlocked_at = s.unlockedAt;

  const { data, error } = await adminSupabase
    .from('skills')
    .update(updates)
    .eq('id', req.params.id)
    .eq('user_id', req.userId)
    .select()
    .single();

  if (error) return dbErr(res, error);
  ok(res, data);
});

// ─────────────────────────────────────────────────────────────────────────────
//  LOOT CHESTS ROUTES
// ─────────────────────────────────────────────────────────────────────────────

app.get('/api/chests', requireAuth, async (req, res) => {
  const { data, error } = await adminSupabase
    .from('loot_chests')
    .select('*')
    .eq('user_id', req.userId)
    .order('id');

  if (error) return dbErr(res, error);
  ok(res, data ?? []);
});

app.post('/api/chests/seed', requireAuth, async (req, res) => {
  const chests = req.body;
  if (!Array.isArray(chests)) return err(res, 400, 'Expected array.');

  const rows = chests.map(c => ({
    id:               c.id,
    user_id:          req.userId,
    type:             c.type,
    name:             c.name,
    description:      c.description ?? '',
    requirement_text: c.requirementText ?? '',
    progress:         c.progress ?? 0,
    max_progress:     c.maxProgress,
    unlocked:         c.unlocked ?? false,
    opened:           c.opened ?? false,
    reward_gold:      c.reward?.gold ?? 0,
    reward_xp:        c.reward?.xp ?? 0,
    reward_title:     c.reward?.title ?? null,
    reward_badge:     c.reward?.badge ?? null,
    reward_avatar:    c.reward?.avatar ?? null
  }));

  const { data, error } = await adminSupabase
    .from('loot_chests')
    .upsert(rows, { onConflict: 'id' })
    .select();

  if (error) return dbErr(res, error);
  ok(res, data);
});

app.put('/api/chests/:id', requireAuth, async (req, res) => {
  const c = req.body;
  const updates = {};
  if (c.progress  !== undefined) updates.progress  = c.progress;
  if (c.unlocked  !== undefined) updates.unlocked  = c.unlocked;
  if (c.opened    !== undefined) updates.opened    = c.opened;

  const { data, error } = await adminSupabase
    .from('loot_chests')
    .update(updates)
    .eq('id', req.params.id)
    .eq('user_id', req.userId)
    .select()
    .single();

  if (error) return dbErr(res, error);
  ok(res, data);
});

/** PUT /api/chests – bulk update all chests */
app.put('/api/chests', requireAuth, async (req, res) => {
  const chests = req.body;
  if (!Array.isArray(chests)) return err(res, 400, 'Expected array.');

  const rows = chests.map(c => ({
    id:               c.id,
    user_id:          req.userId,
    type:             c.type,
    name:             c.name,
    description:      c.description ?? '',
    requirement_text: c.requirementText ?? '',
    progress:         c.progress ?? 0,
    max_progress:     c.maxProgress,
    unlocked:         c.unlocked ?? false,
    opened:           c.opened ?? false,
    reward_gold:      c.reward?.gold ?? 0,
    reward_xp:        c.reward?.xp ?? 0,
    reward_title:     c.reward?.title ?? null,
    reward_badge:     c.reward?.badge ?? null,
    reward_avatar:    c.reward?.avatar ?? null
  }));

  const { data, error } = await adminSupabase
    .from('loot_chests')
    .upsert(rows, { onConflict: 'id' })
    .select();

  if (error) return dbErr(res, error);
  ok(res, data);
});

// ─────────────────────────────────────────────────────────────────────────────
//  DAILY MISSIONS ROUTES
// ─────────────────────────────────────────────────────────────────────────────

app.get('/api/missions', requireAuth, async (req, res) => {
  const { data, error } = await adminSupabase
    .from('daily_missions')
    .select('*')
    .eq('user_id', req.userId)
    .order('id');

  if (error) return dbErr(res, error);
  ok(res, data ?? []);
});

app.post('/api/missions/seed', requireAuth, async (req, res) => {
  const missions = req.body;
  if (!Array.isArray(missions)) return err(res, 400, 'Expected array.');

  const rows = missions.map(m => ({
    id:          m.id,
    user_id:     req.userId,
    title:       m.title,
    category:    m.category,
    target:      m.target,
    current:     m.current ?? 0,
    completed:   m.completed ?? false,
    reward_xp:   m.rewardXp,
    reward_gold: m.rewardGold
  }));

  const { data, error } = await adminSupabase
    .from('daily_missions')
    .upsert(rows, { onConflict: 'id' })
    .select();

  if (error) return dbErr(res, error);
  ok(res, data);
});

app.put('/api/missions/:id', requireAuth, async (req, res) => {
  const m = req.body;
  const updates = {};
  if (m.current   !== undefined) updates.current   = m.current;
  if (m.completed !== undefined) updates.completed = m.completed;

  const { data, error } = await adminSupabase
    .from('daily_missions')
    .update(updates)
    .eq('id', req.params.id)
    .eq('user_id', req.userId)
    .select()
    .single();

  if (error) return dbErr(res, error);
  ok(res, data);
});

/** PUT /api/missions – bulk update all missions */
app.put('/api/missions', requireAuth, async (req, res) => {
  const missions = req.body;
  if (!Array.isArray(missions)) return err(res, 400, 'Expected array.');

  const rows = missions.map(m => ({
    id:          m.id,
    user_id:     req.userId,
    title:       m.title,
    category:    m.category,
    target:      m.target,
    current:     m.current ?? 0,
    completed:   m.completed ?? false,
    reward_xp:   m.rewardXp,
    reward_gold: m.rewardGold
  }));

  const { data, error } = await adminSupabase
    .from('daily_missions')
    .upsert(rows, { onConflict: 'id' })
    .select();

  if (error) return dbErr(res, error);
  ok(res, data);
});

// ─────────────────────────────────────────────────────────────────────────────
//  GAME SETTINGS ROUTES
// ─────────────────────────────────────────────────────────────────────────────

app.get('/api/settings', requireAuth, async (req, res) => {
  const { data, error } = await adminSupabase
    .from('game_settings')
    .select('*')
    .eq('user_id', req.userId)
    .single();

  if (error && error.code !== 'PGRST116') return dbErr(res, error);
  ok(res, data ?? null);
});

app.put('/api/settings', requireAuth, async (req, res) => {
  const s = req.body;
  const row = {
    user_id:             req.userId,
    sound_enabled:       s.soundEnabled,
    animations_enabled:  s.animationsEnabled,
    theme:               s.theme,
    quest_reminders:     s.questReminders,
    streak_alerts:       s.streakAlerts,
    daily_bonus_claimed: s.dailyBonusClaimed
  };

  // Drop undefined fields
  Object.keys(row).forEach(k => row[k] === undefined && delete row[k]);

  const { data, error } = await adminSupabase
    .from('game_settings')
    .upsert(row, { onConflict: 'user_id' })
    .select()
    .single();

  if (error) return dbErr(res, error);
  ok(res, data);
});

// ─────────────────────────────────────────────────────────────────────────────
//  NOTIFICATION ROUTES
// ─────────────────────────────────────────────────────────────────────────────

app.get('/api/notifications', requireAuth, async (req, res) => {
  const { data, error } = await adminSupabase
    .from('notifications')
    .select('*')
    .eq('user_id', req.userId)
    .order('created_at', { ascending: false })
    .limit(20);

  if (error) return dbErr(res, error);
  ok(res, data ?? []);
});

app.post('/api/notifications', requireAuth, async (req, res) => {
  const n = req.body;
  const row = {
    id:        n.id ?? `notif-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    user_id:   req.userId,
    title:     n.title,
    message:   n.message ?? '',
    timestamp: n.timestamp ?? 'Just now',
    type:      n.type ?? 'quest',
    read:      n.read ?? false
  };

  const { data, error } = await adminSupabase
    .from('notifications')
    .insert(row)
    .select()
    .single();

  if (error) return dbErr(res, error);
  ok(res, data);
});

/** PUT /api/notifications/read-all */
app.put('/api/notifications/read-all', requireAuth, async (req, res) => {
  const { data, error } = await adminSupabase
    .from('notifications')
    .update({ read: true })
    .eq('user_id', req.userId)
    .select();

  if (error) return dbErr(res, error);
  ok(res, data);
});

app.post('/api/notifications/seed', requireAuth, async (req, res) => {
  const items = req.body;
  if (!Array.isArray(items)) return err(res, 400, 'Expected array.');

  const rows = items.map(n => ({
    id:        n.id,
    user_id:   req.userId,
    title:     n.title,
    message:   n.message ?? '',
    timestamp: n.timestamp ?? 'Just now',
    type:      n.type ?? 'quest',
    read:      n.read ?? false
  }));

  const { data, error } = await adminSupabase
    .from('notifications')
    .upsert(rows, { onConflict: 'id' })
    .select();

  if (error) return dbErr(res, error);
  ok(res, data);
});

// ─────────────────────────────────────────────────────────────────────────────
//  OPENAI CHAT (proxy from old chatServer.mjs, merged here)
// ─────────────────────────────────────────────────────────────────────────────

import OpenAI from 'openai';

const openaiClient = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

app.post('/api/chat', async (req, res) => {
  if (!openaiClient) {
    return err(res, 503, 'RPG Guide is in offline mode. Add OPENAI_API_KEY to enable live AI.');
  }

  const { message, context, history = [] } = req.body ?? {};
  if (typeof message !== 'string' || !message.trim()) {
    return err(res, 400, 'A message is required.');
  }

  try {
    const response = await openaiClient.responses.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o',
      store: false,
      max_output_tokens: 500,
      instructions: `You are RPG Guide, a concise, helpful companion for a real-life productivity RPG. Use supplied game data only; do not claim to have changed state. If proposing a quest, put a single machine-readable JSON object between <quest> and </quest> with title, description, category, difficulty, xpReward, goldReward, attributeType, attributeReward, deadline. Valid categories are Coding, Study, Fitness, Reading, Personal, Health. Keep XP 10-1000 and Gold 5-500.`,
      input: `Game context: ${JSON.stringify(context)}\nRecent conversation: ${JSON.stringify(history.slice(-6))}\nHero: ${message}`
    });
    ok(res, { content: response.output_text || 'Your guide could not form a response.' });
  } catch (e) {
    console.error('Chat request failed:', e?.message ?? e);
    err(res, 500, 'RPG Guide could not reach the guild archives. Please retry.');
  }
});

// ─────────────────────────────────────────────────────────────────────────────
//  Health check
// ─────────────────────────────────────────────────────────────────────────────

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', ts: new Date().toISOString() });
});

// ─────────────────────────────────────────────────────────────────────────────
//  Start
// ─────────────────────────────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`✅  LifeRPG backend listening on http://localhost:${PORT}`);
  console.log(`    Supabase URL: ${SUPABASE_URL}`);
});
