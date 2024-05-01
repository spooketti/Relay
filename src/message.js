const queryMessageEndpoint = "http://127.0.0.1:6221/getServerMessage/"
let MessageBody = document.getElementById("MessageBody")
let ChannelNavName = document.getElementById('ChannelNameNav')

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
                ChannelNavName.innerText = data["channelName"]
                chatbox.placeholder = `Messsage #${data["channelName"]}`
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
            ChannelNavName.innerText = data["channelName"]
            chatbox.placeholder = `Messsage #${data["channelName"]}`
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
            MessageBody.appendChild(MessageWrapper) //if the message is new append it to the end as the end is where the newest message is
        }
        else
        {
            MessageBody.prepend(MessageWrapper) //if this is an old message query it at the top as thats where the old messages are
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

socket.on("recieveChannelCreate",function(msg)
{
  let channelList = document.getElementById("ChannelList")
  let channelListItem = document.createElement("a")
  channelListItem.classList.add("ChannelListItem")
  channelListItem.innerText = msg["name"]
  channelListItem.href = `app.html?ServerChannel=${msg["channelID"]}&Server=${ServerParam}`
  channelList.appendChild(channelListItem)
})
if(ServerChannel)
{
    queryMessage(false)
}
