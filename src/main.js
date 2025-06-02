import * as THREE from 'three';
import './style.css'
import "./collectUserInput";
import {Renderer} from "./components/Renderer";
import {DirectionalLight} from "./components/DirectionalLight";
import {Camera} from "./components/Camera";
import {player,initializePlayer} from "./components/Player";
import {map,initializeMap} from "./components/Map";
import {jarvan,initializeJarvan} from "./components/Enemy";
import { animatePlayer } from './animatePlayer';
import { createFlyingAxe, updateFlyingAxes, flyingAxes } from "./flyingAxeManager";

const scene = new THREE.Scene();
scene.add(player);
scene.add(jarvan);
scene.add(map);
initializeGame()
const ambientLight = new THREE.AmbientLight();
scene.add(ambientLight);


const dirLight = DirectionalLight();
player.add(dirLight);
const camera = new Camera();
player.add(camera);

const renderer = new Renderer();

renderer.render(scene,camera);
renderer.setAnimationLoop(animate);

function animate(){
    animatePlayer();
    // hitTest()
    updateFlyingAxes(scene);
    renderer.render(scene,camera);//render in every loop
}


function initializeGame(){
  initializeMap("map1",jarvan);
  initializePlayer();
}

function shootAxe() {
    // won't lanuch if axe exist
    if (flyingAxes.length > 0) return;
    const position = {
        x: player.position.x,
        y: player.position.y,
        z: player.position.z + 20 // appropriate height
    };
    createFlyingAxe(scene, position);
}

window.addEventListener("shoot-bullet", () => {
    shootAxe();
});