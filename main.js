// The title of the game to be displayed on the title screen
title = "GOLD CATCHING";

// The description, which is also displayed on the title screen
description = `
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

    ENEMIESBASESPEED: 1.0,
    ENEMIESUPSPEED: 1.5
};

// Game runtime options
// Refer to the official documentation for all available options
options = {
	viewSize: {x: G.WIDTH, y: G.HEIGHT},
    isCapturing: true,
    isCapturingGameCanvasOnly: true,
    captureCanvasScale: 2
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
 let waveCount;

/**
 * @typedef {{
 * pos: Vector,
 * }} Gold
 */

/**
 * @type { Gold [] }
 */
let golds;
 


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
            speed: 1.0,
            jumptime: G.PLAYERJUMPCOOLDOWN
		};

        bottomBlocks =  {
			pos: vec(0, G.BOTTOMBLOCKSTARTHEIGHT)
		};

        enemies = [];

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
        player.pos.y = player.pos.y - 5;
        await delay(50);
        player.pos.y = player.pos.y + 5;

    }



    color ("black")

    rect(bottomBlocks.pos, G.WIDTH, G.BOTTOMBLOCKHEIGHT);

    if (enemies.length === 0) {
        currentEnemySpeed =
            rnd(G.ENEMY_MIN_BASE_SPEED, G.ENEMY_MAX_BASE_SPEED) * difficulty;
        for (let i = 0; i < 9; i++) {
            const posX = rnd(0, G.WIDTH);
            const posY = 100;
            enemies.push({ pos: vec(posX, posY) })
        }
    }
      
    remove(enemies, (e) => {
        e.pos.x += currentEnemySpeed;
        color("red");
        box(e.pos, 5);

        return (e.pos.x > G.WIDTH);
    });
}