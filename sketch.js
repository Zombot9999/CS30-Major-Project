// Major Project
// Tareen Perera
// Nov 21, 2023

class Squares {
  constructor(x, y, width, height, dx, dy, warningFrames, displayFrames, rectModeVariable, timeout) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.dx = dx;
    this.dy = dy;
    this.warningStart = millis() + timeout;
    this.warningTime = warningFrames;
    this.displayStart = millis() + this.warningTime + timeout;
    this.displayTime = displayFrames;
    this.rectModeVariable = rectModeVariable;
    this.alpha = 0;
    this.spawnColor = true;
    this.timeoutStart = millis();
    this.timeout = timeout;
  }

  display() {
    if (millis() > this.timeoutStart + this.timeout) {
      rectMode(this.rectModeVariable);
      noStroke();
      if (this.warningStart + this.warningTime < millis()) {
        if (this.spawnColor) {
          setTimeout(() => {
            this.spawnColor = false;
          }, 200);
          fill("white");
        }
        else if (this.spawnColor === false && millis() + 100 > this.displayStart + this.displayTime) {
          fill("white");
        }
        else {
          fill(252, 31, 109);
        }
      }
      else {
        fill(252, 31, 109, this.alpha);
      }
      // if (player.hit === true) {
      //   fill("red");
      // }
      rect(this.x, this.y, this.width, this.height);
    }
  }

  update() {
    if (millis() > this.timeoutStart + this.timeout) {
      if (this.warningStart + this.warningTime > millis()) {
        this.alpha += 1;
      }
      else if (this.warningStart + this.warningTime < millis()) {
        this.x += this.dx;
        this.y += this.dy;
      }
    }
  }
}

class Circles {
  constructor(x, y, radius, radiusIncrease, dx, dy, velocityX, velocityY, warningFrames, displayFrames, rectModeVariable, timeout) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.radiusIncrease = radiusIncrease;
    this.dx = dx;
    this.dy = dy;
    this.vx = velocityX;
    this.vy = velocityY;
    this.warningStart = millis() + timeout;
    this.warningTime = warningFrames;
    this.displayStart = millis() + this.warningTime + timeout;
    this.displayTime = displayFrames;
    this.rectModeVariable = rectModeVariable;
    this.alpha = 0;
    this.spawnColor = true;
    this.timeoutStart = millis();
    this.timeout = timeout;
  }

  display() {
    if (millis() > this.timeoutStart + this.timeout) {
      rectMode(this.rectModeVariable);
      noStroke();
      if (this.warningStart + this.warningTime < millis()) {
        if (this.spawnColor) {
          setTimeout(() => {
            this.spawnColor = false;
          }, 200);
          fill("white");
        }
        else if (this.spawnColor === false && millis() + 100 > this.displayStart + this.displayTime) {
          fill("white");
        }
        else {
          fill(252, 31, 109);
        }
      }
      else {
        fill(252, 31, 109, this.alpha);
      }
      if (player.hit === true) {
        fill("red");
      }
      circle(this.x, this.y, this.radius * 2);
    }
  }

  update() {
    if (millis() > this.timeoutStart + this.timeout) {
      if (this.warningStart + this.warningTime > millis()) {
        this.alpha += 1;
      }
      else if (this.warningStart + this.warningTime < millis()) {
        this.x += this.dx;
        this.y += this.dy;
        this.dx += this.vx;
        this.dy += this.vy;
        this.radius += this.radiusIncrease;
        if (this.radiusIncrease > 0) {
          this.spawnColor = true;
        }
      }
    }
  }
}

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
  
  // Move the particle and make it disappear
  update() {
    this.x += this.dx;
    this.y += this.dy;
    this.timer -= 15;
    this.alpha = map(this.timer, 1500, 0, this.initialAlpha, 0);
    this.size = map(this.timer, 1500, 0, this.initialSize, 0);
  }
  
  // Display the particle
  display() {
    noStroke();
    fill(12, 128, 239, this.alpha);
    rect(this.x, this.y, this.size, this.size); 
  }
}

// Variables
let state = "level";
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
let startupAlpha = 255;
let menuBackground;
let menuTransition;
let playADramaticIrony = true;
let squaresArray = [];
let circlesArray = [];
let aDramaticIronyMusic;

// Load all assets
function preload() {
  hourglass = loadImage("assets/hourglass.png");
  
  aDramaticIronyMusic = loadSound("assets/a dramatic irony.mp3");
  aDramaticIronyMusic.setVolume(0.2);
  
  gameLogo = {
    visual: loadImage("assets/logo.png"),
    width: 500,
    height: 300,
    shakeMultiplier: 1,
    yValue: 0,
    remadeTextSize: 60,
    animationFinished: false,
    animationY: 0,
  };

  menuTransition = {
    transitionSound: loadSound("assets/menu transition.mp3"),
    levelTransition: false,
    rectHeight: 0,
    transitionTime: 1000,
  };

  menuTransition.transitionSound.setVolume(0.2);

  menuMusic = loadSound("assets/menu music.mp3");
  menuMusic.setVolume(0.1);
}

// Setup the variables and modes
function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  rectMode(CENTER);
  imageMode(CENTER);
  
  menuBackground = {
    radius: 50,
    distance: 1,
    circleVelocity: 0.2,
    velocityIncrease: 0.05,
    circleCount: 20,
    angle: 0,
  };

  playButton = new Clickable();
  
  playButtonVariables = {
    width: 250,
    height: 100,
    x: width/2 - 125,
    y: height,
    textSize: 55,
    animationFinished: false,
  };
  
  player = {
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
  // If the game state is startup, display the startup menu
  if (state === "startup") {
    background(5, 15, 14);
    startupMenu();
  }

  // If it's menu, display the logo and the play button
  else if (state === "menu") {
    background(5, 15, 14);
    displayBackground();
    showLogo();
    showPlayButton();
    displayLogoAndMusic();
    displayPlayButton();
    transition();
  }

  // Launch the level once the player clicks play
  else if (state === "level") {
    background(23, 17, 28);
    checkCollision();
    showSquares();
    showCircles();
    showParticles();
    playerBorders();
    lives();
    aDramaticIrony();
    rectMode(CENTER);
    displayPlayerAndLives();
    transition();
    move();
    rectMode(CORNER);
  }
}

function aDramaticIrony() {
  if (playADramaticIrony === true) {
    let square;
    let circle;

    aDramaticIronyMusic.play();
    // circle = new Circles(width/2, height/2, 30, 0, 0, 0, 0, 0, 3000, 100000, CORNER, 2000);
    // circlesArray.push(circle);
    for (let i = 0; i <= 1000; i++) {
      circle = new Circles(random(width), 0, 1, 0.1, 0, 1, 0, 0.1, 0, 10000, CORNER, 100 * i + 1000);
      circlesArray.push(circle);
    }

    // square = new Squares(width/4, height/4, 100, 100, 0, 0, 3000, 3000, CORNER, 1000);
    // squaresArray.push(square);

    // square = new Squares(width, 0, 50, height, -5, 0, 1500, 6000, CORNER, 0);
    // squaresArray.push(square);

    // square = new Squares(0, 0, 20, height, 20, 0, 1000, 6000, CORNER, 5000);
    // squaresArray.push(square);
    // square = new Squares(0, 0, width, 20, 0, 10, 3000, 6000, CORNER, 7500);
    // squaresArray.push(square);
    // square = new Squares(0, height - 20, width, 20, 0, -10, 3000, 6000, CORNER, 10000);
    // squaresArray.push(square);
    // square = new Squares(width - 20, 0, 20, height, -20, 0, 3000, 6000, CORNER, 12500);
    // squaresArray.push(square);

    // for (let i = 0; i < 5; i++) {
    //   square = new Squares(0, random(0, height), width, random(25, 50), 0, 0, 2500, 2000, CORNER, 1000 * i);
    //   squaresArray.push(square);
    // }
    // for (let i = 0; i < 5; i++) {
    //   setTimeout(() => {
    //     screenShake(5);
    //   }, 1500 * i);
    // }
    playADramaticIrony = false;
  }
}

function showSquares() {
  for (let i = squaresArray.length - 1; i >= 0; i--) {
    squaresArray[i].display();
    squaresArray[i].update();
    if (millis() > squaresArray[i].displayStart + squaresArray[i].displayTime) {
      squaresArray.splice(i, 1);
    }
  }
}

function showCircles() {
  for (let i = circlesArray.length - 1; i >= 0; i--) {
    circlesArray[i].display();
    circlesArray[i].update();
    if (millis() > circlesArray[i].displayStart + circlesArray[i].displayTime) {
      circlesArray.splice(i, 1);
    }
  }
}

function screenShake(loopNo) {
  for (let i = squaresArray.length - 1; i >= 0; i--) {
    for (let j = 0; j < loopNo; j++) {
      setTimeout(() => {
        squaresArray[i].y += 1;
        player.y += 0.5;
      }, 20 * j);
    }
    setTimeout(() => {
      for (let k = 0; k < loopNo; k++) {
        setTimeout(() => {
          squaresArray[i].y -= 1;
          player.y -= 0.5;
        }, 20 * k);
      }
    }, loopNo * 20/2);
  }
}

function checkCollision() {
  rectMode(CORNER);
  let hits = 0;
  for (let i = 0; i < squaresArray.length; i++) {
    if (collideRectRect(player.x - player.width/2, player.y - player.height/2, player.width, player.height, squaresArray[i].x, squaresArray[i].y, squaresArray[i].width, squaresArray[i].height) && squaresArray[i].warningStart + squaresArray[i].warningTime < millis()) {
      hits += 1;
    }
  }
  for (let i = 0; i < circlesArray.length; i++) {
    if (collideRectCircle(player.x - player.width/2, player.y - player.height/2, player.width, player.height, circlesArray[i].x, circlesArray[i].y, circlesArray[i].radius * 2) && circlesArray[i].warningStart + circlesArray[i].warningTime < millis()) {
      hits += 1;
    }
  }
  if (hits > 0) {
    player.hit = true;
  }
  else {
    player.hit = false;
  }
  rectMode(CENTER);
}

function transition() {
  rectMode(CENTER);
  fill(27, 17, 28);
  noStroke();
  rect(width/2, height/2, width, menuTransition.rectHeight);
  if (menuTransition.levelTransition === true) {
    for (let i = 0; i <= 200; i++) {
      setTimeout(() => {
        menuTransition.rectHeight = map(i, 0, 200, 0, height);
      }, 5 * i);
    }
    for (let i = 200; i >= 0; i--) {
      setTimeout(() => {
        menuTransition.rectHeight = map(i, 0, 200, 0, height);
      }, 5 * (200 - i) + 1000);
    }
    menuTransition.levelTransition = "waiting...";
  }
}

// Circle animation for main menu
function displayBackground() {
  noStroke();
  push();
  angleMode(RADIANS);
  setCenter(width/2, height/2);
  rotate(menuBackground.angle);
  fill(252, 31, 109, 100);
  polarEllipses(menuBackground.circleCount, 50, 50, menuBackground.distance);
  polarEllipses(1, menuBackground.radius, menuBackground.radius, 0);
  if (menuBackground.distance < width/2 + menuBackground.radius * 5) {
    menuBackground.distance += menuBackground.circleVelocity;
    menuBackground.circleVelocity += menuBackground.velocityIncrease;
  }
  else {
    menuBackground.circleVelocity = menuBackground.velocityIncrease;
    menuBackground.distance = 1;
    for (let i = 0; i < 20; i++) {
      setTimeout(() => {
        menuBackground.radius += 0.5;
      }, 10 * i);
    }    
    setTimeout(() => {
      for (let i = 0; i < 20; i++) {
        setTimeout(() => {
          menuBackground.radius -= 0.5;
        }, 10 * i);
      } 
    }, 100);
  }
  setCenter(-width/2, -height/2);
  menuBackground.angle += 1;
  pop();
}

// I had to make this bc the music wouldn't play without player interaction :(
function startupMenu() {
  textAlign(CENTER);
  fill(252, 31, 109, startupAlpha);
  textFont("courier new", gameLogo.remadeTextSize); 
  text("Click Anywhere To Start", width/2, height/2);
  if (mouseIsPressed) {
    // Delay the menu so the game has enough time to play the animation
    setTimeout(() => {
      state = "menu";
    }, 1000);

    setTimeout(() => {
      menuBackground.velocityIncrease = 0.25;
      menuBackground.circleCount = 30;
    }, 18000);

    // Disappearing animation for the text
    for (let i = 100; i > 0; i--) {
      setTimeout(() => {
        startupAlpha = map(i, 0, 100, 0, 255);
      }, 10 * (100 - i));
    }
  }
}

// Animation for the play button to fly from the bottom
function showPlayButton() {
  let iterations = height/5;
  if (playButtonVariables.animationFinished === false) {
    for (let i = 0; i < iterations; i++) {
      setTimeout(() => {
        playButtonVariables.y -= 2;
      }, 5 * i);
    }
    setTimeout(() => {
      playButtonVariables.animationFinished = true;
    }, iterations * 5);
    playButtonVariables.animationFinished = "waiting...";
  }
}

// Display the play button and do it's hover animations
function displayPlayButton() {
  rectMode(CORNER);
  playButton.textSize = playButtonVariables.textSize;
  playButton.locate(playButtonVariables.x, playButtonVariables.y);
  playButton.resize(playButtonVariables.width, playButtonVariables.height);
  playButton.draw();

  if (playButtonVariables.animationFinished === true) {
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
  
    // If clicked change the state to level
    if (menuTransition.levelTransition === false) {
      playButton.onPress = function(){
        setTimeout(() => {
          state = "level";
          menuBackground.velocityIncrease = 0.1;
        }, menuTransition.transitionTime);
        menuTransition.levelTransition = true;
        menuMusic.stop();
        menuTransition.transitionSound.play();
      };
    }
  }
}

// Animate the logo to fly from the top
function showLogo() {
  let iterations = (height/5 + gameLogo.yValue)/1.5;
  if (gameLogo.animationFinished === false) {
    for (let i = 0; i < iterations; i++) {
      setTimeout(() => {
        gameLogo.animationY += 1.5;
      }, 5 * i);
    }
    setTimeout(() => {
      gameLogo.animationFinished = true;
    }, iterations * 5);
    gameLogo.animationFinished = "waiting...";
  }
}

function displayLogoAndMusic() {
  // Play the menu music in a loop
  if (menuMusic.isPlaying() === false && menuTransition.levelTransition === false) {
    menuMusic.play();
  }
  
  if (gameLogo.animationFinished === true) {
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
    image(gameLogo.visual, width/2, height/5 + gameLogo.yValue, gameLogo.width, gameLogo.height);
    textAlign(CENTER);
    fill(0, 254, 255);
    textFont("Georgia", gameLogo.remadeTextSize); 
    text("RE-MADE", width/2, height/5 + gameLogo.yValue + gameLogo.height/2.5);
  }
  else {
    textAlign(CENTER);
    fill(0, 254, 255, 255);
    textFont("Georgia", gameLogo.remadeTextSize); 
    text("RE-MADE", width/2, gameLogo.animationY + gameLogo.height/2.5);
    image(gameLogo.visual, width/2, gameLogo.animationY, gameLogo.width, gameLogo.height); 
  }
}



function showParticles() {
  rectMode(CENTER);
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
  // Display player
  noStroke();
  fill(player.color);
  rect(player.x, player.y, player.width, player.height);

  // Display lives
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
  // Decrease lives and grant i frames
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

function keyPressed() {
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