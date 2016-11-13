/*

entityManager.js

A module which handles arbitrary entity-management for "Asteroids"


We create this module as a single global object, and initialise it
with suitable 'data' and 'methods'.

"Private" properties are denoted by an underscore prefix convention.

*/


"use strict";


// Tell jslint not to complain about my use of underscore prefixes (nomen),
// my flattening of some indentation (white), or my use of incr/decr ops 
// (plusplus).
//
/*jslint nomen: true, white: true, plusplus: true*/


var entityManager = {

// "PRIVATE" DATA
_ducks   : [],
_gun : [],
_rocks   : [],
_bullets : [],
_ships   : [],
_score	 : [],

_bShowRocks : true,
_level : 1,
_ducksKilled : 0,
_spawnTimer : 0,
_playerLives : 5,
_yolo: false,

// "PRIVATE" METHODS


_generateDucks : function() {
    var i,
        NUM_DUCKS = Math.round(Math.random()*3);

    for (i = 0; i < NUM_DUCKS; ++i) {
        this.generateDuck();
    }
},

_duckEscape : function() {
    this._playerLives--;

},


_generateGun : function(descr) {
    console.log("generating the gun")
    this._gun.push(new Gun(descr));
},

_findNearestShip : function(posX, posY) {
    var closestShip = null,
        closestIndex = -1,
        closestSq = 1000 * 1000;

    for (var i = 0; i < this._ships.length; ++i) {

        var thisShip = this._ships[i];
        var shipPos = thisShip.getPos();
        var distSq = util.wrappedDistSq(
            shipPos.posX, shipPos.posY, 
            posX, posY,
            g_canvas.width, g_canvas.height);

        if (distSq < closestSq) {
            closestShip = thisShip;
            closestIndex = i;
            closestSq = distSq;
        }
    }
    return {
        theShip : closestShip,
        theIndex: closestIndex
    };
},

_forEachOf: function(aCategory, fn) {
    for (var i = 0; i < aCategory.length; ++i) {
        fn.call(aCategory[i]);
    }
},

// PUBLIC METHODS

// A special return value, used by other objects,
// to request the blessed release of death!
//
KILL_ME_NOW : -1,

// Some things must be deferred until after initial construction
// i.e. thing which need `this` to be defined.
//
deferredSetup : function () {
    this._categories = [this._rocks, this._bullets, this._ships, this._ducks, this._gun];
},

init: function() {
	console.log("init EM");
    this._generateDucks();
	this._generateGun();
	this._score.push(new Score());
    //this._generateShip();
},

fireBullet: function(cx, cy, velX, velY, rotation) {
    this._bullets.push(new Bullet({
        cx   : cx,
        cy   : cy,
        velX : velX,
        velY : velY,

        rotation : rotation
    }));
},


generateDuck : function(descr) {
	console.log("generating duck")
    this._ducks.push(new Duck(descr));
},

generateRock : function(descr) {
    //this._ducks.push(new Duck(descr));
},

generateShip : function(descr) {
    //this._ships.push(new Ship(descr));
},

killNearestShip : function(xPos, yPos) {
    var theShip = this._findNearestShip(xPos, yPos).theShip;
    if (theShip) {
        theShip.kill();
    }
},

yoinkNearestShip : function(xPos, yPos) {
    var theShip = this._findNearestShip(xPos, yPos).theShip;
    if (theShip) {
        theShip.setPos(xPos, yPos);
    }
},

resetShips: function() {
    this._forEachOf(this._ships, Ship.prototype.reset);
},

haltShips: function() {
    this._forEachOf(this._ships, Ship.prototype.halt);
},	

toggleRocks: function() {
    this._bShowRocks = !this._bShowRocks;
},

shootLocation: function(x,y) {
    for( var i = 0 ; i < this._ducks.length ; i++){
		if(this._ducks[i].scanForHit(x,y)) return;
	}
},

duckEscape: function() {
   this._playerLives--;
},

update: function(du) {
    for (var c = 0; c < this._categories.length; ++c) {

        var aCategory = this._categories[c];
        var i = 0;

        while (i < aCategory.length) {

            var status = aCategory[i].update(du);

            if (status === this.KILL_ME_NOW) {
                // remove the dead guy, and shuffle the others down to
                // prevent a confusing gap from appearing in the array
                aCategory.splice(i,1);
                if(this._ducksKilled === this.level * 10){
                    this._level++;
                    this._playerLives++;
                }
            }
            else {
                ++i;
            }

        }
        if(this._playerLives === 0 && this._yolo === false){
            this._yolo = true;
            window.alert("Game over \n Your score:"+" "+this._score[0].score);
            location.reload();
        }
    }
	
	this._gun[0].update();
    this._score[0].update();
	
    if (this._ducks.length === 0||this._spawnTimer < 0)
    {
        this._generateDucks();
        this._spawnTimer = 1000-this._level*this._level;
    }

},

render: function(ctx) {

    var debugX = 10, debugY = 100;
	
	g_sprites.BG3.drawCentredAt(
        ctx, 300, 300, 0
	);
	g_sprites.BG2.drawCentredAt(
        ctx, 300, 300, 0
	);

    for (var c = 0; c < this._categories.length; ++c) {

        var aCategory = this._categories[c];

        if (!this._bShowRocks && 
            aCategory == this._rocks)
            continue;

        for (var i = 0; i < aCategory.length; ++i) {

            aCategory[i].render(ctx);
            //debug.text(".", debugX + i * 10, debugY);

        }
        debugY += 10;
    }
	
	g_sprites.BG1.drawCentredAt(
        ctx, 300, 300, 0
	);
	this._gun[0].render(ctx);
	this._score[0].render(ctx);
}

}

// Some deferred setup which needs the object to have been created first
entityManager.deferredSetup();

