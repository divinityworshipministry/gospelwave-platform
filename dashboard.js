
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
          </div>${user.app_metadata?.role === "admin" ? `
<div style="background:#10264a;padding:20px;border-radius:12px;margin-bottom:15px;">
  <h3>🛡️ Admin Dashboard</h3>
  <p>Manage artist applications and GospelWave content.</p>
  <button id="gw-admin" style="padding:12px;background:#d4af37;border:0;border-radius:6px;font-weight:bold;">Open Admin Dashboard</button>
</div>
` : ""}

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

    document.getElementById("gw-artist").onclick = async function() {
  const { data: artists, error } = await window.gospelwaveDB
    .from("artists")
    .select("id, verification_status")
    .eq("owner_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1);

  const area = document.getElementById("gw-dashboard-message");

  if (error) {
    area.textContent = "Unable to check your artist status: " + error.message;
    return;
  }

  if (!artists || artists.length === 0) {
    showGospelWaveArtistApplication(user);
    return;
  }

  if (artists[0].verification_status === "verified") {
    showGospelWaveSongSubmission(user, artists[0].id);
    return;
  }

  if (artists[0].verification_status === "pending") {
    area.textContent = "Your artist application is awaiting administrator approval.";
    return;
  }

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

async function showGospelWaveAdminDashboard(user) {
  if (user.app_metadata?.role !== "admin") {
    alert("Access denied. Administrators only.");
    return;
  }

  const area = document.getElementById("gw-dashboard-message");

  area.innerHTML = `
    <div style="background:#10264a;padding:20px;border-radius:12px;">
      <h2 style="color:#d4af37;">GospelWave Admin</h2>
      <h3>Artist Applications</h3>
      <p>Review and manage pending artist applications.</p>
      <hr style="border:1px solid #d4af37;margin:25px 0;">

<h3>Song Submissions</h3>
<hr style="border:1px solid #d4af37;margin:25px 0;">

<h3>Music Rights Review</h3>
<p>Review artists' copyright confirmations and supporting documents before approving songs.</p>
<div id="gw-pending-rights">Loading rights submissions...</div>
<p>Review and manage songs submitted by GospelWave artists.</p>
<div id="gw-pending-songs">Loading song submissions...</div>
      <div id="gw-pending-artists">Loading applications...</div>
    </div>
  `;

  const list = document.getElementById("gw-pending-artists");

  const { data, error } = await window.gospelwaveDB
    .from("artists")
    .select("id, artist_name, country, biography, created_at")
    .eq("verification_status", "pending")
    .order("created_at", { ascending: false });

  if (error) {
    list.textContent = "Error loading applications: " + error.message;
    return;
  }

  if (!data || data.length === 0) {
  list.textContent = "There are no pending artist applications.";
} else {
  data.forEach(function(artist) {
    const card = document.createElement("div");
    card.style.cssText =
      "background:#071b36;padding:15px;margin-top:15px;border-radius:8px;";

    const name = document.createElement("h3");
    name.textContent = artist.artist_name;

    const details = document.createElement("p");
    details.textContent =
      "Country: " + (artist.country || "Not provided") +
      " | Biography: " + (artist.biography || "Not provided");

    const approve = document.createElement("button");
    approve.textContent = "Approve";
    approve.style.cssText =
      "padding:10px;background:#168a45;color:white;border:0;margin-right:10px;";

    const reject = document.createElement("button");
    reject.textContent = "Reject";
    reject.style.cssText =
      "padding:10px;background:#b52b35;color:white;border:0;";

    approve.onclick = function() {
      updateArtistApplication(artist.id, "verified");
    };

    reject.onclick = function() {
      updateArtistApplication(artist.id, "rejected");
    };

    card.append(name, details, approve, reject);
    list.appendChild(card);
    });
    }

  await loadPendingSongs();
  await loadPendingRights();
  }

async function updateArtistApplication(artistId, status) {
  const { data: authData, error: authError } =
    await window.gospelwaveDB.auth.getUser();

  if (authError || !authData.user ||
      authData.user.app_metadata?.role !== "admin") {
    alert("Access denied. Administrators only.");
    return;
  }

  if (!["verified", "rejected"].includes(status)) {
    alert("Invalid application status.");
    return;
  }

  const { error } = await window.gospelwaveDB
    .from("artists")
    .update({ verification_status: status })
    .eq("id", artistId);

  if (error) {
    alert("Update failed: " + error.message);
    return;
  }

  alert("Artist application " + status + " successfully.");

  showGospelWaveAdminDashboard(authData.user);
}

async function loadPendingSongs() {
  const area = document.getElementById("gw-pending-songs");

  if (!area) return;

  area.textContent = "Loading song submissions...";

  const { data, error } = await window.gospelwaveDB
    .from("songs")
    .select("id, title, country, language, download_type, download_price, created_at")
    .eq("status", "pending")
    .order("created_at", { ascending: false });

  if (error) {
    area.textContent = "Error loading songs: " + error.message;
    return;
  }

  if (!data || data.length === 0) {
    area.textContent = "There are no pending song submissions.";
    return;
  }

  area.innerHTML = "";

  data.forEach(function(song) {
    const card = document.createElement("div");

    card.style.cssText =
      "background:#071b36;padding:15px;margin-top:15px;border-radius:8px;";

    const title = document.createElement("h3");
    title.textContent = song.title;

    const details = document.createElement("p");
    details.textContent =
      "Country: " + (song.country || "Not provided") +
      " | Language: " + (song.language || "Not provided") +
      " | Type: " + (song.download_type || "Not specified");

    const approve = document.createElement("button");
    approve.textContent = "Approve";
    approve.style.cssText =
      "padding:10px;background:#168a45;color:white;border:0;margin-right:10px;";

    const reject = document.createElement("button");
    reject.textContent = "Reject";
    reject.style.cssText =
      "padding:10px;background:#b52b35;color:white;border:0;";

    approve.onclick = function() {
      updateSongSubmission(song.id, "published");
    };

    reject.onclick = function() {
      updateSongSubmission(song.id, "rejected");
    };

    card.append(title, details, approve, reject);
    area.appendChild(card);
  });
}

async function updateSongSubmission(songId, status) {
  const { data: authData, error: authError } =
    await window.gospelwaveDB.auth.getUser();

  if (authError || !authData.user ||
      authData.user.app_metadata?.role !== "admin") {
    alert("Access denied. Administrators only.");
    return;
  }

  if (!["published", "rejected"].includes(status)) {
    alert("Invalid song status.");
    return;
  }
  
  if (status === "published") {
    const { data: rights, error: rightsError } =
      await window.gospelwaveDB
        .from("music_rights")
        .select("review_status")
        .eq("song_id", songId)
        .eq("review_status", "approved")
        .limit(1);

    if (rightsError) {
      alert("Could not verify music rights: " + rightsError.message);
      return;
    }

    if (!rights || rights.length === 0) {
      alert("This song cannot be published until its music rights are approved.");
      return;
    }
  }
  const { error } = await window.gospelwaveDB
    .from("songs")
    .update({ status: status })
    .eq("id", songId);

  if (error) {
    alert("Song update failed: " + error.message);
    return;
  }

  alert("Song " + status + " successfully.");

  await loadPendingSongs();
}
async function loadPendingRights() {
  const area = document.getElementById("gw-pending-rights");

  if (!area) return;

  area.textContent = "Loading rights submissions...";

  const { data, error } = await window.gospelwaveDB
    .from("music_rights")
    .select("*")
    .eq("review_status", "pending")
    .order("created_at", { ascending: false });

  if (error) {
    area.textContent = "Error loading rights submissions: " + error.message;
    return;
  }

  if (!data || data.length === 0) {
    area.textContent = "There are no pending music-rights submissions.";
    return;
  }

  area.innerHTML = "";

  for (const item of data) {
    const card = document.createElement("div");

    card.style.cssText =
      "background:#071b36;padding:15px;margin-top:15px;border-radius:8px;";

    const heading = document.createElement("h3");
    heading.textContent = "Rights Holder: " +
      (item.rights_holder_name || "Not provided");

    const details = document.createElement("p");
    details.textContent =
      "Song ID: " + item.song_id +
      " | Recording rights: " + (item.recording_rights_confirmed ? "Yes" : "No") +
      " | Composition rights: " + (item.composition_rights_confirmed ? "Yes" : "No") +
      " | Download permission: " + (item.download_permission_confirmed ? "Yes" : "No");

    card.append(heading, details);

    if (item.document_path) {
      const { data: fileData, error: fileError } =
        await window.gospelwaveDB.storage
          .from("rights-documents")
          .createSignedUrl(item.document_path, 300);

      if (!fileError && fileData?.signedUrl) {
        const link = document.createElement("a");
        link.href = fileData.signedUrl;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.textContent = "View Supporting Document";
        link.style.color = "#d4af37";
        card.appendChild(link);
      } else {
        const warning = document.createElement("p");
        warning.textContent = "Supporting document could not be opened.";
        card.appendChild(warning);
      }
    }

    const approve = document.createElement("button");
    approve.textContent = "Approve Rights";
    approve.style.cssText =
      "padding:10px;background:#168a45;color:white;border:0;margin:12px 10px 0 0;";

    const reject = document.createElement("button");
    reject.textContent = "Reject Rights";
    reject.style.cssText =
      "padding:10px;background:#b52b35;color:white;border:0;";

    approve.onclick = function() {
      updateMusicRights(item.id, "approved");
    };

    reject.onclick = function() {
      updateMusicRights(item.id, "rejected");
    };

    card.append(approve, reject);
    area.appendChild(card);
  }
}
async function updateMusicRights(rightsId, status) {
  const { data: authData, error: authError } =
    await window.gospelwaveDB.auth.getUser();

  if (authError || !authData.user ||
      authData.user.app_metadata?.role !== "admin") {
    alert("Access denied. Administrators only.");
    return;
  }

  if (!["approved", "rejected"].includes(status)) {
    alert("Invalid rights review status.");
    return;
  }

  if (status === "approved") {
    const { data: rights, error: checkError } =
      await window.gospelwaveDB
        .from("music_rights")
        .select("recording_rights_confirmed, composition_rights_confirmed, download_permission_confirmed, document_path")
        .eq("id", rightsId)
        .single();

    if (checkError || !rights) {
      alert("Could not verify rights submission.");
      return;
    }

    if (
      !rights.recording_rights_confirmed ||
      !rights.composition_rights_confirmed ||
      !rights.download_permission_confirmed ||
      !rights.document_path
    ) {
      alert("All rights confirmations and a supporting document are required.");
      return;
    }
  }

  const { error } = await window.gospelwaveDB
    .from("music_rights")
    .update({ review_status: status })
    .eq("id", rightsId);

  if (error) {
    alert("Rights review failed: " + error.message);
    return;
  }

  alert("Music rights " + status + " successfully.");

  await loadPendingRights();
}

