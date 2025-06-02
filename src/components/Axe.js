import * as THREE from 'three';

// Bullet ���캯�������ճ�ʼλ�ò���
export function Axe(initialPosition = { x: 0, y: 0, z: 10 }) {
    const axe = new THREE.Group();
    const body = new THREE.Mesh(
        new THREE.BoxGeometry(5, 5, 5),
        new THREE.MeshLambertMaterial({
            color: "yellow",
            flatShading: true,
        })
    );
    body.position.z = 0; // �ӵ������� group ������
    bullet.add(body);

    // �����ӵ���ʼλ��
    bullet.position.set(initialPosition.x, initialPosition.y, initialPosition.z);
    bullet.castShadow = true;
    bullet.receiveShadow = true;

    return bullet;
}