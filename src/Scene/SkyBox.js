/**
 * @file Contains all ShipGL.SkyBox code.
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
 * Creates a new ShipGL.SkyBox instance.
 *
 * @class ShipGL.SkyBox
 * @classdesc A ShipGL.SkyBox object provides a means to render a skybox.
 * @augments ShipGL.GLResource
 *
 * @param {WebGLRenderingContext} gl The rendering context
 */
ShipGL.SkyBox = function(gl)
{
    ShipGL.GLResource.call(this, gl);

    /**
     * @memberof ShipGL.SkyBox#
     * @description The texture cube.
     * @name cubeMap
     */
    this.cubeMap = new ShipGL.CubeTexture(this.gl);

    var bufferUtils = new ShipGL.BufferUtilities(this.gl);

    /**
     * @memberof ShipGL.SkyBox#
     * @description The vertex buffer object for the skybox.
     * @name vbo
     */
    this.vbo = bufferUtils.createVertexBuffer([
       // Snagged from learningwebgl.com. (in the interest of time)
       // Front face
      -1.0, -1.0,  1.0,
       1.0, -1.0,  1.0,
       1.0,  1.0,  1.0,
      -1.0,  1.0,  1.0,

       // Back face
      -1.0, -1.0, -1.0,
      -1.0,  1.0, -1.0,
       1.0,  1.0, -1.0,
       1.0, -1.0, -1.0,

       // Top face
      -1.0,  1.0, -1.0,
      -1.0,  1.0,  1.0,
       1.0,  1.0,  1.0,
       1.0,  1.0, -1.0,

       // Bottom face
      -1.0, -1.0, -1.0,
       1.0, -1.0, -1.0,
       1.0, -1.0,  1.0,
      -1.0, -1.0,  1.0,

       // Right face
       1.0, -1.0, -1.0,
       1.0,  1.0, -1.0,
       1.0,  1.0,  1.0,
       1.0, -1.0,  1.0,

       // Left face
      -1.0, -1.0, -1.0,
      -1.0, -1.0,  1.0,
      -1.0,  1.0,  1.0,
      -1.0,  1.0, -1.0
    ]);

    /**
     * @memberof ShipGL.SkyBox#
     * @description The index buffer object for the skybox.
     * @name ibo
     */
    this.ibo = bufferUtils.createIndexBuffer([
        // Snagged from learningwebgl.com. (in the interest of time)
         0,  1,  2,    0,  2,  3, // Front face
         4,  5,  6,    4,  6,  7, // Back face
         8,  9, 10,    8, 10, 11, // Top face
        12, 13, 14,   12, 14, 15, // Bottom face
        16, 17, 18,   16, 18, 19, // Right face
        20, 21, 22,   20, 22, 23  // Left face
    ]);

    var vShaderCode = [
        "uniform mat4 uProjMat;",
        "uniform mat4 uViewMat;",
        "uniform mat4 uModelMat;",
        "",
        "attribute vec3 aPosition;",
        "",
        "varying vec3 texCoord;",
        "",
        "void main()",
        "{",
        "    gl_Position = uProjMat * uViewMat * uModelMat * vec4(aPosition, 1.0);",
        "    texCoord = aPosition;",
        "}"
    ].join("\n");

    var fShaderCode = [
        "precision mediump float;",
        "",
        "uniform samplerCube uCubeTex;",
        "",
        "varying vec3 texCoord;",
        "",
        "void main()",
        "{",
        "	gl_FragColor = textureCube(uCubeTex, texCoord);",
        "}"
    ].join("\n");

    /**
     * @memberof ShipGL.SkyBox#
     * @description The shader program for the skybox.
     * @name program
     */
    this.program = new ShipGL.ShaderProgram(this.gl);
    this.program.create(vShaderCode, fShaderCode);

    this.center = vec3.create();
    this.width = 2;

    this.projMat = mat4.create();
    this.viewMat = mat4.create();
    this.modelMat = mat4.create();
};

ShipGL.SkyBox.prototype = Object.create(ShipGL.GLResource.prototype);

/**
 * Draw the skybox. Be sure to set the skybox's projection/view matrices,
 * and any other required state before calling this.
 *
 * @this {ShipGL.SkyBox}
 */
ShipGL.SkyBox.prototype.draw = function()
{
    this.program.bind();
    this.vbo.bind();
    this.ibo.bind();
    this.cubeMap.bind(0);

    this.program.enableAttributeArray("aPosition");

    this.program.setUniformMat4("uProjMat", this.projMat);
    this.program.setUniformMat4("uViewMat", this.viewMat);
    this.program.setUniformMat4("uModelMat", this.modelMat);
    this.program.setUniform1i("uCubeTex", 0);
    
    this.program.setAttributeBuffer3f("aPosition", 0, 0);

    this.gl.drawElements(this.gl.TRIANGLES, this.ibo.length,
                         this.gl.UNSIGNED_SHORT, 0);
    
    this.program.disableAttributeArray("aPosition");

    this.cubeMap.unbind();
    this.ibo.unbind();
    this.vbo.unbind();
    this.program.unbind();
};

/**
 * Load the skybox's cube map using the specified path to the image folder.
 *
 * @this {ShipGL.SkyBox}
 *
 * @param {string} path The path to the image folder
 * @param {string} ext The image extension
 */
ShipGL.SkyBox.prototype.setDirectory = function(path, ext)
{
    var posString = "/positive_";
    var negString = "/negative_";

    this.cubeMap.loadPositiveX(path + posString + "x" + ext);
    this.cubeMap.loadPositiveY(path + posString + "y" + ext);
    this.cubeMap.loadPositiveZ(path + posString + "z" + ext);

    this.cubeMap.loadNegativeX(path + negString + "x" + ext);
    this.cubeMap.loadNegativeY(path + negString + "y" + ext);
    this.cubeMap.loadNegativeZ(path + negString + "z" + ext);
};

/**
 * Set the center of the skybox.
 *
 * @this {ShipGL.SkyBox}
 *
 * @param {vec3} center The skybox's new center
 */
ShipGL.SkyBox.prototype.setCenter = function(center)
{
    vec3.set(center, this.center);
    this._computeModelMatrix();
};

/**
 * Set the width for each side of the skybox.
 *
 * @this {ShipGL.SkyBox}
 *
 * @param {number} width The skybox's new width for each side
 */
ShipGL.SkyBox.prototype.setWidth = function(width)
{
    this.width = width;
    this._computeModelMatrix();
};

/**
 * Set the projection matrix for the skybox.
 *
 * @this {ShipGL.SkyBox}
 *
 * @param {mat4} projMat The skybox's new projection matrix
 */
ShipGL.SkyBox.prototype.setProjection = function(projMat)
{
    mat4.set(projMat, this.projMat);
};

/**
 * Set the view matrix for the skybox.
 *
 * @this {ShipGL.SkyBox}
 *
 * @param {mat4} viewMat The skybox's new view matrix
 */
ShipGL.SkyBox.prototype.setView = function(viewMat)
{
    mat4.set(viewMat, this.viewMat);
};

ShipGL.SkyBox.prototype._computeModelMatrix = function()
{
    var halfWidth = 0.5 * this.width;
    mat4.identity(this.modelMat);
    mat4.translate(this.modelMat, this.center);
    mat4.scale(this.modelMat, [halfWidth, halfWidth, halfWidth]);
};
