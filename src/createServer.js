const createServerEndpoint = "http://127.0.0.1:6221/createServer/"
let createServerMenu = document.getElementById("CreateServerMenu")
let createServerFile = document.getElementById("CreateServerFile")
let createServerIcon = document.getElementById("CreateServerIcon")
let createServerInput = document.getElementById("CreateServerNameInput")
let defaultServerPFP

function openCreateServer()
{
    createServerMenu.style.display = "flex"
    createServerMenu.style.animation = "fadeIn .5s linear forwards"
    createServerInput.value = null
    let createServerSpanIcon = document.createElement("span")
    createServerSpanIcon.classList.add("material-symbols-outlined")
    createServerSpanIcon.style.fontSize = "40px"
    createServerSpanIcon.style.color = "white"
    createServerSpanIcon.innerText = "upload_file"
    createServerIcon.innerHTML = null
    createServerIcon.appendChild(createServerSpanIcon)
}

function closeCreateServer()
{
    createServerMenu.style.animation = "fadeOut .5s linear forwards"
    window.setTimeout(function(){
        createServerMenu.style.display = "none"
    },500)
}

function uploadCreateServerPFP()
{
createServerFile.click()
}

createServerFile.addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            const imageUrl = event.target.result;
            const image = new Image();
            image.src = imageUrl;
            image.onload = function() {
                let serverProfile = document.createElement("img")
                serverProfile.src = image.src
                serverProfile.style.aspectRatio = "1/1"
                serverProfile.style.width = "100%"
                createServerIcon.innerHTML = null
                createServerIcon.appendChild(serverProfile)
            };
        };
        reader.readAsDataURL(file); // Read the file as a data URL
    }
});

let xhr = new XMLHttpRequest();       
    xhr.open("GET", "https://spooketti.github.io/portfolio/assets/images/favicon.ico", true); 
    xhr.responseType = "blob";
    xhr.onload = function () {
            let reader = new FileReader();
            reader.onload = function(event) {
               let res = event.target.result;
               defaultServerPFP = res
            }
            let file = this.response;
            reader.readAsDataURL(file)
    };
    xhr.send()

function submitServer()
{
    let payload = 
    {
        "name":createServerInput.value,
        "pfp": createServerIcon.firstChild.nodeName === "IMG" ? createServerIcon.firstChild.src : defaultServerPFP
    }
    fetch(createServerEndpoint,
        {
            method:"POST",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${localStorage.getItem("jwt")}`
              },
            credentials: "include",
            body: JSON.stringify(payload)
        }).then(response =>{
            if(response.ok)
            {
                chatbox.value = null;
                return response.text()
            }
            throw new Error("Network response failed")
        }).then(data => {
            console.log("Response:", data);
          })
          .catch(error => {
            console.error("There was a problem with the fetch", error);
          });
    closeCreateServer()

}