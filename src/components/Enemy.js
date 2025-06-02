import * as THREE from "three";
import { tilesize } from "../constants";
export const jarvan = JarvanIV();

export const position = {
    currentRow:0,
    currentTile:0,
}

function JarvanIV(){
    const enemy = new THREE.Group();
    
    // 各部件尺寸
    const bodyHeight = 12;
    const headHeight = 12;
    const hairBandHeight = 2;
    const hairHeight = 7;
    const headWidth = 15;
    const shoulderWidth = 5;
    
    // 身体
    const body = new THREE.Mesh(
        new THREE.BoxGeometry(25,25,bodyHeight),
        new THREE.MeshLambertMaterial({
            color:"#77612A",
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
        new THREE.BoxGeometry(headWidth, 25, headHeight),
        new THREE.MeshLambertMaterial({
            color:"#F3DB9E",
            flatShading:true,
        })
    );
    head.position.z = currentTop + headHeight/2;
    head.castShadow = true;
    head.receiveShadow = true;

    const shoulderLeft = new THREE.Mesh(
        new THREE.BoxGeometry(shoulderWidth, 25, headHeight),
        new THREE.MeshLambertMaterial({
            color:"#E0E052",
            flatShading:true,
        })
    );
    shoulderLeft.position.x = - (headWidth / 2 + shoulderWidth / 2);
    shoulderLeft.position.z = currentTop + headHeight/2;
    shoulderLeft.castShadow = true;
    shoulderLeft.receiveShadow = true;

    const shoulderRight = new THREE.Mesh(
        new THREE.BoxGeometry(shoulderWidth, 25, headHeight),
        new THREE.MeshLambertMaterial({
            color:"#E0E052",
            flatShading:true,
        })
    );
    shoulderRight.position.x = (headWidth / 2 + shoulderWidth / 2);
    shoulderRight.position.z = currentTop + headHeight/2;
    shoulderRight.castShadow = true;
    shoulderRight.receiveShadow = true;

    currentTop += headHeight;
    // 发带
    const hairBand = new THREE.Mesh(
        new THREE.BoxGeometry(25,25,hairBandHeight),
        new THREE.MeshLambertMaterial({
            color:"#F0EB18",
            flatShading:true,
        })
    );
    hairBand.position.z = currentTop + hairBandHeight/2;
    hairBand.castShadow = true;
    hairBand.receiveShadow = true;
    currentTop += hairBandHeight;

    // 头发
    const hair = new THREE.Mesh(
        new THREE.BoxGeometry(25,25,hairHeight),
        new THREE.MeshLambertMaterial({
            color:"#EFEA11",
            flatShading:true,
        })
    );
    hair.position.z = currentTop + hairHeight/2;
    hair.castShadow = true;
    hair.receiveShadow = true;
    currentTop += hairHeight;

    enemy.add(body);
    enemy.add(head);
    enemy.add(shoulderLeft);
    enemy.add(shoulderRight);
    enemy.add(hairBand);
    enemy.add(hair);

    const totalWidth = headWidth + shoulderWidth*2; // 左右肩膀最宽
    const totalHeight = 25; // y方向
    const totalDepth = bodyHeight + headHeight + hairBandHeight + hairHeight; // z方向

    const collisionBox = new THREE.Mesh(
        new THREE.BoxGeometry(totalWidth,totalHeight,totalDepth),
        new THREE.MeshLambertMaterial({
            color:"yellow",
            visible:false})
        )
    collisionBox.position.z = totalDepth/2;
    const enemyContainer = new THREE.Group();
    enemyContainer.add(enemy);
    enemyContainer.add(collisionBox);
    enemyContainer.collisionBox = collisionBox;
    return enemyContainer;
}

export function initializeJarvan(rowIndex = 0) {
    position.currentRow = rowIndex;
    position.currentTile = 0;
    jarvan.position.x = 0;
    jarvan.position.y = position.currentRow * tilesize;
    jarvan.position.z = 0;
}