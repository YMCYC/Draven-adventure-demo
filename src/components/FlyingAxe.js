import * as THREE from 'three';

export function FlyingAxe(initialPosition = { x: 0, y: 0, z: 20 }) {
    const axe = new THREE.Group();
    
    // The axe model is a sub-group, added to the main group
    const axeModel = new THREE.Group();
    
    // Handle: vertical stick, centered at (0,0,0)
    const axeHandle = new THREE.Mesh(
        new THREE.BoxGeometry(3, 2, 10), // z is 20
        new THREE.MeshLambertMaterial({ color: "#4C2617", flatShading: true })
    );
    axeHandle.position.set(0, 0, 0);
    
    // Top blade
    const axeHead = new THREE.Mesh(
        new THREE.BoxGeometry(6, 2, 6),
        new THREE.MeshLambertMaterial({ color: "#1C2427", flatShading: true })
    );
    // Blade at z = +10
    axeHead.position.set(1, 0, 6.5); // 10 is the blade, 1.5 is a small offset
    
    // Bottom blade
    const axeBlade = new THREE.Mesh(
        new THREE.BoxGeometry(3, 2, 8),
        new THREE.MeshLambertMaterial({ color: "#EFF0F1", flatShading: true })
    );
    // Blade at z = -10
    axeBlade.position.set(5, 0, 6.5); // -10 is the blade, -1.5 is a small offset
    
    // Add all parts to the axe model
    axeModel.add(axeHandle);
    axeModel.add(axeHead);
    axeModel.add(axeBlade);
    
    // Rotate the model so the handle is along the x-axis
    axeModel.rotation.z = Math.PI / 2;
    
    // Add the model to the main group
    axe.add(axeModel);
    
    // Only move axe.position.z to move the whole axe
    axe.position.set(initialPosition.x, initialPosition.y, initialPosition.z);
    
    // Enable shadow for all meshes
    axe.traverse((child) => {
        if (child instanceof THREE.Mesh) {
            child.castShadow = true;
            child.receiveShadow = true;
        }
    });
    
    return axe;
} 