/**
 * @file Contains all ShipGL.Floor code.
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
 * Creates a new ShipGL.Floor instance.
 *
 * @class ShipGL.Floor
 * @classdesc A ShipGL.Floor object provides a means to render a floor.
 * @augments ShipGL.GLResource
 *
 * @param {WebGLRenderingContext} gl The rendering context
 */
ShipGL.Floor = function(gl)
{
    ShipGL.GLResource.call(this, gl);

    /**
     * @memberof ShipGL.Floor#
     * @description The number of tiles in one row of the floor.
     * @name tilesAcross
     */
    this.tilesAcross = 10;
    
    /**
     * @memberof ShipGL.Floor#
     * @description The width in world space of the floor.
     * @name width
     */
    this.width = 2;
    
    /**
     * @memberof ShipGL.Floor#
     * @description The texture used to tile the floor.
     * @name tileTexture
     */
    this.tileTexture = new ShipGL.Texture(this.gl);
    
    /**
     * @memberof ShipGL.Floor#
     * @description The center of the floor.
     * @name center
     */
    this.center = vec3.create();
    
    var bufferUtils = new ShipGL.BufferUtilities(this.gl);

    /**
     * @memberof ShipGL.Floor#
     * @description The vertex buffer object for the floor.
     * @name vbo
     */
    this.vbo = bufferUtils.createVertexBuffer([
        // Vertices
        -1.0, 0.0, -1.0,
        -1.0, 0.0,  1.0,
         1.0, 0.0,  1.0,
         1.0, 0.0, -1.0,

        // Texture coordinates
         0.0, 0.0,
         0.0, 1.0,
         1.0, 0.0,
         1.0, 1.0
    ]);

    this.positionsOffset = 0;
    this.texCoordsOffset = 12;
    this.stride = 0;

    /**
     * @memberof ShipGL.Floor#
     * @description The index buffer object for the floor.
     * @name ibo
     */
    this.ibo = bufferUtils.createIndexBuffer([
        0, 1, 2,   0, 2, 3
    ]);
    
    var vShaderCode = [
        "uniform mat4 uProjMat;",
        "uniform mat4 uViewMat;",
        "uniform mat4 uModelMat;",
        "uniform float uTilesAcross;",
        "",
        "attribute vec3 aPosition;",
        "attribute vec2 aTexCoord;",
        "",
        "varying vec2 texCoord;",
        "",
        "void main()",
        "{",
        "    gl_Position = uProjMat * uViewMat * uModelMat * vec4(aPosition, 1.0);",
        "    texCoord = uTilesAcross * aTexCoord;",
        "}"
    ].join("\n");

    var fShaderCode = [
        "precision mediump float;",
        "",
        "uniform sampler2D uTex;",
        "",
        "varying vec2 texCoord;",
        "",
        "void main()",
        "{",
        "	gl_FragColor = texture2D(uTex, texCoord);",
        "	//gl_FragColor = vec4(0.8, 0.8, 0.3, 1.0);",
        "}"
    ].join("\n");

    /**
     * @memberof ShipGL.Floor#
     * @description The shader program for the floor.
     * @name program
     */
    this.program = new ShipGL.ShaderProgram(this.gl);
    this.program.create(vShaderCode, fShaderCode);

    this.projMat = mat4.create();
    this.viewMat = mat4.create();
    this.modelMat = mat4.create();
};

ShipGL.Floor.prototype = Object.create(ShipGL.GLResource.prototype);

/**
 * Draw the floor. Be sure to set the floor's projection/view matrices,
 * and any other required state before calling this.
 *
 * @this {ShipGL.Floor}
 */
ShipGL.Floor.prototype.draw = function()
{
    this.program.bind();
    this.vbo.bind();
    this.ibo.bind();
    this.tileTexture.bind(0);
    
    this.program.enableAttributeArray("aPosition");
    this.program.enableAttributeArray("aTexCoord");

    this.program.setUniformMat4("uProjMat", this.projMat);
    this.program.setUniformMat4("uViewMat", this.viewMat);
    this.program.setUniformMat4("uModelMat", this.modelMat);
    this.program.setUniform1f("uTilesAcross", this.tilesAcross);
    this.program.setUniform1i("uTex", 0);
    
    this.program.setAttributeBuffer3f("aPosition", this.stride, this.positionsOffset);
    this.program.setAttributeBuffer2f("aTexCoord", this.stride, this.texCoordsOffset);

    this.gl.drawElements(this.gl.TRIANGLES, this.ibo.length,
                         this.gl.UNSIGNED_SHORT, 0);
    
    this.program.disableAttributeArray("aTexCoord");
    this.program.disableAttributeArray("aPosition");

    this.tileTexture.unbind();
    this.ibo.unbind();
    this.vbo.unbind();
    this.program.unbind();
};

/**
 * Load the tile texture using the specified path to the image file.
 *
 * @this {ShipGL.Floor}
 *
 * @param {string} pathToTile The path to the image file
 */
ShipGL.Floor.prototype.setTexture = function(pathToTile)
{
    this.tileTexture.load(pathToTile);
};

/**
 * Set the center of the floor.
 *
 * @this {ShipGL.Floor}
 *
 * @param {vec3} center The floor's new center
 */
ShipGL.Floor.prototype.setCenter = function(center)
{
    vec3.set(center, this.center);
    this._computeModelMatrix();
};

/**
 * Set the width for each side of the floor.
 *
 * @this {ShipGL.Floor}
 *
 * @param {number} width The floor's new width for each side
 */
ShipGL.Floor.prototype.setWidth = function(width)
{
    this.width = width;
    this._computeModelMatrix();
};

/**
 * Set the projection matrix for the floor.
 *
 * @this {ShipGL.Floor}
 *
 * @param {mat4} projMat The floor's new projection matrix
 */
ShipGL.Floor.prototype.setProjection = function(projMat)
{
    mat4.set(projMat, this.projMat);
};

/**
 * Set the view matrix for the floor.
 *
 * @this {ShipGL.Floor}
 *
 * @param {mat4} viewMat The floor's new view matrix
 */
ShipGL.Floor.prototype.setView = function(viewMat)
{
    mat4.set(viewMat, this.viewMat);
};

ShipGL.Floor.prototype._computeModelMatrix = function()
{
    var halfWidth = 0.5 * this.width;
    mat4.identity(this.modelMat);
    mat4.translate(this.modelMat, this.center);
    mat4.scale(this.modelMat, [halfWidth, halfWidth, halfWidth]);
};
