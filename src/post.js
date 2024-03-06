let submitMessageElement = document.getElementById("SubmitMessage")
let isShiftDown = false;

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

}