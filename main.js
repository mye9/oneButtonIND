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

    PLAYERJUMPCOOLDOWN: 1
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



function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}

// The game loop function
async function update() {
    // The init function running at startup
	if (!ticks) {
        // A CrispGameLib function
        // First argument (number): number of times to run the second argument
        // Second argument (function): a function that returns an object. This
        // object is then added to an array. This array will eventually be
        // returned as output of the times() function.
		blocks = times(100, () => {
            // Random number generator function
            // rnd( min, max )
            const posX = rnd(0, G.WIDTH);
            const posY = rnd(0, G.HEIGHT);
            // An object of type Star with appropriate properties
            return {
                // Creates a Vector
                pos: vec(posX, posY),
                // More RNG
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

	}

    // Update for Star
    blocks.forEach((s) => {
        // Move the star downwards
        s.pos.y += s.speed;
        // Bring the star back to top once it's past the bottom of the screen
        if (s.pos.y > G.HEIGHT) s.pos.y = 0;

        // Choose a color to draw
        color("light_black");
        // Draw the star as a square of size 1
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

    //   if (input.isJustReleased == true){
    //     player.pos.y = player.pos.y + 10;
    //   }

    //   player.pos.clamp(0, G.WIDTH, 0, G.HEIGHT);


      color ("black")

      rect(bottomBlocks.pos, G.WIDTH, G.BOTTOMBLOCKHEIGHT);
}