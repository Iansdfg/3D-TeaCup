//This work is based on course websites's code, demo from discussion and inspred by following online tutorial.
//https://courses.engr.illinois.edu/cs418/HelloTexture.html
//https://courses.engr.illinois.edu/cs418/HelloTexture.js
//https://courses.engr.illinois.edu/cs418/discussion_content_Spring2017/TextureDemoSolution331.zip
//https://courses.engr.illinois.edu/cs418/discussion_content_Spring2017/CubemapTextureSlidesOBJ.pptx
//some function (setupTeapotShaders, setupSkyBoxShaders,createProgram, createTeapot,createSkyBox,createGLContext) was helped by classmates

// The webgl context.
var gl; 
var canvas;
  
// Normal
var nMatrix = mat3.create();

//Create Projection matrix
var pMatrix = mat4.create();   

// Create the Inverse transform rotation matrix
var invVT = mat3.create();

// Skybox and teapot
var cubeTexture;
var cube;        
var teapot;

// Rotation for teapot
var teaX = 0;
var teaY = 0; 

// Converts Degrees to Radians
function degToRad(degrees) {
    return degrees * Math.PI / 180;
}

//for viewing
var unitx = vec3.create();
var unity = vec3.create();
var unitz = vec3.create();
var viewZ;

//rotatation for the wall
var modelXRotationRadians = degToRad(0);
var modelYRotationRadians = degToRad(0);

//rotatation helper
function degToRad(degrees) {
        return degrees * Math.PI / 180;
}
 
function getVMatrix (){
        return new Float32Array(
              [ unitx[0], unity[0], unitz[0], 0,
                unitx[1], unity[1], unitz[1], 0, 
                unitx[2], unity[2], unitz[2], 0,
	                0,        0,   -100, 1 ] );
    }
    
//View parameters     
function setView(canvas, viewDir, up, viewDis) {
        var viewDir = vec3.fromValues(0.0,0.0,10.0);
        var viewPt = vec3.fromValues(0.0,0.0,1.0);
        var up = vec3.fromValues(0.0,1.0,0.0);
        
        vec3.normalize(unitz, viewPt);
        vec3.normalize(unity, unitz);
        
        var dot = (unitz[0] * up[0]) + (unitz[1] * up[1]) + (unitz[2] * up[2]);        
        vec3.scale(unity, unity, dot);  
        
        vec3.subtract(unity, up, unity);
        vec3.cross(unitx, unity, unitz);  
}


// Draw Function
function draw() {
    gl.clearColor(0,0,0,1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    mat4.perspective(pMatrix, Math.PI/5, 1, 10, 2000);
    
    mvMatrix = getVMatrix();
    mat3.normalFromMat4(nMatrix, mvMatrix);
    
    //Wall rotation
    mat4.rotateX(mvMatrix,mvMatrix,modelXRotationRadians);
    mat4.rotateY(mvMatrix,mvMatrix,modelYRotationRadians);
    
    // Skybox
    gl.useProgram(shaderProgramSkyBox);
    gl.uniformMatrix4fv(uPMatrixSkyBox, false, pMatrix);
    cube.render();  
    
    // Teapot rotation
    mat4.rotateX(mvMatrix,mvMatrix,teaX);
    mat4.rotateY(mvMatrix,mvMatrix,teaY);
    
    //Reflection
    mat3.normalFromMat4(nMatrix, mvMatrix);
    
    //Teapot.
    gl.useProgram(shaderProgram);
    gl.uniformMatrix4fv(uPMatrix, false, pMatrix);
    gl.enableVertexAttribArray(aVertexPosition);
    gl.enableVertexAttribArray(aNormal);
    teapot.render(); 
}
function draw2() {
    gl.clearColor(0,0,0,1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    mat4.perspective(pMatrix, Math.PI/5, 1, 10, 2000);
    
    mvMatrix = getVMatrix();
    mat3.normalFromMat4(nMatrix, mvMatrix);
    
    //Wall rotation
    mat4.rotateX(mvMatrix,mvMatrix,modelXRotationRadians);
    mat4.rotateY(mvMatrix,mvMatrix,modelYRotationRadians);
    
    // Skybox
    gl.useProgram(shaderProgramSkyBox);
    gl.uniformMatrix4fv(uPMatrixSkyBox, false, pMatrix);
    cube.render();  
    
    // Teapot rotation
    mat4.rotateX(mvMatrix,mvMatrix,teaX);
    mat4.rotateY(mvMatrix,mvMatrix,teaY);
    
    //Reflection
    mat3.normalFromMat4(nMatrix, mvMatrix);
    
    //Teapot.
    gl.useProgram(shaderProgram);
    gl.uniformMatrix4fv(uPMatrix, false, pMatrix);
    gl.enableVertexAttribArray(aVertexPosition);
    gl.enableVertexAttribArray(aNormal);
    teapot.render2(); 
}

// Setup Texture Map
function setupTextureMap() {
    cubeTexture = gl.createTexture(); 
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, cubeTexture); 
    
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); // ADDED
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE); // ADDED
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

      load(gl, gl.TEXTURE_CUBE_MAP_POSITIVE_X, cubeTexture, 'canary/pos-x.png'); 
      load(gl, gl.TEXTURE_CUBE_MAP_NEGATIVE_X, cubeTexture, 'canary/neg-x.png'); 
      load(gl, gl.TEXTURE_CUBE_MAP_POSITIVE_Y, cubeTexture, 'canary/pos-y.png'); 
      load(gl, gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, cubeTexture, 'canary/neg-y.png'); 
      load(gl, gl.TEXTURE_CUBE_MAP_POSITIVE_Z, cubeTexture, 'canary/pos-z.png'); 
      load(gl, gl.TEXTURE_CUBE_MAP_NEGATIVE_Z, cubeTexture, 'canary/neg-z.png');
}

function load(gl, target, texture, url){
    var image = new Image(); 
    image.onload = function() {
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
        gl.texImage2D( target, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    }
    image.src = url;
}

// Set Up Teapot Shader
function setupTeapotShaders() {
    var vertexShader = loadShaderFromDOM("shader-vs"); 
    var fragmentShader = loadShaderFromDOM("shader-fs");
    
    shaderProgram = createProgram(gl,vertexShader,fragmentShader);
    aVertexPosition =  gl.getAttribLocation(shaderProgram, "aVertexPosition");
    aNormal =  gl.getAttribLocation(shaderProgram, "aVertexNormal");
    uMVMatrix = gl.getUniformLocation(shaderProgram, "uMVMatrix");
    uPMatrix = gl.getUniformLocation(shaderProgram, "uPMatrix");
    uNMatrix = gl.getUniformLocation(shaderProgram, "uNMatrix");
}

// Set Up Sky Box Shador
function setupSkyBoxShaders() {
    var vertexShader = loadShaderFromDOM("sb-shader-vs"); 
    var fragmentShader = loadShaderFromDOM("sb-shader-fs");
    
    shaderProgramSkyBox = createProgram(gl,vertexShader,fragmentShader);
    aVertexPositionSkyBox =  gl.getAttribLocation(shaderProgramSkyBox, "aVertexPosition");
    uMVMatrixSkyBox = gl.getUniformLocation(shaderProgramSkyBox, "uMVMatrix");
    uPMatrixSkyBox = gl.getUniformLocation(shaderProgramSkyBox, "uPMatrix");
}
// Create teapot
function createTeapot(data) { 
    var tea = {};
    
    tea.coordsBuffer = gl.createBuffer();
    tea.normalBuffer = gl.createBuffer();
    tea.indexBuffer = gl.createBuffer();
    
    tea.count = data.indices.length;
    
    gl.bindBuffer(gl.ARRAY_BUFFER, tea.coordsBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, data.vertexPositions, gl.STATIC_DRAW);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, tea.normalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, data.vertexNormals, gl.STATIC_DRAW);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, tea.indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, data.indices, gl.STATIC_DRAW);
    
    tea.render = function() {
        gl.bindBuffer(gl.ARRAY_BUFFER, this.coordsBuffer);
        gl.vertexAttribPointer(aVertexPosition, 3, gl.FLOAT, false, 0, 0);
        
        gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
        gl.vertexAttribPointer(aNormal, 3, gl.FLOAT, false, 0, 0);
        
        gl.uniformMatrix4fv(uMVMatrix, false, mvMatrix );
        gl.uniformMatrix3fv(uNMatrix, false, nMatrix);
        gl.uniformMatrix3fv(uInvVT, false, invVT);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        
        gl.drawElements(gl.TRIANGLES, this.count, gl.UNSIGNED_SHORT, 0);
    }
    tea.render2 = function() {
        gl.bindBuffer(gl.ARRAY_BUFFER, this.coordsBuffer);
        gl.vertexAttribPointer(aVertexPosition, 3, gl.FLOAT, false, 0, 0);
        
        gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
        gl.vertexAttribPointer(aNormal, 3, gl.FLOAT, false, 0, 0);
        
        gl.uniformMatrix4fv(uMVMatrix, false, mvMatrix );
        gl.uniformMatrix3fv(uNMatrix, false, nMatrix);
        
    
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        
        gl.drawElements(gl.TRIANGLES, this.count, gl.UNSIGNED_SHORT, 0);
    }
    return tea;
}

// Create Sky
function createSkyBox(data) { 
    var skybox = {};
    
    skybox.coordsBuffer = gl.createBuffer();
    skybox.indexBuffer = gl.createBuffer();
    skybox.count = data.indices.length;
    
    gl.bindBuffer(gl.ARRAY_BUFFER, skybox.coordsBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, data.vertexPositions, gl.STATIC_DRAW);
    
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, skybox.indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, data.indices, gl.STATIC_DRAW);
    
    skybox.render = function() { 
        gl.bindBuffer(gl.ARRAY_BUFFER, this.coordsBuffer);
        gl.vertexAttribPointer(aVertexPositionSkyBox, 3, gl.FLOAT, false, 0, 0);
        gl.uniformMatrix4fv(uMVMatrixSkyBox, false, mvMatrix );
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        gl.drawElements(gl.TRIANGLES, this.count, gl.UNSIGNED_SHORT, 0);
    }
    
    return skybox;
}

function createProgram(gl, vertexShaderSource, fragmentShaderSource) {
   var vsh = gl.createShader( gl.VERTEX_SHADER );
   gl.shaderSource(vsh,vertexShaderSource);
   gl.compileShader(vsh);
   if ( ! gl.getShaderParameter(vsh, gl.COMPILE_STATUS) ) {
      throw "Error in vertex shader:  " + gl.getShaderInfoLog(vsh);
   }
   var fsh = gl.createShader( gl.FRAGMENT_SHADER );
   gl.shaderSource(fsh, fragmentShaderSource);
   gl.compileShader(fsh);
   if ( ! gl.getShaderParameter(fsh, gl.COMPILE_STATUS) ) {
      throw "Error in fragment shader:  " + gl.getShaderInfoLog(fsh);
   }
   var shaderProgram = gl.createProgram();
   gl.attachShader(shaderProgram,vsh);
   gl.attachShader(shaderProgram, fsh);
   gl.linkProgram(shaderProgram);
   if ( ! gl.getProgramParameter( shaderProgram, gl.LINK_STATUS) ) {
      throw "Link error in program:  " + gl.getProgramInfoLog(shaderProgram);
   }
   return shaderProgram;
}

// Function Called to creat the web
function createGLContext(canvas) {
  var names = ["webgl", "experimental-webgl"];
  var context = null;
  for (var i=0; i < names.length; i++) {
    try {
      context = canvas.getContext(names[i]);
    } catch(e) {}
    if (context) {
      break;
    }
  }
  if (context) {
    context.viewportWidth = canvas.width;
    context.viewportHeight = canvas.height;
  } else {
    alert("Failed to create WebGL context!");
  }
  return context;
}


// Loads Shaders
// @param {string} id ID string for shader to load. Either vertex shader/fragment shader
function loadShaderFromDOM(id) {
  var shaderScript = document.getElementById(id);
  if (!shaderScript) {
    return null;
  }
  var currentChild = shaderScript.firstChild;
  var shaderSource = "";
  while (currentChild) {
    if (currentChild.nodeType == 3) {
      shaderSource += currentChild.textContent;
    }
    currentChild = currentChild.nextSibling;
  }
  return shaderSource;  
}

// Interface
function interface(event) {    
    if (event.keyCode == 65) {
        teaY-= 0.1;
    } else if (event.keyCode == 87) {
        teaX-= 0.1;
    } else if (event.keyCode == 68) {
        teaY+=  0.1;
    } else if (event.keyCode == 83) {
        teaX+= 0.1;
    }
    if (event.keyCode == 40) {
        modelXRotationRadians += 0.1;
    } else if (event.keyCode == 38) {
        modelXRotationRadians -= 0.1;
    } else if (event.keyCode == 39) {
        modelYRotationRadians +=  0.1;
    } else if (event.keyCode == 37) {
        modelYRotationRadians -= 0.1;
    }
    event.preventDefault();
}

// Function to call keyEvent
function keyEvent() {
    document.addEventListener("keydown", interface, false);
}
// Draw cube
function skyBoxCube(side) {
    var s = (side || 1)/2;
    var coords = [];
    var normals = [];
    var indices = [];
    function face(xyz, nrm) {
        var start = coords.length/3;
        var i;
        for (i = 0; i < 12; i++) {
            coords.push(xyz[i]);
        }  
        for (i = 0; i < 4; i++) {
            normals.push(nrm[0],nrm[1],nrm[2]);
        } 
        indices.push(start,start+1,start+2,start,start+2,start+3);
    }
    face( [-s,-s,s, s,-s,s, s,s,s, -s,s,s], [0,0,1] );
    face( [-s,-s,-s, -s,s,-s, s,s,-s, s,-s,-s], [0,0,-1] );
    face( [-s,s,-s, -s,s,s, s,s,s, s,s,-s], [0,1,0] );
    face( [-s,-s,-s, s,-s,-s, s,-s,s, -s,-s,s], [0,-1,0] );
    face( [s,-s,-s, s,s,-s, s,s,s, s,-s,s], [1,0,0] );
    face( [-s,-s,-s, -s,-s,s, -s,s,s, -s,s,-s], [-1,0,0] );
    return {
        vertexPositions: new Float32Array(coords),
        vertexNormals: new Float32Array(normals),
        indices: new Uint16Array(indices)
    }
}

// Start Up 
function startup() {
    canvas = document.getElementById("myGLCanvas");
    gl = createGLContext(canvas);
    
    //teapotObject
    setupSkyBoxShaders();
    setupTeapotShaders();
    
    uInvVT = gl.getUniformLocation(shaderProgram, "invVT");
    gl.enable(gl.DEPTH_TEST);
    
    new setView(canvas);
    
    
    teapot = createTeapot(teapotObject);
    cube = createSkyBox(skyBoxCube(1000));

    setupTextureMap();
    tick();   
}

// Tick Function
function tick() {
    requestAnimFrame(tick);
    keyEvent();
    if(document.getElementById("NReflective").checked){
      draw2(); 
    }else{
      draw();
    }
//    draw();
 
}


