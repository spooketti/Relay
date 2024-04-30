let authEndpoint = "http://127.0.0.1:6221/auth/"
let loginButton = document.getElementById("LoginButton")
let navbar = document.getElementById("navbar")
let joinDateSpan = document.getElementById("ProfileJoinDate")
let profileMenu = document.getElementById("ProfileMenu")
var socket = io("http://127.0.0.1:6221/",{ autoConnect: false,extraHeaders: {
  Authorization: localStorage.getItem("jwt")
} });

        socket.on('connect', function() {
            if(ServerChannel)
            {
              socket.emit("join",ServerChannel)
            }
        });

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
      document.getElementById("ProfileMenuUsername").innerText = data["username"]
      document.getElementById("ProfileMenuUserID").innerText = `@${data["userID"]}`
      let navbarProfile = document.createElement("div")
      navbarProfile.id = "NavbarProfile"
      let navbarPFP = document.createElement("img")
      navbarPFP.src = data["pfp"]
      navbarPFP.id = "NavbarProfilePFP"
      let navbarUsername = document.createElement("span")
      navbarUsername.id = "NavbarProfileUsername"
      navbarUsername.innerText = data["username"]
      navbar.appendChild(navbarProfile)
      navbarProfile.appendChild(navbarPFP)
      navbarProfile.appendChild(navbarUsername)
      joinDateSpan.innerText = dateTime(data["joindate"])
      navbarProfile.onclick = toggleProfileMenu
      document.getElementById("ProfileMenuPFP").src = data["pfp"]
      let logoutWrapper = document.createElement("div")
      logoutWrapper.id = "LogoutWrapper"
      profileMenu.appendChild(logoutWrapper)
      let logoutButton = document.createElement("button")
      logoutButton.id = "LogoutButton"
      logoutButton.innerText = "Log Out"
      logoutWrapper.appendChild(logoutButton)
      logoutButton.onclick = logout
      
      socket.auth = {"userID":data["userID"]}
      socket.connect()
    })
    .catch(error => {
      console.error("There was a problem with the fetch", error);
      window.location.href = "login.html"
    });
  
  function toggleProfileMenu()
  {
    if(profileMenu.style.display == "block")
    {
      profileMenu.style.display = "none"
      return
    }
    profileMenu.style.display = "block"
    profileMenu.style.animation = "fadeInUp 1s ease"
  }

const getServerEndpoint = "http://127.0.0.1:6221/getServer/"
let ServerListNav = document.getElementById("ServerList")
function queryServer()
{
    fetch(getServerEndpoint,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${localStorage.getItem("jwt")}`
          },
        }).then(response => {
          if (response.ok) {
            return response.json()
          }
          throw new Error("Network response failed")
        }).then(data => {
          for(let i=0;i<data["servers"].length;i++)
          {
            let serverAnchor = document.createElement("a")
            serverAnchor.href = `app.html?Server=${data["servers"][i]["serverID"]}`
          ServerListNav.appendChild(serverAnchor)
          let serverIMG = document.createElement("img")
          serverIMG.classList.add("ServerListIcon")
          serverIMG.src = data["servers"][i]["pfp"]
          serverAnchor.appendChild(serverIMG)
          }
        })
        .catch(error => {
          console.error("There was a problem with the fetch", error);
        });
}

function logout()
{
  localStorage.removeItem("jwt")
  window.location.href = "login.html"
}

queryServer()