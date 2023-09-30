var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var score = 0;
var level = 1;
var highscore = localStorage.getItem("highscore");
var highlevel = localStorage.getItem("highlevel");
var gameover = false;
var bullets = [];
var bulletRadius = 5;
var enemyMaxDistance = 2000;
var enemies = [];
var keys = {};
var level = 1;
var qtEnemies = 10;

var playerImage = new Image();
playerImage.src = "assets/img/player-spaceship.png";
var  player = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  size: 20,
  speed: 5,
};

function createPlayer() {
  player = {
    x: canvas.width / 2,
    y: 90 * (canvas.height / 100),
    size: 15,
    speed: 5,
  };
}

function createEnemies(qtEnemies) {
  for (var i = 0; i < qtEnemies; i++) {
    enemies.push({
      x: Math.random() * enemyMaxDistance + (canvas.width - enemyMaxDistance) / 2,
      y: 0,
      size: 20,
      speed: Math.random() * 1 + 1,
    });
  }
  
}


function drawPlayer() {
  ctx.drawImage(playerImage, player.x - player.size, player.y - player.size, player.size * 2, player.size * 2);
}


function drawBullets() {
  for (var i = 0; i < bullets.length; i++) {
    var bullet = bullets[i];
    ctx.beginPath();
    ctx.arc(bullet.x, bullet.y, 2, 0, 2 * Math.PI);
    ctx.fillStyle = "green";
    ctx.fill();
  }
}


function checkBulletCollisions() {
  for (var i = 0; i < bullets.length; i++) {
    var bullet = bullets[i];
    for (var j = 0; j < enemies.length; j++) {
      var enemy = enemies[j];
      if (bullet && enemy) {
        var d = distance(bullet.x, bullet.y, enemy.x, enemy.y);
        if (d < bulletRadius + enemy.size) {
          bullets.splice(i, 1);
          enemies.splice(j, 1);
          console.log(enemies.length)
          i--;
          j--;
          addScore(1);
          saveHighScore();
          checkLevel();
        }
      }
    }
  }
}



function shoot() {
  if (gameover) return;
  bullets.push({
    x: player.x,
    y: player.y - player.size,
  });
}


function moveBullets() {
  for (var i = 0; i < bullets.length; i++) {
    var bullet = bullets[i];
    bullet.y -= 10;
  }
}


function drawEnemies() {
  for (var i = 0; i < enemies.length; i++) {
    var enemy = enemies[i];
    ctx.beginPath();
    ctx.arc(enemy.x, enemy.y, enemy.size, 0, 2 * Math.PI);
    ctx.fillStyle = "red";
    ctx.fill();
  }
}


function movePlayer() {
  if (gameover) return;
  if (keys.ArrowLeft && player.x > 0) {
    player.x -= player.speed;
  }
  if (keys.ArrowRight && player.x < canvas.width) {
    player.x += player.speed;
  }
  if (keys.ArrowUp && player.y > 0) {
    player.y -= player.speed;
  }
  if (keys.ArrowDown && player.y < canvas.height) {
    player.y += player.speed;
  }
}


function moveEnemies() {
  for (var i = 0; i < enemies.length; i++) {
    var enemy = enemies[i];
    if (enemy.x < player.x) {
      enemy.x += enemy.speed;
    }
    if (enemy.x > player.x) {
      enemy.x -= enemy.speed;
    }
    if (enemy.y < player.y) {
      enemy.y += enemy.speed;
    }
    if (enemy.y > player.y) {
      enemy.y -= enemy.speed;
    }
  }
}

function distance(x1, y1, x2, y2) {
  var dx = x1 - x2;
  var dy = y1 - y2;
  return Math.sqrt(dx * dx + dy * dy);
}


function checkCollisions() {
  for (var i = 0; i < enemies.length; i++) {
    var enemy = enemies[i];
    var d = distance(player.x, player.y, enemy.x, enemy.y);
    if (d < player.size + enemy.size) {
      gameover = true;
      checkScore();
      showMenu();
    }
  }
}

function addScore(qtScore) {
  score += qtScore;
  updateScore();
}

function checkScore() {
  if (!highscore || score > highscore || !highlevel || level > highlevel) {
    saveHighScore();
    score = 0;
  }
  updateScore();
}

function checkLevel() {
  if (enemies.length <= 0) {
    level ++;
    qtEnemies = qtEnemies * 1.5;
    document.getElementById("level").innerHTML = "Level: "+level;
    createEnemies(qtEnemies);
  }
}

function updateScore() {
  if (highscore) {
    document.getElementById("highscore").innerHTML = "Highscore: " + highscore;
  }
  if (highlevel) {
    document.getElementById("highlevel").innerHTML = "Highest Level: " + highlevel;
  }
  document.getElementById("score").innerHTML = "Score: " + score;
  document.getElementById("level").innerHTML = "Level: " + level;
}


function hideMenu() {
  document.getElementsByClassName('game-menu')[0].style.visibility = 'hidden';
}

function showMenu() {
  document.getElementsByClassName('game-menu')[0].style.visibility = '';
}

function countDown() {
  var timeleft = 5;
  var downloadTimer = setInterval(function(){
  timeleft--;
  document.getElementById("countdowntimer").textContent = timeleft;
  if(timeleft <= 0)
      clearInterval(downloadTimer);
  },1000);
}


function loop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawPlayer();
  drawEnemies();
  drawBullets();

  movePlayer();
  moveEnemies();
  moveBullets();

  checkBulletCollisions();
  checkCollisions();

  //updateScore();

  if (!gameover) {
    requestAnimationFrame(loop);
  }
}

function saveHighScore() {
  if (score > localStorage.getItem("highscore")) {
    localStorage.setItem("highscore", score);
  }

  if (level > localStorage.getItem("highlevel")) {
    localStorage.setItem("highlevel", level);
  }

  updateScore();
}


function runGame() {
  hideMenu();
  qtEnemies = 10;
  createPlayer();
  enemies = [];
  gameover = false;
  createEnemies(qtEnemies);
  score = 0;
  level = 1;
  updateScore();

  loop();
}


function showCredits() {
  alert('https://gabrieltsants.github.io/');
}

window.addEventListener("keydown", function (event) {
  keys[event.code] = true;
  if (event.code === "Space") {
    shoot();
  }
});
window.addEventListener("keyup", function (event) {
  keys[event.code] = false;
});

window.addEventListener('resize', function() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  player.x = canvas.width / 2;
  player.y = 90 * (canvas.height / 100);
  document.getElementById("score").style.top = canvas.height / 10 + "px";
  document.getElementById("score").style.left = canvas.width / 20 + "px";
  document.getElementById("level").style.top = canvas.height / 10 + "px";
  document.getElementById("level").style.right = canvas.width / 20 + "px";
  resizeCanvas();
});


        
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

resizeCanvas();
updateScore();

/* Touch move spaceship */
canvas.addEventListener("touchstart", function(event) {
  var touchX = event.touches[0].clientX;
  var touchY = event.touches[0].clientY;
  
  player.x = touchX;
  player.y = touchY;
});

canvas.addEventListener("touchmove", function(event) {
  var touchX = event.touches[0].clientX;
  var touchY = event.touches[0].clientY;
  
  player.x = touchX;
  player.y = touchY;
});

canvas.addEventListener("touchend", function(event) {
  shoot();
});

/* Mouse move spacecship */

/*
  window.addEventListener("mousemove", function (event) {
    var rect = canvas.getBoundingClientRect();
    player.x = event.clientX - rect.left;
    player.y = event.clientY - rect.top;
  });


  window.addEventListener("mousedown", function (event) {
    shoot();
  });
*/
