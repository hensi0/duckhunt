// ====
// Gun
// ====

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/


// A generic contructor which accepts an arbitrary descriptor object
function Gun(descr) {

    // Common inherited setup logic from Entity
    this.setup(descr);

      
    // Default sprite and scale, if not otherwise specified
    this.sprite = this.sprite || g_sprites.gun;
	this.spriteCross = this.spriteCross || g_sprites.cross;
    this.scale  = this.scale  || 1;

/*
    // Diagnostics to check inheritance stuff
    this._GunProperty = true;
    console.dir(this);
*/

};

Gun.prototype = new Entity();
Gun.prototype.spriteCross;

//shoots tho gun 
Gun.prototype.shoot = function (x,y) {
    //console.log("boom boom á (x,y): (" + x + "," + y + ")");
	if(y < 400){
		entityManager.shootLocation(x,y);
		entityManager.generateParticle(g_mouseX2, g_mouseY2, 0, 0, 0.7, 3, "#bcd9bc", true, false);
	}
};


Gun.prototype.update = function (du) {

    // TODO: YOUR STUFF HERE! --- Unregister and check for death
	// spatialManager.unregister(this);
	this.cx = g_mouseX;//+this.sprite.width/2;
	this.cy = g_mouseY+this.sprite.height/2;
    
	
    // TODO: YOUR STUFF HERE! --- (Re-)Register
	// spatialManager.register(this);
	
};

Gun.prototype.getRadius = function () {
    return 0;
};


Gun.prototype.render = function (ctx) {
	var origScale = this.sprite.scale;
    // pass my scale into the sprite, for drawing
    this.sprite.scale = this.scale;
	var X;
	var Y;
	if(g_mouseLocked){
		X = g_mouseX2;
		Y = g_mouseY2;
	} else {
		X = g_mouseX;
		Y = g_mouseY;
	}
	if(Y < 470)
		this.spriteCross.drawCentredAt(
			ctx, X, Y, 0
		);
	else
		ctx.fillRect(
			 X-5, Y-5, 10, 10
		);
		
	this.rotation = -Math.atan((600-Y)/X) + 110/180;
	if(this.rotation < -1) this.rotation = -1;
	if(this.rotation > 0.2) this.rotation = 0.2;
	
    this.sprite.drawCentredAt(
        ctx, 120, 500, this.rotation
    );

};
