	function loadModel(modelURL) {
		xmlhttp = new XMLHttpRequest(); // Firefox!
		xmlhttp.open("GET", modelURL, false);
		xmlhttp.send(null);
		var modelData = JSON.parse(xmlhttp.responseText);
		var model = new JSONModel(modelData);
		escena.addComponent(model);
		return model;
	}

	function JSONModel(data) {
		this.init();
		this.data = data;
		
		this.draw = function(t) {
			// vertices[0] = position_buffer
			// vertices[1] = normal_buffer
			// connectivity[0] = triangle_list
			// FIXME: esto es siempre asi o habria que fijarse en name?
			var nodeTransf = mat4.create();
			var color = Color.create(1, 1, 1, 1);
			nodeTransf = mat4.multiply(t, this.getTransf());

			for (var i=0; i < this.data.connectivity[0].indices.length; i+=3) {
				// FIXME: estoy hardcodeando un downscaling por 1000 para que se vea en nuestro mundo
				var v1 = new Vertice(
					this.data.vertices[0].values[this.data.connectivity[0].indices[i]*3] / 1000,
					this.data.vertices[0].values[this.data.connectivity[0].indices[i]*3+1] / 1000,
					this.data.vertices[0].values[this.data.connectivity[0].indices[i]*3+2] / 1000);
				v1.normal = [
					this.data.vertices[1].values[this.data.connectivity[0].indices[i]*3],
					this.data.vertices[1].values[this.data.connectivity[0].indices[i]*3+1],
					this.data.vertices[1].values[this.data.connectivity[0].indices[i]*3+2],
					0
				];
				var v2 = new Vertice(
					this.data.vertices[0].values[this.data.connectivity[0].indices[i+1]*3] / 1000,
					this.data.vertices[0].values[this.data.connectivity[0].indices[i+1]*3+1] / 1000,
					this.data.vertices[0].values[this.data.connectivity[0].indices[i+1]*3+2] / 1000);
				v2.normal = [
					this.data.vertices[1].values[this.data.connectivity[0].indices[i+1]*3],
					this.data.vertices[1].values[this.data.connectivity[0].indices[i+1]*3+1],
					this.data.vertices[1].values[this.data.connectivity[0].indices[i+1]*3+2],
					0
				];
				var v3 = new Vertice(
					this.data.vertices[0].values[this.data.connectivity[0].indices[i+2]*3] / 1000,
					this.data.vertices[0].values[this.data.connectivity[0].indices[i+2]*3+1] / 1000,
					this.data.vertices[0].values[this.data.connectivity[0].indices[i+2]*3+2] / 1000);
				v3.normal = [
					this.data.vertices[1].values[this.data.connectivity[0].indices[i+2]*3],
					this.data.vertices[1].values[this.data.connectivity[0].indices[i+2]*3+1],
					this.data.vertices[1].values[this.data.connectivity[0].indices[i+2]*3+2],
					0
				];
				var tVertex1 = transformVertex(v1, nodeTransf);
				var tVertex2 = transformVertex(v2, nodeTransf);
				var tVertex3 = transformVertex(v3, nodeTransf);
				
				triangleBuffer.push(tVertex1.x, tVertex1.y, tVertex1.z);
				triangleColorBuffer.push(Color.r(color), Color.g(color), Color.b(color), 1);
				triangleNormalBuffer.push(tVertex1.normal[0], tVertex1.normal[1], tVertex1.normal[2]);

				triangleBuffer.push(tVertex2.x, tVertex2.y, tVertex2.z);
				triangleColorBuffer.push(Color.r(color), Color.g(color), Color.b(color), 1);
				triangleNormalBuffer.push(tVertex2.normal[0], tVertex2.normal[1], tVertex2.normal[2]);

				triangleBuffer.push(tVertex3.x, tVertex3.y, tVertex3.z);
				triangleColorBuffer.push(Color.r(color), Color.g(color), Color.b(color), 1);
				triangleNormalBuffer.push(tVertex3.normal[0], tVertex3.normal[1], tVertex3.normal[2]);
			}
		}
	}

	JSONModel.prototype = new AffineTransforms();
