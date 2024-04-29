//let 
const queryMessageEndpoint = "http://127.0.0.1:6221/getServerMessage/"
let MessageBody = document.getElementById("MessageBody")

function queryMessage(specialScroll) {
    let payload =
    {
        "channel": ServerChannel,
        "offset": currentMessageOffset
    }
    fetch(queryMessageEndpoint,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${localStorage.getItem("jwt")}`
            },
            body: JSON.stringify(payload)
        }).then(response => {
            if (response.ok) {
                return response.json()
            }
            throw new Error("Network response failed")
        }).then(data => {
            currentMessageOffset += 5
            if(data["messages"].length<=0)
            {
                return
            }
            let marker = MessageBody.firstElementChild
            for (let i = 0; i < data["messages"].length; i++)
            {
                appendMessage(data["messages"][i],false)
            }
            if(specialScroll)
            {
                MessageBody.scrollTop = window.scrollY + marker.getBoundingClientRect().top
            }
            if(MessageBody.scrollHeight <= MessageBody.clientHeight)
            {
                MessageBody.scrollTop = MessageBody.scrollHeight;   
                queryMessage(false)
            }
        })
        .catch(error => {
            console.error("There was a problem with the fetch", error);
        });
}

function appendMessage(data,isNew)
{
    let scrollToBottom = Math.ceil(MessageBody.scrollTop) >= (MessageBody.scrollHeight - MessageBody.offsetHeight) - 100
        let MessageWrapper = document.createElement("div")
        MessageWrapper.classList.add("MessageWrapper")
        let MessagePosterWrapper = document.createElement("div")
        MessagePosterWrapper.classList.add("MessagePosterWrapper")
        let MessagePFP = document.createElement("img")
        MessagePFP.src = data["pfp"]
        MessagePFP.classList.add("MessagePFP")
        let MessageUsername = document.createElement("span")
        MessageUsername.classList.add("MessageUsername")
        MessageUsername.innerText = data["name"]
        let MessageDate = document.createElement("span")
        MessageDate.classList.add("MessageDate")
        MessageDate.innerText = dateTime(data["date"])
        let MessageContent = document.createElement("span")
        MessageContent.innerText = data["message"]
        MessageContent.classList.add("MessageContent")
        if(isNew)
        {
            MessageBody.appendChild(MessageWrapper)
        }
        else
        {
            MessageBody.prepend(MessageWrapper)
        }
        MessageWrapper.appendChild(MessagePosterWrapper)
        MessagePosterWrapper.appendChild(MessagePFP)
        MessagePosterWrapper.appendChild(MessageUsername)
        MessageUsername.appendChild(MessageDate)
        MessageUsername.appendChild(document.createElement("br"))
        MessageUsername.appendChild(MessageContent)
        if(scrollToBottom)
        {
            MessageBody.scrollTop = MessageBody.scrollHeight
        }
}

MessageBody.addEventListener("scroll",function(e)
{
    if(MessageBody.scrollTop == 0)
    {
        queryMessage(true)
    }
})

socket.on("recieveServerMessage",function(msg)
{
    currentMessageOffset++
    appendMessage(msg,true)
})
queryMessage(false)