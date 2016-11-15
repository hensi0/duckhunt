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
_particles: [],
_score	 : [],


_level : 1,
_selectedGun : 0,
_ducksKilled : 0,
_spawnTimer : 0,
_playerLives : 5,
_yolo: false,

// "PRIVATE" METHODS


_generateDucks : function() {
    var i,
        NUM_DUCKS = Math.round(Math.random()*3+(this._level/5));

    for (i = 0; i < NUM_DUCKS; ++i) {
        this.generateDuck();
    }
},


_generateGun : function(descr) {
    console.log("generating the gun")
    this._gun.push(new Gun(descr));
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
    this._categories = [this._ducks, this._particles];
},

init: function() {
	console.log("init EM");
    this._generateDucks();
	//pistol
	this._generateGun(({
			reloadTimer:25,
			reloadTime:	25,
			maxAmmo:	6,
			ammoType:	'rounds',
			ammo: 		0
	}));
	this._generateGun(({
			reloadTimer:100,
			reloadTime:	100,
			maxAmmo:	20,
			ammoType:	'uzirounds',
			shootingTimer: 7,
			ammo: 		0
	}));
	this._generateGun(({
			reloadTimer:80,
			reloadTime:	80,
			maxAmmo:	4,
			ammoType:	'shells',
			ammo: 		0
	}));
	this._score.push(new Score());
},

generateParticle : function(x,y,angle,avgVel,maxAlpha,maxR,fillStyle, bool, bool2){
	if(bool2) var r = Math.random()*maxR;
	else var r = maxR;
	var vel = avgVel + (0.5*avgVel - Math.random()*avgVel); // +- 50% velocity from avgVel
	var alpha = maxAlpha;
	var particle = new Particle({
		cx: x,
		cy: y,
		r: r,
		angle: angle,
		vel: vel,
		style: fillStyle,
		alpha: alpha,
		fade: bool,
		shrink: bool2
	});
    this._particles.push(particle);
},

generateDuck : function(descr) {
    this._ducks.push(new Duck(descr));
},


shootLocation: function(x,y, dmg) {
    for( var i = 0 ; i < this._ducks.length ; i++){
		if(this._ducks[i].scanForHit(x,y, dmg)) return;
	}
},

duckEscape: function() {
   this._playerLives--;
},

select_pistol : '1'.charCodeAt(0),
select_uzi : '2'.charCodeAt(0),
select_shotgun : '3'.charCodeAt(0),
reload : 'R'.charCodeAt(0),

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
                if(this._ducksKilled >= this._level * 10){
                    this._level++;
                    if(this._playerLives<5){
                        this._playerLives++;
                    }
                    this._ducksKilled = 0;
                }
            }
            else {
                ++i;
            }

        }
        if(this._playerLives === 0 && this._yolo === false){
            this._yolo = true;
            window.alert("Game over \n Your score:"+" "+this._score[0].score);
        }
    }
	
	if (eatKey(this.select_pistol)) this._selectedGun = 0;
	if (eatKey(this.select_uzi)) this._selectedGun = 1;
	if (eatKey(this.select_shotgun)) this._selectedGun = 2;
	if (eatKey(this.reload)) this._gun[this._selectedGun].reload();
	
	this._gun[this._selectedGun].update(du);
    this._score[0].update(du);
	
    if (this._ducks.length === 0||this._spawnTimer < 0)
    {
        this._generateDucks();
        this._spawnTimer = 200-this._level*this._level;
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


        for (var i = 0; i < aCategory.length; ++i) {

            aCategory[i].render(ctx);
            //debug.text(".", debugX + i * 10, debugY);

        }
        debugY += 10;
    }
	
	g_sprites.BG1.drawCentredAt(
        ctx, 300, 300, 0
	);
	this._gun[this._selectedGun].render(ctx);
	this._score[0].render(ctx);
}

}

// Some deferred setup which needs the object to have been created first
entityManager.deferredSetup();

