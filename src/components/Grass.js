import * as THREE from "three";
import {tilesPerRow,tilesize} from "../constants";

export function Grass(rowIndex){
    const grass = new THREE.Group();
    grass.position.y = rowIndex * tilesize;

    const foundation = new THREE.Mesh(
        new THREE.BoxGeometry(tilesPerRow * tilesize,tilesize,3),
        new THREE.MeshLambertMaterial({ color:"#BFF9CE"})
    );
    foundation.position.z = 1.5;
    foundation.receiveShadow = true;
    grass.add(foundation);

    return grass;
}