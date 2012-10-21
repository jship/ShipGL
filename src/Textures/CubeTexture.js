/**
 * @file Contains all ShipGL.CubeTexture code.
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
