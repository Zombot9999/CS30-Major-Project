// Major Project - JSAB Remade
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

  // Display the squares
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
      rect(this.x, this.y, this.width, this.height);
    }
  }

  // Update the square's x, y and alpha
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
        if (collideRectRect(player.x - player.width/2, player.y - player.height/2, player.width, player.height, this.x, this.y, this.width, this.height)) {
          player.hit = true;
          console.log(player.hit);
        }
      }
      if (this.warningStart + this.warningTime < millis() || this.dyIncrease !== 0 || this.dxIncrease !== 0) {
        this.x += this.dx;
        this.y += this.dy;
        if (collideRectRect(player.x - player.width/2, player.y - player.height/2, player.width, player.height, this.x, this.y, this.width, this.height)) {
          player.hit = true;
        }
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

  // Display the circles
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

  // Update the circle's alpha, x, y and radius
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
let state = "startup";
let allowButtonClick = true;
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
let tutorialVariables;
let timeouts = [];
let jsabFont;
let showGrade = false;
let displayGradeVariables;
let stars = 0;
let winSound;

// Load all assets
function preload() {
  jsabFont =loadFont("assets/Nexa-Book.ttf");

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

  tutorialVariables = {
    music: loadSound("assets/Tutorial Music.mp3"),
    tutorialPlayed: true,
    text: " ",
    textXPos: 0,
    textYPos: 0,
  };

  tutorialVariables.music.setVolume(0.3);

  winSound = loadSound("assets/win.mp3");
  winSound.setVolume(0.3);
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

  // eslint-disable-next-line no-undef
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
    lives: 5,
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
    hitsTaken: 0,
    dashesDone: 0,
    rank: "none",
  };
  
  playButton.color = "#FC1F66";      
  playButton.cornerRadius = 10;       
  playButton.strokeWeight = 10;       
  playButton.stroke = "#e2457a";    
  playButton.text = "PLAY";      
  playButton.textColor = "white";   
  playButton.textSize = playButtonVariables.textSize;         
  playButton.textFont = jsabFont; 

  tutorialVariables.textXPos = width/2;
  tutorialVariables.textYPos = height/2;

  displayGradeVariables = {
    showGrade: false,
    yPos: -height,
    entryAnimation: false,
    starCountXPos: width + 100,
    starsEarned: 0,
    starsDisplay: 0,
  };

  // Get the previous amount of stars the user had
  stars = getItem("stars");
  if (stars === null) {
    stars = 0;
  }
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
    displayStars();
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
    displayGrade();
    displayPlayerAndLives();
    transition();
    move();
    rectMode(CORNER);
    whiteScreen();
  }

  // Tutorial level
  else if (state === "tutorial") {
    background(23, 17, 28);
    checkCollision();
    showSquares();
    showCircles();
    showParticles();
    playerBorders();
    lives();
    tutorial();
    rectMode(CENTER);
    displayPlayerAndLives();
    showInstructions();
    transition();
    move();
    rectMode(CORNER);
    whiteScreen();
  }
}

// Show the amoung of stars the player has on the main menu
function displayStars() {
  textAlign(RIGHT);
  fill("gold");
  textSize(50);
  text("🌟", width - 110, 55);
  textFont(jsabFont);
  text(stars, width - 30, 50);
  textSize(100);
}

// Display the player's stats after the level
function displayGrade() {
  if (displayGradeVariables.showGrade === true) {
    textAlign(CENTER);
    fill(player.color);
    textSize(50);
    text("Hits taken: " + player.hitsTaken, width/2, displayGradeVariables.yPos - 75);
    text("Dashes done: " + player.dashesDone, width/2, displayGradeVariables.yPos);
    textSize(100);

    if (player.rank === "S") {
      fill("gold");
      textFont("georgia");
      text("🌟", displayGradeVariables.starCountXPos - 75, height - 100);
      textFont(jsabFont);
      text("+" + displayGradeVariables.starsDisplay, displayGradeVariables.starCountXPos + 75, height - 100);
    }
    else if (player.rank === "A+") {
      fill("gold");
      textFont("georgia");
      text("🌟", displayGradeVariables.starCountXPos - 75, height - 100);
      textFont(jsabFont);
      text("+" + displayGradeVariables.starsDisplay, displayGradeVariables.starCountXPos + 75, height - 100);
      fill("yellow");
    }
    else if (player.rank === "A") {
      fill("gold");
      textFont("georgia");
      text("🌟", displayGradeVariables.starCountXPos - 75, height - 100);
      textFont(jsabFont);
      text("+" + displayGradeVariables.starsDisplay, displayGradeVariables.starCountXPos + 75, height - 100);
      fill("orange");
    }
    else if (player.rank === "B") {
      fill("gold");
      textFont("georgia");
      text("🌟", displayGradeVariables.starCountXPos - 75, height - 100);
      textFont(jsabFont);
      text("+" + displayGradeVariables.starsDisplay, displayGradeVariables.starCountXPos + 75, height - 100);
      fill("white");
    }
    else if (player.rank === "C") {
      fill("gold");
      textFont("georgia");
      text("🌟", displayGradeVariables.starCountXPos - 60, height - 100);
      textFont(jsabFont);
      text("+" + displayGradeVariables.starsDisplay, displayGradeVariables.starCountXPos + 60, height - 100);
      fill("red");
    }
    text("Rank: "+ player.rank, width/2, displayGradeVariables.yPos + 100);

    // Entering animation for the text
    if (displayGradeVariables.entryAnimation === true) {
      displayGradeVariables.entryAnimation = false;
      for (let i = -height; i < height/2; i += 5) {
        setTimeout(() => {
          displayGradeVariables.yPos = i;
        }, i);
      }

      for (let i = 0; i < 250; i += 1) {
        setTimeout(() => {
          displayGradeVariables.starCountXPos -= 1.1;
        }, i);
      }

      // Animate the star count
      for (let i = 0; i < displayGradeVariables.starsEarned; i += 1) {
        setTimeout(() => {
          displayGradeVariables.starsDisplay++;
        }, 40 * i + 500);
      }
    }
  }
}

// Show the instructions using the variables
function showInstructions() {
  rectMode(CENTER);
  textAlign(CENTER);
  fill(0, 254, 255);
  textFont(jsabFont, width/40); 
  text(tutorialVariables.text, tutorialVariables.textXPos, tutorialVariables.textYPos);

  // Always show this bit of instructions in the tutorial
  textAlign(CORNER);
  textFont(jsabFont, width/80); 
  text("Note: Transparent pink will warn you of incoming danger zones but will not damage you; Try to avoid them.", 10, height - width/80);
}

// Tutorial level
function tutorial() {
  if (tutorialVariables.tutorialPlayed === true) {
    let circle;
    let square;
    let timeoutID;

    setTimeout(() => {
      tutorialVariables.music.play();

      // Show move controls coming from the left of the screen
      tutorialVariables.text = "Use WASD to move.";
      tutorialVariables.textXPos = -width/2;
      for (let i = -width/2; i <= width/2; i += 1) {
        timeoutID = setTimeout(() => {
          tutorialVariables.textXPos = i;
        }, 0.75 * i);
        timeouts.push(timeoutID);
      }

      // Change the instructions to let the player know to dodge pink
      timeoutID = setTimeout(() => {
        let change = ["Doe WASD to move.", "Dod WASD to move.", "DodgeASD to move.", "Dodge pi to move.", "Dodge pinto move.", "Dodge pink  move.", "Dodge pink obove.", "Dodge pink obje", "Dodge pink object", "Dodge pink objects."];
        for (let i = 0; i < 10; i++) {
          timeoutID = setTimeout(() => {
            tutorialVariables.text = change[i];
          }, 50 * i);
          timeouts.push(timeoutID);
        }
      }, 5000);
      timeouts.push(timeoutID);

      // Send the instructions away
      timeoutID = setTimeout(() => {
        for (let i = width/2; i < width * 1.5; i++) {
          timeoutID = setTimeout(() => {
            tutorialVariables.textXPos = i;
          }, 0.75 * i);
          timeouts.push(timeoutID);
        }
      }, 8000);
      timeouts.push(timeoutID);

      // 4 circles enlarging and disappearing 
      for (let time of [2000, 3500, 5500, 7000]) {
        let xpos = random(100, width - 100);
        let ypos = random(100, height - 100);
        circle = new Circles(xpos, ypos, 75, 1, 0, 0, 0, 0, 1000, 750, CORNER, time, "add");
        circlesArray.push(circle);
        for (let i = 50; i > 0; i--) {
          circle = new Circles(xpos, ypos, i * 2, 0, 0, 0, 0, 0, 0, 100, CORNER, time + (11 - i) * 10 + 1650, "add");
          circlesArray.push(circle);
        }
      }

      // Screenshake
      for (let i = 10000; i <= 42500; i += 500) { 
        timeoutID = setTimeout(() => {
          screenShake(5);
        }, i);
        timeouts.push(timeoutID);
      }
      for (let i = 54000; i <= 90000; i += 500) { 
        timeoutID = setTimeout(() => {
          screenShake(5);
        }, i);
        timeouts.push(timeoutID);
      }

      // 2 rectangles that are on top and bottom of the screen
      square = new Squares(width, 0, width * 20, height/2 - 50, -0.75, 0, 2000, 1000, CORNER, 8000, 0, -100);
      squaresArray.push(square);
      square = new Squares(0, 0, width, height/2 - 50, 0, 0, 2000, 0, CORNER, 8000, 0, 0);
      squaresArray.push(square);
      square = new Squares(-(width * 20), height - height/2 + 50, width * 20, height/2 - 50, 0.75, 0, 2000, 1000, CORNER, 8000, 0, 100);
      squaresArray.push(square);
      square = new Squares(0, height - height/2 + 50, width, height/2 - 50, 0, 0, 2000, 0, CORNER, 8000, 0, 0);
      squaresArray.push(square);

      // Rectangles that go from up to down 
      for (let i = 11000; i < 25000; i += 500) { 
        let position = random(100, width - 100);
        square = new Squares(position, -(height * 20), 75, 20 * height, 0, 0.2, 2000, 1000, CORNER, i - 2000, 75, 0);
        squaresArray.push(square);
        square = new Squares(position, 0, 75, height, 0, 0, 2000, 0, CORNER, i - 2000, 0, 0);
        squaresArray.push(square);
      }

      // Extra rectangles going horizontally 
      for (let i = 14000; i <= 22000; i += 4000) {
        let ypos = random(150, height - 150);
        for (let j = 0; j < 5; j++) {
          square = new Squares(0, ypos + j * 20, width, 10, 0, 0, 1000 + j * 50, 500, CORNER, i - 1000 + j * 50, 0, 0);
          squaresArray.push(square);
        }
      }

      // 2 vertical rectangles in left and right sides
      square = new Squares(0, height, width/2 - 100, 20 * height, 0, -0.75, 2000, 1000, CORNER, 24000, -75, 0);
      squaresArray.push(square);
      square = new Squares(0, 0, width/2 - 100, height, 0, 0, 2000, 0, CORNER, 24000, 0, 0);
      squaresArray.push(square);
      square = new Squares(width - width/2 + 100, -(height * 20), width/2 - 100, 20 * height, 0, 0.75, 2000, 1000, CORNER, 24000, 75, 0);
      squaresArray.push(square);
      square = new Squares(width - width/2 + 100, 0, width/2 - 100, height, 0, 0, 2000, 0, CORNER, 24000, 0, 0);
      squaresArray.push(square);

      // Rectangles that go from left to right 
      for (let i = 27000; i < 39000; i += 500) { 
        let position = random(height);
        square = new Squares(-(width * 5), position, width * 5, 40, 0.2, 0, 2000, 500, CORNER, i - 2000, 0, 75);
        squaresArray.push(square);
        square = new Squares(0, position, width, 40, 0, 0, 2000, 0, CORNER, i - 2000, 0, 0);
        squaresArray.push(square);
      }

      // Extra rectangles going vertically 
      for (let time of [30000, 34000, 38000, 39000, 54000, 55000, 56000, 56250, 62000, 66000, 70000]) {
        let xpos = random(150, width - 150);
        for (let j = 0; j < 7; j++) {
          square = new Squares(xpos + j * 20, 0, 10, height, 0, 0, 1000 + j * 25, 500, CORNER, time - 1000 + j * 25, 0, 0);
          squaresArray.push(square);
        }
      }

      // 2 rectangles that are on top and bottom of the screen
      square = new Squares(width, 0, width * 10, height/2 - 50, -0.2, 0, 3000, 1000, CORNER, 37000, 0, -100);
      squaresArray.push(square);
      square = new Squares(0, 0, width, height/2 - 50, 0, 0, 3000, 0, CORNER, 37000, 0, 0);
      squaresArray.push(square);
      square = new Squares(-(width * 10), height - height/2 + 50, width * 10, height/2 - 50, 0.2, 0, 3000, 1000, CORNER, 37500, 0, 100);
      squaresArray.push(square);
      square = new Squares(0, height - height/2 + 50, width, height/2 - 50, 0, 0, 3000, 0, CORNER, 37500, 0, 0);
      squaresArray.push(square);

      // 2 vertical rectangles in left and right sides
      square = new Squares(0, height, width/2 - 100, 20 * height, 0, -0.2, 3000, 1000, CORNER, 39000, -75, 0);
      squaresArray.push(square);
      square = new Squares(0, 0, width/2 - 100, height, 0, 0, 3000, 0, CORNER, 39000, 0, 0);
      squaresArray.push(square);
      square = new Squares(width - width/2 + 100, -(height * 20), width/2 - 100, 20 * height, 0, 0.2, 3000, 1000, CORNER, 39000, 75, 0);
      squaresArray.push(square);
      square = new Squares(width - width/2 + 100, 0, width/2 - 100, height, 0, 0, 3000, 0, CORNER, 39000, 0, 0);
      squaresArray.push(square);

      // Show dash control 
      timeoutID = setTimeout(() => {
        tutorialVariables.text = "You can also dash using the space bar.";
        tutorialVariables.textXPos = -width/2;
        for (let i = -width/2; i <= width/2; i += 1) {
          timeoutID = setTimeout(() => {
            tutorialVariables.textXPos = i;
          }, 0.75 * i);
          timeouts.push(timeoutID);
        }
      }, 43000);
      timeouts.push(timeoutID);

      // Change the instructions
      timeoutID = setTimeout(() => {
        let change = ["You can also dash using the space bar.", "Das can also dash using the space bar.", "Dashing w also dash using the space bar.", "Dashing will dash using the space bar.", "Dashing will bri using the space bar.", "Dashing will briefly using the space bar.", "Dashing will briefly make  the space bar.", "Dashing will briefly make you ipace bar.", "Dashing will briefly make you invin bar.", "Dashing will briefly make you invincible."];
        for (let i = 0; i < 10; i++) {
          timeoutID = setTimeout(() => {
            tutorialVariables.text = change[i];
          }, 50 * i);
          timeouts.push(timeoutID);
        }
      }, 46000);
      timeouts.push(timeoutID);

      // Change the instructions
      timeoutID = setTimeout(() => {
        let change = ["Tryhing will briefly make you invincible.", "Try dag will briefly make you invincible.", "Try dashiill briefly make you invincible.", "Try dashing briefly make you invincible.", "Try dashing threfly make you invincible.", "Try dashing througy make you invincible.", "Try dashing through thke you invincib", "Try dashing through thes you invin", "Try dashing through these you i.", "Try dashing through these."];
        for (let i = 0; i < 10; i++) {
          timeoutID = setTimeout(() => {
            tutorialVariables.text = change[i];
          }, 50 * i);
          timeouts.push(timeoutID);
        }
      }, 48000);
      timeouts.push(timeoutID);

      // Send the instructions away
      timeoutID = setTimeout(() => {
        for (let i = width/2; i < width * 1.5; i++) {
          timeoutID = setTimeout(() => {
            tutorialVariables.textXPos = i;
          }, 0.75 * i);
          timeouts.push(timeoutID);
        }
      }, 50000);
      timeouts.push(timeoutID);

      for (let i = 0; i * (height/20) < height; i++) {
        circle = new Circles(width - height/40, height/20 * i + height/40, height/20, 0, -5, 0, 0, 0, 2000, 10000, CORNER, 50000, "add");
        circlesArray.push(circle);
      }

      // 2 rectangles that are on top and bottom of the screen
      square = new Squares(width, 0, width * 400, height/2 - height/3, -0.2, 0, 2000, 16000, CORNER, 56000, 0, -100);
      squaresArray.push(square);
      square = new Squares(0, 0, width, height/2 - height/3, 0, 0, 2000, 0, CORNER, 56000, 0, 0);
      squaresArray.push(square);
      square = new Squares(-(width * 400), height - height/2 + height/3, width * 400, height/2 - height/3, 0.2, 0, 2000, 16000, CORNER, 56000, 0, 100);
      squaresArray.push(square);
      square = new Squares(0, height - height/2 + height/3, width, height/2 - height/3, 0, 0, 2000, 0, CORNER, 56000, 0, 0);
      squaresArray.push(square);

      // 2 vertical rectangles in left and right sides
      square = new Squares(0, height, width/2 - width/3, 300 * height, 0, -0.2, 2000, 16000, CORNER, 56000, -75, 0);
      squaresArray.push(square);
      square = new Squares(0, 0, width/2 - width/3, height, 0, 0, 2000, 0, CORNER, 56000, 0, 0);
      squaresArray.push(square);
      square = new Squares(width - width/2 + width/3, -(height * 300), width/2 - width/3, 300 * height, 0, 0.2, 2000, 16000, CORNER, 56000, 75, 0);
      squaresArray.push(square);
      square = new Squares(width - width/2 + width/3, 0, width/2 - width/3, height, 0, 0, 2000, 0, CORNER, 56000, 0, 0);
      squaresArray.push(square);

      // Rectangles horizontally or vertically until the level ends
      for (let i = 59000; i < 90000; i += 500) { 
        if (random([0, 1]) === 1) {
          let position = random(height/2 - height/3, height/2 + height/3);
          square = new Squares(-(width * 10), position, width * 10, 35, 0.2, 0, 2000, 500, CORNER, i - 2000, 0, 75);
          squaresArray.push(square);
          square = new Squares(0, position, width, 35, 0, 0, 2000, 0, CORNER, i - 2000, 0, 0);
          squaresArray.push(square);
        }
        else {
          let position = random(width/2 - width/3, width/2 + width/3);
          square = new Squares(position, -(height * 20), 35, 20 * height, 0, 0.2, 2000, 1000, CORNER, i - 2000, 75, 0);
          squaresArray.push(square);
          square = new Squares(position, 0, 35, height, 0, 0, 2000, 0, CORNER, i - 2000, 0, 0);
          squaresArray.push(square);
        }
      }

      // Rectangles that go across the screen forcing the player to dash
      for (let time of [78000, 82000, 86000, 87000, 88000]) { 
        if (random([0, 1]) === 1) {
          square = new Squares(-30, 0, 30, height, 0.5, 0, 1000, 15000, CORNER, time - 1000, 0, 10);
          squaresArray.push(square);
        }
        else {
          square = new Squares(width, 0, 30, height, -0.5, 0, 1000, 15000, CORNER, time - 1000, 0, -10);
          squaresArray.push(square);
        }
      }

      // Back to the main menu
      timeoutID = setTimeout(() => {
        setTimeout(() => {
          state = "menu";
          menuBackground.velocityIncrease = 0.1;
          menuMusic.play();
          menuTransition.levelTransition = false;
          playADramaticIrony = true;
          tutorialVariables.tutorialPlayed = true;
          squaresArray = [];
          circlesArray = [];

          for (let timeout of timeouts) {
            clearTimeout(timeout);
          }

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
      }, 98000);
      timeouts.push(timeoutID);

    // Delay everything
    }, 1000);
    tutorialVariables.tutorialPlayed = false;
  }
}

function aDramaticIrony() {
  if (playADramaticIrony === true) {
    let square;
    let circle;
    let timeoutID;

    setTimeout(() => {
      aDramaticIronyMusic.play();

      // Spawn squares at random places
      for (let i = 0; i <= 30; i++) {
        let size = random([75, 125]);
        square = new Squares(random(size, width - size), random(size, height - size), size, size, random(-0.5, 0.5), random(-0.25, 0.25), 750, 2000, CORNER, i * 700, 0, 0);
        squaresArray.push(square);
      }

      // Spawn circles dropping from the top of the screen
      circle = new Circles(random(width), 0, 6, 0, 0, 1, 0, 0.1, 0, 2000, CORNER, 700, "add");
      circlesArray.push(circle);

      setTimeout(() => {
        for (let i = 0; i <= 30; i++) {
          circle = new Circles(random(width), 0, 6, 0, 0, 1, 0, 0.1, 0, 2000, CORNER, 500 * i, "add");
          circlesArray.push(circle);
        }
        setTimeout(() => {
          for (let i = 0; i <= 100; i++) {
            circle = new Circles(random(width), 0, 10, 0, 0, 1, 0, random(0.3, 0.8), 0, 2000, CORNER, 100 * i, "add");
            circlesArray.push(circle);
          }
        }, 6000);
      }, 6000);


      // Borders
      square = new Squares(0, 0, (height - 50)/6, height, 0, 0, 1500, 12000, CORNER, 22000, 0, 0); 
      squaresArray.push(square);
      square = new Squares(width - (height - 50)/6, 0, (height - 50)/6, height, 0, 0, 1500, 12000, CORNER, 22000, 0, 0);
      squaresArray.push(square);
      square = new Squares(0, 0, width, (height - 50)/6, 0, 0, 1500, 12000, CORNER, 22000, 0, 0);
      squaresArray.push(square);
      square = new Squares(0, height - (height - 50)/6, width, (height - 50)/6, 0, 0, 1500, 12000, CORNER, 22000, 0, 0);
      squaresArray.push(square);
      timeoutID = setTimeout(() => {
        screenShake(5);
      }, 23500); 
      timeouts.push(timeoutID);

      square = new Squares(0, 0, (height - 50)/3, height, 0, 0, 1000, 8500, CORNER, 25500, 0, 0); 
      squaresArray.push(square);
      square = new Squares(width - (height - 50)/3, 0, (height - 50)/3, height, 0, 0, 1000, 8500, CORNER, 25500, 0, 0);
      squaresArray.push(square);
      square = new Squares(0, 0, width, (height - 50)/3, 0, 0, 1000, 8500, CORNER, 25500, 0, 0);
      squaresArray.push(square);
      square = new Squares(0, height - (height - 50)/3, width, (height - 50)/3, 0, 0, 1000, 8500, CORNER, 25500, 0, 0);
      squaresArray.push(square);
      timeoutID = setTimeout(() => {
        screenShake(5);
      }, 26500);
      timeouts.push(timeoutID); 

      square = new Squares(0, 0, (height - 50)/2.5, height, 0, 0, 1000, 5000, CORNER, 28000, 0, 0); 
      squaresArray.push(square);
      square = new Squares(width - (height - 50)/2.5, 0, (height - 50)/2.5, height, 0, 0, 1000, 5000, CORNER, 28000, 0, 0);
      squaresArray.push(square);
      square = new Squares(0, 0, width, (height - 50)/2.5, 0, 0, 1000, 5000, CORNER, 28000, 0, 0);
      squaresArray.push(square);
      square = new Squares(0, height - (height - 50)/2.5, width, (height - 50)/2.5, 0, 0, 1000, 5000, CORNER, 28000, 0, 0);
      squaresArray.push(square);
      timeoutID = setTimeout(() => {
        screenShake(5);
      }, 29000); 
      timeouts.push(timeoutID);

      // Circles between the borders
      for (let i = 0; i < 3; i++) {
        circle = new Circles(width - 300, height/2, height/10, 0, -1, 0, -0.5, 0, 0, 2000, CORNER, 1000 * i + 29000, "add"); 
        circlesArray.push(circle);
      }

      // Lines and the rectangle in the middle
      for (let i = 1; i * 30 < width/2 - width/22; i++) {
        square = new Squares(i * 30, 0, 20, height, 0, 0, 500, 1500, CORNER, 32000 + i * 50, 0, 0); 
        squaresArray.push(square);
        square = new Squares(width - i * 30, 0, 20, height, 0, 0, 500, 1500, CORNER, 32000 + i * 50, 0, 0); //32000
        squaresArray.push(square);
      }

      square = new Squares(width/2 - width/30, 0, width/15, height, 0, 0, 3000, 1000, CORNER, 32000, 0, 0); //32000
      squaresArray.push(square);
      timeoutID = setTimeout(() => {
        screenShake(5);
      }, 35000); 
      timeouts.push(timeoutID);

      // 2 rectangles that trap the player
      square = new Squares(0, -height, width, height, 0, 0.35, 0, 12000, CORNER, 35000, 0, 0); 
      squaresArray.push(square);
      square = new Squares(0, height, width, height, 0, -0.35, 0, 12000, CORNER, 35000, 0, 0);
      squaresArray.push(square);
      timeoutID = setTimeout(() => {
        screenShake(5);
      }, 47000); 
      timeouts.push(timeoutID);


      // Exploding circles and the lines to dash through
      circle = new Circles(width/2, height/2, 30, 0, 0, 0, 0, 0, 2000, 0, CORNER, 36000, "add");
      circlesArray.push(circle);
      for (let i = 0; i <= 8; i++) {
        if (i%2 === 1) {
          square = new Squares(0, 0, 5 * (i + 1), height, 5 + i, 0, 500, 5000, CORNER, i * 1000 + 36000, 0, 0);

          circle = new Circles(width/2, height/2, 5, 0.5, 0, 0, 0, 0, 500, 750, CORNER, i * 1000 + 36000, "add");
          circlesArray.push(circle);
          angleMode(DEGREES);
          let circleAmount = floor(random(3, 5));
          for (let k = 0; k < 360; k += 360/circleAmount) {
            circle = new Circles(width/2 + cos(k), height/2 + sin(k), 5, 0, cos(k), sin(k), 1.005 + i/200, 1.005 + i/200, 0, 20000, CORNER, 37250 + 1000 * i, "multiply");
            circlesArray.push(circle);
          }
        }
        else {
          square = new Squares(width - 5 * (i + 1), 0, 5 * (i + 1), height, -5 - i, 0, 500, 5000, CORNER, i * 1000 + 36000, 0, 0);
        }
        squaresArray.push(square);
      }

      // Rectangles that go from up to down 
      for (let i = 46000; i <= 48500; i += 500) { 
        let position = random(100, width - 100);
        square = new Squares(position, -(height * 20), 200, 20 * height, 0, 0.2, 2000, 1000, CORNER, i, 75, 0);
        squaresArray.push(square);
        square = new Squares(position, 0, 200, height, 0, 0, 2000, 0, CORNER, i, 0, 0);
        squaresArray.push(square);
        
        timeoutID = setTimeout(() => {
          screenShake(5);
        }, i + 2000);
        timeouts.push(timeoutID);
      }

      // Spawn the last one wherever the player is
      timeoutID = setTimeout(() => {
        square = new Squares(player.x - 100, -(height * 20), 200, 20 * height, 0, 0.2, 2000, 1000, CORNER, 0, 75, 0);
        squaresArray.push(square);
        square = new Squares(player.x - 100, 0, 200, height, 0, 0, 2000, 0, CORNER, 0, 0, 0);
        squaresArray.push(square);
      }, 49000);
      timeouts.push(timeoutID);
      
      timeoutID = setTimeout(() => {
        screenShake(5);
      }, 51000);
      timeouts.push(timeoutID);

      // Spawn a bunch of lines in the middle with not many warning frames
      for (let elements of [[-50, 100, 51000], [-85, 30, 51125], [55, 30, 51250], [-110, 20, 51375], [90, 20, 51500], [-135, 20, 51425], [115, 20, 51550]]) {
        square = new Squares(0, height/2 + elements[0], width, elements[1], 0, 0, 500, 1000, CORNER, elements[2], 0, 0);
        squaresArray.push(square);
      }

      // Rectangles that go from left to right
      for (let i = 52300; i < 55300; i += 500) { 
        let position = random(50, height- 50);
        square = new Squares(-(width * 20), position, width * 20, 100, 0.4, 0, 2000, 1000, CORNER, i, 0, 100);
        squaresArray.push(square);
        square = new Squares(0, position, width, 100, 0, 0, 2000, 0, CORNER, i, 0, 0);
        squaresArray.push(square);
        
        timeoutID = setTimeout(() => {
          screenShake(5);
        }, i + 2000);
        timeouts.push(timeoutID);
      }

      // Spawn the last one wherever the player is
      timeoutID = setTimeout(() => {
        square = new Squares(-(width * 20), player.y - 50, width * 20, 100, 0.4, 0, 2000, 1000, CORNER, 0, 0, 100);
        squaresArray.push(square);
        square = new Squares(0, player.y - 50, width, 100, 0, 0, 2000, 0, CORNER, 0, 0, 0);
        squaresArray.push(square);
      }, 55300);
      timeouts.push(timeoutID);
      
      timeoutID = setTimeout(() => {
        screenShake(5);
      }, 57300);
      timeouts.push(timeoutID);

      // Lines to corner the player
      for (let i = 0; i * 30 < width/1.5; i++) {
        square = new Squares(i * 30, 0, 20, height, 0, 0, 1000, 500, CORNER, 56000 + i * 50, 0, 0); 
        squaresArray.push(square);
      }

      // Spawn rectangles to the right and on top of the screen
      square = new Squares(width/1.5, -(height * 20), width/1.5, 20 * height, 0, 0.2, 2000, 1000, CORNER, 57000, 75, 0);
      squaresArray.push(square);
      square = new Squares(width/1.5, 0, width/1.5, height, 0, 0, 2000, 0, CORNER, 57000, 0, 0);
      squaresArray.push(square);
      square = new Squares(0, 0, width, height/1.5, 0, 0, 2000, 5000, CORNER, 57000, 0, 0);
      squaresArray.push(square);
      timeoutID = setTimeout(() => {
        screenShake(5);
      }, 59000);
      timeouts.push(timeoutID);

      // Rectangles that go from left to right with a trail
      for (let i = 60000; i < 63000; i += 500) {
        let position = random(height/1.5, height);
        square = new Squares(-25, position, 25, 25, 2, 0, 500, 20000, CORNER, i, 0, 20);
        squaresArray.push(square);
        square = new Squares(-75, position + 5, 50, 10, 2, 0, 500, 20000, CORNER, i, 0, 20);
        squaresArray.push(square);
        square = new Squares(0, position, width, 25, 0, 0, 1500, -100, CORNER, i, 0, 0);
        squaresArray.push(square);
      }
      
      // Exploding circles to the left, right and middle
      for (let k = 0; k <= 10; k++) {
        if (k % 3 === 0) {
          circle = new Circles(width, height/2, 5, 0.5, -1, 0, 0, 0, 500, 750, CORNER, 64000 + 1000 * k, "add"); 
          circlesArray.push(circle);
          angleMode(DEGREES);
          let circleAmount = floor(random(10, 25));
          for (let i = 0; i <= 360; i += 360/circleAmount) {
            circle = new Circles(width + cos(i) - 50, height/2 + sin(i), 10, 0, cos(i), sin(i), 1.005 + k/200, 1.005 + k/200, 0, 20000, CORNER, 65250 + 1000 * k, "multiply"); 
            circlesArray.push(circle);
          }
        }

        else if (k % 2 === 0) {
          circle = new Circles(0, height/2, 5, 0.5, 1, 0, 0, 0, 500, 750, CORNER, 64000 + 1000 * k, "add");
          circlesArray.push(circle);
          angleMode(DEGREES);
          let circleAmount = floor(random(10, 25));
          for (let i = 0; i < 360; i += 360/circleAmount) {
            circle = new Circles(cos(i) + 50, height/2 + sin(i), 10, 0, cos(i), sin(i), 1.005 + k/200, 1.005 + k/200, 0, 20000, CORNER, 65250 + 1000 * k, "multiply");
            circlesArray.push(circle);
          }
        }

        else {
          circle = new Circles(width/2, height/2, 5, 0.5, 0, 0, 0, 0, 500, 750, CORNER, 64000 + 1000 * k, "add");
          circlesArray.push(circle);
          angleMode(DEGREES);
          let circleAmount = floor(random(10, 25));
          for (let i = 0; i < 360; i += 360/circleAmount) {
            circle = new Circles(width/2 + cos(i), height/2 + sin(i), 10, 0, cos(i), sin(i), 1.005 + k/200, 1.005 + k/200, 0, 20000, CORNER, 65250 + 1000 * k, "multiply");
            circlesArray.push(circle);
          }
        }
      }

      // Circle in the middle of the screen that grows and explodes
      circle = new Circles(width/2, height/2, 5, 0.5, 0, 0, 0, 0, 500, 8250, CORNER, 75000, "add");
      circlesArray.push(circle);
      for (let i = 0; i < 1440; i += 360/30) {
        circle = new Circles(width/2 + cos(i), height/2 + sin(i), 2, 0.1, cos(i), sin(i), 1.005, 1.005, 0, 10000, CORNER, i/30*100 + 75000, "multiply");
        circlesArray.push(circle);
      }
      angleMode(DEGREES);
      for (let j = 0; j < 20; j++) {
        let circleAmount = floor(random(5, 20));
        for (let i = 360/circleAmount; i < 360; i += 360/circleAmount) {
          circle = new Circles(width/2 + cos(i), height/2 + sin(i), 7, 0, cos(i), sin(i), 1.005+j/1000, 1.005+j/1000, 0, 5000, CORNER, 83750, "multiply");
          circlesArray.push(circle);
        }
      }

      // Another circle that spawns in the middle and shoots out smaller circles around it
      circle = new Circles(width/2, height/2, 50, 0, 0, 0, 0, 0, 500, 12250, CORNER, 85000, "add");
      circlesArray.push(circle);
      for (let i = 0; i < 3600; i += 360/30) {
        circle = new Circles(width/2, height/2, 5, 0, cos(i), sin(i), 1.01, 1.01, 0, 10000, CORNER, i/30*100 + 85500, "multiply");
        circlesArray.push(circle);
      }
      timeoutID = setTimeout(() => {
        screenShake(5);
      }, 97750);
      timeouts.push(timeoutID);

      // Pattern on the top and bottom of the screen
      for (let i = 0; i < 120; i++) {
        if (i % 2 === 0) {
          square = new Squares(width + i * 50 + 5 * i, height - 50, 50, 50, -25, 0, 1000, 5000 + i * 200, CORNER, 83500, 0, -2);
          squaresArray.push(square);
          square = new Squares(-(width/3 + i * 50 + 5 * i), 0, 50, 75, 35, 0, 1000, 5000 + i * 200, CORNER, 83500, 0, 2);
          squaresArray.push(square);
        }
        else {
          square = new Squares(width + i * 50 + 5 * i, height - 75, 50, 75, -25, 0, 1000, 5000 + i * 200, CORNER, 83500, 0, -2);
          squaresArray.push(square);
          square = new Squares(-(width/3 + i * 50 + 5 * i), 0, 50, 50, 35, 0, 1000, 5000 + i * 200, CORNER, 83500, 0, 2); 
          squaresArray.push(square);
        }
      }

      // Circles on the left side and right side
      for (let i = 0; i < 8; i++) {
        circle = new Circles(0, i*(height/8) + height/16, height/16, 0, 0, 0, 0, 0, 500, 10000, CORNER, 85000 + 250 * i, "add");
        circlesArray.push(circle);
        circle = new Circles(width, i*(height/8) + height/16, height/16, 0, 0, 0, 0, 0, 500, 10000, CORNER, 85000 + 250 * i, "add");
        circlesArray.push(circle);
      }

      // 4 rectangles going top to bottom
      for (let i = 1; i < 5; i++) { 
        let xpos = (width/4 - 100) * i;
        square = new Squares(xpos, -(height * 20), 200, 20 * height, 0, 0.2, 2000, 1000, CORNER, 87000 + 1000 * i, 75, 0); 
        squaresArray.push(square);
        square = new Squares(xpos, 0, 200, height, 0, 0, 2500, 0, CORNER, 87000 + 950 * i, 0, 0); 
        squaresArray.push(square);
        
        timeoutID = setTimeout(() => {
          screenShake(5);
        }, 89000 + 950 * i);
        timeouts.push(timeoutID);
        timeoutID = setTimeout(() => {
          screenShake(5);
        }, 106500 + 1000 * (i-1));
        timeouts.push(timeoutID);
      }
      square = new Squares(-width, 0, width, height, 1.5, 0, 0, 6000, CORNER, 98000, 0, 0);
      squaresArray.push(square);
      square = new Squares(width, 0, width*2, height, -1.5, 0, 0, 6000, CORNER, 98000, 0, 0);
      squaresArray.push(square);

      // Spawn strips of squares in random y spots  with a random dy value
      for (let j = 0; j < 10; j++) {
        let ypos = random(100, height - 100);
        let dy = random(-1.5, 1.5);
        for (let i = 0; i * 30 < width; i++) {
          square = new Squares(i * 30, ypos, 20, 20, 0.5, dy, 750, 1000, CORNER, 98000 + j * 500 + 10 * i, 0, 0); 
          squaresArray.push(square);
        }
      }

      // Force player into a small area in the middle
      square = new Squares(width, 0, width * 80, height/2 - 150, -0.2, 0, 2000, 7000, CORNER, 104500, 0, -75); 
      squaresArray.push(square);
      square = new Squares(0, 0, width, height/2 - 150, 0, 0, 2000, 0, CORNER, 104500, 0, 0);
      squaresArray.push(square);
      square = new Squares(-(width*80), height/2 + 150, width * 80, height/2, 0.2, 0, 2000, 7000, CORNER, 104500, 0, 75); 
      squaresArray.push(square);
      square = new Squares(0, height/2 + 150, width, height/2, 0, 0, 2000, 0, CORNER, 104500, 0, 0); 
      squaresArray.push(square);
      square = new Squares(0, -(height * 80), width/2- 250, 80 * height, 0, 0.2, 2000, 6000, CORNER, 105500, 75, 0);
      squaresArray.push(square);
      square = new Squares(0, 0, width/2 - 250, height, 0, 0, 2000, 0, CORNER, 105500, 0, 0);
      squaresArray.push(square);
      square = new Squares(width - (width/2 - 250), -(height * 80), width/2 - 250, 80 * height, 0, 0.2, 2000, 6000, CORNER, 105500, 75, 0);
      squaresArray.push(square);
      square = new Squares(width - (width/2 - 250), 0, width/2 - 250, height, 0, 0, 2000, 0, CORNER, 105500, 0, 0); 
      squaresArray.push(square);

      // Columns of rectangles
      for (let i = 0; i < floor(width/100); i++) {
        if (i % 2 === 0) {
          square = new Squares(i * 100, 0, 100, height, 0, 0, 1000, 650, CORNER, 107500, 0, 0);
          squaresArray.push(square);
        }
        else {
          square = new Squares(i * 100, 0, 100, height, 0, 0, 1500, 500, CORNER, 108000, 0, 0);
          squaresArray.push(square);
        }
      }

      // Send the player back to the menu
      timeoutID = setTimeout(() => {
        setTimeout(() => {
          state = "menu";
          menuBackground.velocityIncrease = 0.1;
          menuMusic.play();
          menuTransition.levelTransition = false;
          playADramaticIrony = true;
          tutorialVariables.tutorialPlayed = true;
          squaresArray = [];
          circlesArray = [];

          for (let timeout of timeouts) {
            clearTimeout(timeout);
          }

          menuBackground.velocityIncrease = 0.05;
          menuBackground.circleCount = 20;
          player.x = width/2;
          player.y = height/2;
          displayGradeVariables.showGrade = false;
          displayGradeVariables.entryAnimation = false;
          displayGradeVariables.starsDisplay = 0;
          displayGradeVariables.starCountXPos = width + 100;
          displayGradeVariables.yPos = -height;
        }, menuTransition.transitionTime + 1000);
    
        setTimeout(() => {
          menuTransition.levelTransition = true;
          menuMusic.stop();
          menuTransition.transitionSound.play();
        }, 1000);
        player.lives = 99;
      }, 118000);
      timeouts.push(timeoutID);

      // Allow displayGrade() to function and set the player ranks
      timeoutID = setTimeout(() => {
        if (player.hitsTaken === 0) {
          player.rank = "S";
          stars += 30;
          displayGradeVariables.starsEarned = 30;
        }
        else if (player.hitsTaken === 1) {
          player.rank = "A+";
          stars += 25;
          displayGradeVariables.starsEarned = 25;
        }
        else if (player.hitsTaken === 2) {
          player.rank = "A";
          stars += 20;
          displayGradeVariables.starsEarned = 20;
        }
        else if (player.hitsTaken === 3) {
          player.rank = "B";
          stars += 10;
          displayGradeVariables.starsEarned = 10;
        }
        else if (player.hitsTaken >= 4) {
          player.rank = "C";
          stars += 3;
          displayGradeVariables.starsEarned = 3;
        }
        storeItem("stars", stars);

        displayGradeVariables.showGrade = true;
        displayGradeVariables.entryAnimation = true;
        winSound.play(); 
      }, 114000); 
      timeouts.push(timeoutID);

    // Delay everything
    }, 1000);
    playADramaticIrony = false;
  }
}

// Go through the array of squares and display all of them
function showSquares() {
  for (let i = squaresArray.length - 1; i >= 0; i--) {
    squaresArray[i].display();
    squaresArray[i].update();
    if (millis() > squaresArray[i].displayStart + squaresArray[i].displayTime) {
      squaresArray.splice(i, 1);
    }
  }
}

// Go through the array of circles and display all of them
function showCircles() {
  for (let i = circlesArray.length - 1; i >= 0; i--) {
    circlesArray[i].display();
    circlesArray[i].update();
    if (millis() > circlesArray[i].displayStart + circlesArray[i].displayTime) {
      circlesArray.splice(i, 1);
    }
  }
}

// Brief white screen
function whiteScreen() {
  if (isScreenWhite) {
    rectMode(CORNER);
    fill("white");
    rect(0, 0, width, height);
  }
}

// Change y values of all squares, circles and player to make it look like a screenshake
function screenShake(loopNo) {
  isScreenWhite = true;
  setTimeout(() => {
    isScreenWhite = false;
  }, 25);

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

// Collision check using collide2D
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

// Transition screen between menu and levels
function transition() {
  rectMode(CENTER);
  // fill(27, 17, 28);
  fill("black");
  noStroke();
  rect(width/2, height/2, width, menuTransition.rectHeight);
  if (menuTransition.levelTransition === true) {
    for (let i = 0; i <= 225; i++) {
      setTimeout(() => {
        menuTransition.rectHeight = map(i, 0, 200, 0, height);
      }, 5 * i);
    }
    for (let i = 225; i >= 0; i--) {
      setTimeout(() => {
        menuTransition.rectHeight = map(i, 0, 200, 0, height);
      }, 5 * (225 - i) + 1000);
    }
    menuTransition.levelTransition = "waiting...";
  }
}

// Circle animation for main menu
function displayBackground() {
  noStroke();
  push();
  angleMode(RADIANS);
  // eslint-disable-next-line no-undef
  setCenter(width/2, height/2);
  rotate(menuBackground.angle);
  fill(252, 31, 109, 100);
  // eslint-disable-next-line no-undef
  polarEllipses(menuBackground.circleCount, 50, 50, menuBackground.distance);
  // eslint-disable-next-line no-undef
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
  // eslint-disable-next-line no-undef
  setCenter(-width/2, -height/2);
  menuBackground.angle += 1;
  pop();
}

// I had to make this bc the music wouldn't play without player interaction 
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
    if (menuTransition.levelTransition === false && allowButtonClick === true) {
      playButton.onPress = function(){
        setTimeout(() => {
          state = "level";
          menuBackground.velocityIncrease = 0.1;
          allowButtonClick = true;
        }, menuTransition.transitionTime);
        menuTransition.levelTransition = true;
        menuMusic.stop();
        menuTransition.transitionSound.play();
        player.lives = 98;
        allowButtonClick = false;
        playADramaticIrony = true;
        tutorialVariables.tutorialPlayed = false;
        player.hitsTaken = 0;
        player.dashesDone = 0;
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

  if (mouseX < 85 && mouseY < 85) {
    stroke(252, 31, 102);
    fill(200, 69, 100);
  }
  else {
    stroke(200, 69, 100);
    fill(252, 31, 102);
  }
  rectMode(CORNER);
  rect(10, 10, 75);
  strokeWeight(10);
  noStroke();
  fill("white");
  textFont("sans serif");
  text("?", 10, 20, 75, 75);
}

// If the player clicks on the question mark button, start the tutorial
function mousePressed() {
  if (mouseX < 85 && mouseY < 85 && allowButtonClick === true && state === "menu") {
    setTimeout(() => {
      state = "tutorial";
      menuBackground.velocityIncrease = 0.1;
      allowButtonClick = true;
    }, menuTransition.transitionTime);
    menuTransition.levelTransition = true;
    menuMusic.stop();
    menuTransition.transitionSound.play();
    player.lives = 98;
    allowButtonClick = false;
    playADramaticIrony = false;
    tutorialVariables.tutorialPlayed = true;
  }
}

// Show particles on the player
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

// Player can't go outside the window
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

// Show the player and lives
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
    noStroke();
    textFont("courier new", 30);
    text("❤︎", 10, 30);
    textStyle(BOLD);
    textFont(jsabFont, 30);
    text(player.lives, 45, 30);
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
    player.hitsTaken += 1;
    playerHit.play();
    player.invincible = true;
    player.iFrameTimer = millis() + 2500;
    player.dx *= -1;
    player.dy *= -1;
    for (let i = 0; i <= 50; i++) {
      setTimeout(() => {
        player.movement = false;
        if (dHeld) {
          player.x -= 5;
        }
        if (aHeld) {
          player.x += 5;
        }
        if (sHeld) {
          player.y -= 5;
        }
        if (wHeld) {
          player.y += 5;
        }
        player.movement = true;
      }, 5 * i);
    }
  }
  
  // If invincible
  if (player.invincible) {
    image(hourglass, player.x, player.y - player.nonStretchedSize - 5, player.stretchedMin, player.stretchedMin);
  }

  // Remove invincibility after some time
  if (millis() > player.iFrameTimer) {
    player.invincible = false;
  }

  // If the player runs out of lives
  if (player.lives <= 0) {
    playerDead.play();
    aDramaticIronyMusic.stop();
    tutorialVariables.music.stop();

    setTimeout(() => {
      state = "menu";
      menuBackground.velocityIncrease = 0.1;
      menuMusic.play();
      menuTransition.levelTransition = false;
      playADramaticIrony = true;
      tutorialVariables.tutorialPlayed = true;
      squaresArray = [];
      circlesArray = [];
      for (let timeout of timeouts) {
        clearTimeout(timeout);
      }
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
  if ((state === "level" || state === "tutorial") && key === " " && millis() > player.dashTimer && player.movement) {
    // Give the player invincibility 
    if (player.invincible === false) {
      player.iFrameTimer = millis() + 200;
      player.invincible = true;
    }

    for (let i = 0; i <= 15; i++) {
      setTimeout(() => {
        player.dx += 10;
        player.dy += 10;
        let newParticle = new Particle(player.x, player.y, 255, 10);      
        particles.push(newParticle);
      }, 10 * i);
    }

    player.dashTimer = millis() + player.dashCooldown;
    if (displayGradeVariables.showGrade === false) {
      player.dashesDone++;
    }
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