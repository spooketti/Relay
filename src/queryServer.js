const getServerEndpoint = "http://127.0.0.1:6221/getServer/"
function queryServer()
{
    fetch(getServerEndpoint,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${localStorage.getItem("jwt")}`
          },
        }).then(response => {
          if (response.ok) {
            return response.json()
          }
          throw new Error("Network response failed")
        }).then(data => {
          console.log(data)
        })
        .catch(error => {
          console.error("There was a problem with the fetch", error);
        });
}