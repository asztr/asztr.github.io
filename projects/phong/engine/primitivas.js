	function AffineTransforms() {
		this.transfS;
		this.transfR;
		this.transfT;
		this.transf;

		//devuelve la matriz T.R.S
		this.getTransf = function() {
			var transfTmp = mat4.create();
			transfTmp = mat4.multiply(this.transfT, this.transfR);
			this.transf = mat4.multiply(transfTmp, this.transfS);
			return this.transf;
		}

		//agrega a transfT la traslacion dada por vec
		this.translate = function(vec) {
			mat4.translate(this.transfT, vec);
		}

		//agrega a transfS el scaling dado por vec
		this.scale = function(vec) {
			mat4.scale(this.transfS, vec);
		}

		//agrega a transfR una rotacion angle en XY
		this.rotateZ = function(angle) {
			var newtransfR = mat4.create();
			mat4.identity(newtransfR);
			newtransfR[0] = Math.cos(angle);
			newtransfR[1] = -Math.sin(angle);
			newtransfR[4] = Math.sin(angle);
			newtransfR[5] = Math.cos(angle);
			this.transfR = mat4.multiply(newtransfR, this.transfR);
		}

		//agrega a transfR una rotacion angle en XZ
		this.rotateY = function(angle) {
			var newtransfR = mat4.create();
			mat4.identity(newtransfR);
			newtransfR[0] = Math.cos(angle);
			newtransfR[2] = Math.sin(angle);
			newtransfR[8] = -Math.sin(angle);
			newtransfR[10] = Math.cos(angle);
			this.transfR = mat4.multiply(newtransfR, this.transfR);
		}

		//agrega a transfR una rotacion angle en YZ
		this.rotateX = function(angle) {
			var newtransfR = mat4.create();
			mat4.identity(newtransfR);
			newtransfR[5] = Math.cos(angle);
			newtransfR[6] = -Math.sin(angle);
			newtransfR[9] = Math.sin(angle);
			newtransfR[10] = Math.cos(angle);
			this.transfR = mat4.multiply(newtransfR, this.transfR);
		}
		
		//esto estaba en el constructor
		this.init = function() {
			this.transf = mat4.create();
			this.transfS = mat4.create();
			this.transfR = mat4.create();
			this.transfT = mat4.create();
			mat4.identity(this.transf);
			mat4.identity(this.transfS);
			mat4.identity(this.transfR);
			mat4.identity(this.transfT);
		}
	}

	function Triangulo(v0, v1, v2) {
		this.v0 = v0;
		this.v1 = v1;
		this.v2 = v2;
		
		this.init();

		this.draw = function(t) {
			var nodeTransf = mat4.create();
			nodeTransf = mat4.multiply(t, this.getTransf());

			//meto en una lista los vertices del triangulo transformados
			var transfVertices = [transformVertex(this.v0, nodeTransf), transformVertex(this.v1, nodeTransf), transformVertex(this.v2, nodeTransf)];

			for (var i=0; i < 3 ; i++) {
				triangleBuffer.push(transfVertices[i].x, transfVertices[i].y, transfVertices[i].z);
				triangleColorBuffer.push(Color.r(transfVertices[i].c), Color.g(transfVertices[i].c), Color.b(transfVertices[i].c), 1);
				triangleNormalBuffer.push(transfVertices[i].normal[0], transfVertices[i].normal[1], transfVertices[i].normal[2]);
			}

		}
	}

	Triangulo.prototype = new AffineTransforms();

	function Punto(v0) {
		this.v0 = v0;
		this.v0.normal = [0, 0, 0, 0];
		
		this.init();

		this.draw = function(t) {
			var nodeTransf = mat4.create();
			nodeTransf = mat4.multiply(t, this.getTransf());

			var transfVertex = transformVertex(this.v0, nodeTransf);

			pointBuffer.push(transfVertex.x, transfVertex.y, transfVertex.z);
			pointColorBuffer.push(Color.r(transfVertex.c), Color.g(transfVertex.c), Color.b(transfVertex.c), 1);
			pointNormalBuffer.push(transfVertex.normal[0], transfVertex.normal[1], transfVertex.normal[2]);
		}
	}

	Punto.prototype = new AffineTransforms();

	function Vertice(x, y, z, c) {
		this.x = x;
		this.y = y;
		this.z = z;
		this.c = c;

		this.normal = []; //FIXME (inventar vec4?)

		this.setVector = function(v) {
			this.x = v[0];
			this.y = v[1];
			this.z = v[2];
		}

		this.vector = function() {
			var ret = vec3.create();
			ret[0] = this.x;
			ret[1] = this.y;
			ret[2] = this.z;
			return ret;
		}
	}

	//devuelve transf . v
	function transformVertex(v, transf) {
		var TVertex = new Vertice(0, 0, 0, v.c);
		TVertex.setVector(mat4.multiplyVec3(transf, v.vector()));
		TVertex.normal = mat4.multiplyVec4(transf, v.normal);
		return TVertex;
	}
