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

let particles = [];
let lastSpawnTime = 0;
let spawnInterval = 100;
let player;
let playerAvatar;
let playerX = 50;
let playerY = 50;
let hourglass;

function preload() {
  hourglass = loadImage("assets/hourglass.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  rectMode(CENTER);
  imageMode(CENTER);

  player = {
    shape: new Sprite(),
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
}

function draw() {
  clear();
  background(23, 17, 28);
  if (collideRectRect(player.x-player.width/2, player.y-player.height/2, player.width, player.height, 75, 75, 50, 50)) {
    fill("red");
    player.hit = true;
  }
  else {
    fill("green");
    player.hit = false;
  }
  rect(100, 100, 50);
  showParticles();
  displayPlayerAndLives();
  playerBorders();
  lives();
  move();
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
  player.shape.width = player.width;
  player.shape.height = player.height;
  player.shape.x = player.x;
  player.shape.y = player.y;
  player.shape.color = player.color;
  player.shape.stroke = player.color;

  fill(player.color);
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
  if (key === " " && millis() > player.dashTimer) {
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


// // A class consisting of all attacks
// class Attacks{

//   constructor() {

//     // Variables for spawnLinesYAxis() and spawnLinesXAxis()
//     this.spawnLinesYTimer = 0;
//     this.spawnLinesXTimer = 0;
//     this.spawnLinesX = 0;
//     this.spawnLinesY = 0;
//     this.linesAttackX = true;
//     this.linesAttackY = true;
    
//     // Variables for spawnOnPlayer() 
//     this.spawnPlayer = true;
//     this.spawnOnPlayerY = 0;
//     this.spawnOnPlayerX = 0;
    
//     // Variables for randomSpawn()
//     this.randomSpawnTimer = 0;
//     this.spawnRandom = true;
//     this.randomSpawnCooldown = 3000;

//   }

//   // Spawns a kill block in a random spot
//   randomSpawn() {
//     if (this.spawnRandom && millis() > this.randomSpawnTimer) {
//       let randomX = floor(random(0, rows));
//       let randomY = floor(random(0, columns));
  
//       if (grid[randomY][randomX] === 0) {
//         grid[randomY][randomX] = 1;
        
//         // Spawn kill block to the north
//         if (randomY > 0) {
//           setTimeout(() => {
//             grid[randomY - 1][randomX] = 1;
//           }, 350);
//           // Spawn kill block to the north east
//           if (randomX < rows - 1) {
//             setTimeout(() => {
//               grid[randomY - 1][randomX + 1] = 1;
//               diagonalMove(randomX, randomY, "northeast");
//             }, 700);
//           }
//           // Spawn kill block to the north west
//           if (randomX > 0) {
//             setTimeout(() => {
//               grid[randomY - 1][randomX - 1] = 1;
//               diagonalMove(randomX, randomY, "northwest");
//             }, 700);
//           }
//         }
//         // Spawn another kill block to the east area
//         if (randomX < rows - 1) {
//           setTimeout(() => {
//             grid[randomY][randomX + 1] = 1;
//           }, 300);
//         }
//         // Spawn another kill block to the west area
//         if (randomX > 0) {
//           setTimeout(() => {
//             grid[randomY][randomX - 1] = 1;
//           }, 300);
//         }
//         // Spawn kill block to the south
//         if (randomY < columns - 1) {
//           setTimeout(() => {
//             grid[randomY + 1][randomX] = 1;
//           }, 300);
//           // Spawn kill block to the south east
//           if (randomX < rows - 1) {
//             setTimeout(() => {
//               grid[randomY + 1][randomX + 1] = 1;
//               diagonalMove(randomX, randomY, "southeast");
//             }, 700);
//           }
//           // Spawn kill block to the south west
//           if (randomX > 0) {
//             setTimeout(() => {
//               grid[randomY + 1][randomX - 1] = 1;
//               diagonalMove(randomX, randomY, "southwest");
//             }, 700);
//           }
//         }
//         // Cooldown
//         this.randomSpawnTimer = millis() + this.randomSpawnCooldown;
//       }
//     }
//   }
  
//   // Spawns horizontal lines going from left to right in a random y spot
//   spawnLinesXAxis(minRange, maxRange, speed, yLocation) {
    
//     if (this.linesAttackX) {
//     // this.spawnLinesXTimer = millis() + cooldown;
//       this.spawnLinesY = yLocation;
//       for (let lineX = minRange; lineX < maxRange; lineX++) {
//         if (grid[this.spawnLinesY][lineX] === 0) {
//           setTimeout(() => {
//             grid[this.spawnLinesY][lineX] = 1; 
//           }, speed * lineX);
//         }
//       }
//     }
//     console.log(minRange, maxRange, speed, yLocation);
//   }
  

//   // Spawns vertical lines going from top to bottom in a random x spot
//   spawnLinesYAxis(minRange, maxRange, cooldown, speed) {
//     if (this.linesAttackY && millis() > this.spawnLinesYTimer) {
//       this.spawnLinesYTimer = millis() + cooldown;
//       this.spawnLinesX = floor(random(0, rows));
//       for (let lineY = minRange; lineY < maxRange; lineY++) {
//         if (grid[lineY][this.spawnLinesX] === 0) {
//           setTimeout(() => {
//             grid[lineY][this.spawnLinesX] = 1;
//           }, speed * lineY);
//         }
//       }
//     }
//   }

//   // Spawns a kill block on the player
//   // spawnOnPlayer() {
//   //   if (this.spawnPlayer && (grid[floor((player.y+player.size/2)/cellSize)][floor((player.x+player.size/2)/cellSize)] === 0 
//   //     || grid[floor((player.y-player.size/2)/cellSize)][floor((player.x+player.size/2)/cellSize)] === 0
//   //     || grid[floor((player.y+player.size/2)/cellSize)][floor((player.x-player.size/2)/cellSize)] === 0
//   //     || grid[floor((player.y-player.size/2)/cellSize)][floor((player.x-player.size/2)/cellSize)] === 0)) {

//   //     grid[floor((player.y+player.size/2)/cellSize)][floor((player.x+player.size/2)/cellSize)] = 1;
//   //     grid[floor((player.y-player.size/2)/cellSize)][floor((player.x+player.size/2)/cellSize)] = 1;
//   //     grid[floor((player.y+player.size/2)/cellSize)][floor((player.x-player.size/2)/cellSize)] = 1;
//   //     grid[floor((player.y-player.size/2)/cellSize)][floor((player.x-player.size/2)/cellSize)] = 1;

//   //   }
//   // }
// }

// let grid;
// let cellSize = 60;
// let rows;
// let columns; 
// let player;
// let score = 0;
// let moves = new Attacks;
// let moves2 = new Attacks;
// let dashCooldown = 0;

// // Create canvas, set variables and make an empty grid
// function setup() {
//   createCanvas(windowWidth, windowHeight);
//   columns = floor(windowHeight/cellSize);
//   rows = floor(windowWidth/cellSize);
  
//   player = {
//     x: width/2,
//     y: height/2,
//     dx: 5,
//     dy: 5,
//     size: cellSize/2,
//     livesMax: 100,
//     lives: 99,
//     iFrame: false,
//     iFrameTimer: 0,
//     color: "cyan",
//   };
  
//   grid = makeEmptyGrid(columns, rows);
// }

// let level = true;

// function draw() {
//   noStroke();
//   background(220);
//   displayGrid();
//   displayPlayer();
//   movePlayer();
//   livesSystem();
//   // // moves.spawnOnPlayer();
//   // moves.spawnLinesYAxis(0, columns, 3000, 50);
//   // setTimeout(() => {
//   //   moves.spawnLinesXAxis(0, rows, 25, floor(random(0, columns)));
//   //   // moves2.spawnLinesXAxis(0, rows, 25, floor(2));
//   //   moves.spawnLinesXAxis(0, rows, 25, floor(3));
//   //   // moves2.spawnLinesXAxis(0, rows, 25, floor(4));
//   // }, 3000 * moves.spawnLinesXTimer);
//   // moves.randomSpawn();
//   // moves.spawnLinesXTimer++;
//   // // moves2.spawnLinesXTimer++;
//   game();
// }

// function game() {
//   if (level) {
//     level = false;
//     moves2.spawnLinesXAxis(0, rows, 25, floor(2));
//     moves.spawnLinesXAxis(0, rows, 25, floor(3));
//     moves2.spawnLinesXAxis(0, rows, 25, floor(4));
//   }
// }

// function diagonalMove(x, y, direction) {  
//   for (let i = 0; i < columns && i >= 0; i++) {

//     if (direction === "northwest" && x < rows && x >= 0) {
//       setTimeout(() => {
//         grid[y - 1 * i][x - 1 * i] = 1;
//       }, 100 * i);
//     }

//     if (direction === "northeast" && x < rows && x >= 0) {
//       setTimeout(() => {
//         grid[y - 1 * i][x + 1 * i] = 1;
//       }, 100 * i);
//     }

//     if (direction === "southwest" && x < rows && x >= 0) {
//       setTimeout(() => {
//         grid[y + 1 * i][x - 1 * i] = 1;
//       }, 100 * i);
//     }

//     if (direction === "southeast" && x < rows && x >= 0) {
//       setTimeout(() => {
//         grid[y + 1 * i][x + 1 * i] = 1;
//       }, 100 * i);
//     }
//   }
// }

// // Display game over
// function gameOver() {
//   textSize(100);
//   fill("white");
//   text("Game Over!", windowWidth/2, windowHeight/2);
//   fill("green");
//   text(score, windowWidth/2, windowHeight/2 + 100);
//   player.color = "cyan";
//   moves.linesAttackX = false;
//   moves.linesAttackY = false;
//   moves.spawnPlayer = false;
//   moves.spawnRandom = false;
// }

// // Check if the player has died and reduce lives
// function livesSystem() {
//   if (player.iFrame === false && player.lives > 0 
//     // Hitbox detection (I know it looks really messy...)
//     && (floor((player.y+player.size/2)/cellSize) < columns 
//     && grid[floor((player.y+player.size/2)/cellSize)][floor((player.x+player.size/2)/cellSize)] === 4.5 
//     || grid[floor((player.y-player.size/2)/cellSize)][floor((player.x+player.size/2)/cellSize)] === 4.5
//     || floor((player.y+player.size/2)/cellSize) < columns 
//     && grid[floor((player.y+player.size/2)/cellSize)][floor((player.x-player.size/2)/cellSize)] === 4.5
//     || grid[floor((player.y-player.size/2)/cellSize)][floor((player.x-player.size/2)/cellSize)] === 4.5)) {

//     player.lives -= 1;
//     player.iFrame = true;
//     player.iFrameTimer = millis() + 2000;
//     player.color = "blue";
//   }
//   if (player.lives <= 0) {
//     gameOver();
//   }
//   if (millis() > player.iFrameTimer) {
//     player.iFrame = false;
//     player.color = "cyan";
//   }
//   else {
//     player.iFrame = true;
//   }
//   if (player.lives > 0) {
//     score = floor(millis() / 100);
//   }
// }

// // Display the player and their lives
// function displayPlayer() {
//   noStroke();
//   rectMode(CENTER);
//   textAlign(CENTER);
//   fill(player.color);
//   rect(player.x, player.y, player.size);

//   if (player.lives === player.livesMax) {
//     fill("green");
//   }
//   else if (player.lives < player.livesMax && player.lives > 1) {
//     fill("yellow");
//   }
//   else {
//     fill("red");
//   }
//   stroke(5);
//   textFont("Courier New", player.size);
//   textStyle(BOLD);
//   text(player.lives, player.x, player.y, player.size, player.size);
//   rectMode(CORNER);
// }

// function movePlayer() {
//   if (player.lives > 0) {
//     if (keyIsDown(32) && millis() > dashCooldown) {
//       dashCooldown = millis() + 500;
//       for (let i = 0; i <= 20; i++) {
//         setTimeout(() => {
//           player.dx += 5;
//           player.dy += 5; 
//         }, 10 * i);
//       }
//       if (player.iFrame === false) {
//         player.iFrameTimer = millis() + 200;
//         player.iFrame = true;
//       }
//     }
//     if (keyIsDown(87)) {
//       if (player.y - player.dy < 0 + player.size/2) {
//         player.y = 0 + player.size/2;
//       }
//       else {
//         player.y -= player.dy;
//       }
//     }
//     if (keyIsDown(83)) {
//       if (player.y + player.dy > columns*cellSize - player.size/2) {
//         player.y = columns*cellSize - player.size/2;
//       }
//       else {
//         player.y += player.dy;
//       }
//     }
//     if (keyIsDown(65)) {
//       if (player.x - player.dx < 0 + player.size/2) {
//         player.x = 0 + player.size/2;
//       }
//       else {
//         player.x -= player.dx;
//       }
//     }
//     if (keyIsDown(68)) {
//       if (player.x + player.dx > rows*cellSize - player.size/2) {
//         player.x = rows*cellSize - player.size/2;
//       }
//       else {
//         player.x += player.dx;
//       }
//     }
//     player.dx = 5;
//     player.dy = 5;
//     if (millis() > player.iFrameTimer) {
//       player.iFrame = false;
//       player.color = "cyan";
//     }
//   }
// }

// // Key type functions
// function keyTyped() {
//   if (key === "v") {
//     moves.linesAttackY = !moves.linesAttackY;
//     moves2.linesAttackY = !moves2.linesAttackY;
//   }
//   if (key === "h") {
//     moves.linesAttackX = !moves.linesAttackX;
//     moves2.linesAttackX = !moves2.linesAttackX;
//   }
//   if (key === "p") {
//     moves.spawnPlayer = !moves.spawnPlayer;
//     moves2.spawnPlayer = !moves2.spawnPlayer;
//   }
//   if (key === "r") {
//     moves.spawnRandom = !moves.spawnRandom;
//     moves2.spawnRandom = !moves2.spawnRandom;
//   }
// }

// // Change a block when it's clicked on
// function mousePressed() {
//   let y = Math.floor(mouseY/cellSize);
//   let x = Math.floor(mouseX/cellSize);

//   if (grid[y][x] === 0) {
//     grid[y][x] = 1;
//   }
//   else if (grid[y][x] === 4 || grid[y][x] === 4.5) {
//     grid[y][x] = 0;
//   }
// }

// // Display the grid and change their values 
// function displayGrid() {
//   for (let y = 0; y < columns; y++) {
//     for (let x = 0; x < rows; x++) {
//       if (grid[y][x] === 1) {   
//         grid[y][x] = 1.5;
//         fill(170, 21, 87);
//         setTimeout(() => {
//           grid[y][x] = 4; 
//         }, 500);
//       }

//       // Value 1.5 is similar to one and prevents the setTimeout() from happening more than once
//       else if (grid[y][x] === 1.5) {
//         fill(170, 21, 87);
//       }

//       else if (grid[y][x] === 4) {
//         fill("white");
//         setTimeout(() => {
//           fill(253, 31, 108);
//         }, 250);
//         setTimeout(() => {
//           grid[y][x] = 0; 
//         }, 2000);
//         grid[y][x] = 4.5;
//       }

//       // Value 4.5 is similar to one and prevents the setTimeout() from happening more than once
//       else if (grid[y][x] === 4.5) {
//         fill(253, 31, 108);
//       }

//       else if (grid[y][x] === 0) {
//         fill(41,34,57);
//       }
//       rect(x * cellSize, y * cellSize, cellSize, cellSize);
//     }
//   }
// }

// // Make an empty grid
// function makeEmptyGrid(cols, rows) {
//   let randomArray = [];
//   for (let y = 0; y < cols; y++) {
//     randomArray.push([]);
//     for (let x = 0; x < rows; x++) {
//       randomArray[y].push(0);
//     }
//   }
//   return randomArray;
// }
