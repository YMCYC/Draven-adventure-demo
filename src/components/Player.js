import * as THREE from "three";
import {endsUpInValidPosition} from "../utilities/endsUpInValidPosition";
import {metadata as rows,addRows} from "./Map";

export const player = Player();

export const movesQueue = [];

function Player(){
    const player = new THREE.Group();
    
    // 各部件尺寸
    const bodyHeight = 8;
    const headHeight = 12;
    const hairBandHeight = 2;
    const hairHeight = 7;

    // 身体
    const body = new THREE.Mesh(
        new THREE.BoxGeometry(15,15,bodyHeight),
        new THREE.MeshLambertMaterial({
            color:"#303F3C",
            flatShading:true,    
        })
    );
    let currentTop = 0;
    body.position.z = currentTop + bodyHeight/2;
    body.castShadow = true;
    body.receiveShadow = true;
    currentTop += bodyHeight;

    // 头
    const head = new THREE.Mesh(
        new THREE.BoxGeometry(15,15,headHeight),
        new THREE.MeshLambertMaterial({
            color:"#E09B7F",
            flatShading:true,
        })
    );
    head.position.z = currentTop + headHeight/2;
    head.castShadow = true;
    head.receiveShadow = true;
    currentTop += headHeight;

    // 发带
    const hairBand = new THREE.Mesh(
        new THREE.BoxGeometry(15,15,hairBandHeight),
        new THREE.MeshLambertMaterial({
            color:"#EBB879",
            flatShading:true,
        })
    );
    hairBand.position.z = currentTop + hairBandHeight/2;
    hairBand.castShadow = true;
    hairBand.receiveShadow = true;
    currentTop += hairBandHeight;

    // 头发
    const hair = new THREE.Mesh(
        new THREE.BoxGeometry(15,15,hairHeight),
        new THREE.MeshLambertMaterial({
            color:"#3C1521",
            flatShading:true,
        })
    );
    hair.position.z = currentTop + hairHeight/2;
    hair.castShadow = true;
    hair.receiveShadow = true;
    currentTop += hairHeight;

    player.add(body);
    player.add(head);
    player.add(hairBand);
    player.add(hair);

    const playerContainer = new THREE.Group();
    playerContainer.add(player);

    return playerContainer;
}

export const position = {
    currentRow:0,
    currentTile:0,
}

export function initializePlayer(){
    player.position.x = 0;
    player.position.y = 0;
    player.position.z = 0;

    position.currentRow = 0;
    position.currentTile = 0;
}

export function queueMove(direction){
    const isValidMove = endsUpInValidPosition(
        {
            rowIndex:position.currentRow,
            tileIndex:position.currentTile,
        },
        [...movesQueue,direction]
    );
    if(!isValidMove) return;
    movesQueue.push(direction);
}

export function stepCompleted(){
    //删除一个指令并移动
    const direction = movesQueue.shift();
    
    if(direction === "forward") position.currentRow += 1;
    if(direction === "backward") position.currentRow -= 1;
    if(direction === "left") position.currentTile -= 1;
    if(direction === "right") position.currentTile += 1;   

    // if(position.currentRow >= rows.length-10) addRows();

    // const scoreDOM = document.getElementById("score");
    // if (scoreDOM) scoreDOM.textContent = position.currentRow.toString();
}