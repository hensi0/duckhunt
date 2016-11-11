// ==========
// Duck STUFF
// ==========

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/


// A generic contructor which accepts an arbitrary descriptor object
function Duck(descr) {

    // Common inherited setup logic from Entity
    this.setup(descr);
	this.spawn();
    this.rememberResets();
    
    // Default sprite, if not otherwise specified
    this.sprite = this.sprite || g_sprites.rock;
    
	if(typeof makeBirdAnimation == 'function') {
		this.animations = makeBirdAnimation(this._scale);
		this.animation = this.animations['animation'];
	}
    // Set normal drawing scale, and warp state off
    this._scale = 1;
};

Duck.prototype = new Entity();

Duck.prototype.rememberResets = function () {
    // Remember my reset positions
    this.reset_cx = this.cx;
    this.reset_cy = this.cy;
    this.reset_rotation = this.rotation;
};

// Initial, inheritable, default values
Duck.prototype.rotation = 0;
Duck.prototype.cx = 200;
Duck.prototype.cy = 200;
Duck.prototype.velX = 0;
Duck.prototype.velY = 0;
Duck.prototype.launchVel = 2;
Duck.prototype.numSubSteps = 1;
Duck.prototype.flightTimer = 100;

// HACKED-IN AUDIO (no preloading)
//Duck.prototype.warpSound = new Audio("sounds/DuckWarp.ogg");

Duck.prototype.spawn = function () {
	var side = 1 - (Math.random()*Math.floor(0.5 + 1));
	this.cx = Math.random()*600;
	this.cy = 600 + Math.random()* 50;
	this.velY = Math.random() *- 0.5 - 2;
	this.velX = (-side*Math.random() - side)*2;
};
    
Duck.prototype.update = function (du) {

    //if(Math.abs(this.cy - this.reset_cy) > 50) this.velY *= -1;
    if(this.cx<0||this.cx>canvas.width){
        this.velX *= -1;
    }

    if(this.cy<0){
        this._isDeadNow = true;
    }

    if(this._isDeadNow) return entityManager.KILL_ME_NOW;

	this.cx += this.velX;
	this.cy += this.velY;

    this.flightTimer-=du;
    if(this.flightTimer<0){
        this.flightTimer = 1000;
        this.randomiseFlight();
    }
	
	this.animation.update(du);

};


Duck.prototype.scanForHit = function (x,y) {
    if(Math.abs(this.cx - x) <  this.getRadius() &&  Math.abs(this.cy - y) <  this.getRadius()){
		this.takeBulletHit();
		return true;
	} else return false;
};




Duck.prototype.getRadius = function () {
    return (this.sprite.width)/2 * 0.8;
};

Duck.prototype.takeBulletHit = function () {
    this._isDeadNow = true;
};

Duck.prototype.reset = function () {
    this.setPos(this.reset_cx, this.reset_cy);
    this.rotation = this.reset_rotation;
    
};


var NOMINAL_ROTATE_RATE = 0.1;


Duck.prototype.render = function (ctx) {
    //sprite 
	/*
	var origScale = this.sprite.scale;
    // pass my scale into the sprite, for drawing
    this.sprite.scale = this._scale;
    this.sprite.drawCentredAt(
	ctx, this.cx, this.cy, this.rotation
    );
    this.sprite.scale = origScale;
	*/
	//animation
	
	 this.animation.renderAt(ctx, this.cx, this.cy, this.rotation);
};


Duck.prototype.randomiseFlight = function () {
    var side = 1 - (Math.floor(0.5 + Math.random())*2);

    this.velY = Math.random()*-1;
    this.velX = (-side*Math.random() - side);
};
