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
