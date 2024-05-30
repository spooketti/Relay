let authEndpoint = `${serverAddress}/auth/`
let loginButton = document.getElementById("LoginButton")
let navbar = document.getElementById("navbar")
let joinDateSpan = document.getElementById("ProfileJoinDate")
let profileMenu = document.getElementById("ProfileMenu")
let editProfileWrapper = document.getElementById("EditProfileMenuWrapper")


function toggleEditProfileMenu(choice) {
  editProfileWrapper.style.filter = "opacity(1)"
  editProfileWrapper.style.display = "flex"
    if (choice=="close") {
        editProfileWrapper.style.filter = "opacity(0)"
        window.setTimeout(function () {
            editProfileWrapper.style.display = "none"
        }, 500)
        return
    }
}
/*
var socket = io("http://127.0.0.1:6221/",{ autoConnect: false,extraHeaders: { //connect to the backend with socket.io
  Authorization: localStorage.getItem("jwt")
} });
*/
var socket = io(`${serverAddress}/`,{ autoConnect: false,extraHeaders: { //connect to the backend with socket.io
  Authorization: localStorage.getItem("jwt")
} });

        socket.on('connect', function() {
            if(ServerParam)
            {
              socket.emit("join",`Server:${ServerParam}`) //join the server for listening to channel creation events
              if(ServerChannel)
              {
                socket.emit("join",ServerChannel) //join the server but with the unique channel id for real time messaging
              }
            }
        });

fetch(authEndpoint,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${localStorage.getItem("jwt")}` //jwt represents the logged in user and will eventually expire (json web token)
      },
      
    }).then(response => {
      if (response.ok) {
        loginButton.remove()
        return response.json()
      }
      throw new Error("Network response failed")
    }).then(data => { //all of this code will append data to the user profile preview (the menu with the logout button)
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
      document.getElementById("EditPFPIMG").src = data["pfp"]
      document.getElementById("ProfileMenuBio").innerText = data["bio"]
      let logoutWrapper = document.createElement("div")
      logoutWrapper.id = "LogoutWrapper"
      profileMenu.appendChild(logoutWrapper)
      let logoutButton = document.createElement("button")
      logoutButton.id = "LogoutButton"
      logoutButton.innerText = "Log Out"
      logoutWrapper.appendChild(logoutButton)

      let openProfEditButton = document.createElement("button")
      openProfEditButton.id = "EditProfileButton"
      openProfEditButton.innerText = "Edit Profile"
      logoutWrapper.appendChild(openProfEditButton)
      openProfEditButton.onclick = toggleEditProfileMenu
      socket.connect() //connect to socket
    })
    .catch(error => {
      console.error("There was a problem with the fetch", error);
      window.location.href = "login.html" //if the user isn't authenticated properly go to login.html
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

const getServerEndpoint = `${serverAddress}/getServer/`
let ServerListNav = document.getElementById("ServerList")
function queryServer() //get the servers that the user is in
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
          for(let i=0;i<data["servers"].length;i++) //afeter querying the current user's servers start appending them to the DOM
          {
            let serverAnchor = document.createElement("a")
            serverAnchor.href = `app.html?Server=${data["servers"][i]["serverID"]}`
          ServerListNav.appendChild(serverAnchor)
          let serverIMG = document.createElement("img")
          serverIMG.classList.add("ServerListIcon")
          serverIMG.src = data["servers"][i]["pfp"]
          serverIMG.id = `navServer${data["servers"][i]["serverID"]}`
          serverAnchor.appendChild(serverIMG)
          }
          if(ServerParam)
            {
              document.getElementById(`navServer${ServerParam}`).classList.add("activeServer")
            }
        })
        .catch(error => {
          console.error("There was a problem with the fetch", error);
        });
}

function logout()
{
  localStorage.removeItem("jwt") //jwt is the users "link" to the server via JWT
  window.location.href = "login.html"
}

queryServer()