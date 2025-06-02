import { FlyingAxe } from "./components/FlyingAxe";
import * as THREE from "three";
import { metadata } from "./components/Map";
import { player } from "./components/Player";
import { minTileIndex, maxTileIndex, tilesize } from "./constants";
import { addStarAtTile, addImageAtTile } from "./utilities/addTarget";
import { sendMessage } from "./socket";

export const flyingAxes = [];

// 用于追踪当前target图片Mesh，便于移除
let lastTargetMesh = null;

export function createFlyingAxe(scene, position) {
    const axe = FlyingAxe(position);
    scene.add(axe);
    flyingAxes.push(axe);
    axe.isReturning = false;
    axe.returnTarget = null;
    axe.returnProgress = 0; // 0~1
    axe.returnDuration = 0;
    axe.returnElapsed = 0;
    axe.targetMesh = null; // 记录本次回弹的target图片Mesh
    return axe;
}

export function updateFlyingAxes(scene) {
    // Assume each frame is about 16ms
    const deltaTime = 0.016;
    for (let i = flyingAxes.length - 1; i >= 0; i--) {
        const axe = flyingAxes[i];
        if (axe.isReturning) {
            axe.returnElapsed += deltaTime;
            let t = axe.returnElapsed / axe.returnDuration;
            if (t > 1) t = 1;
            axe.returnProgress = t;

            // Parabola control point
            const p0 = axe.returnStart;
            const p2 = axe.returnTarget;
            const p1 = {
                x: (p0.x + p2.x) / 2,
                y: (p0.y + p2.y) / 2,
                z: Math.max(p0.z, p2.z) + 60
            };

            // Quadratic Bezier interpolation
            axe.position.x = (1 - t) * (1 - t) * p0.x + 2 * (1 - t) * t * p1.x + t * t * p2.x;
            axe.position.y = (1 - t) * (1 - t) * p0.y + 2 * (1 - t) * t * p1.y + t * t * p2.y;
            axe.position.z = (1 - t) * (1 - t) * p0.z + 2 * (1 - t) * t * p1.z + t * t * p2.z;

            // Rotate while returning
            axe.rotation.x += 0.3;

            // Remove axe and target image when done
            if (axe.returnProgress >= 1) {
                scene.remove(axe);
                flyingAxes.splice(i, 1);
                if (axe.targetMesh && scene.children.includes(axe.targetMesh)) {
                    scene.remove(axe.targetMesh);
                }
            }
            continue;
        }
        // Move axe forward
        axe.position.y += 1.8;
        axe.rotation.x -= 0.3;

        // Collision detection
        const axeBox = new THREE.Box3().setFromObject(axe);
        const currentRow = Math.round(axe.position.y / tilesize);
        const rowsToCheck = [currentRow, currentRow + 1, currentRow - 1, currentRow + 2, currentRow - 2];
        let hitEnemy = null;
        for (const rowIdx of rowsToCheck) {
            const rowData = metadata[rowIdx];
            if (!rowData) continue;
            if (rowData.fieldType === "EnemyField") {
                const enemy = rowData.enemyRef;
                if (enemy) {
                    const enemyBox = new THREE.Box3().setFromObject(enemy.collisionBox);
                    if (axeBox.intersectsBox(enemyBox)) {
                        hitEnemy = enemy;
                        // 受击反馈
                        if (typeof enemy.hitFeedback === 'function') {
                            enemy.hitFeedback();
                        }
                        // Axe hit enemy, set return
                        const playerRow = Math.round(player.position.y / tilesize);
                        const playerTile = Math.round(player.position.x / tilesize);
                        const candidateTiles = [playerTile - 1, playerTile, playerTile + 1];
                        const randomTile = candidateTiles[Math.floor(Math.random() * candidateTiles.length)];
                        const targetX = randomTile * tilesize;
                        const targetY = playerRow * tilesize;
                        const targetZ = 4;
                        axe.isReturning = true;
                        axe.returnTarget = { x: targetX, y: targetY, z: targetZ };
                        axe.returnStart = { x: axe.position.x, y: axe.position.y, z: axe.position.z };
                        axe.returnProgress = 0;
                        axe.returnDuration = 1.3;
                        axe.returnElapsed = 0;
                        if (axe.targetMesh && scene.children.includes(axe.targetMesh)) {
                            scene.remove(axe.targetMesh);
                        }
                        axe.targetMesh = null;
                        addImageAtTile(scene, playerRow, randomTile, targetZ, tilesize, (mesh) => {
                            axe.targetMesh = mesh;
                        });
                        console.log('hit enemy,enemy.id:', enemy.enemyId);
                        sendMessage({
                            type: 'enemy_hit',
                            enemyId: enemy.enemyId,
                            damage:20
                        });
                        break;
                    }
                }
            }
            if (hitEnemy) break;
        }
        let shouldRemove = false;
        if (axe.position.y > player.position.y + 300) {
            shouldRemove = true;
        }
        if (shouldRemove) {
            scene.remove(axe);
            flyingAxes.splice(i, 1);
        }
    }
} 