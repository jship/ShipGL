/**
 * @file Contains all ShipGL.Buffer code.
 * @author Jason Shipman
 *
 * @license
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
