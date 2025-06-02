// src/socket.js

// 你可以根据实际情况调整 ws 地址
const WS_URL = 'ws://localhost:3001';

let socket = null;
const listeners = {};

// 敌人数据缓存（id -> enemyData）
export const enemyMap = {};

// 连接WebSocket
export function connectSocket() {
  socket = new WebSocket(WS_URL);

  socket.onopen = () => {
    console.log('WebSocket connected!');
    emit('open');
  };

  socket.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    handleMessage(msg);
  };

  socket.onclose = () => {
    console.log('WebSocket closed!');
    emit('close');
    // 可选：自动重连
    // setTimeout(connectSocket, 2000);
  };

  socket.onerror = (err) => {
    console.error('WebSocket error:', err);
    emit('error', err);
  };
}

// 发送消息到服务端
export function sendMessage(msg) {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(msg));
  }
}

// 处理服务端消息
function handleMessage(msg) {
  if (msg.type === 'init') {
    Object.values(msg.enemies).forEach(enemyData => {
      emit('enemy_init', enemyData);
    });
  } else if (msg.type === 'enemy_hp_update') {
    if (enemyMap[msg.enemyId]) {
      enemyMap[msg.enemyId].hp = msg.hp;
      emit('enemy_hp_update', enemyMap[msg.enemyId]);
    }
  } else if (msg.type === 'enemy_dead') {
    console.log('收到敌人死亡消息:', msg);
    console.log('enemyMap:', enemyMap);
    if (enemyMap[msg.enemyId]) {
      console.log('删除敌人:', enemyMap[msg.enemyId]);
      emit('enemy_dead', enemyMap[msg.enemyId]);
      delete enemyMap[msg.enemyId];
    }
  }
  // 你可以继续扩展更多类型
}

// 事件监听/分发
export function on(event, handler) {
  if (!listeners[event]) listeners[event] = [];
  listeners[event].push(handler);
}
function emit(event, ...args) {
  if (listeners[event]) {
    listeners[event].forEach(fn => fn(...args));
  }
}
