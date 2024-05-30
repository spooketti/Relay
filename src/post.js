let submitMessageElement = document.getElementById("SubmitMessage")
let chatbox = document.getElementById("ChatBox")
let isShiftDown = false;
const sendMessageServerEndpoint = `${serverAddress}/sendServerMessage/`

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
         socket.emit("sendServerMessage",payload) //real time messaging
         chatbox.value = "";
}