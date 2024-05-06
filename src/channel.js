const queryString = window.location.search
const params = new URLSearchParams(queryString)
let DMChannel
let ServerChannel
let currentMessageOffset = 0

function dateTime(epoch)
{
    let today = new Date(epoch*1000) //this takes in a ms value not seconds, so multiply by 1000
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); 
    const yyyy = today.getFullYear();
    let time = today.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return ` ${mm}/${dd}/${yyyy} at ${time}`;
}

const createChannelEndpoint = "https://relayserver-5l9m.onrender.com/createChannel/"//"http://127.0.0.1:6221/createChannel/"
const queryChannelEndpoint = "https://relayserver-5l9m.onrender.com/getServerChannels/"//"http://127.0.0.1:6221/getServerChannels/"
const joinServerEndpoint = "https://relayserver-5l9m.onrender.com/joinServer/"//"http://127.0.0.1:6221/joinServer/"
ServerChannel = params.get("ServerChannel")
ServerParam = params.get("Server")
JoinServerParam = params.get("JoinServer") //query parameters are file.html?var=value

if(params.has("JoinServer"))
{
  let payload = 
  {
    "serverID":JoinServerParam
  }
  fetch(joinServerEndpoint,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${localStorage.getItem("jwt")}`
      },
      body: JSON.stringify(payload)
    }).then(response => {
      if (response.ok) {
        return response.text()
      }
      throw new Error("Network response failed")
    }).then(data => { //joins the server created from the link
        window.location.href = "app.html"
    })
    .catch(error => {
      console.error("There was a problem with the fetch", error);
    });
}

if(!params.has("Server")&&!params.has("ServerChannel")) //if there are no parameters
{
  document.getElementById("CreateChannel").remove()
  document.getElementById("GetChannelLink").remove()
}

if(!ServerChannel)
    {
        document.getElementById("ChatContainer").remove()
        document.getElementById("MessageBody").style.height = "100%"
    }

if(params.has("Server"))
{
    queryChannel() //if it is in server view query the channels that exist in the server
}

function createChannel()
{
    let channelName = document.getElementById("CreateChannelField").value
    let payload = 
    {
     "name":channelName,
      "serverID":ServerParam,
    }
    socket.emit("createChannel",payload) //emit allowing for real time creation
}

function queryChannel()
{
    let channelList = document.getElementById("ChannelList")
    let serverNameElement = document.getElementById("ServerName")
    let payload = 
  {
    "serverID":ServerParam,
  }
    fetch(queryChannelEndpoint,
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
          for(let i=0;i<data["channels"].length;i++)
          {
            let channelListItem = document.createElement("a")
            channelListItem.classList.add("ChannelListItem")
            channelListItem.innerText = data["channels"][i]["name"]
            channelListItem.href = `app.html?ServerChannel=${data["channels"][i]["channelID"]}&Server=${ServerParam}`
            channelList.appendChild(channelListItem)
          }
          serverNameElement.innerText = data["serverName"]

          let copyLinkButton = document.createElement("button")
          copyLinkButton.innerText = "🔗"
          copyLinkButton.id = "GetChannelLink"
          copyLinkButton.onclick = copyServerLink
          copyLinkButton.classList.add("ChannelCreateButton")
          serverNameElement.appendChild(copyLinkButton)

          let createChannel = document.createElement("button")
          createChannel.innerText = "+"
          createChannel.id = "CreateChannel"
          createChannel.onclick = openChannelCreate
          createChannel.classList.add("ChannelCreateButton")
          serverNameElement.appendChild(createChannel)
        })
        .catch(error => {
          console.error("There was a problem with the fetch", error);
        });
}


function openChannelCreate()
{
    document.getElementById("CreateChannelInput").style.transform = "translateX(0px)"
}

function closeChannelCreate()
{  
    document.getElementById("CreateChannelField").value = ""
    document.getElementById("CreateChannelInput").style.transform = "translateX(-233px)"
}

function copyServerLink()
{
  navigator.clipboard.writeText(`app.html?JoinServer=${ServerParam}`)
  document.getElementById("GetChannelLink").innerText = "✔"
  window.setTimeout(function(){
    document.getElementById("GetChannelLink").innerText = "🔗"
  },1500)
}