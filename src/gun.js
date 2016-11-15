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
	this.spriteSGshell = this.spriteSGshell || g_sprites.SGshell;
	this.spritePshell = this.spritePistolShell || g_sprites.Pshell;
    this.scale  = this.scale  || 1;

/*
    // Diagnostics to check inheritance stuff
    this._GunProperty = true;
    console.dir(this);
*/

};

Gun.prototype = new Entity();
Gun.prototype.spriteCross;
Gun.prototype.spriteSGshell;
Gun.prototype.spritePshell;
Gun.prototype.reloadTime;
Gun.prototype.reloadTimer;
Gun.prototype.maxAmmo;
Gun.prototype.ammoType;
Gun.prototype.ammo;
Gun.prototype.shooting = false;
Gun.prototype.shootingTimer;


//shoots tho gun 
Gun.prototype.shoot = function (x,y) {
    //console.log("boom boom á (x,y): (" + x + "," + y + ")");
	if(y < 400 && this.ammo > 0){
		if(this.ammoType === 'rounds'){
			this.shot(x,y, 1);
			this.ammo--;
		} else if(this.ammoType === 'uzirounds'){
			this.shooting = true;
			this.shot(x,y, 1);
			this.ammo--;
		} else if(this.ammoType === 'shells'){
			for(var i = 0; i < 15; i++){
					var X = x + Math.random()*40 - 20;
					var Y = y + Math.random()*40 - 20;
				this.shot(X,Y, 0.5);
			}
				
			this.ammo--;
		}
	}
};

Gun.prototype.shot = function (x,y, dmg) {
		entityManager.shootLocation(x,y, dmg);
		entityManager.generateParticle(x, y, 0, 0, 0.7, 3, "#bcd9bc", true, false);
};

Gun.prototype.stopShooting = function () {
		this.shooting = false;
};

Gun.prototype.update = function (du) {

    // TODO: YOUR STUFF HERE! --- Unregister and check for death
	// spatialManager.unregister(this);
	//this.cx = g_mouseX;//+this.sprite.width/2;
	//this.cy = g_mouseY+this.sprite.height/2;

    if(this.shooting){
		if(this.shootingTimer < 0){
			this.shoot(g_mouseX2, g_mouseY2);
			this.shootingTimer = 7;
		} else this.shootingTimer -= du;
	}		
	if(this.ammo <= 0) this.reload(du);
	
    // TODO: YOUR STUFF HERE! --- (Re-)Register
	// spatialManager.register(this);
	
};

Gun.prototype.reload = function () {
    this.reloadTimer--;
	this.ammo = 0;
	if(this.reloadTimer < 0){
		this.reloadTimer = this.reloadTime; 
		this.ammo = this.maxAmmo;
	}
};

Gun.prototype.getRadius = function () {
    return 0;
};
// Render stuff



Gun.prototype.drawAmmo = function (ctx, X, Y) {
    var gradur = 0;
	var x;
	var y;
	for(var i = 0; i < this.maxAmmo; i++){
		if((i+1) > this.ammo) return;
		gradur += (Math.PI*2)/this.maxAmmo;
		x = Math.cos(gradur)*25;
		y = Math.sin(gradur)*25;
		if(this.ammoType === 'rounds' || this.ammoType === 'uzirounds')
			this.spritePshell.drawCentredAt(
				ctx, X + x, Y - y, 0
			);
		else if (this.ammoType === 'shells')
			this.spriteSGshell.drawCentredAt(
				ctx, X + x, Y - y, 0
			);
		else console.log("ammo-type: " + this.ammoType + " not found");
	}	
};

Gun.prototype.drawCross = function (ctx, X, Y) {
    
	if(Y < 470){
		this.spriteCross.drawCentredAt(
			ctx, X, Y, 0
		);
		
		this.drawAmmo(ctx, X, Y);
	} else
		ctx.fillRect(
			 X-5, Y-5, 10, 10
		);
	if(this.ammo <= 0){
		ctx.beginPath();
		ctx.strokeStyle = "white";
		ctx.lineWidth = 2;
    	ctx.arc(X, Y, 20, 0, (this.reloadTimer/this.reloadTime)*(Math.PI*2));
		ctx.stroke();
	}
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
	
	this.drawCross(ctx, X, Y);
	this.rotation = -Math.atan((600-Y)/X) + 110/180;
	if(this.rotation < -1) this.rotation = -1;
	if(this.rotation > 0.2) this.rotation = 0.2;
	
    this.sprite.drawCentredAt(
        ctx, 120, 500, this.rotation
    );

};
