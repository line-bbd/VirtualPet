document
  .getElementById("registrationForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    var formData = new FormData(event.target);

    fetch("/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(Object.fromEntries(formData)),
    })
      .then((response) => response.json())
      .then((data) => {
        var messageContainer = document.getElementById("error");

        if (data.valid) {
          messageContainer.innerHTML = "Registration successful";
          messageContainer.style.color = "green";
        } else {
          messageContainer.innerHTML = data.message;
          messageContainer.style.color = "red";
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        var messageContainer = document.getElementById("error");
        messageContainer.innerHTML =
          "An error occurred. Please try again later.";
        messageContainer.style.color = "red";
      });
  });
