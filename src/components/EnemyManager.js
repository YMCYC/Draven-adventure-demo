// src/components/EnemyManager.js

// import { scene } from '../main'; // 或者通过参数传入 scene
import { JarvanIV } from './Enemy'; // 你可以根据 enemyData.type 动态选择不同敌人
import { tilesize } from '../constants';
import { createHealthBar,updateHealthBar } from './HealthBar';

// 用于缓存所有前端的 enemy 实例
const enemyInstances = {};

// 创建 enemy
export function createEnemyFromServer(enemyData, scene) {
  // 这里可以根据 enemyData.type 创建不同类型的敌人
  let enemy;
  if (enemyData.type === 'jarvan') {
    enemy = JarvanIV(enemyData); // 这里用 enemyData.x, enemyData.y 设置位置
  }
  // ...其他类型


  if (enemy) {
    enemy.enemyId = enemyData.id;
    enemy.hp = enemyData.hp;
    enemy.maxHp = enemyData.maxHp || enemyData.hp;

    const healthBar = createHealthBar(30, 3); // 宽10，高1，可自定义
    healthBar.position.z = enemy.position.z + 40; // 适当调整y轴
    enemy.add(healthBar);

    enemy.healthBar = healthBar;

    updateHealthBar(healthBar, enemy.hp, enemy.maxHp);
    // 设置位置
    enemy.position.x = enemyData.x;
    enemy.position.y = enemyData.rowIndex * tilesize;
    enemy.position.z = 0;
    enemyInstances[enemyData.id] = enemy;
    scene.add(enemy);
  }
}




// 更新 enemy HP
export function updateEnemyHp(enemyId, hp) {
  const enemy = enemyInstances[enemyId];
  if (enemy) {
    enemy.hp = hp;
    console.log(`Enemy [${enemyId}] HP updated: ${hp}`);
  }
}

// 查找 enemy
export function getEnemyById(enemyId) {
  return enemyInstances[enemyId];
}

// 移除 enemy
export function removeEnemy(enemyId, scene) {
  const enemy = enemyInstances[enemyId];
  console.log(`[removeEnemy] 移除 enemy: ${enemyId}`);
  if (enemy) {
    console.log(`[removeEnemy] 移除 enemy: ${enemyId}`);
    scene.remove(enemy);
    delete enemyInstances[enemyId];
  }
}