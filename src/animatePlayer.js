import * as THREE from "three";
import {movesQueue,stepCompleted} from "./components/Player";
import {player,position} from "./components/Player";
import {tilesize} from "./constants";

const moveClock = new THREE.Clock(false);

export function animatePlayer(){
    if (!movesQueue.length) return;
    if (!moveClock.running) moveClock.start();

    const stepTime = 0.2;
    const progress = Math.min(1,moveClock.getElapsedTime()/stepTime);

    setPosition(progress);
    setRotation(progress);

    if (progress >= 1){
        stepCompleted();
        moveClock.stop();
    }
}

function setPosition(progress){
    const startX = position.currentTile * tilesize;
    const startY = position.currentRow * tilesize;
    let endX = startX;
    let endY = startY;

    if (movesQueue[0] === "forward") {endY = startY + tilesize;}
    if (movesQueue[0] === "backward") {endY = startY - tilesize;}
    if (movesQueue[0] === "left") {endX = startX - tilesize;}
    if (movesQueue[0] === "right") {endX = startX + tilesize;}
    
    player.position.x = THREE.MathUtils.lerp(startX,endX,progress);
    player.position.y = THREE.MathUtils.lerp(startY,endY,progress);
    player.children[0].position.z = Math.sin(progress * Math.PI)*8;
}

function setRotation(progress){
    let endRotation =0;
    if(movesQueue[0] == "forward") endRotation = 0;
    if(movesQueue[0] == "backward") endRotation = Math.PI;
    if(movesQueue[0] == "left") endRotation = -Math.PI/2;
    if(movesQueue[0] == "right") endRotation = Math.PI/2;

    player.children[0].rotation.z = THREE.MathUtils.lerp(
        player.children[0].rotation.z,
        endRotation,
        progress
    );
}
