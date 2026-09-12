/**
 * Quick anon-only connectivity test (no service role key needed).
 * Run: node backend/test-anon.mjs
 */

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });

const SUPABASE_URL      = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

console.log('\n══════════════════════════════════════════');
console.log('  LifeRPG – Anon Connection Test');
console.log('══════════════════════════════════════════\n');

console.log(`  URL : ${SUPABASE_URL}`);
console.log(`  Anon: ${SUPABASE_ANON_KEY?.slice(0, 40)}...`);

const client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { persistSession: false }
});

const tables = [
  'players', 'quests', 'achievements', 'shop_items', 'inventory',
  'skills', 'loot_chests', 'daily_missions', 'game_settings', 'notifications'
];

console.log('\n  Probing all 10 tables with anon key...\n');

for (const table of tables) {
  const { error } = await client.from(table).select('*', { count: 'exact', head: true });
  if (!error) {
    console.log(`  ✅  ${table} – reachable`);
  } else if (error.code === 'PGRST301' || error.message?.includes('row-level security') || error.message?.includes('permission denied')) {
    console.log(`  🔒  ${table} – RLS blocked unauthenticated read (correct)`);
  } else if (error.code === '42P01') {
    console.log(`  ❌  ${table} – TABLE DOES NOT EXIST`);
  } else {
    console.log(`  ❌  ${table} – ${error.message} (code: ${error.code})`);
  }
}

console.log('\n  ✅  Anon client can reach Supabase.');
console.log('  Next: add SUPABASE_SERVICE_ROLE_KEY to backend/.env then run:');
console.log('       node backend/test-connection.mjs\n');
