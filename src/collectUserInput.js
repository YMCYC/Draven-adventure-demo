import {queueMove} from "./components/Player";

document.getElementById("forward")
    ?.addEventListener("click",()=> queueMove("forward"));

document.getElementById("backward")
    ?.addEventListener("click",()=> queueMove("backward"));

document.getElementById("left")
    ?.addEventListener("click",()=> queueMove("left"));

document.getElementById("right")
    ?.addEventListener("click",()=> queueMove("right"));

document.getElementById("throw-axe")
    ?.addEventListener("click",()=> {
        window.dispatchEvent(new Event("shoot-bullet"));
    });

window.addEventListener("keydown",(event)=>{
    if (event.key === "ArrowUp"){
        event.preventDefault();
        queueMove("forward");
    } else if (event.key === "ArrowDown"){
        event.preventDefault();
        queueMove("backward");
    } else if (event.key === "ArrowLeft"){
        event.preventDefault();
        queueMove("left");
    } else if (event.key === "ArrowRight"){
        event.preventDefault();
        queueMove("right");
    } else if (event.code === "Space") {
        event.preventDefault();
        window.dispatchEvent(new Event("shoot-bullet"));
    }
    
});
