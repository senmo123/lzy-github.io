"use strict";

var canvas;
var gl;

var theta = 0.0;
var thetaLoc;
var direction = 1;
var delay = 200;
var i;
var j;

function thetaround(i, j){
	var x;
	if(j==0){
		x = 72*i*Math.PI / 180;
	}
	if(j==1){
		x = (72*i+36)*Math.PI / 180;
	}
	return x;
}

function changeDir(){
	direction *= -1;
}

function initRotSquare(){
	canvas = document.getElementById( "rot-canvas" );
	gl = WebGLUtils.setupWebGL( canvas, "experimental-webgl" );
	if( !gl ){
		alert( "WebGL isn't available" );
	}

	gl.viewport( 0, 0, canvas.width, canvas.height );
	gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

	var program = initShaders( gl, "rot-v-shader", "rot-f-shader" );
	gl.useProgram( program );

	var R = 1.0;
	var r = Math.sin(18*Math.PI/180) / Math.sin(36*Math.PI/180);
	console.log(r);
	var R1_x, R1_y, R2_x, R2_y, R3_x, R3_y, R4_x, R4_y, R5_x, R5_y;
	var r1_x, r1_y, r2_x, r2_y, r3_x, r3_y, r4_x, r4_y, r5_x, r5_y;
	R1_x = R*Math.cos(thetaround(0, 0));R1_y = R*Math.sin(thetaround(0, 0));
	R2_x = R*Math.cos(thetaround(1, 0));R2_y = R*Math.sin(thetaround(1, 0));
	R3_x = R*Math.cos(thetaround(2, 0));R3_y = R*Math.sin(thetaround(2, 0));
	R4_x = R*Math.cos(thetaround(3, 0));R4_y = R*Math.sin(thetaround(3, 0));
	R5_x = R*Math.cos(thetaround(4, 0));R5_y = R*Math.sin(thetaround(4, 0));
	
	r1_x = r*Math.cos(thetaround(0, 1)); r1_y = r*Math.sin(thetaround(0, 1));
	console.log(r1_x, r1_y, Math.cos(36))
	r2_x = r*Math.cos(thetaround(1, 1)); r2_y = r*Math.sin(thetaround(1, 1));
	r3_x = r*Math.cos(thetaround(2, 1)); r3_y = r*Math.sin(thetaround(2, 1));
	r4_x = r*Math.cos(thetaround(3, 1)); r4_y = r*Math.sin(thetaround(3, 1));
	r5_x = r*Math.cos(thetaround(4, 1)); r5_y = r*Math.sin(thetaround(4, 1));
	var vertices = [
			R1_x, R1_y, 0,
			r1_x, r1_y, 0,
			r5_x, r5_y, 0,
			
			R2_x, R2_y, 0,
			r1_x, r1_y, 0,
			r2_x, r2_y, 0,
			
			R3_x, R3_y, 0,
			r2_x, r2_y, 0,
			r3_x, r3_y, 0,
			
			R4_x, R4_y, 0,
			r3_x, r3_y, 0,
			r4_x, r4_y, 0,
			
			R5_x, R5_y, 0,
			r4_x, r4_y, 0,
			r5_x, r5_y, 0,
			
			r1_x, r1_y, 0,
			r5_x, r5_y, 0,
			r2_x, r2_y, 0,
			
			r2_x, r2_y, 0,
			r5_x, r5_y, 0,
			r4_x, r4_y, 0,
			
			r2_x, r2_y, 0,
			r4_x, r4_y, 0,
			r3_x, r3_y, 0,
			
		 
	];
	
	var bufferId = gl.createBuffer();
	gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
	gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( vertices ), gl.STATIC_DRAW );

	var vPosition = gl.getAttribLocation( program, "vPosition" );
	gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
	gl.enableVertexAttribArray( vPosition );

	thetaLoc = gl.getUniformLocation( program, "theta" );

	document.getElementById( "controls" ).onclick = function( event ){
		switch( event.target.index ){
			case 0:
				direction *= -1;
				break;
			case 1:
				delay /= 2.0;
				break;
			case 2:
				delay *= 2.0;
				break;	
		}
	};

	renderSquare();
}

function renderSquare(){
	gl.clear( gl.COLOR_BUFFER_BIT );
	
	// set uniform values
	theta += direction * 0.1;
	if( theta > 2 * Math.PI )
		theta -= (2 * Math.PI);
	else if( theta < -2 * Math.PI )
		theta += ( 2 * Math.PI );

	gl.uniform1f( thetaLoc, theta );

	gl.drawArrays( gl.TRIANGLE_STRIP, 0, 24 );

	// update and render
	setTimeout( function (){ requestAnimFrame( renderSquare ); }, delay );
}