"use strict";

const { vec3 } = glMatrix;

var canvas;
var gl;
var Ds;
var points = [];
var colors = [];
var numTimesToSubdivide=4;
var theta;
var spin;
var da,db,dc;

function initTriangles(){
	canvas = document.getElementById( "gl-canvas" );
	points = [];
	gl = WebGLUtils.setupWebGL( canvas );
	if( !gl ){
		alert( "WebGL isn't available" );
	}
	
	// initialise data for Sierpinski gasket

	// first, initialise the corners of the gasket with three points.
	var vertices = [
		-Math.sqrt(3/4), -0.5,  0,
		 0, 1.0,  0,
		 Math.sqrt(3/4), -0.5,  0
	];
	// var u = vec3.create();
	// vec3.set( u, -1, -1, 0 );
	var u = vec3.fromValues( vertices[0], vertices[1], vertices[2] );
	// var v = vec3.create();
	// vec3.set( v, 0, 1, 0 );
	var v = vec3.fromValues( vertices[3], vertices[4], vertices[5] );
	// var w = vec3.create();
	// vec3.set( w, 1, -1, 0 );
	var w = vec3.fromValues( vertices[6], vertices[7], vertices[8] );

	divideTriangle( u, v, w, numTimesToSubdivide );
	// configure webgl
	gl.viewport( 0, 0, canvas.width, canvas.height );
	gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

	// load shaders and initialise attribute buffers
	var program = initShaders( gl, "vertex-shader", "fragment-shader" );
	gl.useProgram( program );

	// load data into gpu
	var vertexBuffer = gl.createBuffer();
	gl.bindBuffer( gl.ARRAY_BUFFER, vertexBuffer );
	gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( points ), gl.STATIC_DRAW );

	// associate out shader variables with data buffer
	var vPosition = gl.getAttribLocation( program, "vPosition" );
	gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
	gl.enableVertexAttribArray( vPosition );

	renderTriangles();
};

function changelevel(){
	numTimesToSubdivide=document.getElementById("num").value;
	theta = document.getElementById("theta").value;
	spin = document.getElementById("spin").value;
	Ds = document.getElementsByName("1");
	for( var i = 0;i<Ds.length;i++)
	{
		if(Ds[i].checked) Ds=Ds[i].value;
	}
	document.getElementById("demo").innerHTML = "当前层数："+numTimesToSubdivide+"<br>"+"当前旋转角度："+theta+"<br>当前类型："+Ds;	
	theta = theta*(Math.PI/180.0);
	if(Ds=="2D"|| Ds=="Line") initTriangles();
	else init(); 
}

function triangle( a, b, c ){
	//var k;
	if(spin==true){
		da=Math.sqrt((a[0]*a[0]+a[1]*a[1]));
		db=Math.sqrt((b[0]*b[0]+b[1]*b[1]));
		dc=Math.sqrt((c[0]*c[0]+c[1]*c[1]));
		if(Ds=="2D")
		{//2D
			points.push( a[0]*Math.cos(da*theta)-a[1]*Math.sin(da*theta), a[1]*Math.cos(da*theta)+a[0]*Math.sin(da*theta), a[2] );
			points.push( b[0]*Math.cos(db*theta)-b[1]*Math.sin(db*theta), b[1]*Math.cos(db*theta)+b[0]*Math.sin(db*theta), b[2] );
			points.push( c[0]*Math.cos(dc*theta)-c[1]*Math.sin(dc*theta), c[1]*Math.cos(dc*theta)+c[0]*Math.sin(dc*theta), c[2] );
		}else{//line
			points.push( a[0]*Math.cos(da*theta)-a[1]*Math.sin(da*theta), a[1]*Math.cos(da*theta)+a[0]*Math.sin(da*theta), a[2] );
			points.push( b[0]*Math.cos(db*theta)-b[1]*Math.sin(db*theta), b[1]*Math.cos(db*theta)+b[0]*Math.sin(db*theta), b[2] );
			points.push( b[0]*Math.cos(db*theta)-b[1]*Math.sin(db*theta), b[1]*Math.cos(db*theta)+b[0]*Math.sin(db*theta), b[2] );
			points.push( c[0]*Math.cos(dc*theta)-c[1]*Math.sin(dc*theta), c[1]*Math.cos(dc*theta)+c[0]*Math.sin(dc*theta), c[2] );
			points.push( c[0]*Math.cos(dc*theta)-c[1]*Math.sin(dc*theta), c[1]*Math.cos(dc*theta)+c[0]*Math.sin(dc*theta), c[2] );
			points.push( a[0]*Math.cos(da*theta)-a[1]*Math.sin(da*theta), a[1]*Math.cos(da*theta)+a[0]*Math.sin(da*theta), a[2] );
		}
	}else{
		if(Ds=="2D"){
			points.push( a[0]*Math.cos(theta)-a[1]*Math.sin(theta), a[1]*Math.cos(theta)+a[0]*Math.sin(theta), a[2] );
			points.push( b[0]*Math.cos(theta)-b[1]*Math.sin(theta), b[1]*Math.cos(theta)+b[0]*Math.sin(theta), b[2] );
			points.push( c[0]*Math.cos(theta)-c[1]*Math.sin(theta), c[1]*Math.cos(theta)+c[0]*Math.sin(theta), c[2] );
		}else if(Ds=="Line"){
			points.push( a[0]*Math.cos(theta)-a[1]*Math.sin(theta), a[1]*Math.cos(theta)+a[0]*Math.sin(theta), a[2] );
			points.push( b[0]*Math.cos(theta)-b[1]*Math.sin(theta), b[1]*Math.cos(theta)+b[0]*Math.sin(theta), b[2] );
			points.push( b[0]*Math.cos(theta)-b[1]*Math.sin(theta), b[1]*Math.cos(theta)+b[0]*Math.sin(theta), b[2] );
			points.push( c[0]*Math.cos(theta)-c[1]*Math.sin(theta), c[1]*Math.cos(theta)+c[0]*Math.sin(theta), c[2] );
			points.push( c[0]*Math.cos(theta)-c[1]*Math.sin(theta), c[1]*Math.cos(theta)+c[0]*Math.sin(theta), c[2] );
			points.push( a[0]*Math.cos(theta)-a[1]*Math.sin(theta), a[1]*Math.cos(theta)+a[0]*Math.sin(theta), a[2] );
		}
	}
	// for( k = 0; k < 3; k++ )
	// 	points.push( a[k] );
	// for( k = 0; k < 3; k++ )
	// 	points.push( b[k] );
	// for( k = 0; k < 3; k++ )
	// 	points.push( c[k] );
}

function divideTriangle( a, b, c, count ){
	// check for end of recursion
	if( count == 0 ){
		triangle( a, b, c );
	}else{
		var ab = vec3.create();
		vec3.lerp( ab, a, b, 0.5 );
		var bc = vec3.create();
		vec3.lerp( bc, b, c, 0.5 );
		var ca = vec3.create();
		vec3.lerp( ca, c, a, 0.5 );

		--count;

		// three new triangles
		divideTriangle( a, ab, ca, count );
		divideTriangle( b, bc, ab, count );
		divideTriangle( c, ca, bc, count );
		if(Ds=="Line")divideTriangle( ab, bc, ca, count );
	}
}

function renderTriangles(){
	gl.clear( gl.COLOR_BUFFER_BIT );
	if(Ds=="2D")gl.drawArrays( gl.TRIANGLES, 0, points.length/3 );
	else gl.drawArrays(gl.LINES,0,points.length/3);
}

//3D
function init() {
    canvas = document.getElementById("gl-canvas");

    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) {
        alert("WebGL isn't available");
    }
    points = [];
    // initialise data for 3d sierpinski gasket
    // first initialize the vertices of the 3d gasket
    // four vertices on unit cicle
    // initial tetrahedron with equal length sides

    var vertices = [
        0.0000, 0.0000, -1.0000,
        0.0000, 0.9428, 0.3333,
        -0.8165, -0.4714, 0.3333,
        0.8165, -0.4714, 0.3333
    ];

    // var t = vec3.create();
    // vec3.set(t, vertices[0], vertices[1], vertices[2]);
    var t = vec3.fromValues( vertices[0], vertices[1], vertices[2] );
    // var u = vec3.create();
    // vec3.set(u, vertices[3], vertices[4], vertices[5]);
    var u = vec3.fromValues( vertices[3], vertices[4], vertices[5] );
    // var v = vec3.create();
    // vec3.set(v, vertices[6], vertices[7], vertices[8]);
    var v = vec3.fromValues( vertices[6], vertices[7], vertices[8] );
    // var w = vec3.create();
    // vec3.set(w, vertices[9], vertices[10], vertices[11]);
    var w = vec3.fromValues( vertices[9], vertices[10], vertices[11] );

    divideTetra(t, u, v, w, numTimesToSubdivide);

    // configure webgl
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    // enable hidden-surface removal
    gl.enable(gl.DEPTH_TEST);

    // load shaders and initialize attribute buffers
    var program = initShaders(gl, "vertex-shader3", "fragment-shader3");
    gl.useProgram(program);

    // create buffer object, initialize it, and associate it with
    // attribute variables in vertex shader

    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(points), gl.STATIC_DRAW);

    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    var cBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

    var vColor = gl.getAttribLocation(program, "vColor");
    gl.vertexAttribPointer(vColor, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vColor);

    render();
};
function Ttriangle(a, b, c, color) {
    // add colors and vertices for one triangle
    var baseColor = [
        1.0, 0.0, 0.0,
        0.0, 1.0, 0.0,
        0.0, 0.0, 1.0,
        0.0, 0.0, 0.0
	];
	if(spin==true)
	{
		da=Math.sqrt((a[0]*a[0]+a[1]*a[1]));
		db=Math.sqrt((b[0]*b[0]+b[1]*b[1]));
		dc=Math.sqrt((c[0]*c[0]+c[1]*c[1]));
	}else {
		da=1,db=1,dc=1;
	}
    for (var k = 0; k < 3; k++) {
        colors.push(baseColor[color * 3 + k]);
	}
	points.push( a[0]*Math.cos(da*theta)-a[1]*Math.sin(da*theta), a[1]*Math.cos(da*theta)+a[0]*Math.sin(da*theta), a[2] );
    for (var k = 0; k < 3; k++) {
        colors.push(baseColor[color * 3 + k]);
	}
	points.push( b[0]*Math.cos(db*theta)-b[1]*Math.sin(db*theta), b[1]*Math.cos(db*theta)+b[0]*Math.sin(db*theta), b[2] );
    for (var k = 0; k < 3; k++) {
        colors.push(baseColor[color * 3 + k]);
    }
	points.push( c[0]*Math.cos(dc*theta)-c[1]*Math.sin(dc*theta), c[1]*Math.cos(dc*theta)+c[0]*Math.sin(dc*theta), c[2] );
}

function tetra(a, b, c, d) {
    Ttriangle(a, c, b, 0);
    Ttriangle(a, c, d, 1);
    Ttriangle(a, b, d, 2);
    Ttriangle(b, c, d, 3);
}

function divideTetra(a, b, c, d, count) {
    // check for end of recursion
    if (count == 0) {
        tetra(a, b, c, d);
    } else {
        var ab = vec3.create();
        vec3.lerp(ab, a, b, 0.5);
        var ac = vec3.create();
        vec3.lerp(ac, a, c, 0.5);
        var ad = vec3.create();
        vec3.lerp(ad, a, d, 0.5);
        var bc = vec3.create();
        vec3.lerp(bc, b, c, 0.5);
        var bd = vec3.create();
        vec3.lerp(bd, b, d, 0.5);
        var cd = vec3.create();
        vec3.lerp(cd, c, d, 0.5);

        --count;

        divideTetra(a, ab, ac, ad, count);
        divideTetra(ab, b, bc, bd, count);
        divideTetra(ac, bc, c, cd, count);
        divideTetra(ad, bd, cd, d, count);
    }

}

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, points.length / 3);
}
