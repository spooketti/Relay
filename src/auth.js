let authEndpoint = "http://127.0.0.1:6221/auth/"
let loginButton = document.getElementById("LoginButton")

fetch(authEndpoint,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${localStorage.getItem("jwt")}`
      },
    }).then(response => {
      if (response.ok) {
        loginButton.remove()
        return response.json()
      }
      throw new Error("Network response failed")
    }).then(data => {
      console.log("Response:", data);
    })
    .catch(error => {
      console.error("There was a problem with the fetch", error);
    });
  