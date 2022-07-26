// TODO: Check if the user already exist before registering
// TODO: Chack if there is any error in login (Maybe because of wrong password)
const upload = require("./upload").default;
const BASE_URL = process.env.BASE_URL;

export function finalize(user) {
  localStorage.setItem("user", JSON.stringify(user));
  window.location.href = "/feeds";
}

export function getCurrentUser() {
  return JSON.parse(localStorage.getItem("user"));
}

export async function getUserById(userId) {
  try {
    const res = await fetch(`${BASE_URL}users/` + userId, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (res.status === 200) {
      const data = await res.json();
      console.log(data);
      return data;
    } else {
      alert("Error: " + res.status + " " + res.statusText);
    }
  } catch (err) {
    console.log("user.js:", err);
    return { error: err };
  }
}

export async function register(username, email, password, fullname) {
  try {
    const user = await fetch(`${BASE_URL}auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fullname: fullname,
        email: email,
        username: username,
        password: password,
      }),
    });
    if (user.status === 200) {
      // console.log(await user.json());
      finalize(await user.json());
    } else {
      alert("Error: " + user.error);
    }
  } catch (err) {
    alert("Error: " + err);
  }
}

export async function login(email, password) {
  const user = await fetch(`${BASE_URL}auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: email,
      password: password,
    }),
  });
  if (user.status === 200) {
    finalize(await user.json());
  } else {
    alert("Error: " + user.error);
  }
}

export async function updateUser(userId, file, fullname, bio) {
  var image_url = "";

  const newUser = {
    userId: userId,
    fullname: fullname,
    bio: bio,
  };
  if (file) {
    image_url = await upload(file);
    newUser["profilePicture"] = image_url;
  }
  try {
    const res = await fetch(`${BASE_URL}users/` + userId, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newUser),
    });
    if (res.status === 200) {
      const data = await res.json();
      console.log(data);
      localStorage.setItem("user", JSON.stringify(data));
      return data;
    } else {
      alert("Error: " + res.status + " " + res.statusText);
    }
  } catch (err) {
    console.log("post.js:", err);
    return { error: err };
  }
}

export function logout() {
  localStorage.removeItem("user");
  window.location.href = "/login";
}

module.exports = {
  register,
  login,
  logout,
  getUserById,
  updateUser,
};
