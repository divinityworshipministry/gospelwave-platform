const { createClient } = window.supabase;

const gospelwaveDB = createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
);

window.gospelwaveDB = gospelwaveDB;

async function testGospelWaveConnection() {
  const message = document.createElement("div");

  message.style.cssText =
    "padding:20px;margin:20px;background:#10264a;color:#fff;border-radius:10px;text-align:center;";

  message.textContent = "Testing GospelWave database connection...";

  document.body.appendChild(message);

  const { data, error } = await gospelwaveDB
    .from("genres")
    .select("name")
    .limit(3);

  if (error) {
    message.textContent = "Connection test failed: " + error.message;
  } else {
    message.textContent =
      "GospelWave database connected successfully! Genres found: " +
      data.length;
  }
}

testGospelWaveConnection();
