	function Camera() {
		this.matrix = mat4.create();
		this.position = vec3.create();

		this.pitch = 0;
		this.pitchRate = 0;
		this.yaw = 0;
		this.yawRate = 0;

		this.maxWalkingSpeed = 0;
		this.speed = 0;
		this.sideSpeed = 0;
		
		this.joggingAngle = 0; // Used to make us "jog" up and down as we move forward. (stolen)
	}

	function Orbit(obj, center, start, length) {
		this.center = center;
		this.start = start;
		this.length = length; // longitud de la parametrizacion
		this.obj = obj;
		this.currentT = 0;
		
		var radiusVector = vec3.sub(start, center);
		this.r = vec3.length(radiusVector);
		this.normal = vec3.normal(radiusVector, start);
		
		this.move = function(t) {
		}
	}

	var currentlyPressedKeys = {};

	function handleKeyDown(event) {
		currentlyPressedKeys[event.keyCode] = true;
		//console.log(event.keyCode);

		// si se presionan las teclas arriba o abajo, cancelo el evento (para evitar el scroll vertical)
		if (event.keyCode == 38 || event.keyCode == 40) 
			return false;
		
		if (event.keyCode == 69)
			toggleGUIMode();
	}

	function handleKeyUp(event) {
		currentlyPressedKeys[event.keyCode] = false;
	}

	function handleKeys() {
		if (GUIMode) {
			if (currentlyPressedKeys[33]) { // Page Up
				camera.pitchRate = 0.03;
			} else if (currentlyPressedKeys[34]) { // Page Down
				camera.pitchRate = -0.03;
			} else if (!currentMouseState.dragging) { // ninguna tecla y no estoy usando el mouse
				camera.pitchRate = 0;
			}

			if (currentlyPressedKeys[37]) { // Left cursor key
				camera.yawRate = 0.03;
			} else if (currentlyPressedKeys[39]) { // Right cursor key
				camera.yawRate = -0.03;
			} else if (!currentMouseState.dragging) { // ninguna tecla y no estoy usando el mouse
				camera.yawRate = 0;
			}

			if (currentlyPressedKeys[65]) { // A key
				camera.sideSpeed = camera.maxWalkingSpeed;
			} else if (currentlyPressedKeys[68]) { // D key
				camera.sideSpeed = -camera.maxWalkingSpeed;
			} else {
				camera.sideSpeed = 0;
			}

			if (currentlyPressedKeys[38] || currentlyPressedKeys[87]) { // Up cursor key or W
				camera.speed = camera.maxWalkingSpeed;
			} else if (currentlyPressedKeys[40] || currentlyPressedKeys[83]) { // Down cursor key or S
				camera.speed = -camera.maxWalkingSpeed;
			} else {
				camera.speed = 0;
			}
		}
	}
    
    var currentMouseState = {};

	function handleMouseDown(event) {
 		currentMouseState.dragging = true;
 		currentMouseState.startPos = getCanvasCursorPosition(event);
	}

	function handleMouseUp(event) {
 		currentMouseState.dragging = false;
 		camera.yawRate = 0;
 		camera.pitchRate = 0;
	}
	
	function handleMouseMove(event) {
 		if (currentMouseState.dragging) {
 			currentMouseState.currentPos = getCanvasCursorPosition(event);
 			x = currentMouseState.currentPos.x - currentMouseState.startPos.x;
 			y = currentMouseState.currentPos.y - currentMouseState.startPos.y;
			if (GUIMode) {
				camera.yawRate = -0.0005 * x;
				camera.pitchRate = -0.0005 * y;
			}
 		}
	}
	    
	var lastTime = 0;
	var changed = false;

	function animate() {
		var timeNow = new Date().getTime();
		if (lastTime != 0) {
			var elapsed = timeNow - lastTime;

			var cameraDirection = [0, 0, -1, 0];
			var strafeDirection = [1, 0, 0, 0];
			var cameraMatrix = mat4.create();
			mat4.identity(cameraMatrix);
			mat4.rotate(cameraMatrix, deg2rad(camera.yaw), [0, 1, 0]);
			mat4.rotate(cameraMatrix, deg2rad(camera.pitch), [1, 0, 0]);
			
			if (camera.speed != 0) {
				cameraDirection = mat4.multiplyVec4(cameraMatrix, cameraDirection);
				camera.position[0] += cameraDirection[0] * camera.speed * elapsed;
				camera.position[1] += cameraDirection[1] * camera.speed * elapsed;
				camera.position[2] += cameraDirection[2] * camera.speed * elapsed;
				changed = true;
			}
			
			if (camera.sideSpeed != 0) {
				strafeDirection = mat4.multiplyVec4(cameraMatrix, strafeDirection);
				camera.position[0] -= strafeDirection[0] * camera.sideSpeed * elapsed;
				camera.position[1] -= strafeDirection[1] * camera.sideSpeed * elapsed;
				camera.position[2] -= strafeDirection[2] * camera.sideSpeed * elapsed;
				changed = true;
			}
			if (camera.yawRate != 0) {
				camera.yaw += camera.yawRate * elapsed;
				//console.log(camera.yaw);
				changed = true;
			}
			if (camera.pitchRate != 0) {
				camera.pitch += camera.pitchRate * elapsed;
				//console.log(camera.pitch);
				changed = true;
			}

		}
		lastTime = timeNow;
	}

	function tick() {
		requestAnimFrame(tick);
		handleKeys();
		animate();
		if (changed) {
			dibujarEscena();
			changed = false;
		}
	}
