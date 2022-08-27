	function initEscena() {
		escena = new Escena();
		populateInitialScene();
	}

	function populateInitialScene() {
		camera.position = vec3.set([0, 0, 0]);

		ambientLight = Color.create(1,1,1,1);
		lightColor = Color.create(1,1,1,1);
		lightSources.push(new Vertice(1,0,0, lightColor));

		var unColor = Color.create(0.5, 0.5, 0.5, 1);
		var otroColor = Color.create(0.3, 0.3, 1, 1);

		//STARS
		var STAR_COUNT = 300;
		var stars = [];
		var starColor = Color.create(1, 1, 1, 1);
		for (var i=0; i<STAR_COUNT; i++) {
			var theta = Math.PI*Math.random();
			var phi = 2*Math.PI*Math.random();
			var radius = 800.0;
			var x = radius*Math.cos(phi)*Math.sin(theta);
			var y = radius*Math.sin(theta)*Math.sin(phi);
			var z = -radius*Math.cos(theta);
			var v = new Vertice(x, y, z, starColor);

			stars[i] = new Punto(v);
			escena.addComponent(stars[i]);
		}
		//se podria poner en common un conversor de esfericas a cartesianas y viceversa

// 		var elCilindro = new Cilindro(new Vertice(0.0, 0.0, -3, unColor), 0.5, 1.0, 0.1);
// 		elCilindro.rotateX(deg2rad(90));
// 		escena.addComponent(elCilindro);

// 		var elCirculo = new Circulo(new Vertice(0.3, 0.0, -3, unColor), 0.5, 0.1);
// 		elCirculo.rotateX(deg2rad(5));
// 		escena.addComponent(elCirculo);

// 		var elCilindroConTapas = new CilindroConTapas(new Vertice(0.0, 0.0, -3, unColor), 0.5, 1.0, 0.1);
// 		elCilindroConTapas.rotateX(deg2rad(140));
// 		escena.addComponent(elCilindroConTapas);

// 		var elCubo = new Cubo(new Vertice(0.0, 0., -3, unColor), 1.0, 1.0, 0.5);
// 		elCubo.rotateY(deg2rad(0));
// 		elCubo.rotateX(deg2rad(0));
// 		escena.addComponent(elCubo);

// 		var laEsfera = new Esfera(new Vertice(-3,0,-10,unColor), 2, 0.1, 0.2);
// 		laEsfera.rotateY(deg2rad(0));
// 		laEsfera.rotateX(deg2rad(0));
// 		escena.addComponent(laEsfera);

		var laEsferaDelDragon = new EsferaDelDragon(new Vertice(-1,0,-10,unColor), 2, 0.1, 0.2);
		laEsferaDelDragon.rotateY(deg2rad(90));
		laEsferaDelDragon.rotateX(deg2rad(90));
		escena.addComponent(laEsferaDelDragon);

// 		var colorSuperficie = Color.create(0.2, 0.2, 0.2, 1);
// 		var colorSuperficie = Color.create(0.9, 0.9, 0.9, 1);
// 		var controlPoints = [];
// 		for (var i=0; i<=2; i++) {
// 				
// 			controlPoints[i] = [];
// 			for (var j=0; j<=2; j++) {
// 				if (i == 1 && j == 1) controlPoints[i][j] = new Vertice(i*0.4, -10.0, -4 -j*0.4, colorSuperficie);
// 				else controlPoints[i][j] = new Vertice(i*0.4, -0.5, -4 -j*0.4, colorSuperficie);
// 			}
// 		}

// 		var laSuperficie = new BezierSurface(controlPoints);
// 		laSuperficie.scale([1.5, 1.5, 1.5]);
// 		laSuperficie.translate([-0.5,0.5,-1]);
// 		laSuperficie.rotateX(deg2rad(-40));
// 		escena.addComponent(laSuperficie);

		var colorNave = Color.create(0.7, 0.7, 0.7, 1);
		var laNave = new Enterprise(new Vertice(0.0, 0.0, -4, colorNave), 0.5, 0.1);
		laNave.rotateX(deg2rad(30));
		laNave.rotateY(deg2rad(70));
		laNave.rotateZ(deg2rad(60));
		escena.addComponent(laNave);

		var laNavePosta = loadModel("http://rawgit.com/asztrajman/webgl-3Dengine/master/ncc1701D.json");
		laNavePosta.rotateX(deg2rad(90));
		laNavePosta.rotateY(deg2rad(-125));
		laNavePosta.rotateZ(deg2rad(30));
		laNavePosta.translate([0,-0.3,0]);
	}
 
	function dibujarEscena() {
		// color de fondo de la escena
		gl.clearColor(0.0, 0.0, 0.0, 1.0);

		// se dibuja en este viewport (subconjunto del espacio)
		gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);

		// se permiten colores en el canvas
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

		// cuestiones de cara oculta y Z buffer? (no se si tiene que ir aca FIXME)
		// cara oculta se puede llegar a implementar en triangle.draw (no en los shaders)
		gl.clearDepth(1.0);
		gl.enable(gl.DEPTH_TEST);
		gl.depthFunc(gl.LEQUAL);
		
// 		//blending
// 		gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
// 		gl.enable(gl.BLEND);
// 		gl.disable(gl.DEPTH_TEST); //?

		//matrices de perspective, modelview y camara
		mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.01, 1000.0, pMatrix);
		mat4.identity(mvMatrix);
		mat4.rotate(mvMatrix, deg2rad(-camera.pitch), [1, 0, 0]);
		mat4.rotate(mvMatrix, deg2rad(-camera.yaw), [0, 1, 0]);
		mat4.translate(mvMatrix, vec3.negate(camera.position));

		//se establece que el buffer triangleBufferGL es el buffer actual
		gl.bindBuffer(gl.ARRAY_BUFFER, triangleBufferGL);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleBuffer), gl.STATIC_DRAW);
		gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);

		gl.bindBuffer(gl.ARRAY_BUFFER, triangleColorBufferGL);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleColorBuffer), gl.STATIC_DRAW);
		gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, 4, gl.FLOAT, false, 0, 0);

		gl.bindBuffer(gl.ARRAY_BUFFER, triangleNormalBufferGL);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleNormalBuffer), gl.STATIC_DRAW);
		gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, 3, gl.FLOAT, false, 0, 0);

		setUniforms();

		gl.drawArrays(gl.TRIANGLES, 0, triangleBuffer.length / triangleBufferGL.itemSize);

		gl.bindBuffer(gl.ARRAY_BUFFER, pointBufferGL);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pointBuffer), gl.STATIC_DRAW);
		gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);

		gl.bindBuffer(gl.ARRAY_BUFFER, pointColorBufferGL);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pointColorBuffer), gl.STATIC_DRAW);
		gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, 4, gl.FLOAT, false, 0, 0);

		gl.bindBuffer(gl.ARRAY_BUFFER, pointNormalBufferGL);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pointNormalBuffer), gl.STATIC_DRAW);
		gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, 3, gl.FLOAT, false, 0, 0);

		setUniforms();

		// se dibujan los buffers en pantalla
		gl.drawArrays(gl.POINTS, 0, pointBuffer.length / pointBufferGL.itemSize);
	}

	function Escena() {
		this.name = "Escena";

		this.draw = function(t) {
			var nodeTransf;

		if (!this.transf)
			this.init();

			if (t) {
				nodeTransf = mat4.create();
 				nodeTransf = mat4.multiply(t, this.getTransf());
			} else
				nodeTransf = this.getTransf();

			if (!this.components)
				this.components = []; //esto no se puede poner en el constructor directamente?
			for (var i = 0; i < this.components.length; i++) {
				this.components[i].draw(nodeTransf);
			}
		}

		this.addComponent = function(c) {
			if (!this.components)
				this.components = [];
			this.components.push(c);
		}

		this.size = function() {
			return this.components.length;
		}
	}

	Escena.prototype = new AffineTransforms();
