const queryString = window.location.search
const params = new URLSearchParams(queryString)
let DMChannel
let ServerChannel
let GetDMEndpoint = "http://127.0.0.1:6221/getDM/"
DMChannel = params.get("DMChannel")
ServerChannel = params.get("ServerChannel")
if (params.has("DMChannel") && params.has("ServerChannel")) //pick a lane
{
    window.location.href = "app.html"
}

function getDMs() {
    let payload = {"otherUser":"debug"}

    fetch(GetDMEndpoint,
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
                chatbox.value = null;
                return response.json()
            }
            throw new Error("Network response failed")
        }).then(data => {
            console.log(data)
            for(let i=0;i<data.dms.length;i++)
            {
                console.log(data.dms[i])
            }
        })
        .catch(error => {
            console.error("There was a problem with the fetch", error);
        });
}