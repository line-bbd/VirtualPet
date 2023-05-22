class Auth {
  constructor() {
    this.username = "";
    this.userID = "";
    this.authenticated = false;
  }

  login(username, userID) {
    this.username = username;
    this.userID = userID;
    this.authenticated = true;
  }

  logout() {
    this.username = "";
    this.userID = "";
    this.authenticated = false;
  }

  isAuthenticated() {
    return this.authenticated;
  }
}

module.exports = Auth;
