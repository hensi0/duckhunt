"use strict";

function Particle(descriptor){
	for( var key in descriptor ){
		this[key] = descriptor[key];
	}
}

Particle.prototype.dead = false;

Particle.prototype.update = function(dt){
	//Let's trim down the number of particles if performance is suffering
	this.dead = (Math.random() > 1/dt);
	if(this.dead) return;
	this.alpha -= 0.01;
	if(this.shrink) this.r = this.r*0.9;
	if(this.alpha < 0){
		this.dead = true;
		return;
	}
	this.cx += Math.cos(this.angle)*this.vel*dt;
	this.cy += Math.sin(this.angle)*this.vel*dt;
}

Particle.prototype.render = function(ctx){
	if(this.alpha<0 || this.dead) return; //make sure we don't do anything silly
	// Store old values
	var oldStyle = ctx.fillStyle;
	var oldAlpha = ctx.globalAlpha;
	ctx.save();
	
	// Use particle specific values
	ctx.fillStyle = this.style;
	ctx.globalAlpha = this.alpha;
	// Draw the thing
	util.fillCircle(ctx, this.cx, this.cy, this.r);
	
	
	// give the context back as we found it
	ctx.fillStyle = oldStyle;
	ctx.globalAlpha = oldAlpha;
	ctx.beginPath();
	ctx.restore();
}