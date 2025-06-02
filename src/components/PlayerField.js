import * as THREE from "three";
import {tilesPerRow,tilesize} from "../constants";

export function PlayerField(rowIndex){
    const ground = new THREE.Group();
    ground.position.y = rowIndex * tilesize;

    const foundation = new THREE.Mesh(
        new THREE.BoxGeometry(tilesPerRow * tilesize,tilesize,3),
        new THREE.MeshLambertMaterial({ color:"#98B433"})
    );
    foundation.position.z = 1.5;
    foundation.receiveShadow = true;
    ground.add(foundation);

    return ground;
}