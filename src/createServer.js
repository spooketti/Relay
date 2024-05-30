const createServerEndpoint = `${serverAddress}/createServer/`
let createServerMenu = document.getElementById("CreateServerMenu")
let createServerFile = document.getElementById("CreateServerFile")
let createServerIcon = document.getElementById("CreateServerIcon")
let createServerInput = document.getElementById("CreateServerNameInput")
let defaultServerPFP

function openCreateServer() {
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

function closeCreateServer() {
    createServerMenu.style.animation = "fadeOut .5s linear forwards"
    window.setTimeout(function () {
        createServerMenu.style.display = "none"
    }, 500)
}

function uploadCreateServerPFP() {
    createServerFile.click()
}

createServerFile.addEventListener('change', function (event) { //when the server pfp is uploaded
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (event) {
            const imageUrl = event.target.result;
            const image = new Image();
            image.src = imageUrl;
            image.onload = function () {
                let serverProfile = document.createElement("img")
                serverProfile.src = image.src
                serverProfile.style.aspectRatio = "1/1"
                serverProfile.style.width = "100%"
                createServerIcon.innerHTML = null
                createServerIcon.appendChild(serverProfile)
            };
        };
        reader.readAsDataURL(file); //convert to base 64
    }
});

let xhr = new XMLHttpRequest();
xhr.open("GET", "https://i.ibb.co/jWTYmQS/Default-PFP.png", true); //default pfp hosted on the internet for the sake of xml http request giving base64
xhr.responseType = "blob";
xhr.onload = function () {
    let reader = new FileReader();
    reader.onload = function (event) {
        let res = event.target.result;
        defaultServerPFP = res
    }
    let file = this.response;
    reader.readAsDataURL(file)
};
xhr.send()

function submitServer() {
    let payload =
    {
        "name": createServerInput.value,
        "pfp": createServerIcon.firstChild.nodeName === "IMG" ? createServerIcon.firstChild.src : defaultServerPFP
    }
    fetch(createServerEndpoint, //POST request to server to create the server on the users account
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${localStorage.getItem("jwt")}`
            },
            credentials: "include",
            body: JSON.stringify(payload)
        }).then(response => {
            if (response.ok) {
                return response.json()
            }
            throw new Error("Network response failed")
        }).then(data => {
            let serverAnchor = document.createElement("a")
            serverAnchor.href = `app.html?Server=${data["serverID"]}`
            ServerListNav.appendChild(serverAnchor)
            let serverIMG = document.createElement("img")
            serverIMG.classList.add("ServerListIcon")
            serverIMG.src = data["pfp"]
            serverAnchor.appendChild(serverIMG)
        })
        .catch(error => {
            console.error("There was a problem with the fetch", error);
        });
    closeCreateServer()

}