// The title of the game to be displayed on the title screen
title = "GOLD CATCHING";

// The description, which is also displayed on the title screen
description = `CATCHING 
YELLOW/CYAN BLOCKS 
AND AVOID RED BLOCKS
`;

// The array of custom sprites
characters = [];

// Game design variable container
const G = {
	WIDTH: 200,
	HEIGHT: 150,

    BLOCK_SPEED_MIN: 0.2,
	BLOCK_SPEED_MAX: 0.2,
    
    BOTTOMBLOCKHEIGHT: 30,
    BOTTOMBLOCKSTARTHEIGHT: 120,

    PLAYERJUMPCOOLDOWN: 1,
    PLAYERBASESPEED: 0.7,
    PLAYERUPSPEED: 1.2,

    ENEMIESBASESPEED: 1.0,
    ENEMIESUPSPEED: 1.5,
    ENEMIESHEIGHT: 95
};

// Game runtime options
// Refer to the official documentation for all available options
options = {
	viewSize: {x: G.WIDTH, y: G.HEIGHT},
    isCapturing: true,
    isCapturingGameCanvasOnly: true,
    isReplayEnabled: true,
    captureCanvasScale: 2,
    isPlayingBgm: true,
    seed: 7777
};

// JSDoc comments for typing
/**
 * @typedef {{
 * pos: Vector,
 * speed: number
 * }} Block
 */

/**
 * @type { Block [] }
 */
let blocks;

/**
 * @typedef {{
 * pos: Vector,
 * }} BottomBlock
 */

/**
 * @type { BottomBlock }
 */   
let bottomBlocks;



/**
 * @typedef {{
 * pos: Vector,
 * speed: number
 * jumptime: number
 * }} Player
 */

/**
 * @type { Player }
 */
let player;


/**
 * @typedef {{
 * pos: Vector,
 * }} Enemy
 */

/**
 * @type { Enemy [] }
 */
let enemies;


/**
 * @type { number }
 */
 let currentEnemySpeed;

 /**
  * @type { number }
  */
 let currentGoldSpeed;


/**
 * @typedef {{
 * pos: Vector,
 * }} Gold
 */

/**
 * @type { Gold [] }
 */
let golds;

/**
 * @typedef {{
 * pos: Vector,
 * }} HighValueGold
 */

/**
 * @type { Gold [] }
 */
let highValueGolds;

/**
 * @typedef {{
 * pos: Vector,
 * }} HiddenGold
 */

/**
 * @type { Gold [] }
 */
let hiddenGolds;



function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}

async function update() {
	if (!ticks) {

		blocks = times(100, () => {

            const posX = rnd(0, G.WIDTH);
            const posY = rnd(0, G.HEIGHT);

            return {

                pos: vec(posX, posY),
                speed: G.BLOCK_SPEED_MIN
            };
        });

		player =  {
			pos: vec(3, G.BOTTOMBLOCKSTARTHEIGHT - 3),
            speed: rnd(G.PLAYERBASESPEED, G.PLAYERUPSPEED) * difficulty,
            jumptime: G.PLAYERJUMPCOOLDOWN
		};

        bottomBlocks =  {
			pos: vec(0, G.BOTTOMBLOCKSTARTHEIGHT)
		};

        enemies = [];
        golds = [];
        highValueGolds = [];
        hiddenGolds = [];

	}

    blocks.forEach((s) => {
        s.pos.y += s.speed;
        if (s.pos.y > G.HEIGHT) s.pos.y = 0;

        color("light_black");
        box(s.pos, 1);
    });

	color("green");
    box(player.pos, 6);

    player.pos.x += player.speed;
    if (player.pos.x + 3 > G.WIDTH){
        player.pos.x = 0;
    }

    if (input.isPressed == true){
        player.pos.y = player.pos.y - 10;
        await delay(50);
        player.pos.y = player.pos.y + 10;

    }



    color ("black")

    rect(bottomBlocks.pos, G.WIDTH, G.BOTTOMBLOCKHEIGHT);

    if (enemies.length === 0) {
        currentEnemySpeed =
            rnd(G.ENEMY_MIN_BASE_SPEED, G.ENEMY_MAX_BASE_SPEED) * difficulty;
        for (let i = 0; i < 7; i++) {
            const posX = rnd(0, G.WIDTH);
            const posY = G.ENEMIESHEIGHT;
            enemies.push({ pos: vec(posX, posY) })
        }
    }

    if (golds.length === 0) {
        currentGoldSpeed =
            rnd(0.1, 0.5) * difficulty;
        for (let i = 0; i < 5; i++) {
            const posX = rnd(0, G.WIDTH);
            const posY = G.ENEMIESHEIGHT;
            golds.push({ pos: vec(posX, posY) })
        }
    }

    if (hiddenGolds.length === 0) {

        const posX = rnd(0, G.WIDTH);
        const posY = G.ENEMIESHEIGHT;
        hiddenGolds.push({ pos: vec(posX, posY) })
    }


    if (highValueGolds.length === 0) {

        const posX = rnd(0, G.WIDTH);
        const posY = G.ENEMIESHEIGHT;
        highValueGolds.push({ pos: vec(posX, posY) })
    }
      
    remove(enemies, (e) => {
        e.pos.x += currentEnemySpeed;
        color("red");
        box(e.pos, 5);

        const isCollidingWithEnemies = box(e.pos, 5).isColliding.rect.green;
        if(isCollidingWithEnemies){
            color ("red");
            particle(e.pos);
            play ("hit");
            end();
        }

        return (e.pos.x > G.WIDTH);
    });


    remove(golds, (g) => {
        g.pos.x += currentGoldSpeed;
        color("yellow");
        box(g.pos, 5);

        const isCollidingWithGold = box(g.pos, 5).isColliding.rect.green;
        if(isCollidingWithGold){
            color("yellow");
            particle (g.pos);
            addScore(1, g.pos);
            play("coin");
        }

        return (g.pos.x > G.WIDTH || isCollidingWithGold);
    });


    remove(hiddenGolds, (hg) => {
        hg.pos.x += currentGoldSpeed;
        color("yellow");
        box(hg.pos, 5);

        const isCollidingWithHiddenGold = box(hg.pos, 5).isColliding.rect.green;
        if(isCollidingWithHiddenGold){
            color("yellow");
            particle (hg.pos);
            addScore(5, hg.pos);
            play("coin");
        }

        return (hg.pos.x > G.WIDTH || isCollidingWithHiddenGold);
    });

    remove(highValueGolds, (vg) => {
        vg.pos.x += 4.0;
        color("cyan");
        box(vg.pos, 5);

        const isCollidingWithHighValueGold = box(vg.pos, 5).isColliding.rect.green;
        if(isCollidingWithHighValueGold){
            color("cyan");
            particle (vg.pos);
            addScore(10, vg.pos);
            play("lucky");
        }

        return (vg.pos.x > G.WIDTH || isCollidingWithHighValueGold);
    });

}