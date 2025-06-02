import * as THREE from 'three';

// Bullet 构造函数，接收初始位置参数
export function Axe(initialPosition = { x: 0, y: 0, z: 10 }) {
    const axe = new THREE.Group();
    const body = new THREE.Mesh(
        new THREE.BoxGeometry(5, 5, 5),
        new THREE.MeshLambertMaterial({
            color: "yellow",
            flatShading: true,
        })
    );
    body.position.z = 0; // 子弹本体在 group 的中心
    bullet.add(body);

    // 设置子弹初始位置
    bullet.position.set(initialPosition.x, initialPosition.y, initialPosition.z);
    bullet.castShadow = true;
    bullet.receiveShadow = true;

    return bullet;
}