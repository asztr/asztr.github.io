	Color = {};

	Color.create = function(r, g, b, a) {
		var ret = new Float32Array(4);
		ret[0] = r;
		ret[1] = g;
		ret[2] = b;
		ret[3] = a;
		return ret;
	}
	
	Color.set = function(c, r, g, b, a) {
		c[0] = r;
		c[1] = g;
		c[2] = b;
		c[3] = a;
	}
	
	Color.sum = function(a, b) {
		var ret = Color.create(a[0]+b[0],a[1]+b[1],a[2]+b[2],a[3]+b[3]);
		return ret;
	}

	Color.sub = function(a, b) {
		var ret = Color.create(a[0]-b[0],a[1]-b[1],a[2]-b[2],a[3]-b[3]);
		return ret;
	}

	Color.scale = function(c, a) {
		var ret = Color.create(a*c[0], a*c[1], a*c[2], a*c[3]);
		return ret;
	}

	Color.directProduct = function(a, b) {
		var ret = Color.create(a[0]*b[0], a[1]*b[1], a[2]*b[2], a[3]*b[3]);
		return ret;
	}

	Color.r = function(c) { return c[0]; }
	Color.g = function(c) { return c[1]; }
	Color.b = function(c) { return c[2]; }
	Color.a = function(c) { return c[3]; }
