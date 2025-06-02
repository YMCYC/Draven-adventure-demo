import * as THREE from 'three';

// 创建血条
export function createHealthBar(width = 20, height = 2) {
    const group = new THREE.Group();
  
    // 红色背景条
    const redGeometry = new THREE.PlaneGeometry(width, height);
    redGeometry.translate(width / 2, 0, 0);  // 左对齐
    const redMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const redBar = new THREE.Mesh(redGeometry, redMaterial);
    group.add(redBar);
  
    // 绿色血量条
    const greenGeometry = new THREE.PlaneGeometry(width, height);
    greenGeometry.translate(width / 2, 0, 0.5);  // 左对齐
    const greenMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const greenBar = new THREE.Mesh(greenGeometry, greenMaterial);
    group.add(greenBar);
  
    group.greenBar = greenBar;
    group.redBar = redBar;
  
    // 关键：让整个血条group的原点在血条中点
    group.position.x = -width / 2;
  
    return group;
  }
  
  
  // 更新血条
  export function updateHealthBar(healthBar, hp, maxHp) {
    const ratio = Math.max(0, hp / maxHp);
    healthBar.greenBar.scale.x = ratio;
  }