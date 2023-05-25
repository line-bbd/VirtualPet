document
  .getElementById("registrationForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    let formData = new FormData(event.target);

    fetch("/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(Object.fromEntries(formData)),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (!data.valid) {
          let messageContainer = document.getElementById("error");
          messageContainer.innerHTML = data.message;
          messageContainer.style.color = "red";
        } else {
          window.location.href = "/login";
        }
      });
  });
