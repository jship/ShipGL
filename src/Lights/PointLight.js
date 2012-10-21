/**
 * @file Contains all ShipGL.PointLight code.
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

