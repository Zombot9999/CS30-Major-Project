// Major Project
// Tareen Perera
// Nov 21, 2023

class Squares {
  constructor(x, y, width, height, dx, dy, warningFrames, displayFrames, rectModeVariable, timeout, dyIncrease, dxIncrease) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.dx = dx;
    this.dy = dy;
    this.dyIncrease = dyIncrease;
    this.dxIncrease = dxIncrease;
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
          this.dx = 0;
          this.dy = 0;
          this.width -= this.width/4;
          this.height -= this.height/4;
          this.x += this.width/8;
          this.y += this.height/8;
          fill("white");
        }
        else {
          fill(252, 31, 109);
        }
      }
      else if (this.dyIncrease === 0 && this.dxIncrease === 0) {
        fill(252, 31, 109, this.alpha);
      }
      else {
        fill(252, 31, 109);
      }
      // if (player.hit === true) {
      //   fill("red");
      // }
      rect(this.x, this.y, this.width, this.height);
    }
  }

  update() {
    if (millis() > this.timeoutStart + this.timeout) {
      if (this.warningStart + this.warningTime > millis() && (this.dyIncrease === 0 || this.dxIncrease === 0)) {
        this.alpha += 1;
      }
      else if (this.warningStart + this.warningTime < millis() && (this.dyIncrease !== 0 || this.dxIncrease !== 0)) {
        this.dy = this.dyIncrease;
        this.dx = this.dxIncrease;
        this.x += this.dx;
        this.y += this.dy;
      }
      if (this.warningStart + this.warningTime < millis() || this.dyIncrease !== 0 || this.dxIncrease !== 0) {
        this.x += this.dx;
        this.y += this.dy;
      }
    }
  }
}

class Circles {
  constructor(x, y, radius, radiusIncrease, dx, dy, velocityX, velocityY, warningFrames, displayFrames, rectModeVariable, timeout, velocityApply) {
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
    this.velocityApply = velocityApply;
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
          if (this.radiusIncrease > 0) {
            this.radius -= this.radiusIncrease * 20;
          }
          else {
            fill("white");
          }
        }
        else {
          fill(252, 31, 109);
        }
      }
      else {
        fill(252, 31, 109, this.alpha);
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
        if ((this.vx < 0 || this.vy < 0) && this.velocityApply === "add") {
          this.dx -= abs(this.vx);
          this.dy -= abs(this.vy);
        }
        if ((this.vx > 0 || this.vy > 0) && this.velocityApply === "add") {
          this.dx += abs(this.vx);
          this.dy += abs(this.vy);
        }
        if (this.velocityApply === "multiply") {
          this.dx *= abs(this.vx);
          this.dy *= abs(this.vy);
        }
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
let playerHit;
let playerDead;
let isScreenWhite = false;

// Load all assets
function preload() {
  hourglass = loadImage("assets/hourglass.png");
  
  aDramaticIronyMusic = loadSound("assets/a dramatic irony.mp3");
  aDramaticIronyMusic.setVolume(0.2);

  playerHit = loadSound("assets/player hit.mp3");

  playerDead = loadSound("assets/player dead.mp3");
  
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
    lives: 98,
    hit: false,
    invincible: false,
    iFrameTimer: 0,
    dashTimer: 0,
    dashCooldown: 300,
    width: 20,
    height: 20,
    stretchedMax: 24,
    stretchedMin: 18,
    nonStretchedSize: 20,
    color: color(0, 254, 255),
    moved: false,
    movement: true,
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
    whiteScreen();
  }
}

function aDramaticIrony() {
  if (playADramaticIrony === true) {
    let square;
    let circle;

    setTimeout(() => {
      // aDramaticIronyMusic.play();
      
      // for (let i = 0; i <= 30; i++) {
      //   let size = random([75, 125]);
      //   square = new Squares(random(size, width - size), random(size, height - size), size, size, random(-0.5, 0.5), random(-0.25, 0.25), 750, 2000, CORNER, i * 700, 0, 0);
      //   squaresArray.push(square);
      // }

      // circle = new Circles(random(width), 0, 6, 0, 0, 1, 0, 0.1, 0, 2000, CORNER, 700, "add");
      // circlesArray.push(circle);

      // setTimeout(() => {
      //   for (let i = 0; i <= 30; i++) {
      //     circle = new Circles(random(width), 0, 6, 0, 0, 1, 0, 0.1, 0, 2000, CORNER, 500 * i, "add");
      //     circlesArray.push(circle);
      //   }
      //   setTimeout(() => {
      //     for (let i = 0; i <= 100; i++) {
      //       circle = new Circles(random(width), 0, 10, 0, 0, 1, 0, random(0.3, 0.8), 0, 2000, CORNER, 100 * i, "add");
      //       circlesArray.push(circle);
      //     }
      //   }, 6000);
      // }, 6000);

      // square = new Squares(0, 0, (height - 50)/6, height, 0, 0, 1000, 12000, CORNER, 22000, 0, 0); 
      // squaresArray.push(square);
      // square = new Squares(width - (height - 50)/6, 0, (height - 50)/6, height, 0, 0, 1000, 12000, CORNER, 22000, 0, 0);
      // squaresArray.push(square);
      // square = new Squares(0, 0, width, (height - 50)/6, 0, 0, 1000, 12000, CORNER, 22000, 0, 0);
      // squaresArray.push(square);
      // square = new Squares(0, height - (height - 50)/6, width, (height - 50)/6, 0, 0, 1000, 12000, CORNER, 22000, 0, 0);
      // squaresArray.push(square);
      // setTimeout(() => {
      //   screenShake(5);
      // }, 23000); 

      // square = new Squares(0, 0, (height - 50)/3, height, 0, 0, 1000, 8500, CORNER, 25500, 0, 0); 
      // squaresArray.push(square);
      // square = new Squares(width - (height - 50)/3, 0, (height - 50)/3, height, 0, 0, 1000, 8500, CORNER, 25500, 0, 0);
      // squaresArray.push(square);
      // square = new Squares(0, 0, width, (height - 50)/3, 0, 0, 1000, 8500, CORNER, 25500, 0, 0);
      // squaresArray.push(square);
      // square = new Squares(0, height - (height - 50)/3, width, (height - 50)/3, 0, 0, 1000, 8500, CORNER, 25500, 0, 0);
      // squaresArray.push(square);
      // setTimeout(() => {
      //   screenShake(5);
      // }, 26500); 

      // square = new Squares(0, 0, (height - 50)/2.5, height, 0, 0, 1000, 5000, CORNER, 28000, 0, 0); 
      // squaresArray.push(square);
      // square = new Squares(width - (height - 50)/2.5, 0, (height - 50)/2.5, height, 0, 0, 1000, 5000, CORNER, 28000, 0, 0);
      // squaresArray.push(square);
      // square = new Squares(0, 0, width, (height - 50)/2.5, 0, 0, 1000, 5000, CORNER, 28000, 0, 0);
      // squaresArray.push(square);
      // square = new Squares(0, height - (height - 50)/2.5, width, (height - 50)/2.5, 0, 0, 1000, 5000, CORNER, 28000, 0, 0);
      // squaresArray.push(square);
      // setTimeout(() => {
      //   screenShake(5);
      // }, 29000); 

      // for (let i = 0; i <= 2; i++) {
      //   circle = new Circles(width - 300, height/2, height/7, 0, -1, 0, -0.5, 0, 0, 2000, CORNER, 1000 * i + 29000, "add"); 
      //   circlesArray.push(circle);
      // }
      // for (let i = 0; i <= 2; i++) {
      //   circle = new Circles(300, height/2, height/7, 0, 1, 0, 0.5, 0, 0, 2000, CORNER, 1000 * i + 32000, "add"); 
      //   circlesArray.push(circle);
      // }

      // square = new Squares(0, -height, width, height, 0, 0.35, 0, 12000, CORNER, 35000, 0, 0); 
      // squaresArray.push(square);
      // square = new Squares(0, height, width, height, 0, -0.35, 0, 12000, CORNER, 35000, 0, 0);
      // squaresArray.push(square);
      // setTimeout(() => {
      //   screenShake(5);
      // }, 47000); 

      // for (let i = 0; i <= 8; i++) {
      //   if (i%2 === 1) {
      //     square = new Squares(0, 0, 5 * (i + 1), height, 5 + i, 0, 500, 5000, CORNER, i * 1000 + 36000, 0, 0);
      //   }
      //   else {
      //     square = new Squares(width - 5 * (i + 1), 0, 5 * (i + 1), height, -5 - i, 0, 500, 5000, CORNER, i * 1000 + 36000, 0, 0);
      //   }
      //   squaresArray.push(square);
      // }

      // for (let i = 46000; i <= 48500; i += 500) { 
      //   let position = random(100, width - 100);
      //   square = new Squares(position, -(height * 20), 200, 20 * height, 0, 0.2, 2000, 1000, CORNER, i, 75, 0);
      //   squaresArray.push(square);
      //   square = new Squares(position, 0, 200, height, 0, 0, 2000, 0, CORNER, i, 0, 0);
      //   squaresArray.push(square);
        
      //   setTimeout(() => {
      //     screenShake(5);
      //   }, i + 2000);
      // }
      // setTimeout(() => {
      //   square = new Squares(player.x - 100, -(height * 20), 200, 20 * height, 0, 0.2, 2000, 1000, CORNER, 0, 75, 0);
      //   squaresArray.push(square);
      //   square = new Squares(player.x - 100, 0, 200, height, 0, 0, 2000, 0, CORNER, 0, 0, 0);
      //   squaresArray.push(square);
      // }, 49000);
      
      // setTimeout(() => {
      //   screenShake(5);
      // }, 51000);

      // for (let elements of [[-50, 100, 51000], [-85, 30, 51125], [55, 30, 51250], [-110, 20, 51375], [90, 20, 51500], [-135, 20, 51425], [115, 20, 51550]]) {
      //   square = new Squares(0, height/2 + elements[0], width, elements[1], 0, 0, 500, 1000, CORNER, elements[2], 0, 0);
      //   squaresArray.push(square);
      // }

      // for (let i = 52300; i < 55300; i += 500) { //52300; i < 55800
      //   let position = random(75, height- 75);
      //   square = new Squares(-(width * 20), position, width * 20, 150, 0.4, 0, 2000, 1000, CORNER, i, 0, 100);
      //   squaresArray.push(square);
      //   square = new Squares(0, position, width, 150, 0, 0, 2000, 0, CORNER, i, 0, 0);
      //   squaresArray.push(square);
        
      //   setTimeout(() => {
      //     screenShake(5);
      //   }, i + 2000);
      // }

      // setTimeout(() => {
      //   square = new Squares(-(width * 20), player.y - 75, width * 20, 150, 0.4, 0, 2000, 1000, CORNER, 0, 0, 100);
      //   squaresArray.push(square);
      //   square = new Squares(0, player.y - 75, width, 150, 0, 0, 2000, 0, CORNER, 0, 0, 0);
      //   squaresArray.push(square);
      // }, 55300);
      
      // setTimeout(() => {
      //   screenShake(5);
      // }, 57300);

      // for (let j = 0; j < 10; j++) {
      //   circle = new Circles(width, height/2, 5, 0.5, -1, 0, 0, 0, 500, 1000, CORNER, 2000 * j, "add");
      //   circlesArray.push(circle);
      //   angleMode(DEGREES);
      //   let circleAmount = floor(random(10, 25));
      //   for (let i = 0; i <= 360; i += 360/circleAmount) {
      //     circle = new Circles(width + cos(i) - 60, height/2 + sin(i), 10, 0, cos(i), sin(i), 1.005 + j/200, 1.005 + j/200, 0, 20000, CORNER, 1500 + 2000 * j, "multiply");
      //     circlesArray.push(circle);
      //   }
      // }
      // for (let j = 0; j < 10; j++) {
      //   circle = new Circles(0, height/2, 5, 0.5, 1, 0, 0, 0, 500, 1000, CORNER, 2000 * j, "add");
      //   circlesArray.push(circle);
      //   angleMode(DEGREES);
      //   let circleAmount = floor(random(10, 25));
      //   for (let i = 0; i < 360; i += 360/circleAmount) {
      //     circle = new Circles(cos(i) + 60, height/2 + sin(i), 10, 0, cos(i), sin(i), 1.005 + j/200, 1.005 + j/200, 0, 20000, CORNER, 1500 + 2000 * j, "multiply");
      //     circlesArray.push(circle);
      //   }
      // }
      // for (let j = 0; j < 10; j++) {
      //   circle = new Circles(width/2, height/2, 5, 0.5, 0, 0, 0, 0, 500, 1000, CORNER, 2000 * j, "add");
      //   circlesArray.push(circle);
      //   angleMode(DEGREES);
      //   let circleAmount = floor(random(10, 25));
      //   for (let i = 0; i < 360; i += 360/circleAmount) {
      //     circle = new Circles(width/2 + cos(i), height/2 + sin(i), 10, 0, cos(i), sin(i), 1.005 + j/200, 1.005 + j/200, 0, 20000, CORNER, 1500 + 2000 * j, "multiply");
      //     circlesArray.push(circle);
      //   }
      // }

      circle = new Circles(width/2, height/2, 5, 1, 0, 0, 0, 0, 500, 5000, CORNER, 0, "add");
      circlesArray.push(circle);
      for (let i = 0; i < 720; i += 360/30) {
        circle = new Circles(width/2 + cos(i), height/2 + sin(i), 5, 0.1, cos(i), sin(i), 1.005, 1.005, 0, 20000, CORNER, i/30*100, "multiply");
        circlesArray.push(circle);
      }
      angleMode(DEGREES);
      for (let j = 0; j < 20; j++) {
        let circleAmount = floor(random(5, 40));
        for (let i = 0; i < 360; i += 360/circleAmount) {
          circle = new Circles(width/2 + cos(i), height/2 + sin(i), 10, 0, cos(i), sin(i), 1.005+j/800, 1.005+j/800, 0, 20000, CORNER, 5500, "multiply");
          circlesArray.push(circle);
        }
      }

    // Delay everything
    }, 1000);
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

function whiteScreen() {
  if (isScreenWhite) {
    rectMode(CORNER);
    fill("white");
    rect(0, 0, width, height);
  }
}

function screenShake(loopNo) {
  isScreenWhite = true;
  setTimeout(() => {
    isScreenWhite = false;
  }, 50);

  // Squares array
  for (let i = squaresArray.length - 1; i >= 0; i--) {
    for (let j = 0; j < loopNo; j++) {
      setTimeout(() => {
        squaresArray[i].y += 3;
      }, 20 * j);
    }
    setTimeout(() => {
      for (let k = 0; k < loopNo; k++) {
        setTimeout(() => {
          squaresArray[i].y -= 3;
        }, 20 * k);
      }
    }, loopNo * 20/2);
  }

  // Circles array
  for (let i = circlesArray.length - 1; i >= 0; i--) {
    for (let j = 0; j < loopNo; j++) {
      setTimeout(() => {
        circlesArray[i].y += 3;
      }, 20 * j);
    }
    setTimeout(() => {
      for (let k = 0; k < loopNo; k++) {
        setTimeout(() => {
          circlesArray[i].y -= 3;
        }, 20 * k);
      }
    }, loopNo * 20/2);
  }

  // Player
  for (let j = 0; j < loopNo; j++) {
    setTimeout(() => {
      player.y += 1;
    }, 20 * j);
  }
  setTimeout(() => {
    for (let k = 0; k < loopNo; k++) {
      setTimeout(() => {
        player.y -= 1;
      }, 20 * k);
    }
  }, loopNo * 20/2);
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
        player.lives = 5;
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

  if (player.lives !== 99) {
    textAlign(LEFT);
    stroke(5);
    textFont("Courier New", 30);
    text("❤︎", 10, 30);
    textStyle(BOLD);
    text(player.lives, 45, 28);
  }
}

function lives() {
  // Decrease lives and grant i frames
  if (player.hit && player.invincible === false) {
    let wHeld = false;
    let sHeld = false;
    let dHeld = false;
    let aHeld = false;
    if (keyIsDown(87)) {
      wHeld = true;
    }
    if (keyIsDown(68)) {
      dHeld = true;
    }
    if (keyIsDown(83)) {
      sHeld = true;
    }
    if (keyIsDown(65)) {
      aHeld = true;
    }
    player.lives -= 1;
    playerHit.play();
    player.invincible = true;
    player.iFrameTimer = millis() + 3000;
    player.dx *= -1;
    player.dy *= -1;
    for (let i = 0; i <= 50; i++) {
      setTimeout(() => {
        player.movement = false;
        if (dHeld) {
          player.x -= player.dx;
        }
        if (aHeld) {
          player.x += player.dx;
        }
        if (sHeld) {
          player.y -= player.dy;
        }
        if (wHeld) {
          player.y += player.dx;
        }
        player.movement = true;
      }, 5 * i);
    }
  }
  if (player.invincible) {
    image(hourglass, player.x, player.y - player.nonStretchedSize - 5, player.stretchedMin, player.stretchedMin);
  }
  if (millis() > player.iFrameTimer) {
    player.invincible = false;
  }
  if (player.lives <= 0) {
    playerDead.play();
    aDramaticIronyMusic.stop();

    setTimeout(() => {
      state = "menu";
      menuBackground.velocityIncrease = 0.1;
      menuMusic.play();
      menuTransition.levelTransition = false;
      playADramaticIrony = true;
      squaresArray = [];
      circlesArray = [];
      menuBackground.velocityIncrease = 0.05;
      menuBackground.circleCount = 20;
      player.x = width/2;
      player.y = height/2;
    }, menuTransition.transitionTime + 1000);

    setTimeout(() => {
      menuTransition.levelTransition = true;
      menuMusic.stop();
      menuTransition.transitionSound.play();
    }, 1000);

    player.lives = 99;
  }
}

function keyPressed() {
  // Space Bar - Dash
  if (state === "level" && key === " " && millis() > player.dashTimer && player.movement) {
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

  if (player.movement) {
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
}