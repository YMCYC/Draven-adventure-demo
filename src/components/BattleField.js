import * as THREE from "three";
import {tilesPerRow,tilesize} from "../constants";

export function BattleField(rowIndex){
    const ground = new THREE.Group();
    ground.position.y = rowIndex * tilesize;

    const foundation = new THREE.Mesh(
        new THREE.BoxGeometry(tilesPerRow * tilesize,tilesize,3),
        new THREE.MeshLambertMaterial({ color:"#B4B4B4"})
    );
    foundation.position.z = 1.5;
    foundation.receiveShadow = true;
    ground.add(foundation);

    return ground;
}