class Auth {
  constructor() {
    this.username = "";
    this.authenticated = false;
  }

  login(username) {
    this.username = username;
    this.authenticated = true;
  }

  logout() {
    this.username = "";
    this.authenticated = false;
  }

  isAuthenticated() {
    return this.authenticated;
  }
}

module.exports = Auth;
