let authEndpoint = "http://127.0.0.1:6221/auth/"
let loginButton = document.getElementById("LoginButton")
let navbar = document.getElementById("navbar")
let joinDateSpan = document.getElementById("ProfileJoinDate")
let profileMenu = document.getElementById("ProfileMenu")
var socket = io("http://127.0.0.1:6221/",{ autoConnect: false });  // Connect to the SocketIO server

        socket.on('connect', function() {
            console.log('Connected to server');
        });

        socket.on('disconnect', function() {
            console.log('Disconnected from server');
        });

        socket.on('response', function(data) {
            console.log("abc")
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
        /*<div id="NavbarProfile"><img src="assets/img/DefaultPFP.png" id="NavbarProfilePFP"><span
        id="NavbarProfileUsername">Spooketti</span></div>*/
        
        return response.json()
      }
      throw new Error("Network response failed")
    }).then(data => {
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
      joinDateSpan.innerText = data["joindate"]
      navbarProfile.onclick = toggleProfileMenu
      socket.auth = {"userID":data["userID"]}
      socket.connect()
    })
    .catch(error => {
      console.error("There was a problem with the fetch", error);
    });
  
  function toggleProfileMenu()
  {
    //not clean but technically better for memory
    if(profileMenu.style.display == "block")
    {
      profileMenu.style.display = "none"
      return
    }
    profileMenu.style.display = "block"
    profileMenu.style.animation = "fadeInUp 1s ease"
  }