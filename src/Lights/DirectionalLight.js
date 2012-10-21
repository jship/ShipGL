/**
 * @file Contains all ShipGL.DirectionalLight code.
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

