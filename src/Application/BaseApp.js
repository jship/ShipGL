/**
 * @file Contains all ShipGL.BaseApp code.
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
 * Creates a new ShipGL.BaseApp instance.
 *
 * @class ShipGL.BaseApp
 * @classdesc ShipGL.BaseApp is an abstract base class. It is meant to be
 *            inherited to implement your application's specific functionality.
 * @augments ShipGL.GLResource
 *
 * @param {string} canvasId The unique identifier of the canvas to use for rendering
 * @param {object} contextOptions Additional WebGL context options
 */
ShipGL.BaseApp = function(canvasId, contextOptions)
{
    /**
     * @memberof ShipGL.BaseApp#
     * @description The canvas used for rendering
     * @name canvas
     */
    this.canvas = document.getElementById(canvasId);

    ShipGL.GLResource.call(this, this.createContext(this.canvas, contextOptions));

    /**
     * @memberof ShipGL.BaseApp#
     * @description An instance of ShipGL.BufferUtilities
     * @name bufferUtils
     */
    this.bufferUtils = new ShipGL.BufferUtilities(this.gl);

    /**
     * @memberof ShipGL.BaseApp#
     * @description The list of keys that are currently held
     * @name heldKeys
     */
    this.heldKeys = [];

    this._currentTime = 0;
    this._previousTime = 0;
    this._timeDelta = 0;
};

ShipGL.BaseApp.prototype = Object.create(ShipGL.GLResource.prototype);

/**
 * Run the application. This calls update and draw once per frame, sending
 * as a parameter, the time elapsed in milliseconds since the last frame.
 */
ShipGL.BaseApp.prototype.run = function()
{
    this._previousTime = this._currentTime;
    this._currentTime = new Date().getTime();
    this._timeDelta = this._currentTime - this._previousTime;

    this.update(this._timeDelta);
    this.draw(this._timeDelta);
    
    var scope = this;
    requestAnimFrame(function() { scope.run(); });
};

/**
 * Attempt to create a WebGL rendering context using Google's WebGLUtils.
 *
 * @param {HTMLCanvasElement} canvas The canvas to use for rendering
 * @param {object} contextOptions Additional WebGL context options
 */
ShipGL.BaseApp.prototype.createContext = function(canvas, contextOptions)
{
    var gl = WebGLUtils.setupWebGL(canvas, contextOptions);

    if (!gl)
    {
        alert("Unable to initialize WebGL. Your browser may not support it.");
        return;
    }

    return gl;
};

/**
 * Load all content in this method. initialize is called once in the lifetime
 * of a ShipGL.BaseApp.
 */
ShipGL.BaseApp.prototype.initialize = function()
{
    throw "ShipGL.BaseApp.initialize is abstract!";
};

/**
 * Perform logic updates in this method. update is called once per frame.
 *
 * @param {number} elapsed The amount of time in milliseconds since the last
 *                         frame
 */
ShipGL.BaseApp.prototype.update = function(elapsed)
{
    throw "ShipGL.BaseApp.update is abstract!";
};

/**
 * Perform rendering in this method. draw is called once per frame.
 *
 * @param {number} elapsed The amount of time in milliseconds since the last
 *                         frame
 */
ShipGL.BaseApp.prototype.draw = function(elapsed)
{
    throw "ShipGL.BaseApp.draw is abstract!";
};

/**
 * Implement this method if you need to process keyboard input that is
 * continous. For example, if you want your camera to move forward when
 * you hold down a key, handle that here.
 *
 * IMPORTANT: After you've implemented the method, be sure to call it once
 * in update!
 */
ShipGL.BaseApp.prototype.handleHeldKeys = function(elapsed)
{
    throw "ShipGL.BaseApp.handleHeldKeys is abstract!";
};

/**
 * Override this method if you need to process keyboard input that is
 * on/off-like. For example, if you want to press a key that resets the camera
 * to its default view, you would handle that key press here.
 *
 * IMPORTANT: Must hook up document.onkeydown to this! Also, be sure to call
 * this parent method so all the key book-keeping takes place.
 */
ShipGL.BaseApp.prototype.handleKeyPressed = function(keyCode)
{
    this.heldKeys[keyCode] = true;
};

/**
 * Override this method if you need to process keyboard input that is
 * on/off-like. For example, if you want to shoot a missile on releasing a key,
 * you would handle that key release here.
 *
 * IMPORTANT: Must hook up document.onkeyup to this! Also, be sure to call
 * this parent method so all the key book-keeping takes place.
 */
ShipGL.BaseApp.prototype.handleKeyReleased = function(keyCode)
{
    this.heldKeys[keyCode] = false;
};
