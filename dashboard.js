
function showGospelWaveDashboard(user) {
  const accountSection = document.getElementById("account-section");

  if (accountSection) {
    accountSection.style.display = "none";
  }

  let dashboard = document.getElementById("gospelwave-dashboard");

  if (!dashboard) {
    dashboard = document.createElement("section");
    dashboard.id = "gospelwave-dashboard";

    dashboard.style.cssText =
      "background:#071b36;color:white;min-height:100vh;padding:30px 18px;font-family:Arial,sans-serif;";

    dashboard.innerHTML = `
      <div style="max-width:850px;margin:auto;">
        <h1 style="color:#d4af37;">GospelWave</h1>
        <p>Let the Gospel Sound Reach the World.</p>

        <div style="background:#10264a;padding:24px;border-radius:12px;margin:25px 0;">
          <h2 id="gw-welcome">Welcome!</h2>
          <p id="gw-email"></p>
          <p>Welcome to the global GospelWave community.</p>
        </div>

        <h2 style="color:#d4af37;">Your Dashboard</h2>

        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:15px;">

          <div style="background:#10264a;padding:20px;border-radius:12px;">
            <h3>🎵 Discover Music</h3>
            <p>Explore gospel music from around the world.</p>
            <button id="gw-discover" style="padding:12px;background:#d4af37;border:0;border-radius:6px;font-weight:bold;">Explore Genres</button>
            <div id="gw-genres" style="margin-top:12px;"></div>
          </div>

          <div style="background:#10264a;padding:20px;border-radius:12px;">
            <h3>🎤 Become an Artist</h3>
            <p>Apply to create your artist profile and submit music.</p>
            <button id="gw-artist" style="padding:12px;background:#d4af37;border:0;border-radius:6px;font-weight:bold;">Artist Application</button>
          </div>

          <div style="background:#10264a;padding:20px;border-radius:12px;">
            <h3>⬇️ My Downloads</h3>
            <p>Your authorised music downloads will appear here.</p>
            <button id="gw-downloads" style="padding:12px;background:#d4af37;border:0;border-radius:6px;font-weight:bold;">My Downloads</button>
          </div>

          <div style="background:#10264a;padding:20px;border-radius:12px;">
            <h3>👤 My Account</h3>
            <p>View your GospelWave account information.</p>
            <button id="gw-account" style="padding:12px;background:#d4af37;border:0;border-radius:6px;font-weight:bold;">Account Details</button>
          </div>

        </div>

        <p id="gw-dashboard-message" style="margin-top:25px;"></p>

        <button id="gw-logout" style="margin-top:25px;padding:14px 25px;background:#b52b35;color:white;border:0;border-radius:6px;font-weight:bold;">Log Out</button>
      </div>
    `;

    document.body.appendChild(dashboard);

    document.getElementById("gw-discover").onclick = async function() {
      const area = document.getElementById("gw-genres");
      area.textContent = "Loading music genres...";

      const { data, error } = await window.gospelwaveDB
        .from("genres")
        .select("name")
        .order("name");

      if (error) {
        area.textContent = "Unable to load genres.";
        return;
      }

      area.textContent = data.map(item => item.name).join(" • ");
    };

    document.getElementById("gw-artist").onclick = function() {
  showGospelWaveArtistApplication(user);
};

    document.getElementById("gw-downloads").onclick = function() {
      document.getElementById("gw-dashboard-message").textContent =
        "Your authorised downloads section is being prepared.";
    };

    document.getElementById("gw-account").onclick = function() {
      document.getElementById("gw-dashboard-message").textContent =
        "Your account email: " + (user.email || "Not available");
    };

    document.getElementById("gw-logout").onclick = async function() {
      const result = await window.logoutGospelWaveUser();

      if (result.success) {
        dashboard.remove();

        if (accountSection) {
          accountSection.style.display = "block";
          accountSection.scrollIntoView({ behavior: "smooth" });
        }
      } else {
        alert(result.message);
      }
    };
  }

  const name =
    user.user_metadata?.full_name ||
    user.email?.split("@")[0] ||
    "GospelWave Member";

  document.getElementById("gw-welcome").textContent =
    "Welcome, " + name + "!";

  document.getElementById("gw-email").textContent =
    user.email || "";

  dashboard.style.display = "block";
  dashboard.scrollIntoView({ behavior: "smooth" });
}

window.showGospelWaveDashboard = showGospelWaveDashboard;

async function showGospelWaveArtistApplication(user) {
  const area = document.getElementById("gw-dashboard-message");

  area.innerHTML = `
    <div style="background:#10264a;padding:22px;border-radius:12px;margin-top:20px;">
      <h2 style="color:#d4af37;">Artist Application</h2>
      <p>Introduce yourself to the GospelWave global music community.</p>

      <form id="gw-artist-form">
        <input id="gw-artist-name" required
          placeholder="Artist or Stage Name"
          style="width:100%;padding:13px;margin:8px 0;box-sizing:border-box;">

        <input id="gw-artist-country" required
          placeholder="Country"
          style="width:100%;padding:13px;margin:8px 0;box-sizing:border-box;">

        <textarea id="gw-artist-bio" required
          placeholder="Tell us about yourself and your gospel music ministry"
          style="width:100%;padding:13px;margin:8px 0;box-sizing:border-box;min-height:120px;"></textarea>

        <label style="display:block;margin:12px 0;">
          <input type="checkbox" id="gw-artist-rights" required>
          I confirm that I own or have authorisation to submit the music I upload.
        </label>

        <button type="submit"
          style="padding:14px;background:#d4af37;color:#071b36;border:0;border-radius:6px;font-weight:bold;">
          Submit Artist Application
        </button>
      </form>

      <p id="gw-artist-result"></p>
    </div>
  `;

  document.getElementById("gw-artist-form").addEventListener("submit", async function(event) {
    event.preventDefault();

    const result = document.getElementById("gw-artist-result");
    result.textContent = "Submitting your application...";

    const { data: sessionData } =
      await window.gospelwaveDB.auth.getUser();

    const currentUser = sessionData.user;

    if (!currentUser || currentUser.id !== user.id) {
      result.textContent = "Please sign in again.";
      return;
    }

    const { error } = await window.gospelwaveDB
      .from("artists")
      .insert({
        owner_id: currentUser.id,
        artist_name: document.getElementById("gw-artist-name").value.trim(),
        country: document.getElementById("gw-artist-country").value.trim(),
        biography: document.getElementById("gw-artist-bio").value.trim(),
        verification_status: "pending"
      });

    if (error) {
      result.textContent = "Application could not be submitted: " + error.message;
      return;
    }

    result.textContent =
      "Your artist application has been submitted successfully! It is awaiting administrator approval.";

    document.getElementById("gw-artist-form").reset();
  });
}

