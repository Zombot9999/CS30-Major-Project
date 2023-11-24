// Major Project
// Tareen Perera
// Nov 21, 2023

// A class consisting of all attacks
class Attacks{

  constructor() {

    // Variables for spawnLinesYAxis() and spawnLinesXAxis()
    this.linesAttackY = false;
    this.linesAttackX = false;
    this.spawnLinesYTimer = 0;
    this.spawnLinesXTimer = 0;
    this.spawnLinesX = 0;
    this.spawnLinesY = 0;
    this.spawnLinesCooldown = 4500;
    
    // Variables for spawnOnPlayer() 
    this.spawnPlayer = false;
    this.spawnOnPlayerY = 0;
    this.spawnOnPlayerX = 0;
    
    // Variables for randomSpawn()
    this.randomSpawnTimer = 0;
    this.spawnRandom = false;
    this.randomSpawnCooldown = 2000;

  }

  // Spawns a kill block in a random spot
  randomSpawn() {
    if (this.spawnRandom && millis() > this.randomSpawnTimer) {
      let randomX = floor(random(0, rows));
      let randomY = floor(random(0, columns));
  
      if (grid[randomY][randomX] === 0) {
        grid[randomY][randomX] = 1;
        
        // Spawn kill block to the north
        if (randomY > 0) {
          setTimeout(() => {
            grid[randomY - 1][randomX] = 1;
          }, 350);
          // Spawn kill block to the north east
          if (randomX < rows - 1) {
            setTimeout(() => {
              grid[randomY - 1][randomX + 1] = 1;
              diagonalMove(randomX, randomY, "northeast");
            }, 700);
          }
          // Spawn kill block to the north west
          if (randomX > 0) {
            setTimeout(() => {
              grid[randomY - 1][randomX - 1] = 1;
              diagonalMove(randomX, randomY, "northwest");
            }, 700);
          }
        }
        // Spawn another kill block to the east area
        if (randomX < rows - 1) {
          setTimeout(() => {
            grid[randomY][randomX + 1] = 1;
          }, 300);
        }
        // Spawn another kill block to the west area
        if (randomX > 0) {
          setTimeout(() => {
            grid[randomY][randomX - 1] = 1;
          }, 300);
        }
        // Spawn kill block to the south
        if (randomY < columns - 1) {
          setTimeout(() => {
            grid[randomY + 1][randomX] = 1;
          }, 300);
          // Spawn kill block to the south east
          if (randomX < rows - 1) {
            setTimeout(() => {
              grid[randomY + 1][randomX + 1] = 1;
              diagonalMove(randomX, randomY, "southeast");
            }, 700);
          }
          // Spawn kill block to the south west
          if (randomX > 0) {
            setTimeout(() => {
              grid[randomY + 1][randomX - 1] = 1;
              diagonalMove(randomX, randomY, "southwest");
            }, 700);
          }
        }
        // Cooldown
        this.randomSpawnTimer = millis() + this.randomSpawnCooldown;
      }
    }
  }
  
  // Spawns horizontal lines going from left to right in a random y spot
  spawnLinesXAxis() {
    if (this.linesAttackX && millis() > this.spawnLinesXTimer) {
      this.spawnLinesXTimer = millis() + this.spawnLinesCooldown;
      this.spawnLinesY = floor(random(0, columns));
      for (let lineX = 0; lineX < rows; lineX++) {
        if (grid[this.spawnLinesY][lineX] === 0) {
          setTimeout(() => {
            grid[this.spawnLinesY][lineX] = 1; 
          }, 100 * lineX);
        }
      }
    }
  }
  

  // Spawns vertical lines going from top to bottom in a random x spot
  spawnLinesYAxis() {
    if (this.linesAttackY && millis() > this.spawnLinesYTimer) {
      this.spawnLinesYTimer = millis() + this.spawnLinesCooldown;
      this.spawnLinesX = floor(random(0, rows));
      for (let lineY = 0; lineY < columns; lineY++) {
        if (grid[lineY][this.spawnLinesX] === 0) {
          setTimeout(() => {
            grid[lineY][this.spawnLinesX] = 1;
          }, 100 * lineY);
        }
      }
    }
  }

  // Spawns a kill block on the player
  // spawnOnPlayer() {
  //   if (this.spawnPlayer && (grid[floor((player.y+player.size/2)/cellSize)][floor((player.x+player.size/2)/cellSize)] === 0 
  //     || grid[floor((player.y-player.size/2)/cellSize)][floor((player.x+player.size/2)/cellSize)] === 0
  //     || grid[floor((player.y+player.size/2)/cellSize)][floor((player.x-player.size/2)/cellSize)] === 0
  //     || grid[floor((player.y-player.size/2)/cellSize)][floor((player.x-player.size/2)/cellSize)] === 0)) {

  //     grid[floor((player.y+player.size/2)/cellSize)][floor((player.x+player.size/2)/cellSize)] = 1;
  //     grid[floor((player.y-player.size/2)/cellSize)][floor((player.x+player.size/2)/cellSize)] = 1;
  //     grid[floor((player.y+player.size/2)/cellSize)][floor((player.x-player.size/2)/cellSize)] = 1;
  //     grid[floor((player.y-player.size/2)/cellSize)][floor((player.x-player.size/2)/cellSize)] = 1;

  //   }
  // }
}

let grid;
let cellSize = 50;
let rows;
let columns; 
let player;
let score = 0;
let moves = new Attacks;


// Create canvas, set variables and make an empty grid
function setup() {
  createCanvas(windowWidth, windowHeight);
  columns = floor(windowHeight/cellSize);
  rows = floor(windowWidth/cellSize);
  moves.spawnLinesCooldown = int(moves.spawnLinesCooldown);
  moves.randomSpawnCooldown = int(moves.randomSpawnCooldown);
  
  player = {
    x: width/2,
    y: height/2,
    dx: 5,
    dy: 5,
    size: cellSize/2,
    livesMax: 3,
    lives: 3,
    iFrame: false,
    iFrameTimer: 0,
    color: "cyan",
  };
  
  grid = makeEmptyGrid(columns, rows);
}

function draw() {
  background(220);
  displayGrid();
  displayPlayer();
  movePlayer();
  livesSystem();
  // moves.spawnOnPlayer();
  moves.spawnLinesYAxis(); 
  moves.spawnLinesXAxis();
  moves.randomSpawn();
}

function diagonalMove(x, y, direction) {
  let movement = true;
  
  for (let i = 0; i < columns && i >= 0; i++) {

    if (direction === "northwest" && x < rows && x >= 0) {
      setTimeout(() => {
        grid[y - 1 * i][x - 1 * i] = 1;
      }, 100 * i);
    }

    if (direction === "northeast" && x < rows && x >= 0) {
      setTimeout(() => {
        grid[y - 1 * i][x + 1 * i] = 1;
      }, 100 * i);
    }

    if (direction === "southwest" && x < rows && x >= 0) {
      setTimeout(() => {
        grid[y + 1 * i][x - 1 * i] = 1;
      }, 100 * i);
    }

    if (direction === "southeast" && x < rows && x >= 0) {
      setTimeout(() => {
        grid[y + 1 * i][x + 1 * i] = 1;
      }, 100 * i);
    }
  }
}

// Display game over
function gameOver() {
  textSize(100);
  fill("white");
  text("Game Over!", windowWidth/2, windowHeight/2);
  fill("green");
  text(score, windowWidth/2, windowHeight/2 + 100);
  player.color = "cyan";
  moves.linesAttackX = false;
  moves.linesAttackY = false;
  moves.spawnPlayer = false;
  moves.spawnRandom = false;
}

// Check if the player has died and reduce lives
function livesSystem() {
  if (player.iFrame === false && player.lives > 0 
    && (floor((player.y+player.size/2)/cellSize) < columns 
    && grid[floor((player.y+player.size/2)/cellSize)][floor((player.x+player.size/2)/cellSize)] === 4.5 
    || grid[floor((player.y-player.size/2)/cellSize)][floor((player.x+player.size/2)/cellSize)] === 4.5
    || floor((player.y+player.size/2)/cellSize) < columns 
    && grid[floor((player.y+player.size/2)/cellSize)][floor((player.x-player.size/2)/cellSize)] === 4.5
    || grid[floor((player.y-player.size/2)/cellSize)][floor((player.x-player.size/2)/cellSize)] === 4.5)) {
    player.lives -= 1;
    player.iFrame = true;
    player.iFrameTimer = millis() + 2000;
    player.color = "blue";
  }
  if (player.lives <= 0) {
    gameOver();
  }
  if (millis() > player.iFrameTimer) {
    player.iFrame = false;
    player.color = "cyan";
  }
  if (player.lives > 0) {
    score = floor(millis() / 100);
  }
}

// Display the player and their lives
function displayPlayer() {
  noStroke();
  rectMode(CENTER);
  textAlign(CENTER);
  fill(player.color);
  rect(player.x, player.y, player.size);

  if (player.lives === player.livesMax) {
    fill("green");
  }
  else if (player.lives < player.livesMax && player.lives > 1) {
    fill("yellow");
  }
  else {
    fill("red");
  }
  stroke(5);
  textFont("Courier New", player.size);
  textStyle(BOLD);
  text(player.lives, player.x, player.y, player.size, player.size);
  rectMode(CORNER);
}

function movePlayer() {
  if (player.lives > 0) {
    if (keyIsDown(87)) {
      if (player.y - player.dy < 0 + player.size/2) {
        player.y = 0 + player.size/2;
      }
      else {
        player.y -= player.dy;
      }
    }
    if (keyIsDown(83)) {
      if (player.y + player.dy > columns*cellSize - player.size/2) {
        player.y = columns*cellSize - player.size/2;
      }
      else {
        player.y += player.dy;
      }
    }
    if (keyIsDown(65)) {
      if (player.x - player.dx < 0 + player.size/2) {
        player.x = 0 + player.size/2;
      }
      else {
        player.x -= player.dx;
      }
    }
    if (keyIsDown(68)) {
      if (player.x + player.dx > rows*cellSize - player.size/2) {
        player.x = rows*cellSize - player.size/2;
      }
      else {
        player.x += player.dx;
      }
    }
  }
}

// Key type functions
function keyTyped() {
  // Player movement
  // if (key === "s" && player.y < columns - 1 && player.lives > 0) {
  //   player.y = player.y + 1;
  // }
  // if (key === "w" && player.y > 0 && player.lives > 0) {
  //   player.y = player.y - 1;
  // }
  // if (key === "d" && player.x < rows - 1 && player.lives > 0) {
  //   player.x = player.x + 1;
  // }
  // if (key === "a" && player.x > 0 && player.lives > 0) {
  //   player.x = player.x - 1;
  // }

  // Other functions
  if (key === "v") {
    moves.linesAttackY = !moves.linesAttackY;
  }
  if (key === "h") {
    moves.linesAttackX = !moves.linesAttackX;
  }
  if (key === "p") {
    moves.spawnPlayer = !moves.spawnPlayer;
  }
  if (key === "r") {
    moves.spawnRandom = !moves.spawnRandom;
  }
}

// Change a block when it's clicked on
function mousePressed() {
  let y = Math.floor(mouseY/cellSize);
  let x = Math.floor(mouseX/cellSize);

  if (grid[y][x] === 0) {
    grid[y][x] = 1;
  }
  else if (grid[y][x] === 4 || grid[y][x] === 4.5) {
    grid[y][x] = 0;
  }
}

// Display the grid and change their values 
function displayGrid() {
  for (let y = 0; y < columns; y++) {
    for (let x = 0; x < rows; x++) {
      if (grid[y][x] === 1) {   
        grid[y][x] = 1.5;
        fill(170, 21, 87);
        rect(x * cellSize, y * cellSize, cellSize, cellSize);
        setTimeout(() => {
          grid[y][x] = 4; 
        }, 500);
      }

      // Value 1.5 is similar to one and prevents the setTimeout() from happening more than once
      else if (grid[y][x] === 1.5) {
        fill(170, 21, 87);
        rect(x * cellSize, y * cellSize, cellSize, cellSize);
      }

      else if (grid[y][x] === 4) {
        grid[y][x] = 4.5;
        fill(253, 31, 108);
        rect(x * cellSize, y * cellSize, cellSize, cellSize);
        setTimeout(() => {
          if (grid[y][x] === 4 || grid[y][x] === 4.5) {
            grid[y][x] = 0; 
          }
        }, 2000);
      }

      // Value 4.5 is similar to one and prevents the setTimeout() from happening more than once
      else if (grid[y][x] === 4.5) {
        fill(253, 31, 108);
        rect(x * cellSize, y * cellSize, cellSize, cellSize);
      }

      else if (grid[y][x] === 0) {
        fill(41,34,57);
      }
      rect(x * cellSize, y * cellSize, cellSize, cellSize);
    }
  }
}

// Make an empty grid
function makeEmptyGrid(cols, rows) {
  let randomArray = [];
  for (let y = 0; y < cols; y++) {
    randomArray.push([]);
    for (let x = 0; x < rows; x++) {
      randomArray[y].push(0);
    }
  }
  return randomArray;
}