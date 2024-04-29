let submitMessageElement = document.getElementById("SubmitMessage")
let chatbox = document.getElementById("ChatBox")
let isShiftDown = false;
const sendMessageServerEndpoint = "http://127.0.0.1:6221/sendServerMessage/"

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
                e.preventDefault()
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
    if(!ServerChannel)
    {
        return
    }
    let payload = 
    {
        "content":chatbox.value,
        "channel":ServerChannel,
        "image":null
    }
    /*
    fetch(sendMessageServerEndpoint,
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
            currentMessageOffset++
            console.log("Response:", data);
            socket.emit("sendServerMessage",{
                channel : ServerChannel
            })
          })
          .catch(error => {
            console.error("There was a problem with the fetch", error);
          });
          */
         socket.emit("sendServerMessage",payload)
         chatbox.value = "";
}