let loginEndpoint = "http://127.0.0.1:6221/login/"
let signupEndpoint = "http://127.0.0.1:6221/signup/"
let loginSharpenElement = document.getElementById("LoginSharpen")
let loginOpen = true;
let loginField = document.getElementById("LoginForum")
let signupField = document.getElementById("SignupForum")
const sharpRadius = 150;
let pfpFile = document.getElementById("uploadPFPFile")
let pfpPreview = document.getElementById("signupPFPPreview")
let signupForm = document.getElementById("signupForm")
let loginForm = document.getElementById("loginForm")
let loginFail = document.getElementById("LoginFail")
let loginException = document.getElementById("LoginException")
let pfpChanged = false
let defaultPFP
let LoginSplashMessage = document.getElementById("LoginSplashMessage")
let SignupSplashMessage = document.getElementById("SignupSplashMessage")

let signSplash = ["Signup to Relay","Join the discussion"]
let loginSplash = ["Welcome back to Relay", "let today = new Day()","This is just a fancy way to fetch()"]

function login()
{
    let userID = document.getElementById("userIDLogin").value
    let password = document.getElementById("passwordLogin").value
    let payload = 
    {
      "userID":userID,
      "password":password
    }
    fetch(loginEndpoint,
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
            window.location.href = "app.html"
          })
          .catch(error => {
            console.error("There was a problem with the fetch", error);
          });
}

function signup()
{
  let payload = 
  {
    "userID":document.getElementById("userIDSignup").value,
    "username":document.getElementById("usernameSignup").value,
    "password":document.getElementById("passwordSignup").value,
    "pfp": pfpChanged ? pfpPreview.src : defaultPFP,
  }
    fetch(signupEndpoint,
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
            window.location.href = "app.html"
          })
          .catch(error => {
            console.error("There was a problem with the fetch", error);
          });
}

document.addEventListener("mousemove",function(e)
{
  loginSharpenElement.style.left = `${e.clientX-sharpRadius}px`
  loginSharpenElement.style.top = `${e.clientY-sharpRadius}px`
  loginSharpenElement.style.backgroundPositionX = `${e.clientX/10}px`//
  loginSharpenElement.style.backgroundPositionY = `${e.clientY/10}px`//`${e.clientY}px`
})

signupForm.addEventListener("submit",function(e)
{
  let password = document.getElementById("passwordSignup")
  let confirmPassword = document.getElementById("passwordConfirm")
  e.preventDefault()
  if(password.value != confirmPassword.value)
  {
    showException("Your passwords do not match!")
  }
  signup()
})

loginForm.addEventListener("submit",function(e)
{
  let userID = document.getElementById("userIDLogin")
  let password = document.getElementById("passwordLogin")
  e.preventDefault()
  login()
})



function toggleUI()
{
 loginOpen = !loginOpen
 if(loginOpen)
 {
  loginField.style.display = "flex"
  signupField.style.display = "none"
  loginField.style.animation = "fadeInUp 1s ease"
  LoginSplashMessage.innerText = loginSplash[Math.floor(Math.random() * loginSplash.length)]
  return
 }
 loginField.style.display = "none"
 signupField.style.display = "flex"
 signupField.style.animation = "fadeInUp 1s ease"
 SignupSplashMessage.innerText = signSplash[Math.floor(Math.random() * signSplash.length)]
}

pfpFile.addEventListener('change', function(event) {
  pfpChanged = true
  const file = event.target.files[0]; // Get the selected file
  if (file) {
      const reader = new FileReader();
      reader.onload = function(event) {
          const imageUrl = event.target.result; // Get the image URL
          const image = new Image();
          image.src = imageUrl;
          image.onload = function() {
              pfpChanged = true
              pfpPreview.src = image.src
          };
      };
      reader.readAsDataURL(file); // Read the file as a data URL
  }
});

function uploadPFP()
{
  pfpFile.click()
}

function showException(exceptionMessage)
{
  loginFail.style.animation = 'none';
  loginFail.offsetHeight; /* trigger reflow */
  loginFail.style.animation = "fadeInAndOut 3s forwards"; 
  loginException.innerText = exceptionMessage
}

let xhr = new XMLHttpRequest();       
    xhr.open("GET", "https://spooketti.github.io/portfolio/assets/images/favicon.ico", true); 
    xhr.responseType = "blob";
    xhr.onload = function () {
            let reader = new FileReader();
            reader.onload = function(event) {
               let res = event.target.result;
               defaultPFP = res
            }
            let file = this.response;
            reader.readAsDataURL(file)
    };
    xhr.send()

LoginSplashMessage.innerText = loginSplash[Math.floor(Math.random() * loginSplash.length)]