let loginEndpoint = "http://127.0.0.1:6221/login"
let signupEndpoint = "http://127.0.0.1:6221/signup"

function login()
{
    fetch(loginServer,
        {
            method:"POST",
            headers: {
                "Content-Type": "application/json"
              },
            credentials: "include",
            body: JSON.stringify(payload)
        }).then(response =>{
            if(response.ok)
            {
                return response.text()
            }
            throw new Error("Network response failed")
        }).then(data => {
            console.log("Response:", data);
            let jwt = JSON.parse(data)
            localStorage.setItem("jwt",jwt["jwt"])
            window.location.href = "index.html"
          })
          .catch(error => {
            console.error("There was a problem with the fetch", error);
          });
}

function signup()
{
    fetch(loginServer,
        {
            method:"POST",
            headers: {
                "Content-Type": "application/json"
              },
            credentials: "include",
            body: JSON.stringify(payload)
        }).then(response =>{
            if(response.ok)
            {
                return response.text()
            }
            throw new Error("Network response failed")
        }).then(data => {
            console.log("Response:", data);
            let jwt = JSON.parse(data)
            localStorage.setItem("jwt",jwt["jwt"])
            window.location.href = "index.html"
          })
          .catch(error => {
            console.error("There was a problem with the fetch", error);
          });
}