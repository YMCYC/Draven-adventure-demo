import * as THREE from "three";
import {Grass} from "./Grass";
import {Road} from "./Road";
import { jarvan } from "./Enemy";
import { PlayerField } from "./PlayerField";
import { EnemyField } from "./EnemyField";
import { BattleField } from "./BattleField";
import { fieldTemplates,enemyTemplates } from "./Templates";
import {tilesPerRow,tilesize} from "../constants";
export let metadata = []; // current map's metadata

export const map = new THREE.Group();

const fieldTypeToComponent = {
    PlayerField,
    BattleField,
    EnemyField
};

export function initializeMap(templateName = "map1", enemyObj = null) {
    // Select map template
    const template = fieldTemplates[templateName];
    metadata = generateMetadataFromTemplate(template);

    // Clear old map
    map.clear && map.clear(); 
    while (map.children.length) map.remove(map.children[0]);

    addRows();

    // Place enemy at the center of the first BattleField row
    if (enemyObj) {
        const firstBattleRow = metadata.find(row => row.fieldType === "EnemyField");
        if (firstBattleRow) {
            firstBattleRow.enemyRef = enemyObj;
            // Initialize enemy position here
            if (typeof enemyObj.initialize === "function") {
                enemyObj.initialize(firstBattleRow.rowIndex);
            } else if (typeof enemyObj === "object" && typeof enemyObj.position === "object") {
                // For legacy style
                enemyObj.position.x = 0;
                enemyObj.position.y = firstBattleRow.rowIndex * tilesize; // You can pass tilesize as needed
                console.log(enemyObj.position.y);
                enemyObj.position.z = 0;
            }
        }
    }
}

export function addRows() {
    metadata.forEach((rowData) => {
        const Comp = fieldTypeToComponent[rowData.fieldType];
        if (Comp) {
            const row = Comp(rowData.rowIndex);
            map.add(row);
        }
    });
}

export function generateMetadataFromTemplate(template) {
    const metadata = [];
    let rowIndex = 0;
    template.forEach(field => {
        for (let i = 0; i < field.length; i++) {
            metadata.push({
                rowIndex,
                fieldType: field.fieldType,
                // enemyRef: undefined // not assigned here
            });
            rowIndex++;
        }
    });
    return metadata;
}

