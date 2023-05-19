class HeaderNotLoggedIn extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = `
    <style>
    header{
      background-color: #3498db;
    }

    header::after {
      content: '';
      display: table;
      clear: both;
    }
    
    nav{
      float: right;
      height: 3.125rem;
    }

    nav ul {
      margin: 0;
      padding: 0;
      list-style: none;
    }

    nav li {
      display: inline-block;
      margin-right: 4.688rem;
      padding-top: 1.0rem;
      position: relative;
    }

    nav a {
      color: #333;
      text-decoration: none;
      text-transform: uppercase;
      font-size: 1.25rem;
      font-family: "Courier New", monospace;
      font-weight: 800;
    }

    nav a:hover {
      color: #000;
    }

    nav a::before {
      content: '';
      display: block;
      height: 5px;
      background-color: #000;
    
      position: absolute;
      top: 0;
      width: 0%;
    
      transition: all ease-in-out 250ms;
    }
    
    nav a:hover::before {
      width: 100%;
    }
    
    img{
      float: left;
      display: flex;
      height: 3.125rem;
    }
    </style>
    <header id="header-styles">
      <img id="nav-logo" src="img/PetLogo.png">
      <nav>
        <ul>
          <li><a href="/register">Register</a></li>
          <li><a href="/login">Login</a></li>
        </ul>
      </nav>
    </header>
    `;
  }
}

class HeaderLoggedIn extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = `
    <style>
    header{
      background-color: #3498db;
    }

    header::after {
      content: '';
      display: table;
      clear: both;
    }
    
    nav{
      float: right;
      height: 3.125rem;
    }

    nav ul {
      margin: 0;
      padding: 0;
      list-style: none;
    }

    nav li {
      display: inline-block;
      margin-right: 4.688rem;
      padding-top: 1.0rem;
      position: relative;
    }

    nav a {
      color: #333;
      text-decoration: none;
      text-transform: uppercase;
      font-size: 1.25rem;
      font-family: "Courier New", monospace;
      font-weight: 800;
    }

    nav a:hover {
      color: #000;
    }

    nav a::before {
      content: '';
      display: block;
      height: 5px;
      background-color: #000;
    
      position: absolute;
      top: 0;
      width: 0%;
    
      transition: all ease-in-out 250ms;
    }
    
    nav a:hover::before {
      width: 100%;
    }
    
    img{
      float: left;
      display: flex;
      height: 3.125rem;
    }
    </style>
    <header id="header-styles">
      <img id="nav-logo" src="img/PetLogo.png">
      <nav>
        <ul>
          <li><a href="/dashboard">Dashboard</a></li>
          <li><a href="/adopt">Adopt a pet</a></li>
          <li><a href="/viewPet">Play</a></li>
          <li><a href="/logout">Sign Out</a></li>
        </ul>
      </nav>
    </header>
    `;
  }
}

customElements.define("header-out-component", HeaderNotLoggedIn);
customElements.define("header-in-component", HeaderLoggedIn);
