// const X_MAX = 800;
// const Y_MAX = 500;
// const BORDER_MIN = 75;
// const BORDER_MAX = 300;

// const CANVAS_BACKGROUND = 250;

// // ALIEN CONSTANTS
// var ALIEN_SPEED = 1;
// var ALIEN_BULLET_SPD = 4;
// var ALIEN_W = 60;
// var ALIEN_H = 12;
// var ALIEN_COLOR = "#27AE60";
// var ALIEN_HEALTH = 50;

// // PLAYER CONSTANTS
// var PLAYER_W = 30;
// var PLAYER_H = 25;
// var PLAYER_COLOR = "#5DADE2";
// var PLAYER_BULLET_SPD = -10;

// // GAME CONSTANTS
// var LEVEL = 0;
// var DEF_BULLET_W = 2;
// var DEF_BULLET_H = 20;
// var NUM_ALIENS = 3;
// var IS_PLAYER_ALIVE = true;
// let GAME_STARTED = false;
// var GAME_OVER_TXT = "Game Over!";


function setup () {
    X_MAX = 800;
    Y_MAX = 500;
    BORDER_MIN = 75;
    BORDER_MAX = 300;
    
    CANVAS_BACKGROUND = 250;
    
    // ALIEN CONSTANTS
    ALIEN_SPEED = 1;
    ALIEN_BULLET_SPD = 4;
    ALIEN_W = 60;
    ALIEN_H = 12;
    ALIEN_COLOR = "#27AE60";
    ALIEN_HEALTH = 50;
    
    // PLAYER CONSTANTS
    PLAYER_W = 30;
    PLAYER_H = 25;
    PLAYER_COLOR = "#5DADE2";
    PLAYER_BULLET_SPD = -10;
    
    // GAME CONSTANTS
    LEVEL = 0;
    DEF_BULLET_W = 2;
    DEF_BULLET_H = 20;
    NUM_ALIENS = 3;
    IS_PLAYER_ALIVE = true;
    GAME_STARTED = false;
    GAME_OVER_TXT = "Game Over!";

    aliens = [];
    player = {};
    bullets = [];
    upgradeLevel();
    canvas = createCanvas(X_MAX, Y_MAX);
    canvas.parent("game-canvas");
    loop();
}

/** GAME METHODS START **/
function upgradeLevel() {
    bullets = [];
    LEVEL += 1;
    if(LEVEL === 1) {
        NUM_ALIENS = 3;
    }
    else {
        NUM_ALIENS += 3;
    }
    resetPlayer();
    for(var i = 0; i < NUM_ALIENS; i++) {
        aliens.push(newAlien(ALIEN_COLOR, ALIEN_HEALTH));
    }
    ALIEN_BULLET_SPD += 1;
    ALIEN_SPEED += .25;
}

function isCollision(minAx, maxAx, minAy, maxAy, minBx, maxBx, minBy, maxBy) {
    aLeftOfB = maxAx < minBx;
    aRightOfB = minAx > maxBx;
    aAboveB = minAy > maxBy;
    aBelowB = maxAy < minBy;
    return !( aLeftOfB || aRightOfB || aAboveB || aBelowB );
}

function keyPressed() {
    // Space bar
    if(keyCode === 32 && IS_PLAYER_ALIVE) {
        playershoot();
    }
    if(keyCode === 13 && GAME_STARTED && IS_PLAYER_ALIVE){
        GAME_STARTED = false;
        noLoop();
    } 
    else if(keyCode === 13 && !GAME_STARTED && IS_PLAYER_ALIVE){
        GAME_STARTED = true;
        loop();
    }
    else if(keyCode === 13 && !IS_PLAYER_ALIVE) {
        setup();
    }
}
/** GAME METHODS END **/


/** BULLET METHODS START **/
function newBullet(type, x, y, w, h, color, speed) {
    return {type: type, x: x, y: y, w: w, h: h, color: color, speed: speed};
}
/** BULLET METHODS END **/


/** ALIEN METHODS START **/
function alienShoot(alien) {
    bullets.push(
        newBullet("alien", alien.x+(alien.w/2)-DEF_BULLET_W, alien.y, DEF_BULLET_W, DEF_BULLET_H, "red", ALIEN_BULLET_SPD)
    );
    alien.lastShot = new Date().getTime();
}

function newAlien(color, health) {
    return {
        x: random(0, X_MAX-ALIEN_W), 
        y: random(BORDER_MIN, BORDER_MAX), 
        w: ALIEN_W, 
        h: ALIEN_H, 
        color: color,
        right: random(0, 1), 
        lastShot: new Date().getTime(), 
        health: health
    }
}

function renderAlien(alien) {
    fill(alien.color); 
    noStroke();
    rect(alien.x, alien.y, alien.w, alien.h);
    circle(alien.x + (alien.w)/2, alien.y, 20);
    fill("black");
    text(alien.health, alien.x+(alien.w)/2-6, alien.y+(alien.h)/2+3);
}
/** ALIEN METHODS END **/


/** PLAYER METHODS START **/
function playershoot() {
    bullets.push(newBullet(
        "player",
        player.x + (PLAYER_W/2) - DEF_BULLET_W,
        player.y-player.h,
        DEF_BULLET_W,
        DEF_BULLET_H,
        "#D4AC0D",
        PLAYER_BULLET_SPD
    ));
}

function resetPlayer() {
    player = {x: X_MAX/2, y: Y_MAX-PLAYER_H, color: PLAYER_COLOR, w: PLAYER_W, h: PLAYER_H, health: 10}
}

function renderPlayer() {
    if(IS_PLAYER_ALIVE) {
        fill(player.color);
        noStroke();
        rect(player.x, player.y, PLAYER_W, PLAYER_H);
        rect(player.x+(player.w/2)-6, player.y, 12, -10);
        fill("black");
        text(player.health, player.x+(player.w)/2-7, player.y+(player.h)/2);

        if(keyIsDown(LEFT_ARROW)) {
            if(player.x > 0) {
                player.x -= 5;
            }
        }
        if(keyIsDown(RIGHT_ARROW)) {
            if(player.x < X_MAX-PLAYER_W) {
                player.x += 5;
            }
        }
    }
}
/** PLAYER METHODS END **/


// GAME RENDERER
function draw() {
    frameRate(60);
    background(CANVAS_BACKGROUND);
    if(!IS_PLAYER_ALIVE || !GAME_STARTED) {
        if(!IS_PLAYER_ALIVE) {
            textSize(20);
            fill("black");
            text("Game Over!", X_MAX - GAME_OVER_TXT.length - 110, 30);
        }
        noLoop();
    }

    textSize(20);
    fill("black");
    text("Level: " + LEVEL, 10, 30);
    textSize(12);
    renderPlayer();

    let now = new Date().getTime();
    aliens.forEach((alien) => {
        renderAlien(alien);
        if(alien.x <= 0) {
            alien.x += ALIEN_SPEED;
            alien.right = true;
        }
        else if(alien.x >= X_MAX-ALIEN_W) {
            alien.x -= ALIEN_SPEED;
            alien.right = false;
        }
        else if(!alien.right) {
            alien.x -= ALIEN_SPEED;
        }
        else {
            alien.x += ALIEN_SPEED;
        }

        if(now - alien.lastShot >= 3000) {
            alienShoot(alien);
        }
    });

    let bulletsToRemove = [];
    let aliensToRemove = [];
    bullets.forEach((bullet, index) => {
        fill(bullet.color);
        rect(bullet.x, bullet.y, bullet.w, bullet.h);
        if(bullet.y >= Y_MAX) {
            bulletsToRemove.push(index);
        }
        // Collision detection
        if(bullet.type === "player") {
            aliens.forEach((alien, aIndex) => {
                let minAx = alien.x;
                let maxAx = alien.x + alien.w;
                let minAy = alien.y;
                let maxAy = alien.y + alien.h;

                let minBx = bullet.x;
                let maxBx = bullet.x + bullet.w;
                let minBy = bullet.y;
                let maxBy = bullet.y + bullet.h;

                aLeftOfB = maxAx < minBx;
                aRightOfB = minAx > maxBx;
                aAboveB = minAy > maxBy;
                aBelowB = maxAy < minBy;

                let collisionDetected = isCollision(minAx, maxAx, minAy, maxAy, minBx, maxBx, minBy, maxBy);
                if(collisionDetected) {
                    alien.health -= 5;
                    if(alien.health <= 0) {
                        aliensToRemove.push(aIndex);
                    }
                }
            });
        }
        if(bullet.type === "alien") {
            let minAx = player.x;
            let maxAx = player.x + player.w;
            let minAy = player.y;
            let maxAy = player.y + player.h;

            let minBx = bullet.x;
            let maxBx = bullet.x + bullet.w;
            let minBy = bullet.y;
            let maxBy = bullet.y + bullet.h;

            aLeftOfB = maxAx < minBx;
            aRightOfB = minAx > maxBx;
            aAboveB = minAy > maxBy;
            aBelowB = maxAy < minBy;

            let collisionDetected = isCollision(minAx, maxAx, minAy, maxAy, minBx, maxBx, minBy, maxBy);
            if(collisionDetected) {
                player.health -= 1;
                IS_PLAYER_ALIVE = player.health > 0;
            }
        }
        bullet.y += bullet.speed;
    });

    bulletsToRemove.forEach((index) => {
        bullets.splice(index, 1);
    });
    aliensToRemove.forEach((index) => {
        aliens.splice(index, 1);
    });

    if(aliens.length === 0) {
        upgradeLevel();
    }
}

function startGame() {
    draw();
}

// PAUSE AND UNPAUSE GAME