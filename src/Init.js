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
