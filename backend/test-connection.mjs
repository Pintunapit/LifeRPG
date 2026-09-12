/**
 * LifeRPG – Supabase connection test
 * Run: node backend/test-connection.mjs
 *
 * Tests:
 *  1. Env vars are present and correctly formatted
 *  2. Anon client can reach the database (public schema ping)
 *  3. Admin client can read the players table (tests service role key)
 *  4. Admin client can insert and delete a test player row (tests RLS bypass)
 */

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });

const SUPABASE_URL             = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY        = process.env.SUPABASE_ANON_KEY;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const pass = (msg) => console.log(`  ✅  ${msg}`);
const fail = (msg) => console.log(`  ❌  ${msg}`);
const info = (msg) => console.log(`  ℹ️   ${msg}`);

console.log('\n══════════════════════════════════════════');
console.log('  LifeRPG – Supabase Connection Test');
console.log('══════════════════════════════════════════\n');

// ── 1. Env var checks ─────────────────────────────────────────────────────────

console.log('[ 1 ] Checking environment variables...');

let envOk = true;

if (!SUPABASE_URL) {
  fail('SUPABASE_URL is missing'); envOk = false;
} else if (SUPABASE_URL.includes('/rest/v1')) {
  fail(`SUPABASE_URL must NOT include /rest/v1/\n      Current value: ${SUPABASE_URL}\n      Fix: use the bare project URL, e.g. https://xxxx.supabase.co`);
  envOk = false;
} else {
  pass(`SUPABASE_URL = ${SUPABASE_URL}`);
}

if (!SUPABASE_ANON_KEY) {
  fail('SUPABASE_ANON_KEY is missing'); envOk = false;
} else if (!SUPABASE_ANON_KEY.startsWith('eyJ')) {
  fail(`SUPABASE_ANON_KEY looks wrong. Expected a JWT (starts with eyJ).\n      Current value starts with: ${SUPABASE_ANON_KEY.slice(0, 20)}...\n      Fix: copy the "anon public" JWT from Supabase Dashboard > Project Settings > API`);
  envOk = false;
} else {
  pass(`SUPABASE_ANON_KEY starts with eyJ... ✓`);
}

if (!SUPABASE_SERVICE_ROLE_KEY) {
  fail('SUPABASE_SERVICE_ROLE_KEY is missing'); envOk = false;
} else if (SUPABASE_SERVICE_ROLE_KEY === 'PASTE_YOUR_SERVICE_ROLE_JWT_HERE') {
  fail('SUPABASE_SERVICE_ROLE_KEY is still the placeholder.\n      Fix: paste the "service_role" JWT from Supabase Dashboard > Project Settings > API');
  envOk = false;
} else if (!SUPABASE_SERVICE_ROLE_KEY.startsWith('eyJ')) {
  fail(`SUPABASE_SERVICE_ROLE_KEY looks wrong. Expected a JWT (starts with eyJ).\n      Current value starts with: ${SUPABASE_SERVICE_ROLE_KEY.slice(0, 20)}...\n      Fix: copy the "service_role" JWT from Supabase Dashboard > Project Settings > API`);
  envOk = false;
} else {
  pass('SUPABASE_SERVICE_ROLE_KEY starts with eyJ... ✓');
}

if (!envOk) {
  console.log('\n⛔  Fix the env var issues above before proceeding.\n');
  process.exit(1);
}

// ── 2. Anon client connectivity ───────────────────────────────────────────────

console.log('\n[ 2 ] Testing anon client connectivity...');

const anonClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { persistSession: false }
});

try {
  // A simple count query on a public table – will return 0 rows or RLS-filtered rows
  const { error } = await anonClient.from('players').select('id', { count: 'exact', head: true });
  if (error) {
    // RLS blocking unauthenticated reads is expected and fine
    if (error.code === 'PGRST301' || error.message.includes('row-level security')) {
      pass('Anon client reached Supabase (RLS blocked unauthenticated read – this is correct)');
    } else {
      fail(`Anon client error: ${error.message} (code: ${error.code})`);
    }
  } else {
    pass('Anon client connected and queried players table successfully');
  }
} catch (e) {
  fail(`Anon client threw exception: ${e.message}`);
}

// ── 3. Admin client read ──────────────────────────────────────────────────────

console.log('\n[ 3 ] Testing admin (service role) client read...');

const adminClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false }
});

let adminOk = false;
try {
  const { data, error } = await adminClient
    .from('players')
    .select('id, name, email')
    .limit(3);

  if (error) {
    fail(`Admin read error: ${error.message} (code: ${error.code})`);
  } else {
    adminOk = true;
    if (data.length === 0) {
      pass('Admin client connected. players table is empty (no users yet – expected)');
    } else {
      pass(`Admin client connected. Found ${data.length} player row(s):`);
      data.forEach(p => info(`  id=${p.id}  name=${p.name}  email=${p.email}`));
    }
  }
} catch (e) {
  fail(`Admin client threw exception: ${e.message}`);
}

// ── 4. Admin insert + delete test ────────────────────────────────────────────

if (adminOk) {
  console.log('\n[ 4 ] Testing admin insert + delete on players table...');

  const testId = `00000000-0000-0000-0000-000000000001`;

  // First ensure no stale test row
  await adminClient.from('players').delete().eq('id', testId);

  const testRow = {
    id:               testId,
    user_id:          testId,   // same fake UUID for test
    name:             'Test Hero',
    email:            'test@liferpg.io',
    bio:              'Connection test row',
    title:            'Tester',
    avatar:           '🧪',
    level:            1,
    current_xp:       0,
    gold:             100,
    attribute_points: 0,
    strength:         10,
    intellect:        10,
    discipline:       10,
    creativity:       10,
    health:           10,
    focus:            10,
    streak:           0,
    longest_streak:   0,
    last_active_date: new Date().toISOString().split('T')[0],
    joined_date:      new Date().toISOString().split('T')[0],
    equipped_theme:   'dark-obsidian',
    equipped_badge:   ''
  };

  const { error: insertError } = await adminClient.from('players').insert(testRow);

  if (insertError) {
    fail(`Insert test failed: ${insertError.message} (code: ${insertError.code})`);
    if (insertError.message.includes('foreign key')) {
      info('This is expected – user_id must reference auth.users. Real inserts go through auth signup.');
      info('Service role key is working correctly; FK constraint is enforced as designed.');
    }
  } else {
    pass('Insert test row succeeded');

    // Read it back
    const { data: readBack, error: readErr } = await adminClient
      .from('players')
      .select('id, name')
      .eq('id', testId)
      .single();

    if (readErr) {
      fail(`Read-back failed: ${readErr.message}`);
    } else {
      pass(`Read-back confirmed: name="${readBack.name}"`);
    }

    // Clean up
    const { error: delErr } = await adminClient.from('players').delete().eq('id', testId);
    if (delErr) {
      fail(`Cleanup delete failed: ${delErr.message}`);
    } else {
      pass('Test row deleted cleanly');
    }
  }
}

// ── 5. Check all 10 tables exist ──────────────────────────────────────────────

console.log('\n[ 5 ] Checking all 10 tables exist...');

const expectedTables = [
  'players', 'quests', 'achievements', 'shop_items', 'inventory',
  'skills', 'loot_chests', 'daily_missions', 'game_settings', 'notifications'
];

for (const table of expectedTables) {
  try {
    const { error } = await adminClient.from(table).select('*', { count: 'exact', head: true });
    if (error) {
      fail(`Table "${table}": ${error.message}`);
    } else {
      pass(`Table "${table}" exists and is accessible`);
    }
  } catch (e) {
    fail(`Table "${table}" threw: ${e.message}`);
  }
}

console.log('\n══════════════════════════════════════════');
console.log('  Test complete.');
console.log('══════════════════════════════════════════\n');
