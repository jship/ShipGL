/**
 * @file Contains all ShipGL.Math code.
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

