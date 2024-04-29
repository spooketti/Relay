const queryString = window.location.search
const params = new URLSearchParams(queryString)
let DMChannel
let ServerChannel
let currentMessageOffset = 0

function dateTime(epoch)
{
    let today = new Date(epoch*1000)
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    const yyyy = today.getFullYear();
    let time = today.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return ` ${mm}/${dd}/${yyyy} at ${time}`;
}
/*
let GetDMEndpoint = "http://127.0.0.1:6221/getDM/"
DMChannel = params.get("DMChannel")*/

const createChannelEndpoint = "http://127.0.0.1:6221/createChannel/"
const queryChannelEndpoint = "http://127.0.0.1:6221/getServerChannels/"
const joinServerEndpoint = "http://127.0.0.1:6221/joinServer/"
ServerChannel = params.get("ServerChannel")
ServerParam = params.get("Server")
JoinServerParam = params.get("JoinServer")

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
    }).then(data => {
        window.location.href = "app.html"
    })
    .catch(error => {
      console.error("There was a problem with the fetch", error);
    });
}

if (params.has("DMChannel") && params.has("ServerChannel"))
{
    window.location.href = "app.html"
}

if(!params.has("Server")&&!params.has("ServerChannel"))
{
  document.getElementById("CreateChannel").remove()
}

if(!ServerChannel)
    {
        document.getElementById("ChatContainer").remove()
        document.getElementById("MessageBody").style.height = "100%"
    }

if(params.has("Server"))
{
    queryChannel()
}

function createChannel()
{
    let channelName = document.getElementById("CreateChannelField").value
    let payload = 
    {
     "name":channelName,
      "serverID":ServerParam,
    }
      fetch(createChannelEndpoint,
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
          }).then(data => {
              console.log(data)
          })
          .catch(error => {
            console.error("There was a problem with the fetch", error);
          });
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
            console.log(data)
          for(let i=0;i<data["channels"].length;i++)
          {
            let channelListItem = document.createElement("a")
            channelListItem.classList.add("ChannelListItem")
            channelListItem.innerText = data["channels"][i]["name"]
            channelListItem.href = `app.html?ServerChannel=${data["channels"][i]["channelID"]}&Server=${ServerParam}`
            channelList.appendChild(channelListItem)
          }
          serverNameElement.innerText = data["serverName"]
          let createChannel = document.createElement("button")
          createChannel.innerText = "+"
          createChannel.id = "CreateChannel"
          createChannel.onclick = openChannelCreate
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