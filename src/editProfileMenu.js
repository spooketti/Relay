const updateUserEndpoint = `${serverAddress}/updateUser/`
let editPFPElement = document.getElementById("EditPFPIMG")
let editPFPFile = document.getElementById("EditPFPFile")
let editPFPChanged = false

function updateUser() {
    let username = document.getElementById("EditUN").value
    let bio = document.getElementById("EditBio").value
    let oldPW = document.getElementById("EditCP").value
    let newPW = document.getElementById("EditNP").value
    let newPFP = editPFPChanged ? editPFPElement.src : " "
    let payload = {
        "bio": bio,
        "username": username,
        "oldPW": oldPW,
        "newPW": newPW,
        "pfp": newPFP
    }
    fetch(updateUserEndpoint,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${localStorage.getItem("jwt")}`,
            },
            credentials: "include",
            body: JSON.stringify(payload)
        }).then(response => {
            if (response.ok) {
                return response.text()
            }
            throw new Error("Network response failed")
        }).then(data => {
            window.location.href = "app.html"
        })
        .catch(error => {
            console.error("There was a problem with the fetch", error);
        });
}

editPFPFile.addEventListener('change', function(event) {
    pfpChanged = true
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            const imageUrl = event.target.result;
            const image = new Image();
            image.src = imageUrl;
            image.onload = function() {
                editPFPChanged = true
                editPFPElement.src = image.src
            };
        };
        reader.readAsDataURL(file);
    }
  });