import * as THREE from "three";
import {tilesPerRow,tilesize} from "../constants";

export function Road(rowIndex){
    const road = new THREE.Group();
    road.position.y = rowIndex * tilesize;

    const foundation = new THREE.Mesh(
        new THREE.BoxGeometry(tilesPerRow * tilesize,tilesize,3),
        new THREE.MeshLambertMaterial({ color:"#635851"})
    );
    foundation.position.z = 1.5;
    foundation.receiveShadow = true;
    road.add(foundation);

    return road;
}