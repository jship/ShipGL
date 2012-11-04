/**
 * @file Contains all ShipGL initialization code.
 * @author Jason Shipman
 *
 * Copyright (C) 2012 Jason Shipman
 * This software is provided 'as-is', without any express or implied warranty.
 * In no event will the authors be held liable for any damages arising from the
 * use of this software.
 *
 * Permission is granted to anyone to use this software for any purpose,
 * including commercial applications, and to alter it and redistribute it
 * freely, subject to the following restrictions:
 *
 * 1. The origin of this software must not be misrepresented; you must not
 * claim that you wrote the original software. If you use this software
 * in a product, an acknowledgment in the product documentation would be
 * appreciated but is not required.
 *
 * 2. Altered source versions must be plainly marked as such, and must not be
 * misrepresented as being the original software.
 *
 * 3. This notice may not be removed or altered from any source distribution.
 */

/**
 * The ShipGL namespace construction.  To avoid polluting the global
 * namespace, ShipGL just introduces a single global. (Not surprisingly,
 * named ShipGL)
 */
var ShipGL = ShipGL || {};

/**
 * Creates a new ShipGL.GLResource instance.  ShipGL.GLResource serves as the
 * parent class of many of the classes in ShipGL.
 *
 * @class ShipGL.GLResource
 * @classdesc A ShipGL.GLResource object has access to the rendering context
 *            stored in its gl field.
 *
 * @param {WebGLRenderingContext} gl The rendering context
 */
ShipGL.GLResource = function(gl)
{
    /**
     * @memberof ShipGL.GLResource#
     * @description The WebGL rendering context
     * @name gl
     */
    this.gl = gl;
};
/**
 * @file Contains all ShipGL.FileLoader code.
 * @author Jason Shipman
 *
 * Copyright (C) 2012 Jason Shipman
 * This software is provided 'as-is', without any express or implied warranty.
 * In no event will the authors be held liable for any damages arising from the
 * use of this software.
 *
 * Permission is granted to anyone to use this software for any purpose,
 * including commercial applications, and to alter it and redistribute it
 * freely, subject to the following restrictions:
 *
 * 1. The origin of this software must not be misrepresented; you must not
 * claim that you wrote the original software. If you use this software
 * in a product, an acknowledgment in the product documentation would be
 * appreciated but is not required.
 *
 * 2. Altered source versions must be plainly marked as such, and must not be
 * misrepresented as being the original software.
 *
 * 3. This notice may not be removed or altered from any source distribution.
 */

/**
 * ShipGL.FileLoader can synchronously load both local and HTTP files.
 * Function documentation is provided through an example since JSDoc doesn't
 * have great support for documenting singleton-like objects.

 * @example
 * // Load a local text file named "war_and_peace.txt". Store string.
 * var localText = ShipGL.FileLoader.loadLocal("war_and_peace.txt");
 *
 * // Load a text file from a server named "war_and_peace.txt". Store string.
 * var serverText = ShipGL.FileLoader.loadHttp("war_and_peace.txt");
 *
 * // Load a local JSON model file. Note that JSON's MIME type is passed as
 * // well in order to prevent annoying warnings/errors in Firefox.
 * var model = ShipGL.FileLoader.loadLocal("godzilla.json", "application/json");
 *
 * // Try loading a file from a server. If it fails, try loading the file
 * // locally.  This is useful if you work on your WebGL code locally and then
 * // don't want to make file-related modifications for it to work on a server.
 * var data = ShipGL.FileLoader.loadHttp("data.txt") ||
 *            ShipGL.FileLoader.loadLocal("data.txt");
 */
ShipGL.FileLoader = (function()
{
    function makeSynchronousLoader(statusCode)
    {
        return function(url, mimeType)
        {
            var req = new XMLHttpRequest();
            req.open("GET", url, false);

            if (mimeType)
            {
                req.overrideMimeType(mimeType);
            }

            req.send(null);
            return (req.status == statusCode) ? req.responseText : null;
        };
    };

    return { loadLocal: makeSynchronousLoader(0),
             loadHttp: makeSynchronousLoader(200)
    };
})();
/**
 * @file Contains all ShipGL.Math code.
 * @author Jason Shipman
 *
 * Copyright (C) 2012 Jason Shipman
 * This software is provided 'as-is', without any express or implied warranty.
 * In no event will the authors be held liable for any damages arising from the
 * use of this software.
 *
 * Permission is granted to anyone to use this software for any purpose,
 * including commercial applications, and to alter it and redistribute it
 * freely, subject to the following restrictions:
 *
 * 1. The origin of this software must not be misrepresented; you must not
 * claim that you wrote the original software. If you use this software
 * in a product, an acknowledgment in the product documentation would be
 * appreciated but is not required.
 *
 * 2. Altered source versions must be plainly marked as such, and must not be
 * misrepresented as being the original software.
 *
 * 3. This notice may not be removed or altered from any source distribution.
 */

/**
 * ShipGL.Math provides some helpful math routines. Function documentation
 * is provided through an example since JSDoc doesn't have great support for
 * documenting singleton-like objects.
 *
 * @example
 * // toDegrees(radians)
 * var degrees = ShipGL.Math.toDegrees(Math.PI);
 *
 * // toRadians(degrees)
 * var radians = ShipGL.Math.toRadians(180);
 *
 * // isPowerOf2(x)
 * var powerOf2Check = ShipGL.Math.isPowerOf2(1024);
 *
 * // nextHighestPowerOf2(x)
 * var nextPowerOf2 = nextHighestPowerOf2(1000); // nextPowerOf2 == 1024
 *
 * // makeClamp(min, max) returns a function that will clamp values between
 * // min and max.
 * var clamp = ShipGL.Math.makeClamp(0, 255);
 * var invalidColorValue = 256;
 * var validColorValue = clamp(invalidColorValue); // validColorValue == 255
 *
 * // lerp(val1, val2, amount) linearly interpolates between val1 and val2
 * // based on amount.
 * var halfway = ShipGL.Math.lerp(0, 100, 0.5); // halfway == 50;
 *
 * // sphericalToCartesian(theta, phi, r) converts spherical coordinates to
 * // Cartesian coordinates. theta and phi specified in degrees!  If r is
 * // not specified, it will default to 1.
 * var cartesian = ShipGL.Math.sphericalToCartesian(45, 45);
 *
 * // arbitraryRotation(angle, center, axis, dest), angle in degrees!
 * var destMatrix = mat4.create();
 * // Create a rotation matrix for a 90 degree rotation about the Y-axis,
 * // centered at [1, 2, 3]. Result is written into destMatrix.
 * ShipGL.Math.arbitraryRotation(90, [1, 2, 3], [0, 1, 0], destMatrix);
 */
ShipGL.Math = (function()
{
    function toDegrees(radians)
    {
        return radians * 180 / Math.PI;
    };

    function toRadians(degrees)
    {
        return degrees * Math.PI / 180;
    };
    
    // Pulled from: http://www.khronos.org/webgl/wiki/WebGL_and_OpenGL_Differences#Non-Power_of_Two_Texture_Support
    function isPowerOf2(x)
    {
        return (x & (x - 1)) == 0;
    };
     
    // Pulled from: http://www.khronos.org/webgl/wiki/WebGL_and_OpenGL_Differences#Non-Power_of_Two_Texture_Support
    function nextHighestPowerOf2(x)
    {
        --x;

        for (var i = 1; i < 32; i <<= 1)
        {
            x = x | x >> i;
        }

        return x + 1;
    };
    
    function makeClamp(min, max)
    {
        return function(value)
        {
            return Math.min(Math.max(value, min), max);
        };
    };

    function lerp(val1, val2, amount)
    {
        return val1 + (val2 - val1) * amount;
    };
    
    // Provided in a code sample from Dr. Pattanaik.
    // Modified to fit ShipGL coding style.
    function sphericalToCartesian(theta, phi, r)
    {
        r = r || 1;

        var radTheta = toRadians(theta);
        var radPhi = toRadians(phi);

        var cartesian = [
            r * Math.cos(radPhi) * Math.sin(radTheta),
            r * Math.sin(radPhi) * Math.sin(radTheta),
            r * Math.cos(radTheta)
        ];

        return cartesian;
    };

    // Angle in radians!
    // Provided in a code sample from Dr. Pattanaik.
    // Modified to fit ShipGL coding style.
    function arbitraryRotation(angle, center, axis, dest)
    {
        mat4.identity(dest);
        return mat4.translate(mat4.rotate(mat4.translate(dest, center), angle, axis),
                              [-center[0], -center[1], -center[2]]);
    }

    return { toDegrees: toDegrees,
             toRadians: toRadians,
             isPowerOf2: isPowerOf2,
             nextHighestPowerOf2: nextHighestPowerOf2,
             makeClamp: makeClamp,
             lerp: lerp,
             sphericalToCartesian: sphericalToCartesian,
             arbitraryRotation: arbitraryRotation
    };
})();

/**
 * @file Contains all ShipGL.Camera code.
 * @author Jason Shipman
 *
 * Copyright (C) 2012 Jason Shipman
 * This software is provided 'as-is', without any express or implied warranty.
 * In no event will the authors be held liable for any damages arising from the
 * use of this software.
 *
 * Permission is granted to anyone to use this software for any purpose,
 * including commercial applications, and to alter it and redistribute it
 * freely, subject to the following restrictions:
 *
 * 1. The origin of this software must not be misrepresented; you must not
 * claim that you wrote the original software. If you use this software
 * in a product, an acknowledgment in the product documentation would be
 * appreciated but is not required.
 *
 * 2. Altered source versions must be plainly marked as such, and must not be
 * misrepresented as being the original software.
 *
 * 3. This notice may not be removed or altered from any source distribution.
 */

/**
 * Creates a new ShipGL.Camera instance.
 *
 * @class ShipGL.Camera
 * @classdesc A ShipGL.Camera object provides a means to navigate the scene.
 *
 * @param {vec3} position The camera's position
 * @param {vec3} target The point the camera should be looking at
 * @param {vec3} up The camera's up vector. The up you pass in will not
 *                  necessarily be the camera's up vector. The passed in up is
 *                  just used to help construct the camera's coordinate frame.
 */
ShipGL.Camera = function(position, target, up)
{
    /**
     * @memberof ShipGL.Camera#
     * @description The camera's view matrix. Pass this to your shaders.
     * @name viewMatrix
     */
    this.viewMatrix = mat4.create();
    
    this._scratchVec = vec3.create();
    vec3.direction(position, target, this._scratchVec);

    /**
     * @memberof ShipGL.Camera#
     * @description The point in space where the camera is positioned
     * @name position
     */
    this.position = vec3.create(position);

    /**
     * @memberof ShipGL.Camera#
     * @description The direction the camera is pointing
     * @name direction
     */
    this.direction = vec4.create();
    vec3.negate(this._scratchVec, this.direction);
    
    /**
     * @memberof ShipGL.Camera#
     * @description The right direction relative to the camera's
     *              forward direction.
     * @name right
     */
    this.right = vec4.create();
    vec3.cross(up, this._scratchVec, this.right);
    vec3.normalize(this.right);

    /**
     * @memberof ShipGL.Camera#
     * @description The up direction
     * @name up
     */
    this.up = vec4.create();
    vec3.cross(this._scratchVec, this.right, this.up);
    vec3.normalize(this.up);

    /**
     * @memberof ShipGL.Camera#
     * @description The camera's movement speed
     * @name moveSpeed
     */
    this.moveSpeed = 5;
    
    /**
     * @memberof ShipGL.Camera#
     * @description The camera's turning speed (in radians!)
     * @name lookSpeed
     */
    this.lookSpeed = ShipGL.Math.toRadians(3); 

    this._leftRotMat = mat4.create();
    this._rightRotMat = mat4.create();

    this._update();
    this._updateRotationStuff();
};

/**
 * Set the position of the camera.
 *
 * @this {ShipGL.Camera}
 *
 * @param {vec3} p The new position of the camera
 */
ShipGL.Camera.prototype.setPosition = function(p)
{
    vec3.set(p, this.position);
    this._update();
};

/**
 * Set the movement speed of the camera.
 *
 * @this {ShipGL.Camera}
 *
 * @param {number} speed The new movement speed of the camera
 */
ShipGL.Camera.prototype.setMoveSpeed = function(speed)
{
    this.moveSpeed = Math.abs(speed);
};

/**
 * Set the turning speed of the camera.
 *
 * @this {ShipGL.Camera}
 *
 * @param {number} speed The new turning speed of the camera in radians.
 */
ShipGL.Camera.prototype.setLookSpeed = function(speed)
{
    this.lookSpeed = Math.abs(speed);
    this._updateRotationStuff();
};

ShipGL.Camera.prototype._update = function()
{
    vec3.scale(this.direction, this.moveSpeed, this._scratchVec);
    vec3.add(this.position, this._scratchVec, this._scratchVec);
    mat4.lookAt(this.position, this._scratchVec, this.up, this.viewMatrix);
};

ShipGL.Camera.prototype._updateRotationStuff = function()
{
    mat4.identity(this._leftRotMat);
    mat4.identity(this._rightRotMat);

    mat4.rotate(this._leftRotMat, this.lookSpeed, this.up);
    mat4.rotate(this._rightRotMat, -this.lookSpeed, this.up);
};

/**
 * Move the camera forward according to its movement speed.
 *
 * @this {ShipGL.Camera}
 */
ShipGL.Camera.prototype.moveForward = function()
{
    vec3.scale(this.direction, this.moveSpeed, this._scratchVec);
    vec3.add(this.position, this._scratchVec);
    this._update();
};

/**
 * Move the camera backward according to its movement speed.
 *
 * @this {ShipGL.Camera}
 */
ShipGL.Camera.prototype.moveBackward = function()
{
    vec3.scale(this.direction, this.moveSpeed, this._scratchVec);
    vec3.subtract(this.position, this._scratchVec);
    this._update();
};

/**
 * Move the camera left according to its movement speed.
 *
 * @this {ShipGL.Camera}
 */
ShipGL.Camera.prototype.moveLeft = function()
{
    vec3.scale(this.right, this.moveSpeed, this._scratchVec);
    vec3.subtract(this.position, this._scratchVec);
    this._update();
};

/**
 * Move the camera right according to its movement speed.
 *
 * @this {ShipGL.Camera}
 */
ShipGL.Camera.prototype.moveRight = function()
{
    vec3.scale(this.right, this.moveSpeed, this._scratchVec);
    vec3.add(this.position, this._scratchVec);
    this._update();
};

/**
 * Move the camera up according to its movement speed.
 *
 * @this {ShipGL.Camera}
 */
ShipGL.Camera.prototype.moveUp = function()
{
    vec3.scale(this.up, this.moveSpeed, this._scratchVec);
    vec3.add(this.position, this._scratchVec);
    this._update();
};

/**
 * Move the camera down according to its movement speed.
 *
 * @this {ShipGL.Camera}
 */
ShipGL.Camera.prototype.moveDown = function()
{
    vec3.scale(this.up, this.moveSpeed, this._scratchVec);
    vec3.subtract(this.position, this._scratchVec);
    this._update();
};

/**
 * Turn the camera left according to its look speed.
 *
 * @this {ShipGL.Camera}
 */
ShipGL.Camera.prototype.lookLeft = function()
{
    mat4.multiplyVec4(this._leftRotMat, this.direction);
    vec3.normalize(this.direction);
    
    vec3.cross(this.direction, this.up, this.right);
    vec3.normalize(this.right);

    this._update();
};

/**
 * Turn the camera right according to its look speed.
 *
 * @this {ShipGL.Camera}
 */
ShipGL.Camera.prototype.lookRight = function()
{
    mat4.multiplyVec4(this._rightRotMat, this.direction);
    vec3.normalize(this.direction);
    
    vec3.cross(this.direction, this.up, this.right);
    vec3.normalize(this.right);

    this._update();
};

/**
 * @file Contains all ShipGL.Buffer code.
 * @author Jason Shipman
 *
 * Copyright (C) 2012 Jason Shipman
 * This software is provided 'as-is', without any express or implied warranty.
 * In no event will the authors be held liable for any damages arising from the
 * use of this software.
 *
 * Permission is granted to anyone to use this software for any purpose,
 * including commercial applications, and to alter it and redistribute it
 * freely, subject to the following restrictions:
 *
 * 1. The origin of this software must not be misrepresented; you must not
 * claim that you wrote the original software. If you use this software
 * in a product, an acknowledgment in the product documentation would be
 * appreciated but is not required.
 *
 * 2. Altered source versions must be plainly marked as such, and must not be
 * misrepresented as being the original software.
 *
 * 3. This notice may not be removed or altered from any source distribution.
 */

/**
 * Creates a new ShipGL.Buffer instance.  It is not necessary to construct
 * this class directly.  See BufferUtilities.
 *
 * @class ShipGL.Buffer
 * @classdesc A ShipGL.Buffer object provides a simple interface to a raw
 *            WebGL buffer object.
 * @augments ShipGL.GLResource
 *
 * @see ShipGL.BufferUtilities
 *
 * @param {WebGLRenderingContext} gl The rendering context
 * @param {number} BufferType The buffer's type (ARRAY_BUFFER or
 *                            ELEMENT_ARRAY_BUFFER)
 * @param {number} ArrayType The buffer's underlying array type (Float32Array,
 *                           Uint16Array, etc.)
 */
ShipGL.Buffer = function(gl, BufferType, ArrayType)
{
    ShipGL.GLResource.call(this, gl);

    /**
     * @memberof ShipGL.Buffer#
     * @description The raw WebGL buffer object. Prefer using the methods
     *              provided instead of accessing this directly. Be careful!
     * @name rawBuffer
     */
    this.rawBuffer = this.gl.createBuffer();

    /**
     * @memberof ShipGL.Buffer#
     * @description The raw WebGL buffer object's type, either ARRAY_BUFFER
     *              or ELEMENT_ARRAY_BUFFER. Do not modify this!
     * @name BufferType
     */
    this.BufferType = BufferType; 
    
    /**
     * @memberof ShipGL.Buffer#
     * @description The raw WebGL buffer object's element type. It could be
     *              Float32Array, Uint16Array, etc. Do not modify this!
     * @name ArrayType
     */
    this.ArrayType = ArrayType; 
    
    /**
     * @memberof ShipGL.Buffer#
     * @description Number of bytes for single element in underlying array.
     *              Do not modify this!
     * @name bytesPerElement
     */
    this.bytesPerElement = this.ArrayType.BYTES_PER_ELEMENT;

    /**
     * @memberof ShipGL.Buffer#
     * @description Number of elements in buffer's underlying array.
     *              Do not modify this!
     * @name length
     */
    this.length = 0;

    /**
     * @memberof ShipGL.Buffer#
     * @field
     * @description Number of bytes in buffer's underlying array.
     *              Do not modify this!
     * @name byteCount
     */
    this.byteCount = 0;
};

/**
 * Unbinds all buffers.
 *
 * Useful if you aren't positive what buffer(s) are bound and you just
 * want to unbind all of them.
 *
 * @param {WebGLRenderingContext} gl The rendering context
 */
ShipGL.Buffer.unbindAll = function(gl)
{
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
};

ShipGL.Buffer.prototype = Object.create(ShipGL.GLResource.prototype);

/**
 * Bind this buffer to the WebGL rendering context.
 *
 * @this {ShipGL.Buffer}
 */
ShipGL.Buffer.prototype.bind = function()
{
    this.gl.bindBuffer(this.BufferType, this.rawBuffer);
};

/**
 * Unbind this buffer from the WebGL rendering context.
 *
 * @this {ShipGL.Buffer}
 */
ShipGL.Buffer.prototype.unbind = function()
{
    this.gl.bindBuffer(this.BufferType, null);
};

/**
 * Allocates a buffer, initializing its contents to 0.
 *
 * Note that length specifies how many elements the buffer should hold,
 * NOT the length of the buffer in bytes.
 *
 * Assumes buffer has been created and bound.
 *
 * @this {ShipGL.Buffer}
 *
 * @param {number} length The size of the buffer (in terms of elements)
 * @param {number} [usageTip=STATIC_DRAW] The WebGL storage hint
 */
ShipGL.Buffer.prototype.allocate = function(length, usageTip)
{
    usageTip = usageTip || this.gl.STATIC_DRAW;
    this.length = length;
    this.byteCount = this.bytesPerElement * this.length;
    this.gl.bufferData(this.BufferType, this.byteCount, usageTip);
};

/** Writes contents of array into the buffer, starting at index.
 *
 * If index is not specified (or 0), writes whole array assuming array fits.
 *
 * index should represent an index into the buffer's underlying array, so
 * if you had a buffer storing [1, 2, 3], and you wanted to write [4, 5] into
 * the last two slots, you would specify array as [4, 5] and the index as 1.
 *
 * Assumes buffer has been allocated and bound.
 *
 * @example
 * // Assume gl is a valid WebGL context.
 * var gl;
 * var someBuffer = new ShipGL.Buffer(gl, gl.ARRAY_BUFFER, Float32Array);
 *
 * // Bind the buffer.
 * someBuffer.bind();
 *
 * // Allocate a size of 3 for the buffer.
 * someBuffer.allocate(3);
 *
 * // Write an array into the buffer. Note index is left out, so this means
 * // the whole array should be written.
 * someBuffer.write([1, 2, 3]);
 *
 * // Replace the last two elements, 2 and 3, with 4 and 5. index of 1 means
 * // writing starts at "index" 1 internally in the buffer.
 * someBuffer.write([4, 5], 1);
 *
 * // Unbind the buffer.
 * someBuffer.unbind();
 *
 * @this {ShipGL.Buffer}
 *
 * @param {Array} array The array to be written into the buffer
 * @param {number} [index=0] The starting point of the write
 */
ShipGL.Buffer.prototype.write = function(array, index)
{
    index = index || 0;
    this.gl.bufferSubData(this.BufferType,
                          index * this.bytesPerElement,
                          new this.ArrayType(array));
};

/**
 * Destroys the raw WebGL buffer. This is generally not necessary to use
 * unless you need very fine control.
 *
 * After calling this function, be sure to ditch the ShipGL.Buffer reference.
 *
 * @this {ShipGL.Buffer}
 */
ShipGL.Buffer.prototype.deallocate = function()
{
    this.gl.deleteBuffer(this.rawBuffer);
};
/**
 * @file Contains all ShipGL.BufferUtilities code.
 * @author Jason Shipman
 *
 * Copyright (C) 2012 Jason Shipman
 * This software is provided 'as-is', without any express or implied warranty.
 * In no event will the authors be held liable for any damages arising from the
 * use of this software.
 *
 * Permission is granted to anyone to use this software for any purpose,
 * including commercial applications, and to alter it and redistribute it
 * freely, subject to the following restrictions:
 *
 * 1. The origin of this software must not be misrepresented; you must not
 * claim that you wrote the original software. If you use this software
 * in a product, an acknowledgment in the product documentation would be
 * appreciated but is not required.
 *
 * 2. Altered source versions must be plainly marked as such, and must not be
 * misrepresented as being the original software.
 *
 * 3. This notice may not be removed or altered from any source distribution.
 */

/**
 * Creates a new ShipGL.BufferUtilities instance.
 *
 * @class ShipGL.BufferUtilities
 * @classdesc A ShipGL.BufferUtilities object provides a means to create
 *            and initialize a ShipGL.Buffer object in a single line.
 * @augments ShipGL.GLResource
 *
 * @param {WebGLRenderingContext} gl The rendering context
 */
ShipGL.BufferUtilities = function(gl)
{
    ShipGL.GLResource.call(this, gl);

    /**
     * @memberof ShipGL.BufferUtilities#
     * @description Function that creates and initializes a ShipGL.Buffer
     *              vertex buffer. Just pass in an array and and an optional
     *              length. If length is not specified, buffer is initalized
     *              to whole array.
     * @name createVertexBuffer
     * @see ShipGL.Buffer
     * @example
     * // Assume gl is a valid WebGL context.
     * var gl;
     *
     * // Assume positions is an array containing a bunch of vertex positions.
     * var positions = [1.0, 2.0, 3.0, ...];
     *
     * // Create a ShipGL.BufferUtilities instance.
     * var bufferUtils = new ShipGL.BufferUtilities(gl);
     *
     * // Create a ShipGL.Buffer initialized to contain the contents
     * // of the positions array.
     * var someVertexBuffer = bufferUtils.createVertexBuffer(positions);
     *
     * // Create another ShipGL.Buffer initialized to contain the first 9
     * // elements in the positions array.
     * var anotherVertexBuffer = bufferUtils.createVertexBuffer(positions, 9);
     */
    this.createVertexBuffer = this.makeBufferCreator(this.gl.ARRAY_BUFFER, Float32Array);
    
    /**
     * @memberof ShipGL.BufferUtilities#
     * @description Function that creates and initializes a ShipGL.Buffer
     *              index buffer. Just pass in an array and and an optional
     *              length. If length is not specified, buffer is initalized
     *              to whole array.
     * @name createIndexBuffer
     * @see ShipGL.Buffer
     * @example
     * // Assume gl is a valid WebGL context.
     * var gl;
     *
     * // Assume indices is an array containing a bunch of index data.
     * var indices = [0, 1, 2, ...];
     *
     * // Create a ShipGL.BufferUtilities instance.
     * var bufferUtils = new ShipGL.BufferUtilities(gl);
     *
     * // Create a ShipGL.Buffer initialized to contain the contents
     * // of the indices array.
     * var someIndexBuffer = bufferUtils.createIndexBuffer(indices);
     *
     * // Create another ShipGL.Buffer initialized to contain the first 9
     * // elements in the indices array.
     * var anotherIndexBuffer = bufferUtils.createIndexBuffer(indices, 9);
     */
    this.createIndexBuffer = this.makeBufferCreator(this.gl.ELEMENT_ARRAY_BUFFER, Uint16Array);
};

ShipGL.BufferUtilities.prototype = Object.create(ShipGL.GLResource.prototype);

/**
 * Makes a specific buffer creation/initialization function.
 *
 * @see ShipGL.Buffer
 *
 * @this {ShipGL.BufferUtilities}
 *
 * @param {number} BufferType The buffer's type (ARRAY_BUFFER or
 *                            ELEMENT_ARRAY_BUFFER)
 * @param {number} ArrayType The buffer's underlying array type (Float32Array,
 *                           Uint16Array, etc.)
 *
 * @return A tailor-made function that can create and initialize ShipGL.Buffer's.
 */
ShipGL.BufferUtilities.prototype.makeBufferCreator = function(BufferType, ArrayType)
{
    return function(array, length)
    {
        length = length || array.length;
        var buffer = new ShipGL.Buffer(this.gl, BufferType, ArrayType);

        buffer.bind();
        buffer.allocate(length);
        buffer.write(array);
        buffer.unbind();

        return buffer;
    };
};
/**
 * @file Contains all ShipGL.ShaderProgram code.
 * @author Jason Shipman
 *
 * Copyright (C) 2012 Jason Shipman
 * This software is provided 'as-is', without any express or implied warranty.
 * In no event will the authors be held liable for any damages arising from the
 * use of this software.
 *
 * Permission is granted to anyone to use this software for any purpose,
 * including commercial applications, and to alter it and redistribute it
 * freely, subject to the following restrictions:
 *
 * 1. The origin of this software must not be misrepresented; you must not
 * claim that you wrote the original software. If you use this software
 * in a product, an acknowledgment in the product documentation would be
 * appreciated but is not required.
 *
 * 2. Altered source versions must be plainly marked as such, and must not be
 * misrepresented as being the original software.
 *
 * 3. This notice may not be removed or altered from any source distribution.
 */

/**
 * Creates a new ShipGL.ShaderProgram instance.
 *
 * @class ShipGL.ShaderProgram
 * @classdesc A ShipGL.ShaderProgram object provides a convenient interface
 *            to a raw WebGL shader program.
 * @augments ShipGL.GLResource
 *
 * @param {WebGLRenderingContext} gl The rendering context
 */
ShipGL.ShaderProgram = function(gl)
{
    ShipGL.GLResource.call(this, gl);
    
    /**
     * @memberof ShipGL.ShaderProgram#
     * @description The raw WebGL shader program. Prefer using the methods
     *              provided instead of accessing this directly. Be careful!
     * @name rawProgram
     */
    this.rawProgram = this.gl.createProgram();

    // Bytes per float (4).
    this._bpf = Float32Array.BYTES_PER_ELEMENT;

    // Bytes per unsigned short (2).
    this._bps = Uint16Array.BYTES_PER_ELEMENT;
};

ShipGL.ShaderProgram.prototype = Object.create(ShipGL.GLResource.prototype);

/**
 * Bind the shader program to the WebGL rendering context.
 *
 * @this {ShipGL.ShaderProgram}
 */
ShipGL.ShaderProgram.prototype.bind = function()
{
    this.gl.useProgram(this.rawProgram);
};

/**
 * Unbind the shader program from the WebGL rendering context.
 *
 * @this {ShipGL.ShaderProgram}
 */
ShipGL.ShaderProgram.prototype.unbind = function()
{
    this.gl.useProgram(null);
};

/**
 * Create the shader program from vertex and fragment shader sources.
 *
 * @this {ShipGL.ShaderProgram}
 *
 * @param {string} vShaderCode The vertex shader code
 * @param {string} fShaderCode The fragment shader code
 */
ShipGL.ShaderProgram.prototype.create = function(vShaderCode, fShaderCode)
{
    var vShader = this.createShader(this.gl.VERTEX_SHADER,   vShaderCode);
    var fShader = this.createShader(this.gl.FRAGMENT_SHADER, fShaderCode);

    this.gl.attachShader(this.rawProgram, vShader);
    this.gl.attachShader(this.rawProgram, fShader);
    
    this.gl.linkProgram(this.rawProgram);
    if (!this.gl.getProgramParameter(this.rawProgram, this.gl.LINK_STATUS))
    {
        alert("GLSL LINK ERROR!\n" + this.gl.getProgramInfoLog(this.rawProgram));
        return null;
    }
};

/**
 * Create and compile a shader from source.
 *
 * Don't need to call this function. Just use create method. createShader is
 * used internally by create.
 *
 * @this {ShipGL.ShaderProgram}
 *
 * @param {number} shaderType The type of shader
 *                            (VERTEX_SHADER or FRAGMENT_SHADER)
 * @param {string} code The shader code (for either vertex or fragment shader)
 */
ShipGL.ShaderProgram.prototype.createShader = function(shaderType, code)
{
    var shader = this.gl.createShader(shaderType);
    this.gl.shaderSource(shader, code);
    this.gl.compileShader(shader);
    
    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS))
    {
        alert("GLSL COMPILE ERROR!\n" + code + '\n' +
              this.gl.getShaderInfoLog(shader));
        return null;
    }

    return shader;
};

/**
 * Look up the attribute location for the passed in attribute name.
 *
 * @this {ShipGL.ShaderProgram}
 *
 * @param {string} attName The attribute name string
 * @return {number} The attribute location
 */
ShipGL.ShaderProgram.prototype.attributeLocation = function(attName)
{
    var loc = this.gl.getAttribLocation(this.rawProgram, attName);

    if (loc < 0)
    {
        alert("ShipGL.ShaderProgram.attributeLocation: " + attName + " is not " +
              "a valid uniform! Returning null...");
    }

    return loc;
};

/**
 * Look up the uniform location for the passed in uniform name.
 *
 * @this {ShipGL.ShaderProgram}
 *
 * @param {string} unfName The uniform name string
 * @return {number} The uniform location
 */
ShipGL.ShaderProgram.prototype.uniformLocation = function(unfName)
{
    var loc = this.gl.getUniformLocation(this.rawProgram, unfName);

    if (loc < 0)
    {
        alert("ShipGL.ShaderProgram.uniformLocation: " + unfName + " is not " +
              "a valid uniform! Returning null...");
    }

    return loc;
};

/**
 * Enable the attribute array for the passed in attribute name. Do not pass
 * in the attribute location!  Pass in the name string.  Internally,
 * ShipGL.ShaderProgram caches the attribute locations so you don't have to
 * worry about it.
 *
 * @this {ShipGL.ShaderProgram}
 *
 * @param {string} att The attribute name string
 */
ShipGL.ShaderProgram.prototype.enableAttributeArray = function(att)
{
    this[att] = this[att] || this.attributeLocation(att);
    this.gl.enableVertexAttribArray(this[att]);
};

/**
 * Disable the attribute array for the passed in attribute name. Do not pass
 * in the attribute location!  Pass in the name string.  Internally,
 * ShipGL.ShaderProgram caches the attribute locations so you don't have to
 * worry about it.
 *
 * @this {ShipGL.ShaderProgram}
 *
 * @param {string} att The attribute name string
 */
ShipGL.ShaderProgram.prototype.disableAttributeArray = function(att)
{
    this[att] = this[att] || this.attributeLocation(att);
    this.gl.disableVertexAttribArray(this[att]);
};

/**
 * Set a scalar float attribute in the shader program from the bound buffer.
 *
 * You must specify stride and offset! These are in terms of array indices, NOT bytes.
 * The method will send stride and offset in bytes for you.
 *
 * @this {ShipGL.ShaderProgram}
 *
 * @param {string} att The attribute name string
 * @param {number} stride The stride between attributes (in terms of array indices, NOT bytes)
 * @param {number} offset The starting attribute index
 * @param {bool} [norm=false] Whether or not values should be normalized
 */
ShipGL.ShaderProgram.prototype.setAttributeBuffer1f = function(att, stride, offset, norm)
{
    norm = norm || false;
    this[att] = this[att] || this.attributeLocation(att);
    this.gl.vertexAttribPointer(this[att], 1, this.gl.FLOAT, norm, this._bpf * stride, this._bpf * offset);
};

/**
 * Set a two-dimensional float attribute in the shader program from the bound buffer.
 *
 * You must specify stride and offset! These are in terms of array indices, NOT bytes.
 * The method will send stride and offset in bytes for you.
 *
 * @this {ShipGL.ShaderProgram}
 *
 * @param {string} att The attribute name string
 * @param {number} stride The stride between attributes (in terms of array indices, NOT bytes)
 * @param {number} offset The starting attribute index
 * @param {bool} [norm=false] Whether or not values should be normalized
 */
ShipGL.ShaderProgram.prototype.setAttributeBuffer2f = function(att, stride, offset, norm)
{
    norm = norm || false;
    this[att] = this[att] || this.attributeLocation(att);
    this.gl.vertexAttribPointer(this[att], 2, this.gl.FLOAT, norm, this._bpf * stride, this._bpf * offset);
};

/**
 * Set a three-dimensional float attribute in the shader program from the bound buffer.
 *
 * You must specify stride and offset! These are in terms of array indices, NOT bytes.
 * The method will send stride and offset in bytes for you.
 *
 * @this {ShipGL.ShaderProgram}
 *
 * @param {string} att The attribute name string
 * @param {number} stride The stride between attributes (in terms of array indices, NOT bytes)
 * @param {number} offset The starting attribute index
 * @param {bool} [norm=false] Whether or not values should be normalized
 */
ShipGL.ShaderProgram.prototype.setAttributeBuffer3f = function(att, stride, offset, norm)
{
    norm = norm || false;
    this[att] = this[att] || this.attributeLocation(att);
    this.gl.vertexAttribPointer(this[att], 3, this.gl.FLOAT, norm, this._bpf * stride, this._bpf * offset);
};

/**
 * Set a four-dimensional float attribute in the shader program from the bound buffer.
 *
 * You must specify stride and offset! These are in terms of array indices, NOT bytes.
 * The method will send stride and offset in bytes for you.
 *
 * @this {ShipGL.ShaderProgram}
 *
 * @param {string} att The attribute name string
 * @param {number} stride The stride between attributes (in terms of array indices, NOT bytes)
 * @param {number} offset The starting attribute index
 * @param {bool} [norm=false] Whether or not values should be normalized
 */
ShipGL.ShaderProgram.prototype.setAttributeBuffer4f = function(att, stride, offset, norm)
{
    norm = norm || false;
    this[att] = this[att] || this.attributeLocation(att);
    this.gl.vertexAttribPointer(this[att], 4, this.gl.FLOAT, norm, this._bpf * stride, this._bpf * offset);
};

/**
 * Set a scalar integer attribute in the shader program from the bound buffer.
 *
 * You must specify stride and offset! These are in terms of array indices, NOT bytes.
 * The method will send stride and offset in bytes for you.
 *
 * @this {ShipGL.ShaderProgram}
 *
 * @param {string} att The attribute name string
 * @param {number} stride The stride between attributes (in terms of array indices, NOT bytes)
 * @param {number} offset The starting attribute index
 * @param {bool} [norm=false] Whether or not values should be normalized
 */
ShipGL.ShaderProgram.prototype.setAttributeBuffer1i = function(att, stride, offset, norm)
{
    norm = norm || false;
    this[att] = this[att] || this.attributeLocation(att);
    this.gl.vertexAttribPointer(this[att], 1, this.gl.INT, norm, this._bps * stride, this._bps * offset);
};

/**
 * Set a two-dimensional integer attribute in the shader program from the bound buffer.
 *
 * You must specify stride and offset! These are in terms of array indices, NOT bytes.
 * The method will send stride and offset in bytes for you.
 *
 * @this {ShipGL.ShaderProgram}
 *
 * @param {string} att The attribute name string
 * @param {number} stride The stride between attributes (in terms of array indices, NOT bytes)
 * @param {number} offset The starting attribute index
 * @param {bool} [norm=false] Whether or not values should be normalized
 */
ShipGL.ShaderProgram.prototype.setAttributeBuffer2i = function(att, stride, offset, norm)
{
    norm = norm || false;
    this[att] = this[att] || this.attributeLocation(att);
    this.gl.vertexAttribPointer(this[att], 2, this.gl.INT, norm, this._bps * stride, this._bps * offset);
};

/**
 * Set a three-dimensional integer attribute in the shader program from the bound buffer.
 *
 * You must specify stride and offset! These are in terms of array indices, NOT bytes.
 * The method will send stride and offset in bytes for you.
 *
 * @this {ShipGL.ShaderProgram}
 *
 * @param {string} att The attribute name string
 * @param {number} stride The stride between attributes (in terms of array indices, NOT bytes)
 * @param {number} offset The starting attribute index
 * @param {bool} [norm=false] Whether or not values should be normalized
 */
ShipGL.ShaderProgram.prototype.setAttributeBuffer3i = function(att, stride, offset, norm)
{
    norm = norm || false;
    this[att] = this[att] || this.attributeLocation(att);
    this.gl.vertexAttribPointer(this[att], 3, this.gl.INT, norm, this._bps * stride, this._bps * offset);
};

/**
 * Set a four-dimensional integer attribute in the shader program from the bound buffer.
 *
 * You must specify stride and offset! These are in terms of array indices, NOT bytes.
 * The method will send stride and offset in bytes for you.
 *
 * @this {ShipGL.ShaderProgram}
 *
 * @param {string} att The attribute name string
 * @param {number} stride The stride between attributes (in terms of array indices, NOT bytes)
 * @param {number} offset The starting attribute index
 * @param {bool} [norm=false] Whether or not values should be normalized
 */
ShipGL.ShaderProgram.prototype.setAttributeBuffer4i = function(att, stride, offset, norm)
{
    norm = norm || false;
    this[att] = this[att] || this.attributeLocation(att);
    this.gl.vertexAttribPointer(this[att], 4, this.gl.INT, norm, this._bps * stride, this._bps * offset);
};

/**
 * Set a constant scalar float attribute in the shader program.
 *
 * @this {ShipGL.ShaderProgram}
 *
 * @param {string} att The attribute name string
 * @param {float} val1 The float value
 */
ShipGL.ShaderProgram.prototype.setAttributeValue1f = function(att, val1)
{
    this[att] = this[att] || this.attributeLocation(att);
    this.gl.vertexAttrib1f(this[att], val1);
};

/**
 * Set a constant two-dimensional float attribute in the shader program.
 *
 * @this {ShipGL.ShaderProgram}
 *
 * @param {string} att The attribute name string
 * @param {float} val1 The first float value
 * @param {float} val2 The second float value
 */
ShipGL.ShaderProgram.prototype.setAttributeValue2f = function(att, val1, val2)
{
    this[att] = this[att] || this.attributeLocation(att);
    this.gl.vertexAttrib2f(this[att], val1, val2);
};

/**
 * Set a constant three-dimensional float attribute in the shader program.
 *
 * @this {ShipGL.ShaderProgram}
 *
 * @param {string} att The attribute name string
 * @param {float} val1 The first float value
 * @param {float} val2 The second float value
 * @param {float} val3 The third float value
 */
ShipGL.ShaderProgram.prototype.setAttributeValue3f = function(att, val1, val2, val3)
{
    this[att] = this[att] || this.attributeLocation(att);
    this.gl.vertexAttrib3f(this[att], val1, val2, val3);
};

/**
 * Set a constant four-dimensional float attribute in the shader program.
 *
 * @this {ShipGL.ShaderProgram}
 *
 * @param {string} att The attribute name string
 * @param {float} val1 The first float value
 * @param {float} val2 The second float value
 * @param {float} val3 The third float value
 * @param {float} val4 The fourth float value
 */
ShipGL.ShaderProgram.prototype.setAttributeValue4f = function(att, val1, val2, val3, val4)
{
    this[att] = this[att] || this.attributeLocation(att);
    this.gl.vertexAttrib4f(this[att], val1, val2, val3, val4);
};

/**
 * Set a scalar float uniform in the shader program.
 *
 * @this {ShipGL.ShaderProgram}
 *
 * @param {string} unf The uniform name string
 * @param {float} val The float value
 */
ShipGL.ShaderProgram.prototype.setUniform1f = function(unf, val)
{
    this[unf] = this[unf] || this.uniformLocation(unf);
    this.gl.uniform1f(this[unf], val);
};

/**
 * Set a two-dimensional float uniform in the shader program.
 *
 * @this {ShipGL.ShaderProgram}
 *
 * @param {string} unf The uniform name string
 * @param {float} val1 The first float value
 * @param {float} val2 The second float value
 */
ShipGL.ShaderProgram.prototype.setUniform2f = function(unf, val1, val2)
{
    this[unf] = this[unf] || this.uniformLocation(unf);
    this.gl.uniform2f(this[unf], val1, val2);
};

/**
 * Set a three-dimensional float uniform in the shader program.
 *
 * @this {ShipGL.ShaderProgram}
 *
 * @param {string} unf The uniform name string
 * @param {float} val1 The first float value
 * @param {float} val2 The second float value
 * @param {float} val3 The third float value
 */
ShipGL.ShaderProgram.prototype.setUniform3f = function(unf, val1, val2, val3)
{
    this[unf] = this[unf] || this.uniformLocation(unf);
    this.gl.uniform3f(this[unf], val1, val2, val3);
};

/**
 * Set a four-dimensional float uniform in the shader program.
 *
 * @this {ShipGL.ShaderProgram}
 *
 * @param {string} unf The uniform name string
 * @param {float} val1 The first float value
 * @param {float} val2 The second float value
 * @param {float} val3 The third float value
 * @param {float} val4 The fourth float value
 */
ShipGL.ShaderProgram.prototype.setUniform4f = function(unf, val1, val2, val3, val4)
{
    this[unf] = this[unf] || this.uniformLocation(unf);
    this.gl.uniform4f(this[unf], val1, val2, val3, val4);
};

/**
 * Set a scalar integer uniform in the shader program.
 *
 * @this {ShipGL.ShaderProgram}
 *
 * @param {string} unf The uniform name string
 * @param {integer} val The integer value
 */
ShipGL.ShaderProgram.prototype.setUniform1i = function(unf, val)
{
    this[unf] = this[unf] || this.uniformLocation(unf);
    this.gl.uniform1i(this[unf], val);
};

/**
 * Set a two-dimensional integer uniform in the shader program.
 *
 * @this {ShipGL.ShaderProgram}
 *
 * @param {string} unf The uniform name string
 * @param {integer} val1 The first integer value
 * @param {integer} val2 The second integer value
 */
ShipGL.ShaderProgram.prototype.setUniform2i = function(unf, val1, val2)
{
    this[unf] = this[unf] || this.uniformLocation(unf);
    this.gl.uniform2i(this[unf], val1, val2);
};

/**
 * Set a three-dimensional integer uniform in the shader program.
 *
 * @this {ShipGL.ShaderProgram}
 *
 * @param {string} unf The uniform name string
 * @param {integer} val1 The first integer value
 * @param {integer} val2 The second integer value
 * @param {integer} val3 The third integer value
 */
ShipGL.ShaderProgram.prototype.setUniform3i = function(unf, val1, val2, val3)
{
    this[unf] = this[unf] || this.uniformLocation(unf);
    this.gl.uniform3i(this[unf], val1, val2, val3);
};

/**
 * Set a four-dimensional integer uniform in the shader program.
 *
 * @this {ShipGL.ShaderProgram}
 *
 * @param {string} unf The uniform name string
 * @param {integer} val1 The first integer value
 * @param {integer} val2 The second integer value
 * @param {integer} val3 The third integer value
 * @param {integer} val4 The fourth integer value
 */
ShipGL.ShaderProgram.prototype.setUniform4i = function(unf, val1, val2, val3, val4)
{
    this[unf] = this[unf] || this.uniformLocation(unf);
    this.gl.uniform4i(this[unf], val1, val2, val3, val4);
};

/**
 * Set a one-dimensional float vector in the shader program.
 * Assumes vector is typed and sized appropriately.
 *
 * @this {ShipGL.ShaderProgram}
 *
 * @param {string} unf The uniform name string
 * @param {float array} val The float vector
 */
ShipGL.ShaderProgram.prototype.setUniformVec1f = function(unf, val)
{
    this[unf] = this[unf] || this.uniformLocation(unf);
    this.gl.uniform1fv(this[unf], val);
};

/**
 * Set a two-dimensional float vector in the shader program.
 * Assumes vector is typed and sized appropriately.
 *
 * @this {ShipGL.ShaderProgram}
 *
 * @param {string} unf The uniform name string
 * @param {float array} val The float vector
 */
ShipGL.ShaderProgram.prototype.setUniformVec2f = function(unf, val)
{
    this[unf] = this[unf] || this.uniformLocation(unf);
    this.gl.uniform2fv(this[unf], val);
};

/**
 * Set a three-dimensional float vector in the shader program.
 * Assumes vector is typed and sized appropriately.
 *
 * @this {ShipGL.ShaderProgram}
 *
 * @param {string} unf The uniform name string
 * @param {float array} val The float vector
 */
ShipGL.ShaderProgram.prototype.setUniformVec3f = function(unf, val)
{
    this[unf] = this[unf] || this.uniformLocation(unf);
    this.gl.uniform3fv(this[unf], val);
};

/**
 * Set a four-dimensional float vector in the shader program.
 * Assumes vector is typed and sized appropriately.
 *
 * @this {ShipGL.ShaderProgram}
 *
 * @param {string} unf The uniform name string
 * @param {float array} val The float vector
 */
ShipGL.ShaderProgram.prototype.setUniformVec4f = function(unf, val)
{
    this[unf] = this[unf] || this.uniformLocation(unf);
    this.gl.uniform4fv(this[unf], val);
};

/**
 * Set a one-dimensional integer vector in the shader program.
 * Assumes vector is typed and sized appropriately.
 *
 * @this {ShipGL.ShaderProgram}
 *
 * @param {string} unf The uniform name string
 * @param {integer array} val The integer vector
 */
ShipGL.ShaderProgram.prototype.setUniformVec1i = function(unf, val)
{
    this[unf] = this[unf] || this.uniformLocation(unf);
    this.gl.uniform1iv(this[unf], val);
};

/**
 * Set a two-dimensional integer vector in the shader program.
 * Assumes vector is typed and sized appropriately.
 *
 * @this {ShipGL.ShaderProgram}
 *
 * @param {string} unf The uniform name string
 * @param {integer array} val The integer vector
 */
ShipGL.ShaderProgram.prototype.setUniformVec2i = function(unf, val)
{
    this[unf] = this[unf] || this.uniformLocation(unf);
    this.gl.uniform2iv(this[unf], val);
};

/**
 * Set a three-dimensional integer vector in the shader program.
 * Assumes vector is typed and sized appropriately.
 *
 * @this {ShipGL.ShaderProgram}
 *
 * @param {string} unf The uniform name string
 * @param {integer array} val The integer vector
 */
ShipGL.ShaderProgram.prototype.setUniformVec3i = function(unf, val)
{
    this[unf] = this[unf] || this.uniformLocation(unf);
    this.gl.uniform3iv(this[unf], val);
};

/**
 * Set a four-dimensional integer vector in the shader program.
 * Assumes vector is typed and sized appropriately.
 *
 * @this {ShipGL.ShaderProgram}
 *
 * @param {string} unf The uniform name string
 * @param {integer array} val The integer vector
 */
ShipGL.ShaderProgram.prototype.setUniformVec4i = function(unf, val)
{
    this[unf] = this[unf] || this.uniformLocation(unf);
    this.gl.uniform4iv(this[unf], val);
};

/**
 * Set a 2x2 float matrix in the shader program.
 * Assumes matrix is typed and sized appropriately.
 *
 * @this {ShipGL.ShaderProgram}
 *
 * @param {string} unf The uniform name string
 * @param {mat2} val The matrix
 * @param {bool} [transpose=false] Whether or not the matrix should be transposed
 */
ShipGL.ShaderProgram.prototype.setUniformMat2 = function(unf, val, transpose)
{
    transpose = transpose || false;
    this[unf] = this[unf] || this.uniformLocation(unf);
    this.gl.uniformMatrix2fv(this[unf], transpose, val);
};

/**
 * Set a 3x3 float matrix in the shader program.
 * Assumes matrix is typed and sized appropriately.
 *
 * @this {ShipGL.ShaderProgram}
 *
 * @param {string} unf The uniform name string
 * @param {mat3} val The matrix
 * @param {bool} [transpose=false] Whether or not the matrix should be transposed
 */
ShipGL.ShaderProgram.prototype.setUniformMat3 = function(unf, val, transpose)
{
    transpose = transpose || false;
    this[unf] = this[unf] || this.uniformLocation(unf);
    this.gl.uniformMatrix3fv(this[unf], transpose, val);
};

/**
 * Set a 4x4 float matrix in the shader program.
 * Assumes matrix is typed and sized appropriately.
 *
 * @this {ShipGL.ShaderProgram}
 *
 * @param {string} unf The uniform name string
 * @param {mat4} val The matrix
 * @param {bool} [transpose=false] Whether or not the matrix should be transposed
 */
ShipGL.ShaderProgram.prototype.setUniformMat4 = function(unf, val, transpose)
{
    transpose = transpose || false;
    this[unf] = this[unf] || this.uniformLocation(unf);
    this.gl.uniformMatrix4fv(this[unf], transpose, val);
};
/**
 * @file Contains all ShipGL.Texture code.
 * @author Jason Shipman
 *
 * Copyright (C) 2012 Jason Shipman
 * This software is provided 'as-is', without any express or implied warranty.
 * In no event will the authors be held liable for any damages arising from the
 * use of this software.
 *
 * Permission is granted to anyone to use this software for any purpose,
 * including commercial applications, and to alter it and redistribute it
 * freely, subject to the following restrictions:
 *
 * 1. The origin of this software must not be misrepresented; you must not
 * claim that you wrote the original software. If you use this software
 * in a product, an acknowledgment in the product documentation would be
 * appreciated but is not required.
 *
 * 2. Altered source versions must be plainly marked as such, and must not be
 * misrepresented as being the original software.
 *
 * 3. This notice may not be removed or altered from any source distribution.
 */

/**
 * Creates a new ShipGL.Texture instance.
 *
 * @class ShipGL.Texture
 * @classdesc A ShipGL.Texture object provides a simple interface to a raw
 *            WebGL texture.
 * @augments ShipGL.GLResource
 *
 * @param {WebGLRenderingContext} gl The rendering context
 */
ShipGL.Texture = function(gl)
{
    ShipGL.GLResource.call(this, gl);

    this.textureType = this.gl.TEXTURE_2D;

    /**
     * @memberof ShipGL.Texture#
     * @description The raw WebGL texture. Prefer using the methods
     *              provided instead of accessing this directly. Be careful!
     * @name rawTexture
     */
    this.rawTexture = this.gl.createTexture();
    
    /**
     * @memberof ShipGL.Texture#
     * @description Boolean indicating the texture's load status
     * @name isLoaded
     */
    this.isLoaded = false;
    
    /**
     * @memberof ShipGL.Texture#
     * @description The width of the texture
     * @name width
     */
    this.width = 0;
    
    /**
     * @memberof ShipGL.Texture#
     * @description The height of the texture
     * @name height
     */
    this.height = 0;

    /**
     * @memberof ShipGL.Texture#
     * @description Boolean indicating texture dimensions are Not Power of Two.
     *              Not valid until texture is loaded.
     * @name NPOT
     */
    this.NPOT = true;
    
    var scope = this;
    this._image = new Image();
    this._image.onload = function()
    {
        scope.onImageLoad();
    };
};

/**
 * Unbinds all textures.
 *
 * Useful if you aren't positive what textures(s) are bound and you just
 * want to unbind all of them (TEXTURE_2D and TEXTURE_CUBE_MAP).
 *
 * @param {WebGLRenderingContext} gl The rendering context
 */
ShipGL.Texture.unbindAll = function(gl)
{
    gl.bindTexture(gl.TEXTURE_2D, null);
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);
};

ShipGL.Texture.prototype = Object.create(ShipGL.GLResource.prototype);

/**
 * Bind the texture to the WebGL rendering context.
 *
 * @this {ShipGL.Texture}
 *
 * @param {number} [unit] The texture unit to make active. If unit is
 *                        not specified, texture will still get bound
 *                        but no texture unit will be made active.
 * @example
 * // Assume tex is an instance of ShipGL.Texture. You can bind the
 * // texture like this:
 * tex.bind();
 *
 * // You can bind the texture and set the active texture unit in the
 * // same call like this:
 * tex.bind(0);
 *
 * // The above call binds the texture and makes texture unit TEXTURE0 active.
 */
ShipGL.Texture.prototype.bind = function(unit)
{
    if (unit >= 0)
    {
        this.gl.activeTexture(this.gl.TEXTURE0 + unit);
    }

    this.gl.bindTexture(this.textureType, this.rawTexture);
};

/**
 * Unbind the texture from the WebGL rendering context.
 *
 * @this {ShipGL.Texture}
 */
ShipGL.Texture.prototype.unbind = function()
{
    this.gl.bindTexture(this.textureType, null);
};

/**
 * Load the texture.
 *
 * @this {ShipGL.Texture}
 *
 * @param {string} pathToTexture Path to the image file
 */
ShipGL.Texture.prototype.load = function(pathToTexture)
{
    // Kick off the asynchronous image load.
    this._image.src = pathToTexture;
};

/**
 * Set the texture's wrapping mode for the S component of texture coordinates.
 *
 * @this {ShipGL.Texture}
 *
 * @param {boolean} repeat Should S be repeated or clamped?
 */
ShipGL.Texture.prototype.setRepeatS = function(repeat)
{
    this.gl.texParameteri(this.textureType, this.gl.TEXTURE_WRAP_S,
                          repeat ? this.gl.REPEAT : this.gl.CLAMP_TO_EDGE);
};

/**
 * Set the texture's wrapping mode for the T component of texture coordinates.
 *
 * @this {ShipGL.Texture}
 *
 * @param {boolean} repeat Should T be repeated or clamped?
 */
ShipGL.Texture.prototype.setRepeatT = function(repeat)
{
    this.gl.texParameteri(this.textureType, this.gl.TEXTURE_WRAP_T,
                          repeat ? this.gl.REPEAT : this.gl.CLAMP_TO_EDGE);
};

/**
 * Set the texture's filter modes.
 *
 * @this {ShipGL.Texture}
 *
 * @param {boolean} smooth Should the texture have a smooth appearance?
 */
ShipGL.Texture.prototype.setSmooth = function(smooth)
{
    this.gl.texParameteri(this.textureType, this.gl.TEXTURE_MAG_FILTER,
                          smooth ? this.gl.LINEAR : this.gl.NEAREST);

    var smoothMin = this.NPOT ? this.gl.LINEAR : this.gl.LINEAR_MIPMAP_LINEAR;
    this.gl.texParameteri(this.textureType, this.gl.TEXTURE_MIN_FILTER,
                          smooth ? smoothMin : this.gl.NEAREST);
};

/**
 * Callback used to store the texture's image data on the graphics card and
 * handle some other initialization.
 *
 * @this {ShipGL.Texture}
 */
ShipGL.Texture.prototype.onImageLoad = function()
{
    this.bind();

    this.width = this._image.width;
    this.height = this._image.height;

    this.NPOT = !(ShipGL.Math.isPowerOf2(this._image.width) &&
                  ShipGL.Math.isPowerOf2(this._image.height));

    var POT = !this.NPOT;

    this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, 1);

    this.gl.texImage2D(this.textureType,      // enum target
                       0,                     // int level
                       this.gl.RGBA,          // enum internalformat
                       this.gl.RGBA,          // enum format
                       this.gl.UNSIGNED_BYTE, // enum type
                       this._image);           // image data
    
    this.setRepeatS(POT);
    this.setRepeatT(POT);
    this.setSmooth(true);
    
    if (POT)
    {
        this.gl.generateMipmap(this.textureType);
    }

    this.unbind();
    
    this.isLoaded = true;

    delete this._image;
};
/**
 * @file Contains all ShipGL.CubeTexture code.
 * @author Jason Shipman
 *
 * Copyright (C) 2012 Jason Shipman
 * This software is provided 'as-is', without any express or implied warranty.
 * In no event will the authors be held liable for any damages arising from the
 * use of this software.
 *
 * Permission is granted to anyone to use this software for any purpose,
 * including commercial applications, and to alter it and redistribute it
 * freely, subject to the following restrictions:
 *
 * 1. The origin of this software must not be misrepresented; you must not
 * claim that you wrote the original software. If you use this software
 * in a product, an acknowledgment in the product documentation would be
 * appreciated but is not required.
 *
 * 2. Altered source versions must be plainly marked as such, and must not be
 * misrepresented as being the original software.
 *
 * 3. This notice may not be removed or altered from any source distribution.
 */

/**
 * Creates a new ShipGL.CubeTexture instance.
 *
 * @class ShipGL.CubeTexture
 * @classdesc A ShipGL.CubeTexture object provides a simple interface to a raw
 *            WebGL cube map.
 * @augments ShipGL.GLResource
 *
 * @param {WebGLRenderingContext} gl The rendering context
 */
ShipGL.CubeTexture = function(gl)
{
    ShipGL.GLResource.call(this, gl);
    
    this.textureType = this.gl.TEXTURE_CUBE_MAP;
    
    /**
     * @memberof ShipGL.CubeTexture#
     * @description The raw WebGL texture. Prefer using the methods
     *              provided instead of accessing this directly. Be careful!
     * @name rawTexture
     */
    this.rawTexture = this.gl.createTexture();

    this._images = [];

    var i, scope = this;
    for (i = 0; i < 6; i++)
    {
        this._images[i] = new Image();
        this._images[i].onload = (function(index)
                                  {
                                      return function()
                                      {
                                          scope.onImageLoad(index);
                                      };
                                  })(i);
        this._images[i].onerror = (function(index)
                                  {
                                      return function()
                                      {
                                          alert("Image " + index + " " +
                                                this.src + " load error!");
                                      };
                                  })(i);
    }
};

ShipGL.CubeTexture.prototype = Object.create(ShipGL.GLResource.prototype);

/**
 * Bind the texture to the WebGL rendering context.
 *
 * @this {ShipGL.CubeTexture}
 *
 * @param {number} [unit] The texture unit to make active. If unit is
 *                        not specified, texture will still get bound
 *                        but no texture unit will be made active.
 * @example
 * // Assume tex is an instance of ShipGL.CubeTexture. You can bind the
 * // texture like this:
 * tex.bind();
 *
 * // You can bind the texture and set the active texture unit in the
 * // same call like this:
 * tex.bind(0);
 *
 * // The above call binds the texture and makes texture unit TEXTURE0 active.
 */
ShipGL.CubeTexture.prototype.bind = function(unit)
{
    if (unit >= 0)
    {
        this.gl.activeTexture(this.gl.TEXTURE0 + unit);
    }

    this.gl.bindTexture(this.textureType, this.rawTexture);
};

/**
 * Unbind the texture from the WebGL rendering context.
 *
 * @this {ShipGL.CubeTexture}
 */
ShipGL.CubeTexture.prototype.unbind = function()
{
    this.gl.bindTexture(this.textureType, null);
};

/**
 * Load the image for the positive X face.
 *
 * @this {ShipGL.CubeTexture}
 *
 * @param {string} pathToTexture Path to the image file
 */
ShipGL.CubeTexture.prototype.loadPositiveX = function(pathToTexture)
{
    this._images[0].src = pathToTexture;
};

/**
 * Load the image for the negative X face.
 *
 * @this {ShipGL.CubeTexture}
 *
 * @param {string} pathToTexture Path to the image file
 */
ShipGL.CubeTexture.prototype.loadNegativeX = function(pathToTexture)
{
    this._images[1].src = pathToTexture;
};

/**
 * Load the image for the positive Y face.
 *
 * @this {ShipGL.CubeTexture}
 *
 * @param {string} pathToTexture Path to the image file
 */
ShipGL.CubeTexture.prototype.loadPositiveY = function(pathToTexture)
{
    this._images[2].src = pathToTexture;
};

/**
 * Load the image for the negative Y face.
 *
 * @this {ShipGL.CubeTexture}
 *
 * @param {string} pathToTexture Path to the image file
 */
ShipGL.CubeTexture.prototype.loadNegativeY = function(pathToTexture)
{
    this._images[3].src = pathToTexture;
};

/**
 * Load the image for the positive Z face.
 *
 * @this {ShipGL.CubeTexture}
 *
 * @param {string} pathToTexture Path to the image file
 */
ShipGL.CubeTexture.prototype.loadPositiveZ = function(pathToTexture)
{
    this._images[4].src = pathToTexture;
};

/**
 * Load the image for the negative Z face.
 *
 * @this {ShipGL.CubeTexture}
 *
 * @param {string} pathToTexture Path to the image file
 */
ShipGL.CubeTexture.prototype.loadNegativeZ = function(pathToTexture)
{
    this._images[5].src = pathToTexture;
};

/**
 * Set the texture's wrapping mode for the S component of texture coordinates.
 *
 * @this {ShipGL.CubeTexture}
 *
 * @param {boolean} repeat Should S be repeated or clamped?
 */
ShipGL.CubeTexture.prototype.setRepeatS = function(repeat)
{
    this.gl.texParameteri(this.textureType, this.gl.TEXTURE_WRAP_S,
                          repeat ? this.gl.REPEAT : this.gl.CLAMP_TO_EDGE);
};

/**
 * Set the texture's wrapping mode for the T component of texture coordinates.
 *
 * @this {ShipGL.CubeTexture}
 *
 * @param {boolean} repeat Should T be repeated or clamped?
 */
ShipGL.CubeTexture.prototype.setRepeatT = function(repeat)
{
    this.gl.texParameteri(this.textureType, this.gl.TEXTURE_WRAP_T,
                          repeat ? this.gl.REPEAT : this.gl.CLAMP_TO_EDGE);
};

/**
 * Set the texture's filter modes.
 *
 * @this {ShipGL.CubeTexture}
 *
 * @param {boolean} smooth Should the texture have a smooth appearance?
 */
ShipGL.CubeTexture.prototype.setSmooth = function(smooth)
{
    this.gl.texParameteri(this.textureType, this.gl.TEXTURE_MAG_FILTER,
                          smooth ? this.gl.LINEAR : this.gl.NEAREST);

    this.gl.texParameteri(this.textureType, this.gl.TEXTURE_MIN_FILTER,
                          smooth ? this.gl.LINEAR : this.gl.NEAREST);
};

/**
 * Callback used to store a face's image data on the graphics card and
 * handle some other initialization.
 *
 * @this {ShipGL.CubeTexture}
 *
 * @param {number} index The index into the _images array of images (0-5).
 */
ShipGL.CubeTexture.prototype.onImageLoad = function(index)
{
    this.bind();
    this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, 0);
    this.gl.texImage2D(
        this.gl.TEXTURE_CUBE_MAP_POSITIVE_X + index, // enum target
        0,                         // int level
        this.gl.RGBA,             // enum internalformat
        this.gl.RGBA,             // enum format
        this.gl.UNSIGNED_BYTE,    // enum type
        this._images[index]);     // image data

    this.setRepeatS(false);
    this.setRepeatT(false);
    this.setSmooth(true);
    this.unbind();
};
/**
 * @file Contains all ShipGL.Light code.
 * @author Jason Shipman
 *
 * Copyright (C) 2012 Jason Shipman
 * This software is provided 'as-is', without any express or implied warranty.
 * In no event will the authors be held liable for any damages arising from the
 * use of this software.
 *
 * Permission is granted to anyone to use this software for any purpose,
 * including commercial applications, and to alter it and redistribute it
 * freely, subject to the following restrictions:
 *
 * 1. The origin of this software must not be misrepresented; you must not
 * claim that you wrote the original software. If you use this software
 * in a product, an acknowledgment in the product documentation would be
 * appreciated but is not required.
 *
 * 2. Altered source versions must be plainly marked as such, and must not be
 * misrepresented as being the original software.
 *
 * 3. This notice may not be removed or altered from any source distribution.
 */

/**
 * ShipGL.Light is abstract. You can instantiate it, but the instant you call
 * one of the instance's methods, an exception will be thrown.
 *
 * @class ShipGL.Light
 * @classdesc A ShipGL.Light serves as the base class for the specific
 *            light types ShipGL offers.
 *
 * @param {number} intensity The light's intensity
 */
ShipGL.Light = function(intensity)
{
    /**
     * @memberof ShipGL.Light#
     * @description The light's intensity.
     * @name intensity
     */
    this.intensity = vec3.create(intensity);
    
    /**
     * @memberof ShipGL.Light#
     * @description The light's rotation status.
     * @name isRotating
     */
    this.isRotating = false;
    
    /**
     * @memberof ShipGL.Light#
     * @description The light's rotation matrix.
     * @name rotationMat
     */
    this.rotationMat = mat4.create();
};

/**
 * If the light is rotating, calling this function should rotate the light
 * according to its rotation matrix and do any other updating that may
 * be necessary between frames.
 *
 * @this {ShipGL.Light}
 *
 * @param {number} elapsed The elapsed time in milliseconds since the last
 *                         call to update. The implementation does not
 *                         require this parameter to be passed in.
 */
ShipGL.Light.prototype.update = function(elapsed)
{
    throw "ShipGL.Light.update is abstract!";
};

/**
 * Does some preparation for the light to begin rotation, mainly computing
 * the light's rotation matrix.
 *
 * @this {ShipGL.Light}
 *
 * @param {number} angle The angle (in degrees) to rotate for every call
 *                       to update
 * @param {vec3} axis The axis to rotate around
 */
ShipGL.Light.prototype.startRotation = function(angle, axis)
{
    throw "ShipGL.Light.startRotation is abstract!";
};

/**
 * Disables rotation. (No matter how many times you call update, the
 * light won't rotate!)
 *
 * @this {ShipGL.Light}
 */
ShipGL.Light.prototype.stopRotation = function()
{
    throw "ShipGL.Light.stopRotation is abstract!";
};
/**
 * @file Contains all ShipGL.PointLight code.
 * @author Jason Shipman
 *
 * Copyright (C) 2012 Jason Shipman
 * This software is provided 'as-is', without any express or implied warranty.
 * In no event will the authors be held liable for any damages arising from the
 * use of this software.
 *
 * Permission is granted to anyone to use this software for any purpose,
 * including commercial applications, and to alter it and redistribute it
 * freely, subject to the following restrictions:
 *
 * 1. The origin of this software must not be misrepresented; you must not
 * claim that you wrote the original software. If you use this software
 * in a product, an acknowledgment in the product documentation would be
 * appreciated but is not required.
 *
 * 2. Altered source versions must be plainly marked as such, and must not be
 * misrepresented as being the original software.
 *
 * 3. This notice may not be removed or altered from any source distribution.
 */

/**
 * Creates a new ShipGL.PointLight instance.
 *
 * @class ShipGL.PointLight
 * @classdesc A ShipGL.PointLight is a ShipGL.Light that has a position.
 *            The position is represented as a 4D vector with the fourth
 *            component locked to 1.
 * @augments ShipGL.Light
 *
 * @param {number} intensity The light's intensity
 * @param {vec3} position The light's position
 */
ShipGL.PointLight = function(intensity, position)
{
    ShipGL.Light.call(this, intensity);

    /**
     * @memberof ShipGL.PointLight#
     * @description The light's position.
     * @name position
     */
    this.position = vec4.createFrom(position[0], position[1], position[2], 1);
};

ShipGL.PointLight.prototype = Object.create(ShipGL.Light.prototype);

/**
 * If the light is rotating, calling this function will rotate the light
 * according to its rotation matrix.
 *
 * @this {ShipGL.PointLight}
 *
 * @param {number} elapsed The elapsed time in milliseconds since the last
 *                         call to update. The implementation does not
 *                         require this parameter to be passed in.
 */
ShipGL.PointLight.prototype.update = function(elapsed)
{
    if (this.isRotating)
    {
        mat4.multiplyVec4(this.rotationMat, this.position);

        // Rotation matrix should never change 4th component,
        // but just to be safe...
        this.position[3] = 1;
    }
};

/**
 * Does some preparation for the light to begin rotation, mainly computing
 * the light's rotation matrix.
 *
 * @this {ShipGL.PointLight}
 *
 * @param {number} angle The angle (in degrees) to rotate for every call
 *                       to update
 * @param {vec3} axis The axis to rotate around
 * @param {vec3} center Rotate with respect to this point
 */
ShipGL.PointLight.prototype.startRotation = function(angle, axis, center)
{
    this.isRotating = true;

    ShipGL.Math.arbitraryRotation(ShipGL.Math.toRadians(angle),
                                  center,
                                  axis,
                                  this.rotationMat);
};

/**
 * Disables rotation. (No matter how many times you call update, the
 * light won't rotate!)
 *
 * @this {ShipGL.PointLight}
 */
ShipGL.PointLight.prototype.stopRotation = function()
{
    this.isRotating = false;
};

/**
 * @file Contains all ShipGL.DirectionalLight code.
 * @author Jason Shipman
 *
 * Copyright (C) 2012 Jason Shipman
 * This software is provided 'as-is', without any express or implied warranty.
 * In no event will the authors be held liable for any damages arising from the
 * use of this software.
 *
 * Permission is granted to anyone to use this software for any purpose,
 * including commercial applications, and to alter it and redistribute it
 * freely, subject to the following restrictions:
 *
 * 1. The origin of this software must not be misrepresented; you must not
 * claim that you wrote the original software. If you use this software
 * in a product, an acknowledgment in the product documentation would be
 * appreciated but is not required.
 *
 * 2. Altered source versions must be plainly marked as such, and must not be
 * misrepresented as being the original software.
 *
 * 3. This notice may not be removed or altered from any source distribution.
 */

/**
 * Creates a new ShipGL.DirectionalLight instance.
 *
 * @class ShipGL.DirectionalLight
 * @classdesc A ShipGL.DirectionalLight is a ShipGL.Light that has a direction.
 *            The direction is represented as a 4D vector with the fourth
 *            component locked to 0.
 * @augments ShipGL.Light
 *
 * @param {number} intensity The light's intensity
 * @param {vec3} dir The light's direction
 */
ShipGL.DirectionalLight = function(intensity, dir)
{
    ShipGL.Light.call(this, intensity);

    /**
     * @memberof ShipGL.DirectionalLight#
     * @description The light's direction.
     * @name direction
     */
    this.direction = vec4.createFrom(dir[0], dir[1], dir[2], 0);
    vec3.normalize(this.direction);
};

ShipGL.DirectionalLight.prototype = Object.create(ShipGL.Light.prototype);

/**
 * If the light is rotating, calling this function will rotate the light
 * according to its rotation matrix.
 *
 * @this {ShipGL.DirectionalLight}
 *
 * @param {number} elapsed The elapsed time in milliseconds since the last
 *                         call to update. The implementation does not
 *                         require this parameter to be passed in.
 */
ShipGL.DirectionalLight.prototype.update = function(elapsed)
{
    if (this.isRotating)
    {
        mat4.multiplyVec4(this.rotationMat, this.direction);
        
        // Rotation matrix should never change 4th component,
        // but just to be safe...
        this.direction[3] = 0;
        vec3.normalize(this.direction);
    }
};

/**
 * Does some preparation for the light to begin rotation, mainly computing
 * the light's rotation matrix.
 *
 * @this {ShipGL.DirectionalLight}
 *
 * @param {number} angle The angle (in degrees) to rotate for every call
 *                       to update
 * @param {vec3} axis The axis to rotate around
 */
ShipGL.DirectionalLight.prototype.startRotation = function(angle, axis)
{
    this.isRotating = true;

    mat4.identity(this.rotationMat);

    // Unlike ShipGL.PointLight, we do not need to use
    // ShipGL.Math.arbitraryRotation here since we are dealing with
    // light direction, not position.
    mat4.rotate(this.rotationMat, ShipGL.Math.toRadians(angle), axis);
};

/**
 * Disables rotation. (No matter how many times you call update, the
 * light won't rotate!)
 *
 * @this {ShipGL.DirectionalLight}
 */
ShipGL.DirectionalLight.prototype.stopRotation = function()
{
    this.isRotating = false;
};

/**
 * @file Contains all ShipGL.Model code.
 * @author Jason Shipman
 *
 * Copyright (C) 2012 Jason Shipman
 * This software is provided 'as-is', without any express or implied warranty.
 * In no event will the authors be held liable for any damages arising from the
 * use of this software.
 *
 * Permission is granted to anyone to use this software for any purpose,
 * including commercial applications, and to alter it and redistribute it
 * freely, subject to the following restrictions:
 *
 * 1. The origin of this software must not be misrepresented; you must not
 * claim that you wrote the original software. If you use this software
 * in a product, an acknowledgment in the product documentation would be
 * appreciated but is not required.
 *
 * 2. Altered source versions must be plainly marked as such, and must not be
 * misrepresented as being the original software.
 *
 * 3. This notice may not be removed or altered from any source distribution.
 */

/**
 * Creates a new ShipGL.Model instance. Be sure to call initialize to prepare
 * the model for rendering and also to accurately set the instance's fields.
 *
 * @class ShipGL.Model
 * @classdesc ShipGL.Model is an abstract base class that provides a handful
 *            of useful and efficient model loading facilities.
 * @augments ShipGL.GLResource
 *
 * @param {WebGLRenderingContext} gl The rendering context
 * @param {string} pathToJSON The string path to the JSON model file
 * @example
 * // IMPORTANT: Please read this whole example!
 *
 * // Since this class is abstract, a subclass must be provided to create
 * // a valid ShipGL.Model.  Assume you have already written a subclass
 * // called MyModel.
 *
 * // Create an instance and initialize. Note that your subclass may have
 * // additional parameters for construction or initialization.
 * var model = new MyModel(gl, "model.json");
 * model.initialize();
 *
 * // After the model's been initialized, it is ready for rendering.
 *
 * // Assuming you've implemented rendering code in MyModel's draw method,
 * // you can render the model like this:
 * model.draw();
 *
 * // Calling initialize is very important as it does the following:
 * //   1) Stores all attribute info in the vbo and ibo fields.
 * //   2) Loads all of the model's textures.
 * //   3) Computes a normal matrix for each node.
 * //   4) Computes the model's extents info.
 *
 * // After calling initialize, every mesh will have the following additional
 * // fields:
 * //   hasTexture, a boolean for whether or not the mesh's material has a texture
 * //   hasIndices, a boolean for whether or not the mesh has indices
 * //   positionsOffset, the starting array index in the vbo for the mesh's vertices
 * //   normalsOffset, the starting array index in the vbo for the mesh's normals
 * //   stride, the stride between quantities in the array (in terms of array indices, NOT bytes)
 *
 * // If the mesh has a texture (hasTexture == true), it will also have:
 * //   texCoordsOffset, the starting array index in the vbo for the mesh's texture coordinates
 *
 * // If the mesh has indices (hasIndices == true), it will also have:
 * //   indicesOffset, the starting array index in the ibo for the mesh's indices
 * //   indicesByteOffset, the starting byte in the ibo for the mesh's indices (useful for drawElements)
 *
 * // After calling initialize, every material that has a texture will have the
 * // following additional field:
 * //   texture, the material's ShipGL.Texture instance
 *
 * // After calling initialize, every node will have the following additional
 * // field:
 * //   normalMatrix, a matrix used to transform the normal to world space and ensure
 * //                 that it is still perpendicular to the surface
 */
ShipGL.Model = function(gl, pathToJSON)
{
    ShipGL.GLResource.call(this, gl);
    
    var jsonStr = ShipGL.FileLoader.loadLocal(pathToJSON, "application/json") ||
                  ShipGL.FileLoader.loadHttp(pathToJSON, "application/json");

    /**
     * @memberof ShipGL.Model#
     * @description The parsed JSON model data
     * @name json
     */
    this.json = JSON.parse(jsonStr);

    /**
     * @memberof ShipGL.Model#
     * @description The model's vertex buffer object (of type ShipGL.Buffer)
     * @name vbo
     */
    
    /**
     * @memberof ShipGL.Model#
     * @description The model's index buffer object (of type ShipGL.Buffer)
     * @name ibo
     */
    this.vbo = new ShipGL.Buffer(gl, gl.ARRAY_BUFFER, Float32Array);
    this.ibo = new ShipGL.Buffer(gl, gl.ELEMENT_ARRAY_BUFFER, Uint16Array);

    /**
     * @memberof ShipGL.Model#
     * @description The model's minimum extent
     * @name min
     */
    this.min = vec3.create();
    
    /**
     * @memberof ShipGL.Model#
     * @description The model's maximum extent
     * @name max
     */
    this.max = vec3.create();
    
    /**
     * @memberof ShipGL.Model#
     * @description The model's center
     * @name center
     */
    this.center = vec3.create();
    
    /**
     * @memberof ShipGL.Model#
     * @description The model's diagonal distance
     * @name diagonal
     */
    this.diagonal = 0;

    this._imageDirHelper = pathToJSON.replace("model.json", "");
};

ShipGL.Model.prototype = Object.create(ShipGL.GLResource.prototype);

/**
 * Initialize the model.
 *
 * @this {ShipGL.Model}
 */
ShipGL.Model.prototype.initialize = function()
{
    this._initBuffers();
    this._initMaterialTextures();
    this._initNormalMatrices();
    this._computeExtents();
};

/**
 * Render the model. This is abstract.
 *
 * @this {ShipGL.Model}
 */
ShipGL.Model.prototype.draw = function()
{
    throw "ShipGL.Model.draw is abstract!";
};

ShipGL.Model.prototype._initBuffers = function()
{
    var i, curMesh, curMaterial, vboSize = 0, iboSize = 0, stride = 0;

    // This loop computes sizes of VBO and IBO. It also attaches
    // stride, hasIndices, and hasTexture info to the json mesh.
    for (i = 0; i < this.json.meshes.length; i++)
    {
        curMesh = this.json.meshes[i];
        stride = 0;

        vboSize += curMesh.vertexPositions.length;
        stride += 3;

        vboSize += curMesh.vertexNormals.length;
        stride += 3;
        
        curMesh.hasTexture = false;
        if (curMesh.vertexTexCoordinates &&
            curMesh.vertexTexCoordinates[0] &&
            curMesh.vertexTexCoordinates[0].length > 0)
        {
            curMaterial = this.json.materials[curMesh.materialIndex];
            curMesh.hasTexture = curMaterial.diffuseTexture.length > 0;

            if (curMesh.hasTexture)
            {
                vboSize += curMesh.vertexTexCoordinates[0].length;
                stride += 2;
            }
        }

        curMesh.stride = stride;

        curMesh.hasIndices = false;
        if (curMesh.indices && curMesh.indices.length > 0)
        {
            curMesh.hasIndices = true;
            curMesh.indicesOffset = iboSize;
            curMesh.indicesByteOffset = Uint16Array.BYTES_PER_ELEMENT * iboSize;
            iboSize += curMesh.indices.length;
        }
    }

    this.vbo.bind();
    this.ibo.bind();

    this.vbo.allocate(vboSize);
    this.ibo.allocate(iboSize);

    // This loop writes all the vertex/index data into the buffers.
    var j, k, writeIdx = 0;
    for (i = 0; i < this.json.meshes.length; i++)
    {
        curMesh = this.json.meshes[i];

        curMesh.positionsOffset = writeIdx;
        curMesh.normalsOffset = 3 + writeIdx;

        if (curMesh.hasTexture)
        {
            curMesh.texCoordsOffset = 6 + writeIdx;
        }

        for (j = 0, k = 0 ; j < curMesh.vertexPositions.length; j += 3)
        {
            this.vbo.write(curMesh.vertexPositions.slice(j, j+3), writeIdx);
            writeIdx += 3;

            this.vbo.write(curMesh.vertexNormals.slice(j, j+3), writeIdx);
            writeIdx += 3;

            if (curMesh.hasTexture)
            {
                this.vbo.write(curMesh.vertexTexCoordinates[0].slice(k, k+2), writeIdx);
                writeIdx += 2;
                k += 2;
            }
        }

        if (curMesh.hasIndices)
        {
            this.ibo.write(curMesh.indices, curMesh.indicesOffset);
        }
    }
    
    this.vbo.unbind();
    this.ibo.unbind();
};

ShipGL.Model.prototype._initMaterialTextures = function()
{
    var i, curMaterial;

    // This loop loads all textures and stores each one in its
    // corresponding json material (if material has texture).
    for (i = 0; i < this.json.materials.length; i++)
    {
        curMaterial = this.json.materials[i];

        if (curMaterial.diffuseTexture.length > 0)
        {
            curMaterial.texture = new ShipGL.Texture(this.gl);
            curMaterial.texture.load(this._imageDirHelper +
                                     curMaterial.diffuseTexture[0]);
        }
    }
};

ShipGL.Model.prototype._initNormalMatrices = function()
{
    var i, curNode;

    // This loop computes the inverse transpose of each node's model matrix
    // and stores it right back in the json node.
    for (i = 0; i < this.json.nodes.length; i++)
    {
        curNode = this.json.nodes[i];

        curNode.normalMatrix = mat4.create();
        mat4.inverse(curNode.modelMatrix, curNode.normalMatrix);
        mat4.transpose(curNode.normalMatrix);
    }
};

// Defines min, max, center, and diagonal on the model.
ShipGL.Model.prototype._computeExtents = function()
{
    function makeExtentsUpdater(pred)
    {
        return function(v1, v2, dest)
        {
            var extX = v2[0], extY = v2[1], extZ = v2[2];

            if (pred(v1[0], v2[0]))
                extX = v1[0];

            if (pred(v1[1], v2[1]))
                extY = v1[1];

            if (pred(v1[2], v2[2]))
                extZ = v1[2];

            dest[0] = extX;
            dest[1] = extY;
            dest[2] = extZ;
        };
    };

    var updateMinExtents = makeExtentsUpdater(
            function(val1, val2) { return val1 < val2; });

    var updateMaxExtents = makeExtentsUpdater(
            function(val1, val2) { return val1 > val2; });
    
    var minExtent = vec3.createFrom(Number.MAX_VALUE, Number.MAX_VALUE,
                                    Number.MAX_VALUE);
    var maxExtent = vec3.createFrom(-Number.MIN_VALUE, -Number.MIN_VALUE,
                                    -Number.MIN_VALUE);
    var tmpVec = vec3.create();

    var i, j, k, curNode, curVerts;
    for (i = 0; i < this.json.nodes.length; i++)
    {
        curNode = this.json.nodes[i];

        for (j = 0; j < curNode.meshIndices.length; j++)
        {
            curVerts = this.json.meshes[curNode.meshIndices[j]].vertexPositions;

            for (k = 0; k < curVerts.length; k += 3)
            {
                tmpVec[0] = curVerts[k];
                tmpVec[1] = curVerts[k + 1];
                tmpVec[2] = curVerts[k + 2];

                mat4.multiplyVec3(curNode.modelMatrix, tmpVec);

                updateMinExtents(minExtent, tmpVec, minExtent);
                updateMaxExtents(maxExtent, tmpVec, maxExtent);
            }
        }
    }
    
    var center = vec3.create();
    vec3.add(minExtent, maxExtent, center);
    vec3.scale(center, 0.5);

    vec3.set(minExtent, this.min);
    vec3.set(maxExtent, this.max);
    vec3.set(center, this.center);
    this.diagonal = vec3.dist(this.min, this.max);
};
/**
 * @file Contains all ShipGL.SkyBox code.
 * @author Jason Shipman
 *
 * Copyright (C) 2012 Jason Shipman
 * This software is provided 'as-is', without any express or implied warranty.
 * In no event will the authors be held liable for any damages arising from the
 * use of this software.
 *
 * Permission is granted to anyone to use this software for any purpose,
 * including commercial applications, and to alter it and redistribute it
 * freely, subject to the following restrictions:
 *
 * 1. The origin of this software must not be misrepresented; you must not
 * claim that you wrote the original software. If you use this software
 * in a product, an acknowledgment in the product documentation would be
 * appreciated but is not required.
 *
 * 2. Altered source versions must be plainly marked as such, and must not be
 * misrepresented as being the original software.
 *
 * 3. This notice may not be removed or altered from any source distribution.
 */

/**
 * Creates a new ShipGL.SkyBox instance.
 *
 * @class ShipGL.SkyBox
 * @classdesc A ShipGL.SkyBox object provides a means to render a skybox.
 * @augments ShipGL.GLResource
 *
 * @param {WebGLRenderingContext} gl The rendering context
 */
ShipGL.SkyBox = function(gl)
{
    ShipGL.GLResource.call(this, gl);

    /**
     * @memberof ShipGL.SkyBox#
     * @description The texture cube.
     * @name cubeMap
     */
    this.cubeMap = new ShipGL.CubeTexture(this.gl);

    var bufferUtils = new ShipGL.BufferUtilities(this.gl);

    /**
     * @memberof ShipGL.SkyBox#
     * @description The vertex buffer object for the skybox.
     * @name vbo
     */
    this.vbo = bufferUtils.createVertexBuffer([
       // Snagged from learningwebgl.com. (in the interest of time)
       // Front face
      -1.0, -1.0,  1.0,
       1.0, -1.0,  1.0,
       1.0,  1.0,  1.0,
      -1.0,  1.0,  1.0,

       // Back face
      -1.0, -1.0, -1.0,
      -1.0,  1.0, -1.0,
       1.0,  1.0, -1.0,
       1.0, -1.0, -1.0,

       // Top face
      -1.0,  1.0, -1.0,
      -1.0,  1.0,  1.0,
       1.0,  1.0,  1.0,
       1.0,  1.0, -1.0,

       // Bottom face
      -1.0, -1.0, -1.0,
       1.0, -1.0, -1.0,
       1.0, -1.0,  1.0,
      -1.0, -1.0,  1.0,

       // Right face
       1.0, -1.0, -1.0,
       1.0,  1.0, -1.0,
       1.0,  1.0,  1.0,
       1.0, -1.0,  1.0,

       // Left face
      -1.0, -1.0, -1.0,
      -1.0, -1.0,  1.0,
      -1.0,  1.0,  1.0,
      -1.0,  1.0, -1.0
    ]);

    /**
     * @memberof ShipGL.SkyBox#
     * @description The index buffer object for the skybox.
     * @name ibo
     */
    this.ibo = bufferUtils.createIndexBuffer([
        // Snagged from learningwebgl.com. (in the interest of time)
         0,  1,  2,    0,  2,  3, // Front face
         4,  5,  6,    4,  6,  7, // Back face
         8,  9, 10,    8, 10, 11, // Top face
        12, 13, 14,   12, 14, 15, // Bottom face
        16, 17, 18,   16, 18, 19, // Right face
        20, 21, 22,   20, 22, 23  // Left face
    ]);

    var vShaderCode = [
        "uniform mat4 uProjMat;",
        "uniform mat4 uViewMat;",
        "uniform mat4 uModelMat;",
        "",
        "attribute vec3 aPosition;",
        "",
        "varying vec3 texCoord;",
        "",
        "void main()",
        "{",
        "    gl_Position = uProjMat * uViewMat * uModelMat * vec4(aPosition, 1.0);",
        "    texCoord = aPosition;",
        "}"
    ].join("\n");

    var fShaderCode = [
        "precision mediump float;",
        "",
        "uniform samplerCube uCubeTex;",
        "",
        "varying vec3 texCoord;",
        "",
        "void main()",
        "{",
        "	gl_FragColor = textureCube(uCubeTex, texCoord);",
        "}"
    ].join("\n");

    /**
     * @memberof ShipGL.SkyBox#
     * @description The shader program for the skybox.
     * @name program
     */
    this.program = new ShipGL.ShaderProgram(this.gl);
    this.program.create(vShaderCode, fShaderCode);

    this.center = vec3.create();
    this.width = 2;

    this.projMat = mat4.create();
    this.viewMat = mat4.create();
    this.modelMat = mat4.create();
};

ShipGL.SkyBox.prototype = Object.create(ShipGL.GLResource.prototype);

/**
 * Draw the skybox. Be sure to set the skybox's projection/view matrices,
 * and any other required state before calling this.
 *
 * @this {ShipGL.SkyBox}
 */
ShipGL.SkyBox.prototype.draw = function()
{
    this.program.bind();
    this.vbo.bind();
    this.ibo.bind();
    this.cubeMap.bind(0);

    this.program.enableAttributeArray("aPosition");

    this.program.setUniformMat4("uProjMat", this.projMat);
    this.program.setUniformMat4("uViewMat", this.viewMat);
    this.program.setUniformMat4("uModelMat", this.modelMat);
    this.program.setUniform1i("uCubeTex", 0);
    
    this.program.setAttributeBuffer3f("aPosition", 0, 0);

    this.gl.drawElements(this.gl.TRIANGLES, this.ibo.length,
                         this.gl.UNSIGNED_SHORT, 0);
    
    this.program.disableAttributeArray("aPosition");

    this.cubeMap.unbind();
    this.ibo.unbind();
    this.vbo.unbind();
    this.program.unbind();
};

/**
 * Load the skybox's cube map using the specified path to the image folder.
 *
 * @this {ShipGL.SkyBox}
 *
 * @param {string} path The path to the image folder
 * @param {string} ext The image extension
 */
ShipGL.SkyBox.prototype.setDirectory = function(path, ext)
{
    var posString = "/positive_";
    var negString = "/negative_";

    this.cubeMap.loadPositiveX(path + posString + "x" + ext);
    this.cubeMap.loadPositiveY(path + posString + "y" + ext);
    this.cubeMap.loadPositiveZ(path + posString + "z" + ext);

    this.cubeMap.loadNegativeX(path + negString + "x" + ext);
    this.cubeMap.loadNegativeY(path + negString + "y" + ext);
    this.cubeMap.loadNegativeZ(path + negString + "z" + ext);
};

/**
 * Set the center of the skybox.
 *
 * @this {ShipGL.SkyBox}
 *
 * @param {vec3} center The skybox's new center
 */
ShipGL.SkyBox.prototype.setCenter = function(center)
{
    vec3.set(center, this.center);
    this._computeModelMatrix();
};

/**
 * Set the width for each side of the skybox.
 *
 * @this {ShipGL.SkyBox}
 *
 * @param {number} width The skybox's new width for each side
 */
ShipGL.SkyBox.prototype.setWidth = function(width)
{
    this.width = width;
    this._computeModelMatrix();
};

/**
 * Set the projection matrix for the skybox.
 *
 * @this {ShipGL.SkyBox}
 *
 * @param {mat4} projMat The skybox's new projection matrix
 */
ShipGL.SkyBox.prototype.setProjection = function(projMat)
{
    mat4.set(projMat, this.projMat);
};

/**
 * Set the view matrix for the skybox.
 *
 * @this {ShipGL.SkyBox}
 *
 * @param {mat4} viewMat The skybox's new view matrix
 */
ShipGL.SkyBox.prototype.setView = function(viewMat)
{
    mat4.set(viewMat, this.viewMat);
};

ShipGL.SkyBox.prototype._computeModelMatrix = function()
{
    var halfWidth = 0.5 * this.width;
    mat4.identity(this.modelMat);
    mat4.translate(this.modelMat, this.center);
    mat4.scale(this.modelMat, [halfWidth, halfWidth, halfWidth]);
};
/**
 * @file Contains all ShipGL.Floor code.
 * @author Jason Shipman
 *
 * Copyright (C) 2012 Jason Shipman
 * This software is provided 'as-is', without any express or implied warranty.
 * In no event will the authors be held liable for any damages arising from the
 * use of this software.
 *
 * Permission is granted to anyone to use this software for any purpose,
 * including commercial applications, and to alter it and redistribute it
 * freely, subject to the following restrictions:
 *
 * 1. The origin of this software must not be misrepresented; you must not
 * claim that you wrote the original software. If you use this software
 * in a product, an acknowledgment in the product documentation would be
 * appreciated but is not required.
 *
 * 2. Altered source versions must be plainly marked as such, and must not be
 * misrepresented as being the original software.
 *
 * 3. This notice may not be removed or altered from any source distribution.
 */

/**
 * Creates a new ShipGL.Floor instance.
 *
 * @class ShipGL.Floor
 * @classdesc A ShipGL.Floor object provides a means to render a floor.
 * @augments ShipGL.GLResource
 *
 * @param {WebGLRenderingContext} gl The rendering context
 */
ShipGL.Floor = function(gl)
{
    ShipGL.GLResource.call(this, gl);

    /**
     * @memberof ShipGL.Floor#
     * @description The number of tiles in one row of the floor.
     * @name tilesAcross
     */
    this.tilesAcross = 10;
    
    /**
     * @memberof ShipGL.Floor#
     * @description The width in world space of the floor.
     * @name width
     */
    this.width = 2;
    
    /**
     * @memberof ShipGL.Floor#
     * @description The texture used to tile the floor.
     * @name tileTexture
     */
    this.tileTexture = new ShipGL.Texture(this.gl);
    
    /**
     * @memberof ShipGL.Floor#
     * @description The center of the floor.
     * @name center
     */
    this.center = vec3.create();
    
    var bufferUtils = new ShipGL.BufferUtilities(this.gl);

    /**
     * @memberof ShipGL.Floor#
     * @description The vertex buffer object for the floor.
     * @name vbo
     */
    this.vbo = bufferUtils.createVertexBuffer([
        // Vertices
        -1.0, 0.0, -1.0,
        -1.0, 0.0,  1.0,
         1.0, 0.0,  1.0,
         1.0, 0.0, -1.0,

        // Texture coordinates
         0.0, 0.0,
         0.0, 1.0,
         1.0, 0.0,
         1.0, 1.0
    ]);

    this.positionsOffset = 0;
    this.texCoordsOffset = 12;
    this.stride = 0;

    /**
     * @memberof ShipGL.Floor#
     * @description The index buffer object for the floor.
     * @name ibo
     */
    this.ibo = bufferUtils.createIndexBuffer([
        0, 1, 2,   0, 2, 3
    ]);
    
    var vShaderCode = [
        "uniform mat4 uProjMat;",
        "uniform mat4 uViewMat;",
        "uniform mat4 uModelMat;",
        "uniform float uTilesAcross;",
        "",
        "attribute vec3 aPosition;",
        "attribute vec2 aTexCoord;",
        "",
        "varying vec2 texCoord;",
        "",
        "void main()",
        "{",
        "    gl_Position = uProjMat * uViewMat * uModelMat * vec4(aPosition, 1.0);",
        "    texCoord = uTilesAcross * aTexCoord;",
        "}"
    ].join("\n");

    var fShaderCode = [
        "precision mediump float;",
        "",
        "uniform sampler2D uTex;",
        "",
        "varying vec2 texCoord;",
        "",
        "void main()",
        "{",
        "	gl_FragColor = texture2D(uTex, texCoord);",
        "	//gl_FragColor = vec4(0.8, 0.8, 0.3, 1.0);",
        "}"
    ].join("\n");

    /**
     * @memberof ShipGL.Floor#
     * @description The shader program for the floor.
     * @name program
     */
    this.program = new ShipGL.ShaderProgram(this.gl);
    this.program.create(vShaderCode, fShaderCode);

    this.projMat = mat4.create();
    this.viewMat = mat4.create();
    this.modelMat = mat4.create();
};

ShipGL.Floor.prototype = Object.create(ShipGL.GLResource.prototype);

/**
 * Draw the floor. Be sure to set the floor's projection/view matrices,
 * and any other required state before calling this.
 *
 * @this {ShipGL.Floor}
 */
ShipGL.Floor.prototype.draw = function()
{
    this.program.bind();
    this.vbo.bind();
    this.ibo.bind();
    this.tileTexture.bind(0);
    
    this.program.enableAttributeArray("aPosition");
    this.program.enableAttributeArray("aTexCoord");

    this.program.setUniformMat4("uProjMat", this.projMat);
    this.program.setUniformMat4("uViewMat", this.viewMat);
    this.program.setUniformMat4("uModelMat", this.modelMat);
    this.program.setUniform1f("uTilesAcross", this.tilesAcross);
    this.program.setUniform1i("uTex", 0);
    
    this.program.setAttributeBuffer3f("aPosition", this.stride, this.positionsOffset);
    this.program.setAttributeBuffer2f("aTexCoord", this.stride, this.texCoordsOffset);

    this.gl.drawElements(this.gl.TRIANGLES, this.ibo.length,
                         this.gl.UNSIGNED_SHORT, 0);
    
    this.program.disableAttributeArray("aTexCoord");
    this.program.disableAttributeArray("aPosition");

    this.tileTexture.unbind();
    this.ibo.unbind();
    this.vbo.unbind();
    this.program.unbind();
};

/**
 * Load the tile texture using the specified path to the image file.
 *
 * @this {ShipGL.Floor}
 *
 * @param {string} pathToTile The path to the image file
 */
ShipGL.Floor.prototype.setTexture = function(pathToTile)
{
    this.tileTexture.load(pathToTile);
};

/**
 * Set the center of the floor.
 *
 * @this {ShipGL.Floor}
 *
 * @param {vec3} center The floor's new center
 */
ShipGL.Floor.prototype.setCenter = function(center)
{
    vec3.set(center, this.center);
    this._computeModelMatrix();
};

/**
 * Set the width for each side of the floor.
 *
 * @this {ShipGL.Floor}
 *
 * @param {number} width The floor's new width for each side
 */
ShipGL.Floor.prototype.setWidth = function(width)
{
    this.width = width;
    this._computeModelMatrix();
};

/**
 * Set the projection matrix for the floor.
 *
 * @this {ShipGL.Floor}
 *
 * @param {mat4} projMat The floor's new projection matrix
 */
ShipGL.Floor.prototype.setProjection = function(projMat)
{
    mat4.set(projMat, this.projMat);
};

/**
 * Set the view matrix for the floor.
 *
 * @this {ShipGL.Floor}
 *
 * @param {mat4} viewMat The floor's new view matrix
 */
ShipGL.Floor.prototype.setView = function(viewMat)
{
    mat4.set(viewMat, this.viewMat);
};

ShipGL.Floor.prototype._computeModelMatrix = function()
{
    var halfWidth = 0.5 * this.width;
    mat4.identity(this.modelMat);
    mat4.translate(this.modelMat, this.center);
    mat4.scale(this.modelMat, [halfWidth, halfWidth, halfWidth]);
};
/**
 * @file Contains all ShipGL.BaseApp code.
 * @author Jason Shipman
 *
 * Copyright (C) 2012 Jason Shipman
 * This software is provided 'as-is', without any express or implied warranty.
 * In no event will the authors be held liable for any damages arising from the
 * use of this software.
 *
 * Permission is granted to anyone to use this software for any purpose,
 * including commercial applications, and to alter it and redistribute it
 * freely, subject to the following restrictions:
 *
 * 1. The origin of this software must not be misrepresented; you must not
 * claim that you wrote the original software. If you use this software
 * in a product, an acknowledgment in the product documentation would be
 * appreciated but is not required.
 *
 * 2. Altered source versions must be plainly marked as such, and must not be
 * misrepresented as being the original software.
 *
 * 3. This notice may not be removed or altered from any source distribution.
 */

/**
 * Creates a new ShipGL.BaseApp instance.
 *
 * @class ShipGL.BaseApp
 * @classdesc ShipGL.BaseApp is an abstract base class. It is meant to be
 *            inherited to implement your application's specific functionality.
 * @augments ShipGL.GLResource
 *
 * @param {string} canvasId The unique identifier of the canvas to use for rendering
 * @param {object} contextOptions Additional WebGL context options
 */
ShipGL.BaseApp = function(canvasId, contextOptions)
{
    /**
     * @memberof ShipGL.BaseApp#
     * @description The canvas used for rendering
     * @name canvas
     */
    this.canvas = document.getElementById(canvasId);

    ShipGL.GLResource.call(this, this.createContext(this.canvas, contextOptions));

    /**
     * @memberof ShipGL.BaseApp#
     * @description An instance of ShipGL.BufferUtilities
     * @name bufferUtils
     */
    this.bufferUtils = new ShipGL.BufferUtilities(this.gl);

    /**
     * @memberof ShipGL.BaseApp#
     * @description The list of keys that are currently held
     * @name heldKeys
     */
    this.heldKeys = [];

    this._currentTime = 0;
    this._previousTime = 0;
    this._timeDelta = 0;
};

ShipGL.BaseApp.prototype = Object.create(ShipGL.GLResource.prototype);

/**
 * Run the application. This calls update and draw once per frame, sending
 * as a parameter, the time elapsed in milliseconds since the last frame.
 */
ShipGL.BaseApp.prototype.run = function()
{
    this._previousTime = this._currentTime;
    this._currentTime = new Date().getTime();
    this._timeDelta = this._currentTime - this._previousTime;

    this.update(this._timeDelta);
    this.draw(this._timeDelta);
    
    var scope = this;
    requestAnimFrame(function() { scope.run(); });
};

/**
 * Attempt to create a WebGL rendering context using Google's WebGLUtils.
 *
 * @param {HTMLCanvasElement} canvas The canvas to use for rendering
 * @param {object} contextOptions Additional WebGL context options
 */
ShipGL.BaseApp.prototype.createContext = function(canvas, contextOptions)
{
    var gl = WebGLUtils.setupWebGL(canvas, contextOptions);

    if (!gl)
    {
        alert("Unable to initialize WebGL. Your browser may not support it.");
        return;
    }

    return gl;
};

/**
 * Load all content in this method. initialize is called once in the lifetime
 * of a ShipGL.BaseApp.
 */
ShipGL.BaseApp.prototype.initialize = function()
{
    throw "ShipGL.BaseApp.initialize is abstract!";
};

/**
 * Perform logic updates in this method. update is called once per frame.
 *
 * @param {number} elapsed The amount of time in milliseconds since the last
 *                         frame
 */
ShipGL.BaseApp.prototype.update = function(elapsed)
{
    throw "ShipGL.BaseApp.update is abstract!";
};

/**
 * Perform rendering in this method. draw is called once per frame.
 *
 * @param {number} elapsed The amount of time in milliseconds since the last
 *                         frame
 */
ShipGL.BaseApp.prototype.draw = function(elapsed)
{
    throw "ShipGL.BaseApp.draw is abstract!";
};

/**
 * Implement this method if you need to process keyboard input that is
 * continous. For example, if you want your camera to move forward when
 * you hold down a key, handle that here.
 *
 * IMPORTANT: After you've implemented the method, be sure to call it once
 * in update!
 */
ShipGL.BaseApp.prototype.handleHeldKeys = function(elapsed)
{
    throw "ShipGL.BaseApp.handleHeldKeys is abstract!";
};

/**
 * Override this method if you need to process keyboard input that is
 * on/off-like. For example, if you want to press a key that resets the camera
 * to its default view, you would handle that key press here.
 *
 * IMPORTANT: Must hook up document.onkeydown to this! Also, be sure to call
 * this parent method so all the key book-keeping takes place.
 */
ShipGL.BaseApp.prototype.handleKeyPressed = function(keyCode)
{
    this.heldKeys[keyCode] = true;
};

/**
 * Override this method if you need to process keyboard input that is
 * on/off-like. For example, if you want to shoot a missile on releasing a key,
 * you would handle that key release here.
 *
 * IMPORTANT: Must hook up document.onkeyup to this! Also, be sure to call
 * this parent method so all the key book-keeping takes place.
 */
ShipGL.BaseApp.prototype.handleKeyReleased = function(keyCode)
{
    this.heldKeys[keyCode] = false;
};
