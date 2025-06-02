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

export function initializeMap(templateName = "map1") {
    // Select map template
    const template = fieldTemplates[templateName];
    metadata = generateMetadataFromTemplate(template);

    // Clear old map
    map.clear && map.clear(); 
    while (map.children.length) map.remove(map.children[0]);

    addRows();

    // 不再处理 enemyObj，敌人由 WebSocket 事件和 EnemyManager 负责
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

