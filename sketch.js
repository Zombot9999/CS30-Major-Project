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
let menuMusic;
let gameLogo;
let playButton;
let playButtonVariables;
// let playerAvatar;
// let death;

function preload() {
  hourglass = loadImage("assets/hourglass.png");
  gameLogo = {
    visual: loadImage("assets/logo.png"),
    width: 500,
    height: 300,
    shakeMultiplier: 1,
    yValue: 0,
    remadeTextSize: 60,
  };
  menuMusic = loadSound("assets/menu music.mp3");
  menuMusic.setVolume(0.1);
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  rectMode(CENTER);
  imageMode(CENTER);
  
  playButton = new Clickable();
  
  playButtonVariables = {
    width: 250,
    height: 100,
    x: width/2 - 125,
    y: height/1.5 - 50,
    textSize: 55,
  };
  
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
  playButton.color = "#FC1F66";      
  playButton.cornerRadius = 10;       
  playButton.strokeWeight = 10;       
  playButton.stroke = "#e2457a";    
  playButton.text = "PLAY";      
  playButton.textColor = "white";   
  playButton.textSize = playButtonVariables.textSize;         
  playButton.textFont = "times-new-roman"; 
}

function draw() {
  if (state === "menu") {
    background(5, 15, 14);
    displayLogoAndMusic();
    displayPlayButton();
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

function displayPlayButton() {
  rectMode(CORNER);
  playButton.textSize = playButtonVariables.textSize;
  playButton.locate(playButtonVariables.x, playButtonVariables.y);
  playButton.resize(playButtonVariables.width, playButtonVariables.height);
  playButton.draw();

  playButton.onHover = function(){
    if (playButtonVariables.width === 250 && playButtonVariables.height === 100) {
      playButton.stroke = "#FC1F66";    
      playButton.color = "#e2457a";      
      for (let i = 0; i < 4; i++) {
        setTimeout(() => {
          playButtonVariables.width += 5;
          playButtonVariables.height += 5;
          playButtonVariables.x = width/2 - playButtonVariables.width/2;
          playButtonVariables.y = height/1.5 - playButtonVariables.height/2;
          playButtonVariables.textSize += 3;
        }, 10 * i);
      }
    }
  };

  playButton.onOutside = function(){
    if (playButtonVariables.width === 270 && playButtonVariables.height === 120) {
      playButton.stroke = "#e2457a";    
      playButton.color = "#FC1F66";      
      for (let i = 0; i < 4; i++) {
        setTimeout(() => {
          playButtonVariables.width -= 5;
          playButtonVariables.height -= 5;
          playButtonVariables.x = width/2 - playButtonVariables.width/2;
          playButtonVariables.y = height/1.5 - playButtonVariables.height/2;
          playButtonVariables.textSize -= 3;
        }, 10 * i);
      }
    }
  };

  playButton.onPress = function(){
    menuMusic.stop();
    state = "level";
  };
}

function displayLogoAndMusic() {
  // Play the menu music in a loop
  if (menuMusic.isPlaying() === false && mouseIsPressed) {
    menuMusic.play();
  }

  // Animation for the logo
  setTimeout(() => {
    for (let i = 0; i <= 10; i++) {
      setTimeout(() => {
        gameLogo.yValue += 1;
        gameLogo.height += 1;
        gameLogo.width += 1;
        gameLogo.remadeTextSize += 1;
      }, 10 * i);
      setTimeout(() => {
        gameLogo.yValue -= 1;
        gameLogo.height -= 1;
        gameLogo.width -= 1;
        gameLogo.remadeTextSize -= 1;
      }, 20 * i);
    }
  }, 750 * gameLogo.shakeMultiplier);
  gameLogo.shakeMultiplier++;

  // Display the logo
  textAlign(CENTER);
  fill(252, 31, 109);
  textFont("Georgia", gameLogo.remadeTextSize); 
  image(gameLogo.visual, width/2, height/5 + gameLogo.yValue, gameLogo.width, gameLogo.height);
  text("RE-MADE", width/2, height/5 + gameLogo.yValue + gameLogo.height/2.5);
}
function checkCollision() {
  rectMode(CORNER);
  if (collideRectRect(player.x - player.width/2, player.y - player.height/2, player.width, player.height, width/4, height/4, 100, 100)) {
  // if (collideRectRect(player.x - player.width/2, player.y - player.height/2, player.width, player.height, width/4 - 50, height/4 - 50, 100, 100)) {
    fill("red");
    player.hit = true;
  }
  else {
    fill(252, 31, 109);
    player.hit = false;
  }
  rect (width/4, height/4, 100, 100);
  rectMode(CENTER);
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
  console.log("running");
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
  rectMode(CENTER);
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