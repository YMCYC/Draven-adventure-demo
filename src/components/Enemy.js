import * as THREE from "three";
import { tilesize } from "../constants";
export const jarvan = JarvanIV();

export const position = {
    currentRow:0,
    currentTile:0,
}

// 通用hitFeedback，enemyContainer会继承
function defaultHitFeedback() {
    // 变红
    const originalColors = [];
    this.traverse(child => {
        if (child.isMesh && child.material && child.material.color) {
            originalColors.push({ mesh: child, color: child.material.color.clone() });
            child.material.color.set('#ff2222');
        }
    });
    // 弹跳动画
    const originalZ = this.position.z;
    let t = 0;
    const bounceHeight = 12;
    const bounceDuration = 0.25; // 秒
    const animateBounce = () => {
        t += 1/60 / bounceDuration;
        this.position.z = originalZ + Math.abs(Math.sin(Math.PI * t)) * bounceHeight;
        if (t < 1) {
            requestAnimationFrame(animateBounce);
        } else {
            this.position.z = originalZ;
        }
    };
    animateBounce();
    // 恢复颜色
    setTimeout(() => {
        originalColors.forEach(({ mesh, color }) => {
            mesh.material.color.copy(color);
        });
    }, 150);
}

function JarvanIV(){
    const enemy = new THREE.Group();
    
    // 各部件尺寸
    const bodyHeight = 12;
    const headHeight = 12;
    const hairBandHeight = 2;
    const hairHeight = 7;
    const headWidth = 15;
    const shoulderWidth = 5;
    
    // 身体
    const body = new THREE.Mesh(
        new THREE.BoxGeometry(25,25,bodyHeight),
        new THREE.MeshLambertMaterial({
            color:"#77612A",
            flatShading:true,    
        })
    );
    let currentTop = 0;
    body.position.z = currentTop + bodyHeight/2;
    body.castShadow = true;
    body.receiveShadow = true;
    currentTop += bodyHeight;

    // 头
    const head = new THREE.Mesh(
        new THREE.BoxGeometry(headWidth, 25, headHeight),
        new THREE.MeshLambertMaterial({
            color:"#F3DB9E",
            flatShading:true,
        })
    );
    head.position.z = currentTop + headHeight/2;
    head.castShadow = true;
    head.receiveShadow = true;

    const shoulderLeft = new THREE.Mesh(
        new THREE.BoxGeometry(shoulderWidth, 25, headHeight),
        new THREE.MeshLambertMaterial({
            color:"#E0E052",
            flatShading:true,
        })
    );
    shoulderLeft.position.x = - (headWidth / 2 + shoulderWidth / 2);
    shoulderLeft.position.z = currentTop + headHeight/2;
    shoulderLeft.castShadow = true;
    shoulderLeft.receiveShadow = true;

    const shoulderRight = new THREE.Mesh(
        new THREE.BoxGeometry(shoulderWidth, 25, headHeight),
        new THREE.MeshLambertMaterial({
            color:"#E0E052",
            flatShading:true,
        })
    );
    shoulderRight.position.x = (headWidth / 2 + shoulderWidth / 2);
    shoulderRight.position.z = currentTop + headHeight/2;
    shoulderRight.castShadow = true;
    shoulderRight.receiveShadow = true;

    currentTop += headHeight;
    // 发带
    const hairBand = new THREE.Mesh(
        new THREE.BoxGeometry(25,25,hairBandHeight),
        new THREE.MeshLambertMaterial({
            color:"#F0EB18",
            flatShading:true,
        })
    );
    hairBand.position.z = currentTop + hairBandHeight/2;
    hairBand.castShadow = true;
    hairBand.receiveShadow = true;
    currentTop += hairBandHeight;

    // 头发
    const hair = new THREE.Mesh(
        new THREE.BoxGeometry(25,25,hairHeight),
        new THREE.MeshLambertMaterial({
            color:"#EFEA11",
            flatShading:true,
        })
    );
    hair.position.z = currentTop + hairHeight/2;
    hair.castShadow = true;
    hair.receiveShadow = true;
    currentTop += hairHeight;

    enemy.add(body);
    enemy.add(head);
    enemy.add(shoulderLeft);
    enemy.add(shoulderRight);
    enemy.add(hairBand);
    enemy.add(hair);

    const totalWidth = headWidth + shoulderWidth*2; // 左右肩膀最宽
    const totalHeight = 25; // y方向
    const totalDepth = bodyHeight + headHeight + hairBandHeight + hairHeight; // z方向

    const collisionBox = new THREE.Mesh(
        new THREE.BoxGeometry(totalWidth,totalHeight,totalDepth),
        new THREE.MeshLambertMaterial({
            color:"yellow",
            visible:false})
        )
    collisionBox.position.z = totalDepth/2;
    const enemyContainer = new THREE.Group();
    enemyContainer.add(enemy);
    enemyContainer.add(collisionBox);
    enemyContainer.collisionBox = collisionBox;
    enemyContainer.body = body;
    enemyContainer.head = head;
    enemyContainer.shoulderLeft = shoulderLeft;
    enemyContainer.shoulderRight = shoulderRight;
    enemyContainer.hairBand = hairBand;
    enemyContainer.hair = hair;
    // 专属hitFeedback（可自定义）
    enemyContainer.hitFeedback = jarvanHitFeedback;
    return enemyContainer;
}

// 给所有enemy默认加上hitFeedback
THREE.Group.prototype.hitFeedback = defaultHitFeedback;

export function initializeJarvan(rowIndex = 0) {
    position.currentRow = rowIndex;
    position.currentTile = 0;
    jarvan.position.x = 0;
    jarvan.position.y = position.currentRow * tilesize;
    jarvan.position.z = 0;
}

function jarvanHitFeedback() {
    // 1. 变红
    this.body.material.color.set('#BB3015');
    this.head.material.color.set('#F96D4F');
    this.shoulderLeft.material.color.set('#F07029');
    this.shoulderRight.material.color.set('#F07029');
    this.hairBand.material.color.set('#F8750C');
    this.hair.material.color.set('#F8750C');

    // 2. 弹跳动画（可复用原有代码）
    const originalZ = this.position.z;
    let t = 0;
    const bounceHeight = 12;
    const bounceDuration = 0.25;
    const animateBounce = () => {
        t += 1/60 / bounceDuration;
        this.position.z = originalZ + Math.abs(Math.sin(Math.PI * t)) * bounceHeight;
        if (t < 1) {
            requestAnimationFrame(animateBounce);
        } else {
            this.position.z = originalZ;
        }
    };
    animateBounce();

    // 3. 恢复颜色
    setTimeout(() => {
        this.body.material.color.set('#77612A');
        this.head.material.color.set('#F3DB9E');
        this.shoulderLeft.material.color.set('#E0E052');
        this.shoulderRight.material.color.set('#E0E052');
        this.hairBand.material.color.set('#F0EB18');
        this.hair.material.color.set('#EFEA11');
    }, 150);
}


