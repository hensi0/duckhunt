// ======================
// Score counter HUD element
// ======================

"use strict";


function Score(descr) {

    // Common inherited setup logic from Entity
    this.setup(descr);
    
    // Default sprite, if not otherwise specified
    this.sprite = this.sprite || g_sprites.scorebox;
    
    // Set normal drawing scale, and warp state off
    this._scale = 1;
};

Score.prototype = new Entity();


Score.prototype.cx = 500;
Score.prototype.cy = 550;
Score.prototype.score = 0;
Score.prototype.digits = "000000";
Score.prototype.changed = false;

var NUM_DIGITS = 6;
//Location of digits in Score Box
var TEXT_OFFSET = -4
var DIGITS_OFFSET = 20

Score.prototype.addScore = function(diff){
	console.log("add score");
	this.score += diff;
	if (this.score < 0) {
		this.score = 0;
	}
	this.changed = true;
}

Score.prototype.update = function (du) {
	/*
    if (this.changed){
		console.log("score change triggered");
		var tempscore = this.score;
		this.digits = "";
		for (var i = NUM_DIGITS-1; i>=0; i--){
			this.digits = (tempscore%10)+this.digits;
			tempscore = Math.floor(tempscore/10);
		}
		this.changed = false;
	}
	*/
};

Score.prototype.render = function (ctx) {
    var origScale = this.sprite.scale;
    // pass my scale into the sprite, for drawing
    this.sprite.scale = this._scale;
    this.sprite.drawWrappedCentredAt(
	ctx, this.cx, this.cy, this.rotation
    );
	ctx.font = "bold 21px Comic Sans MS";
	ctx.fillStyle = "red";
	ctx.textAlign = "center";
	ctx.fillText("SCORE",this.cx,this.cy+TEXT_OFFSET)
	ctx.fillText(this.score,this.cx,this.cy+DIGITS_OFFSET)
    this.sprite.scale = origScale;
};