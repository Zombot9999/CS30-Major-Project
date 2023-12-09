// Major Project
// Tareen Perera
// Nov 21, 2023

class Particle {
  constructor(x, y, alpha, size) {
    this.x = x;
    this.y = y;
    this.dx = random(-0.5, 0.5);
    this.dy = random(-0.5, 0.5);
    this.initialAlpha = alpha;
    this.alpha = alpha;
    this.timer = 1500; 
    this.initialSize = size;
    this.size = size;
  }

  update() {
    this.x += this.dx;
    this.y += this.dy;
    this.timer -= 15;
    this.alpha = map(this.timer, 1500, 0, this.initialAlpha, 0);
    this.size = map(this.timer, 1500, 0, this.initialSize, 0);
  }

  display() {
    noStroke();
    fill(12, 128, 239, this.alpha);
    rect(this.x, this.y, this.size, this.size); 
  }
}

let state = "menu";
let particles = [];
let lastSpawnTime = 0;
let spawnInterval = 100;
let player;
let playerX = 50;
let playerY = 50;
let hourglass;
// let playerAvatar;
// let death;

function preload() {
  hourglass = loadImage("assets/hourglass.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  rectMode(CENTER);
  imageMode(CENTER);

  player = {
    // shape: new Sprite(),
    x: width/2,
    y: height/2,
    dx: 5,
    dy: 5,
    lives: 3,
    hit: false,
    invincible: false,
    iFrameTimer: 0,
    dashTimer: 0,
    dashCooldown: 500,
    width: 20,
    height: 20,
    stretchedMax: 24,
    stretchedMin: 18,
    nonStretchedSize: 20,
    color: color(0, 254, 255),
    moved: false,
  };

  // playerAvatar = new Sprite();
  // playerAvatar.collider = "dynamic";
  // death = new Sprite(300, 200);
  // death.collider = "static";
}

function draw() {
  if (state === "menu") {
    background(5,15,14,255);
  }
  else if (state === "level") {
    background(23, 17, 28);
    checkCollision();
    showParticles();
    playerBorders();
    displayPlayerAndLives();
    lives();
    move();
  }
}

function checkCollision() {
  if (collideRectRect(player.x - player.width/2, player.y - player.height/2, player.width, player.height, width/4 - 50, height/4 - 50, 100, 100)) {
    fill("red");
    player.hit = true;
  }
  else {
    fill(252, 31, 109);
    player.hit = false;
  }
  rect (width/4, height/4, 100, 100);
}

function showParticles() {
  if (millis() - lastSpawnTime > spawnInterval) {
    particles.push(new Particle(player.x, player.y, 255, 10));
    lastSpawnTime = millis();
  }
  // Update and display all particles
  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update();
    particles[i].display();
  
    if (particles[i].timer <= 0) {
      particles.splice(i, 1);
    }
  }
}

function playerBorders() {
  // Right border
  if (player.x + player.nonStretchedSize/2 > width) { 
    player.x = width - player.nonStretchedSize/2;
  }
  // Left border
  if (player.x - player.nonStretchedSize/2 < 0) { 
    player.x = player.nonStretchedSize/2;
  }
  // Top border
  if (player.y - player.nonStretchedSize/2 < 0) { 
    player.y = player.nonStretchedSize/2;
  }
  // Bottom border
  if (player.y + player.nonStretchedSize/2 > height) { 
    player.y = height - player.nonStretchedSize/2;
  }
}

function displayPlayerAndLives() {
  noStroke();
  fill(player.color);
  rect(player.x, player.y, player.width, player.height);
  // playerAvatar.width = player.width;
  // playerAvatar.height = player.height;
  // playerAvatar.x = player.x;
  // playerAvatar.y = player.y;
  // playerAvatar.color = player.color;
  // playerAvatar.stroke = player.color;

  if (player.lives <= 1) {
    fill("red");
  }
  else if (player.x - player.nonStretchedSize <= 50 && player.y - player.nonStretchedSize <= 40) {
    fill(255, 254, 255);
  }
  textAlign(LEFT);
  stroke(5);
  textFont("Courier New", 30);
  text("❤︎", 10, 30);
  textStyle(BOLD);
  text(player.lives, 45, 28);
}

function lives() {
  if (player.hit && player.invincible === false) {
    player.lives -= 1;
    player.invincible = true;
    player.iFrameTimer = millis() + 3000;
  }
  if (player.invincible) {
    image(hourglass, player.x, player.y - player.nonStretchedSize - 5, player.stretchedMin, player.stretchedMin);
  }
  if (millis() > player.iFrameTimer) {
    player.invincible = false;
  }
}

function keyTyped() {
  // Space Bar - Dash
  if (state === "level" && key === " " && millis() > player.dashTimer) {
    // Give the player invincibility 
    if (player.invincible === false) {
      player.iFrameTimer = millis() + 200;
      player.invincible = true;
    }

    for (let i = 0; i <= 15; i++) {
      setTimeout(() => {
        player.dx += 8;
        player.dy += 8;
        let newParticle = new Particle(player.x, player.y, 255, 10);      
        particles.push(newParticle);
      }, 10 * i);
    }

    player.dashTimer = millis() + player.dashCooldown;
  }
}

function move() {
  let isMoving = false;

  // A Key - Move left
  if (keyIsDown(65) && player.x - player.nonStretchedSize/2 > 0) { 
    player.x -= player.dx;
    isMoving = true;
    player.moved = true;

    // Don't stretch if the player is going sideways
    if (keyIsDown(87) || keyIsDown(83)) {
      player.width = player.nonStretchedSize;
      player.height = player.nonStretchedSize;
    }
    else {
      player.width = player.stretchedMax;
      player.height = player.stretchedMin;
    }
  }

  // D Key - Move right
  if (keyIsDown(68) && player.x + player.nonStretchedSize/2 < width) {
    player.x += player.dx;
    isMoving = true;
    player.moved = true;

    if (keyIsDown(87) || keyIsDown(83)) {
      player.width = player.nonStretchedSize;
      player.height = player.nonStretchedSize;
    }
    else {
      player.width = player.stretchedMax;
      player.height = player.stretchedMin;
    }
  }

  // W Key - Move up
  if (keyIsDown(87) && player.y - player.nonStretchedSize/2 > 0) {
    player.y -= player.dy;
    isMoving = true;
    player.moved = true;

    if (keyIsDown(68) || keyIsDown(65)) {
      player.width = player.nonStretchedSize;
      player.height = player.nonStretchedSize;
    }
    else {
      player.width = player.stretchedMin;
      player.height = player.stretchedMax;
    }
  }

  // S Key - Move down
  if (keyIsDown(83) && player.y + player.nonStretchedSize/2 < height) {
    player.y += player.dy;
    isMoving = true;
    player.moved = true;

    if (keyIsDown(68) || keyIsDown(65)) {
      player.width = player.nonStretchedSize;
      player.height = player.nonStretchedSize;
    }
    else {
      player.width = player.stretchedMin;
      player.height = player.stretchedMax;
    }
  }

  if (!isMoving && player.moved) {
    player.width = player.stretchedMax;
    player.height = player.stretchedMax;
    setTimeout(() => {
      player.width = player.nonStretchedSize;
      player.height = player.nonStretchedSize;
    }, 50);
    player.moved = false;
  }

  player.dx = 5;
  player.dy = 5;
}