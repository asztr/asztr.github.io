	function findOffsets(obj) {
		var curleft = curtop = 0;

		if (obj.offsetParent) {
			do {
				curleft += obj.offsetLeft;
				curtop += obj.offsetTop;
			} while (obj = obj.offsetParent);
		}

		return {left: curleft, top: curtop};
	}

	function getCanvasCursorPosition(e) {
		var x;
		var y;
		var canvas = document.getElementById("canvas");

		var nodeOffsets = findOffsets(canvas);
		
		x = e.clientX + 
				document.documentElement.scrollLeft - nodeOffsets.left;
		y = e.clientY + 
				document.documentElement.scrollTop - nodeOffsets.top;

		return {x: x, y: y};
	}

	function viewportToWorldCoords(viewport_x, viewport_y) {
		var world_x = 2.0/gl.viewportWidth*viewport_x - 1.0;
		var world_y = -2.0/gl.viewportHeight*viewport_y + 1.0;
		
		return {x: world_x, y: world_y};
	}

	function worldToViewportCoords(world_x, world_y) {
		var viewport_x = gl.viewportWidth/2.0*(world_x + 1.0);
		var viewport_y = gl.viewportHeight/2.0*(1.0 - world_y);
	
		return {x: viewport_x, y: viewport_y, round: function() { return { x: Math.floor(viewport_x), y: Math.floor(viewport_y) }; } };
	}

	function map(fn, a) {
		var ret = [];
		for (i = 0; i < a.length; i++) {
			ret[i] = fn(a[i]);
		}
		return ret;
	}

	function zipmap(fn, a, b) {
		var ret = [];
		
		for (i = 0; i < a.length; i++) {
			ret[i] = fn(a[i], b[i]);
		}
		
		return ret;
	}
	
	function deg2rad(deg) {
		return deg*Math.PI/180;
	}

	// Array Remove - By John Resig (MIT Licensed)
	Array.prototype.remove = function(from, to) {
		var rest = this.slice((to || from) + 1 || this.length);
		this.length = from < 0 ? this.length + from : from;
		return this.push.apply(this, rest);
	}

	function concatFloat32Array(array, elem) {
		var a = new Float32Array(array.length+1);
		for (var i = 0; i < array.length; i++) {
			a[i] = array[i];
		}
		a[array.length] = elem;
		return a;
	}

	function combinatorial(n, k) {
		var num = 1;
		var den = 1;

		for (var i = 1; i <= Math.min(k, n-k); i++) {
			den = den * i;
		}			
		
		for (var i = Math.max(k, n-k) + 1; i <= n; i++) {
			num = num * i;
		}
		
		return num / den;
	}
	
	function bernstein(n, j, u) {
		return combinatorial(n, j) * Math.pow(u, j) * Math.pow(1.0-u, n-j);
	}
