// ==============
// MOUSE HANDLING
// ==============

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/

var g_mouseX = 0,
    g_mouseY = 0;

function handleMouse(evt) {
    
    g_mouseX = evt.clientX - g_canvas.offsetLeft;
    g_mouseY = evt.clientY - g_canvas.offsetTop;
    
    // If no button is being pressed, then bail
    var button = evt.buttons === undefined ? evt.which : evt.buttons;
    if (!button) return;
}

function handleMouseDown(e){
    if(e.button === 2){
        entityManager._gun[entityManager._selectedGun].reload();
    }
}
function handleScroll(e){
	var currentgun = entityManager._selectedGun;
	var numguns = 3;
    if (e.wheelDelta > 0){
		currentgun = currentgun + 1;
		while (currentgun >= numguns){
			currentgun -= numguns;
		}
	} else if ( e.wheelDelta < 0 ){
		currentgun = currentgun - 1;
		while (currentgun < 0){
			currentgun += numguns;
		}
	}
	entityManager._selectedGun = currentgun;
    return false; 
}

// Handle "down" and "move" events the same way.

window.addEventListener("mousedown", handleMouseDown);
window.addEventListener("mousemove", handleMouse);
window.addEventListener('mousewheel',handleScroll, false);
