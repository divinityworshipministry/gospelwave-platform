const { createClient } = window.supabase;

const gospelwaveDB = createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
);

window.gospelwaveDB = gospelwaveDB;

console.log("GospelWave database connection initialized.");
