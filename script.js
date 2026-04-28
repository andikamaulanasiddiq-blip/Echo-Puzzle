const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

let player = { x: 50, y: 50, size: 20 };
let keys = {};
let history = [];
let echoes = [];
let frame = 0;

let button = { x: 400, y: 400, size: 20, pressed: false };

window.addEventListener("keydown", e => keys[e.key] = true);
window.addEventListener("keyup", e => keys[e.key] = false);

function update() {
  let dx = 0, dy = 0;
  if (keys['w']) dy = -2;
  if (keys['s']) dy = 2;
  if (keys['a']) dx = -2;
  if (keys['d']) dx = 2;

  player.x += dx;
  player.y += dy;

  history.push({ x: player.x, y: player.y });

  if (frame % 300 === 0 && history.length > 300) {
    echoes.push({ path: history.slice(0, 300), step: 0 });
    history = history.slice(300);
  }

  echoes.forEach(e => {
    if (e.step < e.path.length) {
      e.x = e.path[e.step].x;
      e.y = e.path[e.step].y;
      e.step++;
    }
  });

  button.pressed = false;

  if (collide(player, button)) button.pressed = true;
  echoes.forEach(e => {
    if (collide(e, button)) button.pressed = true;
  });

  frame++;
}

function collide(a, b) {
  return a.x < b.x + b.size &&
         a.x + player.size > b.x &&
         a.y < b.y + b.size &&
         a.y + player.size > b.y;
}

function draw() {
  ctx.clearRect(0, 0, 500, 500);

  ctx.fillStyle = "cyan";
  ctx.fillRect(player.x, player.y, player.size, player.size);

  ctx.fillStyle = "rgba(255,255,0,0.5)";
  echoes.forEach(e => {
    if (e.x) ctx.fillRect(e.x, e.y, player.size, player.size);
  });

  ctx.fillStyle = button.pressed ? "lime" : "red";
  ctx.fillRect(button.x, button.y, button.size, button.size);

  ctx.fillStyle = "white";
  ctx.fillText("Button must be held (you + echo)", 140, 20);
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

loop();
