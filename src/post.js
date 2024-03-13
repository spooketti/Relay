let submitMessageElement = document.getElementById("SubmitMessage")
let chatbox = document.getElementById("ChatBox")
let isShiftDown = false;
let DMEndpoint = "http://127.0.0.1:6221/sendDM/"

document.addEventListener("keydown",function(e)
{
    switch(e.key)
    {
        case "Shift":
            isShiftDown = true;
        break;

        case "Enter":
            if(!isShiftDown)
            {
                postMessage()
            }
        break;
    }
})

document.addEventListener("keyup",function(e)
{
    switch(e.key)
    {
        case "Shift":
            isShiftDown = false;
        break;
    }
})

function postMessage()
{
    let payload = 
    {
        "message":chatbox.value,
        "recipient":1
    }
    fetch(DMEndpoint,
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
}