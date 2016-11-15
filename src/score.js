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

Score.prototype.score = 0;

//Constants for Score Box
var SCORE_X = 540
var SCORE_Y = 570
var TEXT_OFFSET = -4
var DIGITS_OFFSET = 20
//Constants for Level Box
var LEVEL_X = 562;
var LEVEL_Y = 517;
var LEVEL_TEXT_OFFSET = -2;
var LEVEL_NUM_OFFSET = 16;

Score.prototype.addScore = function(diff){
	console.log("add score");
	this.score += diff;
	if (this.score < 0) {
		this.score = 0;
	}
}

Score.prototype.update = function (du) {
	
};

Score.prototype.render = function (ctx) {
    var origScale = this.sprite.scale;
    // pass my scale into the sprite, for drawing
    this.sprite.scale = this._scale;+
	//SCORE
    this.sprite.drawWrappedCentredAt(
	ctx, SCORE_X, SCORE_Y, this.rotation
    );
	ctx.font = "bold 21px Comic Sans MS";
	ctx.fillStyle = "red";
	ctx.textAlign = "center";
	ctx.fillText("SCORE",SCORE_X,SCORE_Y+TEXT_OFFSET)
	ctx.fillText(this.score,SCORE_X,SCORE_Y+DIGITS_OFFSET)
	// LEVEL
    g_sprites.lvlbox.drawWrappedCentredAt(
	ctx, LEVEL_X, LEVEL_Y, this.rotation
    );
	ctx.font = "bold 16px Comic Sans MS";
	ctx.fillText("LVL",LEVEL_X,LEVEL_Y+LEVEL_TEXT_OFFSET)
	ctx.fillText(entityManager._level,LEVEL_X,LEVEL_Y+LEVEL_NUM_OFFSET)
    this.sprite.scale = origScale;
};