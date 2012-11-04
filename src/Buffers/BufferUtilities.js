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
