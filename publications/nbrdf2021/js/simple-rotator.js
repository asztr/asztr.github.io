/**
 * An object of type SimpleRotator can be used to implement a trackball-like mouse rotation
 * of a WebGL scene about the origin.  Only the first parameter to the constructor is required.
 * When an object is created, mouse event handlers are set up on the canvas to respond to rotation.
 * The class defines the following methods for an object rotator of type SimpleRotator:
 *    rotator.setView(viewDirectionVector, viewUpVector, viewDistance) set up the view, where the
 * parameters are optional and are used in the same way as the corresponding parameters in the constructor;
 *    rotator.setViewDistance(viewDistance) sets the distance of the viewer from the origin without
 * changing the direction of view;
 *    rotator.getViewDistance() returns the viewDistance;
 *    rotator.getViewMatrix() returns a Float32Array representing the viewing transformation matrix
 * for the current view, suitable for use with gl.uniformMatrix4fv or for further transformation with
 * the glmatrix library mat4 class;
 *    rotator.getViewMatrixArray() returns the view transformation matrix as a regular JavaScript
 * array, but still represents as a 1D array of 16 elements, in column-major order.
 *
 * @param canvas the HTML canvas element used for WebGL drawing.  The user will rotate the
 *    scene by dragging the mouse on this canvas.  This parameter is required.
 * @param callback if present must be a function, which is called whenever the rotation changes.
 *    It is typically the function that draws the scene
 * @param viewDirectionVector if present must be an array of three numbers, not all zero.  The
 *    view is from the direction of this vector towards the origin (0,0,0).  If not present,
 *    the value [0,0,10] is used.
 * @param viewUpVector if present must be an array of three numbers. Gives a vector that will
 *    be seen as pointing upwards in the view.  If not present, the value is [0,1,0].
 * @param viewDistance if present must be a positive number.  Gives the distance of the viewer
 *    from the origin.  If not present, the length of viewDirectionVector is used.
 */
function SimpleRotator(canvas, callback, viewDirectionVector, viewUpVector, viewDistance) {
    var unitx = new Array(3);
    var unity = new Array(3);
    var unitz = new Array(3);
    var unitx_prev = new Array(3);
    var unity_prev = new Array(3);
    var unitz_prev = new Array(3);
    var viewZ;
    this.setView = function( viewDirectionVector, viewUpVector, viewDistance ) {
        var viewpoint = viewDirectionVector || [0,0,10];
        var viewup = viewUpVector || [0,1,0];
	if (viewDistance && typeof viewDistance == "number")
	    viewZ = viewDistance;
	else
	    viewZ = length(viewpoint);
        copy(unitz,viewpoint);
        normalize(unitz, unitz);
        copy(unity,unitz);
        scale(unity, unity, dot(unitz,viewup));
        subtract(unity,viewup,unity);
        normalize(unity,unity);
        cross(unitx,unity,unitz);
    }
    this.getViewMatrix = function (){
        return new Float32Array( this.getViewMatrixArray() );
    }
    this.getViewMatrixArray = function() {
	    return [ unitx[0], unity[0], unitz[0], 0,
                 unitx[1], unity[1], unitz[1], 0, 
                 unitx[2], unity[2], unitz[2], 0,
                 0, 0, -viewZ, 1 ];
        //return [ unitx[0], unitx[1], unitx[2], 0,
        //         unity[0], unity[1], unity[2], 0, 
        //         unitz[0], unitz[1], unitz[2], 0,
        //         0, 0, -viewZ, 1 ];
    }
    this.getViewDistance = function() {
	return viewZ;
    }
    this.setViewDistance = function(viewDistance) {
	viewZ = viewDistance;
    }
    function updateRot(e1, e2) {  // rotate vector e1 onto e2
/*
        function reflectInAxis(axis, source, destination) {
        	var s = 2 * (axis[0] * source[0] + axis[1] * source[1] + axis[2] * source[2]);
		    destination[0] = s*axis[0] - source[0];
		    destination[1] = s*axis[1] - source[1];
		    destination[2] = s*axis[2] - source[2];
        }
        normalize(e1,e1);
        normalize(e2,e2);
        var e = [0,0,0];
        add(e,e1,e2);
        normalize(e,e);
        var temp = [0,0,0];
        reflectInAxis(e,unitz,temp);
	reflectInAxis(e1,temp,unitz);
	reflectInAxis(e,unitx,temp);
	reflectInAxis(e1,temp,unitx);
	reflectInAxis(e,unity,temp);
	reflectInAxis(e1,temp,unity);
*/
/**/    
        // JMS new code
        // form rotation that takes e1 to e2 and then transform rotational axes with it
        function rotAngleAxis(dst, axis, ctheta, src) {
            var f = dot(src, axis)/(1 + ctheta);
            var tmp = [0,0,0];
            cross(tmp,axis,src);
            dst[0] = ctheta*src[0] + tmp[0] + f*axis[0];
            dst[1] = ctheta*src[1] + tmp[1] + f*axis[1];
            dst[2] = ctheta*src[2] + tmp[2] + f*axis[2];
        }

        var r = [0, 0, 0];
        cross(r, e1, e2);  // accumulate 
        //cross(r, e2, e1);  // accumulate inverse
        var cr = dot(e1, e2);
        rotAngleAxis(unitx, r, cr, unitx_prev);
        rotAngleAxis(unity, r, cr, unity_prev);
        rotAngleAxis(unitz, r, cr, unitz_prev);
/**/
    }
    var centerX = canvas.width/2;
    var centerY = canvas.height/2;
    //var radius = Math.min(centerX,centerY);
    var radius = Math.max(centerX, centerY)*Math.sqrt(2);
    var radius2 = radius * radius;
    var ray_prev = [0,0,0];
    var dragging = false;
    function doMouseDown(evt) {
        if (dragging)
           return;
        dragging = true;
        document.addEventListener("mousemove", doMouseDrag, false);
        document.addEventListener("mouseup", doMouseUp, false);
        var box = canvas.getBoundingClientRect();
        var x_prev = window.pageXOffset + evt.clientX - box.left;
        var y_prev = window.pageYOffset + evt.clientY - box.top;
        copy(unitx_prev, unitx);
        copy(unity_prev, unity);
        copy(unitz_prev, unitz);
        ray_prev = toRay(x_prev, y_prev);
    }
    function doMouseDrag(evt) {
        if (!dragging)
           return;
        var box = canvas.getBoundingClientRect();
        var x = window.pageXOffset + evt.clientX - box.left;
        var y = window.pageYOffset + evt.clientY - box.top;
        var ray = toRay(x,y);
        updateRot(ray_prev,ray);
	    if (callback) {
	        callback();
	    }
    }
    function doMouseUp(evt) {
        if (dragging) {
            document.removeEventListener("mousemove", doMouseDrag, false);
            document.removeEventListener("mouseup", doMouseUp, false);
            dragging = false;

            // orthogonalize rotation
            //function perpProj(dst, axis, src) {
            //    var f = dot(axis, src);
            //    dst[0] = src[0] - f * axis[0];
            //    dst[1] = src[1] - f * axis[1];
            //    dst[2] = src[2] - f * axis[2];
            //}
            //normalize(unitz, unitz);
            //perpProj(unity, unitz, unity);
            //normalize(unity, unity);
            //cross(unitx, unity, unitz); 
        }
    }
    function toRay(x,y) {
       var x = (x - centerX)/radius;
       var y = (centerY - y)/radius;
       var dsq = x*x + y*y;
       var z;
/*
       if (dsq > 1) {
           z = Math.sqrt(dsq - 1);
       } else {
           z = -Math.sqrt(1 - dsq);
       }
*/
       z = dsq - 1;
       var ray = [0,0,0];
       //ray[0] = x * unitx_prev[0] + y * unity_prev[0] + z * unitz_prev[0];
       //ray[1] = x * unitx_prev[1] + y * unity_prev[1] + z * unitz_prev[1];
       //ray[2] = x * unitx_prev[2] + y * unity_prev[2] + z * unitz_prev[2];
       //ray[0] = x * unitx_prev[0] + y * unitx_prev[1] + z * unitx_prev[2];
       //ray[1] = x * unity_prev[0] + y * unity_prev[1] + z * unity_prev[2];
       //ray[2] = x * unitz_prev[0] + y * unitz_prev[1] + z * unitz_prev[2];
       ray = [x, y, z];
       normalize(ray, ray);
       return ray;
    }
    function dot(v,w) {
	    return v[0]*w[0] + v[1]*w[1] + v[2]*w[2];
    }
    function length(v) {
	    return Math.sqrt(v[0]*v[0] + v[1]*v[1] + v[2]*v[2]);
    }
    function normalize(v,w) {
	    var d = length(w);
	    v[0] = w[0]/d;
	    v[1] = w[1]/d;
	    v[2] = w[2]/d;
    }
    function copy(v,w) {
	    v[0] = w[0];
	    v[1] = w[1];
	    v[2] = w[2];
    }
    function add(sum,v,w) {
	    sum[0] = v[0] + w[0];
	    sum[1] = v[1] + w[1];
	    sum[2] = v[2] + w[2];
    }
    function subtract(dif,v,w) {
	    dif[0] = v[0] - w[0];
	    dif[1] = v[1] - w[1];
	    dif[2] = v[2] - w[2];
    }
    function scale(ans,v,num) {
	    ans[0] = v[0] * num;
	    ans[1] = v[1] * num;
	    ans[2] = v[2] * num;
    }
    function cross(c,v,w) {
	    var x = v[1]*w[2] - v[2]*w[1];
	    var y = v[2]*w[0] - v[0]*w[2];
	    var z = v[0]*w[1] - v[1]*w[0];
	    c[0] = x;
	    c[1] = y;
	    c[2] = z;
    }
    this.setView(viewDirectionVector, viewUpVector, viewDistance);
    canvas.addEventListener("mousedown", doMouseDown, false);
}


