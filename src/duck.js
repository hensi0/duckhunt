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
	
	this.animations = makeBirdAnimation(this._scale);
	
	this.spawn();
    this.rememberResets();

    // Default sprite, if not otherwise specified
    this.sprite = this.sprite || g_sprites.rock;
	
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
Duck.prototype.cx = Math.random()*600;
Duck.prototype.cy = 600 + Math.random()* 50;
Duck.prototype.velX = 0;
Duck.prototype.velY = 0;
Duck.prototype.flightTimer = 100;
Duck.prototype.lives = 1;
Duck.prototype.type = 'normal';
Duck.prototype.spawnSpawnsTimer = 100;

// HACKED-IN AUDIO (no preloading)
//Duck.prototype.warpSound = new Audio("sounds/DuckWarp.ogg");

Duck.prototype.spawn = function () {
    this.randType();
	this.configAnimation();
    this.randomiseFlight();
    this.setLives();
    this.maxhp = this.lives;
};

Duck.prototype.configAnimation = function () {
	
    if(this.type === 'normal') this.animation = this.animations['normal'];
	if(this.type === 'speedy') this.animation = this.animations['speedy'];
	if(this.type === 'heavy') this.animation = this.animations['heavy'];
	if(this.type === 'speedySwitch') this.animation = this.animations['speedyswitch'];
	if(this.type === 'superPack') this.animation = this.animations['superpack'];
	
};

Duck.prototype.randType = function (){
    var lvl = entityManager._level;
    var typechooser = Math.random();
    if(typechooser<0.5){
        this.type = 'normal';
    }else if(typechooser<0.6 && lvl>5){
        this.type = 'speedy';
    }else if(typechooser<0.7 && lvl>5){
        this.type = 'heavy';
    }else if(typechooser<0.8 && lvl>5){
        this.type = 'speedySwitch';
    }else if(typechooser<0.9 && lvl>10){
        this.type = 'superPack';
    }else{
        this.type = 'normal';
    }
};

    
Duck.prototype.update = function (du) {

    //if(Math.abs(this.cy - this.reset_cy) > 50) this.velY *= -1;
    if(this.cx<0||this.cx>canvas.width){
        this.velX *= -1;
    }

    if(this.cy+(this.getRadius()*2)<0){
        entityManager.duckEscape();
        this._isDeadNow = true;
    }

    if(this._isDeadNow) return entityManager.KILL_ME_NOW;

	this.cx += this.velX;
	this.cy += this.velY;

    this.flightTimer-=du;
    this.spawnSpawnsTimer-=du;
    if(this.type === 'superPack' && this.spawnSpawnsTimer<0){
        this.spawnSpawns();
        this.spawnSpawnsTimer = 50+Math.random()*150;
    }
    if(this.flightTimer<0){
        this.flightTimer = 50+Math.random()*200;
        this.randomiseFlight();
    }
	
	this.animation.update(du);

};


Duck.prototype.scanForHit = function (x,y, dmg) {
    if(Math.abs(this.cx - x) <  this.getRadius() &&  Math.abs(this.cy - y) <  this.getRadius()){
		this.takeBulletHit(dmg);
		return true;
	} else return false;
};




Duck.prototype.getRadius = function () {
    return (this.sprite.width)/2;
};

Duck.prototype.takeBulletHit = function (dmg) {
    this.lives -= dmg;
    if(this.lives === 0) {
        console.log("die "+this.type);
        entityManager._ducksKilled++;
        this._isDeadNow = true;
        if(this.type === 'normal'){
            entityManager._score[0].addScore(1);
        }else if(this.type === 'speedy'){
            entityManager._score[0].addScore(2);
        }else if(this.type === 'heavy'){
            entityManager._score[0].addScore(5);
        }else if(this.type === 'speedySwitch'){
            entityManager._score[0].addScore(2);
        }else if(this.type === 'superPack'){
            entityManager._score[0].addScore(10);
        }
    }
};

Duck.prototype.reset = function () {
    this.setPos(this.reset_cx, this.reset_cy);
    this.rotation = this.reset_rotation;
    
};

Duck.prototype.drawHealthBar = function (ctx, X, Y) {
    ctx.beginPath();
    ctx.moveTo(X-25, Y-30);
    ctx.strokeStyle = "red";
    ctx.lineWidth = "5";
    ctx.lineTo(X+25, Y-30);
    ctx.stroke();
    ctx.beginPath();
    var n = this.lives/this.maxhp;
    ctx.moveTo(X-25, Y-30);
    ctx.strokeStyle = "green";
    ctx.lineWidth = "5";
    ctx.lineTo(X-25+(50*n), Y-30);
    ctx.stroke();
}


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
	//animation
<<<<<<< HEAD
	*/
    this.drawHealthBar(ctx, this.cx, this.cy-10);
    this.animation.renderAt(ctx, this.cx, this.cy, this.rotation);
};

Duck.prototype.setLives = function() {
    if(this.type === 'heavy'){
        this.lives = 5;
    }else if(this.type === 'superPack'){
        this.lives = 5;
    }else{
        this.lives = 1;
    }
};


Duck.prototype.randomiseFlight = function () {
    var side = 1 - (Math.floor(0.5 + Math.random())*2);
    if(this.type === 'speedy'){
        this.velY = (Math.random() * -0.5 - 1)*1.5;
        this.velX = (-side*Math.random() - side)*3;
    }else{
        this.velY = Math.random() * -0.5 - 1;
        this.velX = (-side*Math.random() - side)*2;
    }
};

Duck.prototype.spawnSpawns = function () {
    entityManager.generateDuck({cx: this.cx, cy:this.cy+20});
}