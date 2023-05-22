const bcrypt = require("bcrypt");

const Pages = {
  LOGIN: {
    url: "/login",
    dir: "/src/views/login.html",
    name: "Home",
    protected: false,
  },
  REGISTER: {
    url: "/register",
    dir: "/src/views/register.html",
    name: "Register",
    protected: false,
  },
  DASHBOARD: {
    url: "/dashboard",
    dir: "/src/views/dashboard.html",
    name: "Dashboard",
    protected: true,
  },
  ADOPT: {
    url: "/adopt",
    dir: "/src/views/adopt.html",
    name: "Adopt",
    protected: true,
  },
  VIEWPET: {
    url: "/viewPet",
    dir: "/src/views/viewPet.html",
    name: "ViewPet",
    protected: true,
  },
};

function validRegistration(username, password, confirmPassword, users) {
  const user = users.find((user) => user.username === username);
  if (user) {
    return {
      valid: false,
      message: "Username already exists",
    };
  }
  if (username.length < 1) {
    return {
      valid: false,
      message: "Username field cannot be empty",
    };
  }
  if (username.length < 3) {
    return {
      valid: false,
      message: "Username must be at least 3 characters long",
    };
  }
  if (password.length < 1) {
    return {
      valid: false,
      message: "Password field cannot be empty",
    };
  }
  if (password !== confirmPassword) {
    return {
      valid: false,
      message: "Passwords do not match",
    };
  }
  return {
    valid: true,
    message: "Registration successful",
  };
}

function validLogin(username, password, users) {
  console.log("Users from db");
  console.log(users);
  const user = users.find((user) => user.username === username);
  if (!user) {
    return {
      valid: false,
      message: "Username not found",
    };
  }
  if (!bcrypt.compareSync(password, user.password)) {
    return {
      valid: false,
      message: "Incorrect password",
    };
  }
  return {
    valid: true,
    message: "Login successful",
  };
}

module.exports = { Pages, validRegistration, validLogin };
