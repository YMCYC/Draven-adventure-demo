import * as THREE from "three";
import { tilesize } from "../constants";

// ���������Mesh
function createStarMesh() {
    // ��Shape�������
    const shape = new THREE.Shape();
    const r1 = 4, r2 = 2;
    for (let i = 0; i < 5; i++) {
        const a = (i * 2 * Math.PI) / 5 - Math.PI / 2;
        const r = i % 2 === 0 ? r1 : r2;
        const x = Math.cos(a) * r;
        const y = Math.sin(a) * r;
        if (i === 0) shape.moveTo(x, y);
        else shape.lineTo(x, y);
    }
    shape.closePath();
    const geometry = new THREE.ExtrudeGeometry(shape, { depth: 1, bevelEnabled: false });
    const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = -Math.PI / 2; // �������ƽ��
    return mesh;
}

// ��ָ��tile���������
export function addStarAtTile(scene, rowIndex, tileIndex, z = 10) {
    // tileIndexת��������
    const x = tileIndex * tilesize;
    const y = rowIndex * tilesize;
    const star = createStarMesh();
    star.position.set(x, y, z);
    scene.add(star);
    setTimeout(() => {
        scene.remove(star);
    }, 3000);
}

let starTexture = null; // ��������

// ��ָ��tile����ͼƬƽ�棬������mesh����
export function addImageAtTile(scene, rowIndex, tileIndex, z = 4, size = tilesize, onMeshCreated) {
    const x = tileIndex * tilesize;
    const y = rowIndex * tilesize;
    const url = "/assets/axe_land_noBG3.png";

    function createMesh(texture) {
        const geometry = new THREE.PlaneGeometry(size, size);
        const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true, side: THREE.DoubleSide });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(x, y, z);
        scene.add(mesh);
        if (onMeshCreated) onMeshCreated(mesh);
        return mesh;
    }

    if (starTexture) {
        return createMesh(starTexture);
    } else {
        const textureLoader = new THREE.TextureLoader();
        textureLoader.load(
            url,
            (texture) => {
                starTexture = texture;
                createMesh(texture);
            },
            undefined,
            (err) => {
                console.error("[addImageAtTile] Fail��:", url, err);
            }
        );
        return null;
    }
}
