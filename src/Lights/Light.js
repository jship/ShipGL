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
