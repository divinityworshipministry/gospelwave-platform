async function registerGospelWaveUser(fullName, email, password) {
  const { data, error } = await window.gospelwaveDB.auth.signUp({
    email: email,
    password: password,
    options: {
      data: {
        full_name: fullName
      },
      emailRedirectTo: "https://gospelsave.netlify.app/"
    }
  });

  if (error) {
    return { success: false, message: error.message };
  }

  return {
    success: true,
    message: "Registration successful. Please check your email for confirmation.",
    data: data
  };
}

async function loginGospelWaveUser(email, password) {
  const { data, error } = await window.gospelwaveDB.auth.signInWithPassword({
    email: email,
    password: password
  });

  if (error) {
    return { success: false, message: error.message };
  }

  return {
    success: true,
    message: "Login successful.",
    data: data
  };
}

async function logoutGospelWaveUser() {
  const { error } = await window.gospelwaveDB.auth.signOut();

  if (error) {
    return { success: false, message: error.message };
  }

  return { success: true, message: "You have logged out." };
}

window.registerGospelWaveUser = registerGospelWaveUser;
window.loginGospelWaveUser = loginGospelWaveUser;
window.logoutGospelWaveUser = logoutGospelWaveUser;
