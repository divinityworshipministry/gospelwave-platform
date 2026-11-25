
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
