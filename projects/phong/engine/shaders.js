function getShader(gl, id) {
    var shaderScript = document.getElementById(id);
    if (!shaderScript) {
        return null;
    }

    var str = "";
    var k = shaderScript.firstChild;
    while (k) {
        if (k.nodeType == 3) {
            str += k.textContent;
        }
        k = k.nextSibling;
    }

    var shader;
    if (shaderScript.type == "x-shader/x-fragment") {
        shader = gl.createShader(gl.FRAGMENT_SHADER);
    } else if (shaderScript.type == "x-shader/x-vertex") {
        shader = gl.createShader(gl.VERTEX_SHADER);
    } else {
        return null;
    }

    gl.shaderSource(shader, str);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert(gl.getShaderInfoLog(shader));
        return null;
    }

    return shader;
}

var shaderProgram; 

function initShaders() {
	var fragmentShader = getShader(gl, "shader-fs");
	var vertexShader = getShader(gl, "shader-vs");

	shaderProgram = gl.createProgram();
	gl.attachShader(shaderProgram, vertexShader);
	gl.attachShader(shaderProgram, fragmentShader);
	gl.linkProgram(shaderProgram);

	if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
		alert("No se pueden inicializar los shaders");
	}

	gl.useProgram(shaderProgram);

	shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
    gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

	shaderProgram.vertexColorAttribute = gl.getAttribLocation(shaderProgram, "aVertexColor");
	gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);

	shaderProgram.vertexNormalAttribute = gl.getAttribLocation(shaderProgram, "aVertexNormal");
	gl.enableVertexAttribArray(shaderProgram.vertexNormalAttribute);

	shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
	shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");

	shaderProgram.lightPositionVecUniform = gl.getUniformLocation(shaderProgram, "uLightPosition");
	shaderProgram.lightColorVecUniform = gl.getUniformLocation(shaderProgram, "uLightColor");
	shaderProgram.ambientColorVecUniform = gl.getUniformLocation(shaderProgram, "uAmbientLightColor");

	shaderProgram.ambientLightBoolUniform = gl.getUniformLocation(shaderProgram, "uAmbientLight");
	shaderProgram.diffuseLightBoolUniform = gl.getUniformLocation(shaderProgram, "uDiffuseLight");
	shaderProgram.specularLightBoolUniform = gl.getUniformLocation(shaderProgram, "uSpecularLight");

	shaderProgram.kaUniform = gl.getUniformLocation(shaderProgram, "uKa");
	shaderProgram.kdUniform = gl.getUniformLocation(shaderProgram, "uKd");
	shaderProgram.ksUniform = gl.getUniformLocation(shaderProgram, "uKs");
}
