

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

var g_canvas = document.getElementById("myCanvas");
var g_ctx = g_canvas.getContext("2d");

// =============
// GATHER INPUTS
// =============

function gatherInputs() {
    // Nothing to do here!
    // The event handlers do everything we need for now.
}


// =================
// UPDATE SIMULATION
// =================

// We take a very layered approach here...
//
// The primary `update` routine handles generic stuff such as
// pausing, single-step, and time-handling.
//
// It then delegates the game-specific logic to `updateSimulation`


// GAME-SPECIFIC UPDATE LOGIC

function updateSimulation(du) {
    
    processDiagnostics();
    
    entityManager.update(du);

}

// GAME-SPECIFIC DIAGNOSTICS

var g_allowMixedActions = true;
var g_useGravity = false;
var g_useAveVel = true;
var g_renderSpatialDebug = false;

var KEY_MIXED   = keyCode('M');;
var KEY_GRAVITY = keyCode('G');
var KEY_AVE_VEL = keyCode('V');
var KEY_SPATIAL = keyCode('X');

var KEY_HALT  = keyCode('H');
var KEY_RESET = keyCode('R');

var KEY_0 = keyCode('0');

var KEY_1 = keyCode('1');
var KEY_2 = keyCode('2');

var KEY_K = keyCode('K');

function processDiagnostics() {

    if (eatKey(KEY_MIXED))
        g_allowMixedActions = !g_allowMixedActions;

    if (eatKey(KEY_GRAVITY)) g_useGravity = !g_useGravity;

    if (eatKey(KEY_AVE_VEL)) g_useAveVel = !g_useAveVel;

    if (eatKey(KEY_SPATIAL)) g_renderSpatialDebug = !g_renderSpatialDebug;
	
	/*
    if (eatKey(KEY_HALT)) entityManager.haltShips();

    if (eatKey(KEY_RESET)) entityManager.resetShips();

    if (eatKey(KEY_0)) entityManager.toggleRocks();

    if (eatKey(KEY_1)) entityManager.generateShip({
        cx : g_mouseX,
        cy : g_mouseY,
        
        sprite : g_sprites.ship});

    if (eatKey(KEY_2)) entityManager.generateShip({
        cx : g_mouseX,
        cy : g_mouseY,
        
        sprite : g_sprites.ship2
        });

    if (eatKey(KEY_K)) entityManager.killNearestShip(
        g_mouseX, g_mouseY);
		*/
}


// =================
// RENDER SIMULATION
// =================

// We take a very layered approach here...
//
// The primary `render` routine handles generic stuff such as
// the diagnostic toggles (including screen-clearing).
//
// It then delegates the game-specific logic to `gameRender`


// GAME-SPECIFIC RENDERING

function renderSimulation(ctx) {
	

	
    entityManager.render(ctx);


	
    if (g_renderSpatialDebug) spatialManager.render(ctx);
}


// =============
// PRELOAD STUFF
// =============

var g_images = {};

function requestPreloads() {

    var requiredImages = {
        ship   	: "https://notendur.hi.is/~pk/308G/images/ship.png",
        ship2  	: "https://notendur.hi.is/~pk/308G/images/ship_2.png",
        rock   	: "res/images/bird.png",
		gun   	: "res/images/gun.png",
		cross   : "res/images/cross.png",
		SGshell : "res/images/SGshell.png",
		Pshell  : "res/images/PistShell.png",
		lives   : "res/images/lives.png",
		nolives   : "res/images/nolives.png",
		BG   	: "res/images/BG.png",
		scorebox: "res/images/scorebox.png",
		lvlbox: "res/images/lvlbox.png",


		BG1   	: "res/images/BG1.png",
		BG2  	: "res/images/BG2.png",
		BG3   	: "res/images/BG3.png"
		
    };

    imagesPreload(requiredImages, g_images, preloadDone);
}

function makeBirdAnimation(scale) {
    var bird = {};
	//animation variables:  (image, y-startlocation, height, width, numberOfFrames, time between frames, scale)
    bird.animation = new Animation(g_images.BG,0,50,50,10,300, scale);
	
    return bird;
};


var g_sprites = {};

function preloadDone() {

    g_sprites.ship  = new Sprite(g_images.ship);
    g_sprites.ship2 = new Sprite(g_images.ship2);
    g_sprites.rock  = new Sprite(g_images.rock);
	g_sprites.gun  = new Sprite(g_images.gun);
	g_sprites.cross  = new Sprite(g_images.cross);
	g_sprites.lives  = new Sprite(g_images.lives);
	g_sprites.nolives  = new Sprite(g_images.nolives);
	g_sprites.SGshell  = new Sprite(g_images.SGshell);
	g_sprites.Pshell  = new Sprite(g_images.Pshell);
	g_sprites.BG  = new Sprite(g_images.BG);

	g_sprites.scorebox  = new Sprite(g_images.scorebox);
	g_sprites.lvlbox = new Sprite(g_images.lvlbox);


	g_sprites.BG1  = new Sprite(g_images.BG1);
	g_sprites.BG2  = new Sprite(g_images.BG2);
	g_sprites.BG3  = new Sprite(g_images.BG3);

	
    g_sprites.bullet = new Sprite(g_images.ship);
    g_sprites.bullet.scale = 0.25;

    entityManager.init();

    main.init();
}


// Kick it off
requestPreloads();