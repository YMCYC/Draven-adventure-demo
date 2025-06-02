import * as THREE from 'three';
import './style.css'
import "./collectUserInput";
import {Renderer} from "./components/Renderer";
import {DirectionalLight} from "./components/DirectionalLight";
import {Camera} from "./components/Camera";
import {player,initializePlayer} from "./components/Player";
import {map,initializeMap, metadata} from "./components/Map";
import {jarvan,initializeJarvan} from "./components/Enemy";
import { animatePlayer } from './animatePlayer';
import { createFlyingAxe, updateFlyingAxes, flyingAxes } from "./flyingAxeManager";
import { connectSocket, on, sendMessage, enemyMap } from './socket';
import {
    createEnemyFromServer,
    updateEnemyHp,
    getEnemyById,
    removeEnemy
  } from './components/EnemyManager';
import { updateHealthBar } from './components/HealthBar';



const scene = new THREE.Scene();
scene.add(player);
// scene.add(jarvan);
scene.add(map);
initializeGame()
const ambientLight = new THREE.AmbientLight();
scene.add(ambientLight);


const dirLight = DirectionalLight();
player.add(dirLight);
const camera = new Camera();
player.add(camera);

const renderer = new Renderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
camera.aspect = window.innerWidth / window.innerHeight;
camera.updateProjectionMatrix();

renderer.render(scene,camera);
renderer.setAnimationLoop(animate);

function animate(){
    animatePlayer();
    // hitTest()
    updateFlyingAxes(scene);
    renderer.render(scene,camera);//render in every loop
}


function initializeGame(){
//   initializeMap("map1",jarvan);
  initializeMap("map1");
  sendMessage({ type: 'request_enemy_init' }); 
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

window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});

// 连接
connectSocket();

// 监听敌人初始化
on('enemy_init', (enemyData) => {
  // 1. 同步 enemyMap
  enemyMap[enemyData.id] = enemyData;
  // 2. 创建 Three.js 敌人实例
  createEnemyFromServer(enemyData, scene);

  // 挂 enemyRef 到 metadata
  const row = metadata.find(row => row.rowIndex === enemyData.rowIndex);
  if (row) {
    const enemyObj = getEnemyById(enemyData.id);
    row.enemyRef = enemyObj;
    console.log(`[enemy_init] 挂载 enemyRef 到 metadata rowIndex=${enemyData.rowIndex}:`, enemyObj);
  } else {
    console.warn(`[enemy_init] 未找到 rowIndex=${enemyData.rowIndex} 的 metadata 行`);
  }
});

// 监听敌人HP变化
on('enemy_hp_update', (enemyData) => {
  console.log('enemy_hp_update event received:', enemyData);
  updateEnemyHp(enemyData.id, enemyData.hp);

  // 播放受击反馈
  const enemy = getEnemyById(enemyData.id);
  if (enemy) {
    // 1. 更新血条
    if (enemy.healthBar) {
      updateHealthBar(enemy.healthBar, enemy.hp, enemy.maxHp);
    }
    // 2. 受击动画
    enemy.hitFeedback && enemy.hitFeedback();
  }
});



// 监听敌人死亡
on('enemy_dead', (enemyData) => {
  // 1. 移除 Three.js 实例
  removeEnemy(enemyData.id, scene);

  // 2. 移除 enemyMap 数据
  delete enemyMap[enemyData.id];

  // 3. 清理 metadata 里的 enemyRef
  const row = metadata.find(row => row.rowIndex === enemyData.rowIndex);
  if (row && row.enemyRef && row.enemyRef.enemyId === enemyData.id) {
    row.enemyRef = null;
  }
});