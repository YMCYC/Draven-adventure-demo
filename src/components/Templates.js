import { jarvan } from "./Enemy";
// 以后可以 import 更多敌人

export const enemyTemplates = {
    jarvan, 
    // more enemies to be added
};

export const fieldTemplates = {
    map1: [
        { fieldType: "PlayerField", length: 2 },
        { fieldType: "BattleField", length: 4 },
        { fieldType: "EnemyField", length: 2 }
    ],
    map2: [
        { fieldType: "PlayerField", length: 2 },
        { fieldType: "BattleField", length: 8 },
        { fieldType: "EnemyField", length: 3 }
    ],
    // more maps to be added
};