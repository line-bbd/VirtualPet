const { Pages } = require("../utils/utils");
const Auth = require("../models/auth");

class Navigator {
  constructor() {
    this.auth = new Auth();
  }

  setAuth(auth) {
    this.auth = auth;
  }

  navigate(res, name) {
    const page = Pages[name];
    if (page.protected && !this.auth.isAuthenticated()) {
      this.destination = Pages.LOGIN;
      return;
    }
    this.destination = page;
  }
}

module.exports = Navigator;
