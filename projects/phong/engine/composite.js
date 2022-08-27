	function BezierSurface(vertices) {
		this.vertices = vertices;

		this.init();

		var m = this.vertices.length-1;
		var n = this.vertices[0].length-1;
		var du = 0.2;
		var dv = 0.2;

		var grid = [];
		var centre = vec3.create(0, 0, 0);

		for (var k=0; k<=m; k++) {
			for (var l=0; l<=n; l++) {
				centre = vec3.add(centre, this.vertices[k][l].vector());
			}
		}
		centre = vec3.scale(centre, 1/((m+1)*(n+1)));

		//genero grid, que tiene los puntos de la superficie (matriz bidimensional)
		for (var u = 0.0, k = 0; u<= 1.0; u += du, k++) {
			grid[k] = [];
			for (var v = 0.0, l = 0; v <= 1.0; v += dv, l++) {
				var surfacePoint = vec3.create(0.0, 0.0, 0.0);
				var surfacePointColor = Color.create(0.0, 0.0, 0.0, 1.0);
				for (var i=0; i<=m; i++) {
					var Bernstein_v = bernstein(m, i, v);
					for(var j=0; j<=n; j++) {
						var bernsteinFactor = bernstein(n, j, u) * Bernstein_v;
						surfacePoint = vec3.add(surfacePoint, vec3.scale(this.vertices[i][j].vector(), bernsteinFactor));
						surfacePointColor = Color.sum(surfacePointColor, Color.scale(this.vertices[i][j].c, bernsteinFactor));
					}
				}
				surfacePoint = vec3.subtract(surfacePoint, centre);
				grid[k][l] = new Vertice(surfacePoint[0], surfacePoint[1], surfacePoint[2], surfacePointColor);
			}
		}
		
		function vertices2Normal(v0, v1, v2) {
			var tmpNormal = vec3.normalize(vec3.cross(vec3.direction(v0.vector(), v1.vector()), vec3.direction(v0.vector(), v2.vector())));
			return concatFloat32Array(vec3.negate(tmpNormal), 0.0);
		}

		for(var k = 0; k<grid.length-1; k++) {
			for(var l = 0; l<grid[k].length-1; l++) {
				grid[k][l].normal = vertices2Normal(grid[k][l], grid[k+1][l], grid[k][l+1]);

				if (k == grid.length-2) grid[k+1][l].normal = vertices2Normal(grid[k][l], grid[k+1][l], grid[k][l+1]);
					else grid[k+1][l].normal = vertices2Normal(grid[k+1][l], grid[k+2][l], grid[k+1][l+1]);
					
				if (l == grid[k].length-2) grid[k][l+1].normal = vertices2Normal(grid[k][l], grid[k+1][l], grid[k][l+1]);
					else grid[k][l+1].normal = vertices2Normal(grid[k][l+1], grid[k+1][l+1], grid[k][l+2]);
					
				if (k == grid.length-2 || l == grid[k].length-2) grid[k+1][l+1].normal = vertices2Normal(grid[k][l], grid[k+1][l], grid[k][l+1]); 
					else grid[k+1][l+1].normal = vertices2Normal(grid[k+1][l+1], grid[k+2][l+1], grid[k+1][l+2]);

				var triangle1 = new Triangulo(grid[k][l], grid[k+1][l], grid[k][l+1]);
				var triangle2 = new Triangulo(grid[k+1][l+1], grid[k+1][l], grid[k][l+1]);

				this.addComponent(triangle1);
				this.addComponent(triangle2);
			}
		}
		this.translate(centre);
	}

	BezierSurface.prototype = new Escena();

	function Cubo(vc, dx, dy, dz) {
		this.vc = vc;

		this.init();

		var v = [];
		v[0] = new Vertice(-0.5, -0.5, -0.5, this.vc.c);
		v[1] = new Vertice( 0.5, -0.5, -0.5, this.vc.c);
		v[2] = new Vertice( 0.5, -0.5,  0.5, this.vc.c);
		v[3] = new Vertice(-0.5, -0.5,  0.5, this.vc.c);
		v[4] = new Vertice(-0.5,  0.5, -0.5, this.vc.c);
		v[5] = new Vertice( 0.5,  0.5, -0.5, this.vc.c);
		v[6] = new Vertice( 0.5,  0.5,  0.5, this.vc.c);
		v[7] = new Vertice(-0.5,  0.5,  0.5, this.vc.c);

		for(var i=0; i<8; i++)
			v[i].normal = concatFloat32Array(vec3.normalize(v[i].vector()), 0.0);

		var trianguloBottom1 = new Triangulo(v[0], v[1], v[2]);
		var trianguloBottom2 = new Triangulo(v[0], v[2], v[3]);

		var trianguloTop1 = new Triangulo(v[4], v[5], v[6]);
		var trianguloTop2 = new Triangulo(v[4], v[6], v[7]);

		var trianguloFront1 = new Triangulo(v[7], v[6], v[2]);
		var trianguloFront2 = new Triangulo(v[7], v[2], v[3]);

		var trianguloBack1 = new Triangulo(v[0], v[1], v[4]);
		var trianguloBack2 = new Triangulo(v[1], v[4], v[5]);

		var trianguloLeft1 = new Triangulo(v[0], v[3], v[7]);
		var trianguloLeft2 = new Triangulo(v[0], v[7], v[4]);

		var trianguloRight1 = new Triangulo(v[1], v[2], v[6]);
		var trianguloRight2 = new Triangulo(v[1], v[6], v[5]);

		this.addComponent(trianguloBottom1);
		this.addComponent(trianguloBottom2);
		this.addComponent(trianguloTop1);
		this.addComponent(trianguloTop2);
		this.addComponent(trianguloFront1);
		this.addComponent(trianguloFront2);
		this.addComponent(trianguloBack1);
		this.addComponent(trianguloBack2);
		this.addComponent(trianguloLeft1);
		this.addComponent(trianguloLeft2);
		this.addComponent(trianguloRight1);
		this.addComponent(trianguloRight2);

		this.scale([dx, dy, dz]);
		this.translate(this.vc.vector());
	}

	Cubo.prototype = new Escena();

	function Esfera(vc, r, dtheta, dphi) {
		this.init();

		this.vcentre = vc;
		this.radius = r;

		for (var theta = 0; theta < Math.PI; theta = theta + dtheta) {
			for (var phi = 0; phi < 2*Math.PI; phi = phi + dphi) {
				var x0 = this.radius * Math.cos(phi) * Math.sin(theta);
				var y0 = this.radius * Math.sin(phi) * Math.sin(theta);
				var z0 = this.radius * Math.cos(theta);
				var v0 = new Vertice(x0, y0, z0, this.vcentre.c);
				v0.normal = [Math.cos(phi) * Math.sin(theta), Math.sin(phi) * Math.sin(theta), Math.cos(theta), 0];

				var x1 = this.radius * Math.cos(phi + dphi) * Math.sin(theta);
				var y1 = this.radius * Math.sin(phi + dphi) * Math.sin(theta);
				var z1 = this.radius * Math.cos(theta);
				var v1 = new Vertice(x1, y1, z1, this.vcentre.c);
				v1.normal = [Math.cos(phi + dphi) * Math.sin(theta), Math.sin(phi + dphi) * Math.sin(theta), Math.cos(theta), 0];

				var x2 = this.radius * Math.cos(phi) * Math.sin(theta + dtheta);
				var y2 = this.radius * Math.sin(phi) * Math.sin(theta + dtheta);
				var z2 = this.radius * Math.cos(theta + dtheta);
				var v2 = new Vertice(x2, y2, z2, this.vcentre.c);
				v2.normal = [Math.cos(phi) * Math.sin(theta + dtheta), Math.sin(phi) * Math.sin(theta + dtheta), Math.cos(theta + dtheta), 0];

				var x3 = this.radius * Math.cos(phi + dphi) * Math.sin(theta + dtheta);
				var y3 = this.radius * Math.sin(phi + dphi) * Math.sin(theta + dtheta);
				var z3 = this.radius * Math.cos(theta + dtheta);
				var v3 = new Vertice(x3, y3, z3, this.vcentre.c);
				v3.normal = [Math.cos(phi + dphi) * Math.sin(theta + dtheta), Math.sin(phi + dphi) * Math.sin(theta + dtheta), Math.cos(theta + dtheta), 0];

				var triangulo1 = new Triangulo(v0, v1, v2);
				var triangulo2 = new Triangulo(v1, v2, v3);
				this.addComponent(triangulo1);
				this.addComponent(triangulo2);
			}
		}

		this.translate(this.vcentre.vector());
	}

	Esfera.prototype = new Escena();

	function EsferaDelDragon(vc, r, dtheta, dphi) {
		this.init();

		this.vcentre = vc;
		this.radius = r;

		var color1 = Color.create(0.88, 0.41, 0.086, 1.0);
		var color2 = Color.create(0.92, 0.66, 0.22, 1.0);

		for (var theta = 0; theta < Math.PI; theta = theta + dtheta) {
			color = Color.sum(color1, Color.scale(Color.sub(color2, color1), theta/Math.PI));
			for (var phi = 0; phi < 2*Math.PI; phi = phi + dphi) {
				var x0 = this.radius * Math.cos(phi) * Math.sin(theta);
				var y0 = this.radius * Math.sin(phi) * Math.sin(theta);
				var z0 = this.radius * Math.cos(theta);
				var v0 = new Vertice(x0, y0, z0, color);
				v0.normal = [Math.cos(phi) * Math.sin(theta), Math.sin(phi) * Math.sin(theta), Math.cos(theta), 0];

				var x1 = this.radius * Math.cos(phi + dphi) * Math.sin(theta);
				var y1 = this.radius * Math.sin(phi + dphi) * Math.sin(theta);
				var z1 = this.radius * Math.cos(theta);
				var v1 = new Vertice(x1, y1, z1, color);
				v1.normal = [Math.cos(phi + dphi) * Math.sin(theta), Math.sin(phi + dphi) * Math.sin(theta), Math.cos(theta), 0];

				var x2 = this.radius * Math.cos(phi) * Math.sin(theta + dtheta);
				var y2 = this.radius * Math.sin(phi) * Math.sin(theta + dtheta);
				var z2 = this.radius * Math.cos(theta + dtheta);
				var v2 = new Vertice(x2, y2, z2, color);
				v2.normal = [Math.cos(phi) * Math.sin(theta + dtheta), Math.sin(phi) * Math.sin(theta + dtheta), Math.cos(theta + dtheta), 0];

				var x3 = this.radius * Math.cos(phi + dphi) * Math.sin(theta + dtheta);
				var y3 = this.radius * Math.sin(phi + dphi) * Math.sin(theta + dtheta);
				var z3 = this.radius * Math.cos(theta + dtheta);
				var v3 = new Vertice(x3, y3, z3, color);
				v3.normal = [Math.cos(phi + dphi) * Math.sin(theta + dtheta), Math.sin(phi + dphi) * Math.sin(theta + dtheta), Math.cos(theta + dtheta), 0];

				var triangulo1 = new Triangulo(v0, v1, v2);
				var triangulo2 = new Triangulo(v1, v2, v3);
				this.addComponent(triangulo1);
				this.addComponent(triangulo2);
			}
		}

		this.translate(this.vcentre.vector());
	}

	EsferaDelDragon.prototype = new Escena();

	function Cilindro(vc, r, h, dtheta) {
		this.init();

		this.vcentre = vc;
		this.radius = r;

		for (var theta = 0; theta < 2*Math.PI; theta = theta + dtheta) {
			var x0 = this.radius * Math.cos(theta);
			var y0 = this.radius * Math.sin(theta);
			var z0 = -h/2;
			var v0 = new Vertice(x0, y0, z0, this.vcentre.c);
			v0.normal = [Math.cos(theta), Math.sin(theta), 0.0, 0.0];

			var x1 = this.radius * Math.cos(theta + dtheta);
			var y1 = this.radius * Math.sin(theta + dtheta);
			var z1 = -h/2;
			var v1 = new Vertice(x1, y1, z1, this.vcentre.c);
			v1.normal = [Math.cos(theta + dtheta), Math.sin(theta + dtheta), 0.0, 0.0];

			var x2 = this.radius * Math.cos(theta);
			var y2 = this.radius * Math.sin(theta);
			var z2 = h/2;
			var v2 = new Vertice(x2, y2, z2, this.vcentre.c);
			v2.normal = [Math.cos(theta), Math.sin(theta), 0.0, 0.0];

			var x3 = this.radius * Math.cos(theta + dtheta);
			var y3 = this.radius * Math.sin(theta + dtheta);
			var z3 = h/2;
			var v3 = new Vertice(x3, y3, z3, this.vcentre.c);
			v3.normal = [Math.cos(theta + dtheta), Math.sin(theta + dtheta), 0.0, 0.0];

			var triangulo1 = new Triangulo(v0, v1, v2);
			var triangulo2 = new Triangulo(v1, v2, v3);
			this.addComponent(triangulo1);
			this.addComponent(triangulo2);
		}
		this.translate(this.vcentre.vector());
	}

	Cilindro.prototype = new Escena();

	function Circulo(vc, r, dtheta) {
		this.init();

		this.vcentre = vc;
		this.radius = r;

		for (var theta = 0; theta < 2*Math.PI; theta = theta + dtheta) {
			var v0 = new Vertice(0, 0, 0, this.vcentre.c);
			v0.normal = [0.0, 0.0, 1.0, 0.0];

			var x1 = this.radius * Math.cos(theta);
			var y1 = this.radius * Math.sin(theta);
			var z1 = 0;
			var v1 = new Vertice(x1, y1, z1, this.vcentre.c);
			v1.normal = [0.0, 0.0, 1.0, 0.0];

			var x2 = this.radius * Math.cos(theta + dtheta);
			var y2 = this.radius * Math.sin(theta + dtheta);
			var z2 = 0
			var v2 = new Vertice(x2, y2, z2, this.vcentre.c);
			v2.normal = [0.0, 0.0, 1.0, 0.0];

			var triangulo1 = new Triangulo(v0, v1, v2);
			this.addComponent(triangulo1);
		}
		this.translate(this.vcentre.vector());
	}

	Circulo.prototype = new Escena();

	function CilindroConTapas(vc, r, h, dtheta) {
		this.init();

		this.addComponent(new Cilindro(new Vertice(0, 0, 0, vc.c), r, h, dtheta));
		this.addComponent(new Circulo(new Vertice(0, 0, -h/2, vc.c), r, dtheta));
		this.addComponent(new Circulo(new Vertice(0, 0, h/2, vc.c), r, dtheta));
		this.translate(vc.vector());
	}

	CilindroConTapas.prototype = new Escena();

	function CilindroCon2Radios(vc, r1, r2, h, dz, dtheta) {
		this.init();

		this.vcentre = vc;
		this.radius1 = r1;
		this.radius2 = r1;

		for (var theta = 0; theta < 2*Math.PI; theta = theta + dtheta) {
			for (var z=-h/2; z < h/2; z = z + dz) {
				var a = 2*(r2-r1)/Math.pow(h,2);
				var b = (r2-r1)/h;
				this.radius1 = r1 + a*Math.pow(z,2) + b*z;
				this.radius2 = r1 + a*Math.pow(z+dz,2) + b*(z+dz);

				var x0 = this.radius1 * Math.cos(theta);
				var y0 = this.radius1 * Math.sin(theta);
				var z0 = z;
				var v0 = new Vertice(x0, y0, z0, this.vcentre.c);
				v0.normal = [Math.cos(theta), Math.sin(theta), 0.0, 0.0];

				var x1 = this.radius1 * Math.cos(theta + dtheta);
				var y1 = this.radius1 * Math.sin(theta + dtheta);
				var z1 = z;
				var v1 = new Vertice(x1, y1, z1, this.vcentre.c);
				v1.normal = [Math.cos(theta + dtheta), Math.sin(theta + dtheta), 0.0, 0.0];

				var x2 = this.radius2 * Math.cos(theta);
				var y2 = this.radius2 * Math.sin(theta);
				var z2 = z + dz;
				var v2 = new Vertice(x2, y2, z2, this.vcentre.c);
				v2.normal = [Math.cos(theta), Math.sin(theta), 0.0, 0.0];

				var x3 = this.radius2 * Math.cos(theta + dtheta);
				var y3 = this.radius2 * Math.sin(theta + dtheta);
				var z3 = z + dz;
				var v3 = new Vertice(x3, y3, z3, this.vcentre.c);
				v3.normal = [Math.cos(theta + dtheta), Math.sin(theta + dtheta), 0.0, 0.0];

				var triangulo1 = new Triangulo(v0, v1, v2);
				var triangulo2 = new Triangulo(v1, v2, v3);
				this.addComponent(triangulo1);
				this.addComponent(triangulo2);
			}
		}
		this.translate(this.vcentre.vector());
	}

	CilindroCon2Radios.prototype = new Escena();

	function Enterprise(vc, rcasco, dtheta) {
		this.init();

		var casco = new CilindroConTapas(new Vertice(0, 0, 0, vc.c), rcasco, 0.05*rcasco, dtheta);
		this.addComponent(casco);

		colorNucleo = Color.create(0.1, 0.3, 1, 1);
		var nucleo = new CilindroCon2Radios(new Vertice(0, 0, 0, vc.c), 0.2*rcasco, 0.1*rcasco, 0.6*rcasco, 0.2*rcasco, dtheta);
		var tapaNucleo1 = new Circulo(new Vertice(0, 0, -0.3*rcasco, colorNucleo), 0.2*rcasco, dtheta);
		var tapaNucleo2 = new Circulo(new Vertice(0, 0, 0.3*rcasco, vc.c), 0.1*rcasco, dtheta);
		nucleo.addComponent(tapaNucleo1);
		nucleo.addComponent(tapaNucleo2);
		nucleo.rotateX(deg2rad(90));
		nucleo.translate([0, rcasco, -rcasco*0.75]);
		this.addComponent(nucleo);

		var impulsor1 = new Cubo(new Vertice(0, 0, 0, vc.c), 0.1*rcasco, 0.7*rcasco, 0.1*rcasco);
		var impulsor2 = new Cubo(new Vertice(0, 0, 0, vc.c), 0.1*rcasco, 0.7*rcasco, 0.1*rcasco);
		impulsor1.translate([0.3*rcasco, 1.3*rcasco, -0.3*rcasco]);
		impulsor2.translate([-0.3*rcasco, 1.3*rcasco, -0.3*rcasco]);
		this.addComponent(impulsor1);
		this.addComponent(impulsor2);

		var palo1 = new Cubo(new Vertice(0, 0, 0, vc.c), 0.05*rcasco, 0.05*rcasco, 0.6*rcasco);
		palo1.translate([0, 0.8*rcasco, -0.25*rcasco]);
		palo1.rotateX(deg2rad(-15));
		this.addComponent(palo1);

		var palo2 = new Cubo(new Vertice(0, 0, 0, vc.c), 0.05*rcasco, 0.05*rcasco, 0.35*rcasco);
		var palo3 = new Cubo(new Vertice(0, 0, 0, vc.c), 0.05*rcasco, 0.05*rcasco, 0.35*rcasco);
		palo2.translate([0.2*rcasco, 1.2*rcasco, -0.5*rcasco]);
		palo2.rotateX(deg2rad(15));
		palo2.rotateY(deg2rad(-20));
		palo3.translate([-0.2*rcasco, 1.2*rcasco, -0.5*rcasco]);
		palo3.rotateX(deg2rad(15));
		palo3.rotateY(deg2rad(20));
		this.addComponent(palo2);
		this.addComponent(palo3);




		this.translate(vc.vector());
	}

	Enterprise.prototype = new Escena();
