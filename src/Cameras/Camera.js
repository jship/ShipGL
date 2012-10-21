/**
 * @file Contains all ShipGL.Camera code.
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
 * Creates a new ShipGL.Camera instance.
 *
 * @class ShipGL.Camera
 * @classdesc A ShipGL.Camera object provides a means to navigate the scene.
 *
 * @param {vec3} position The camera's position
 * @param {vec3} target The point the camera should be looking at
 * @param {vec3} up The camera's up vector. The up you pass in will not
 *                  necessarily be the camera's up vector. The passed in up is
 *                  just used to help construct the camera's coordinate frame.
 */
ShipGL.Camera = function(position, target, up)
{
    /**
     * @memberof ShipGL.Camera#
     * @description The camera's view matrix. Pass this to your shaders.
     * @name viewMatrix
     */
    this.viewMatrix = mat4.create();
    
    this._scratchVec = vec3.create();
    vec3.direction(position, target, this._scratchVec);

    /**
     * @memberof ShipGL.Camera#
     * @description The point in space where the camera is positioned
     * @name position
     */
    this.position = vec3.create(position);

    /**
     * @memberof ShipGL.Camera#
     * @description The direction the camera is pointing
     * @name direction
     */
    this.direction = vec4.create();
    vec3.negate(this._scratchVec, this.direction);
    
    /**
     * @memberof ShipGL.Camera#
     * @description The right direction relative to the camera's
     *              forward direction.
     * @name right
     */
    this.right = vec4.create();
    vec3.cross(up, this._scratchVec, this.right);
    vec3.normalize(this.right);

    /**
     * @memberof ShipGL.Camera#
     * @description The up direction
     * @name up
     */
    this.up = vec4.create();
    vec3.cross(this._scratchVec, this.right, this.up);
    vec3.normalize(this.up);

    /**
     * @memberof ShipGL.Camera#
     * @description The camera's movement speed
     * @name moveSpeed
     */
    this.moveSpeed = 5;
    
    /**
     * @memberof ShipGL.Camera#
     * @description The camera's turning speed (in radians!)
     * @name lookSpeed
     */
    this.lookSpeed = ShipGL.Math.toRadians(3); 

    this._leftRotMat = mat4.create();
    this._rightRotMat = mat4.create();

    this._update();
    this._updateRotationStuff();
};

/**
 * Set the position of the camera.
 *
 * @this {ShipGL.Camera}
 *
 * @param {vec3} p The new position of the camera
 */
ShipGL.Camera.prototype.setPosition = function(p)
{
    vec3.set(p, this.position);
    this._update();
};

/**
 * Set the movement speed of the camera.
 *
 * @this {ShipGL.Camera}
 *
 * @param {number} speed The new movement speed of the camera
 */
ShipGL.Camera.prototype.setMoveSpeed = function(speed)
{
    this.moveSpeed = Math.abs(speed);
};

/**
 * Set the turning speed of the camera.
 *
 * @this {ShipGL.Camera}
 *
 * @param {number} speed The new turning speed of the camera in radians.
 */
ShipGL.Camera.prototype.setLookSpeed = function(speed)
{
    this.lookSpeed = Math.abs(speed);
    this._updateRotationStuff();
};

ShipGL.Camera.prototype._update = function()
{
    vec3.scale(this.direction, this.moveSpeed, this._scratchVec);
    vec3.add(this.position, this._scratchVec, this._scratchVec);
    mat4.lookAt(this.position, this._scratchVec, this.up, this.viewMatrix);
};

ShipGL.Camera.prototype._updateRotationStuff = function()
{
    mat4.identity(this._leftRotMat);
    mat4.identity(this._rightRotMat);

    mat4.rotate(this._leftRotMat, this.lookSpeed, this.up);
    mat4.rotate(this._rightRotMat, -this.lookSpeed, this.up);
};

/**
 * Move the camera forward according to its movement speed.
 *
 * @this {ShipGL.Camera}
 */
ShipGL.Camera.prototype.moveForward = function()
{
    vec3.scale(this.direction, this.moveSpeed, this._scratchVec);
    vec3.add(this.position, this._scratchVec);
    this._update();
};

/**
 * Move the camera backward according to its movement speed.
 *
 * @this {ShipGL.Camera}
 */
ShipGL.Camera.prototype.moveBackward = function()
{
    vec3.scale(this.direction, this.moveSpeed, this._scratchVec);
    vec3.subtract(this.position, this._scratchVec);
    this._update();
};

/**
 * Move the camera left according to its movement speed.
 *
 * @this {ShipGL.Camera}
 */
ShipGL.Camera.prototype.moveLeft = function()
{
    vec3.scale(this.right, this.moveSpeed, this._scratchVec);
    vec3.subtract(this.position, this._scratchVec);
    this._update();
};

/**
 * Move the camera right according to its movement speed.
 *
 * @this {ShipGL.Camera}
 */
ShipGL.Camera.prototype.moveRight = function()
{
    vec3.scale(this.right, this.moveSpeed, this._scratchVec);
    vec3.add(this.position, this._scratchVec);
    this._update();
};

/**
 * Move the camera up according to its movement speed.
 *
 * @this {ShipGL.Camera}
 */
ShipGL.Camera.prototype.moveUp = function()
{
    vec3.scale(this.up, this.moveSpeed, this._scratchVec);
    vec3.add(this.position, this._scratchVec);
    this._update();
};

/**
 * Move the camera down according to its movement speed.
 *
 * @this {ShipGL.Camera}
 */
ShipGL.Camera.prototype.moveDown = function()
{
    vec3.scale(this.up, this.moveSpeed, this._scratchVec);
    vec3.subtract(this.position, this._scratchVec);
    this._update();
};

/**
 * Turn the camera left according to its look speed.
 *
 * @this {ShipGL.Camera}
 */
ShipGL.Camera.prototype.lookLeft = function()
{
    mat4.multiplyVec4(this._leftRotMat, this.direction);
    vec3.normalize(this.direction);
    
    vec3.cross(this.direction, this.up, this.right);
    vec3.normalize(this.right);

    this._update();
};

/**
 * Turn the camera right according to its look speed.
 *
 * @this {ShipGL.Camera}
 */
ShipGL.Camera.prototype.lookRight = function()
{
    mat4.multiplyVec4(this._rightRotMat, this.direction);
    vec3.normalize(this.direction);
    
    vec3.cross(this.direction, this.up, this.right);
    vec3.normalize(this.right);

    this._update();
};

