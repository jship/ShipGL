/**
 * @file Contains all ShipGL.Texture code.
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
