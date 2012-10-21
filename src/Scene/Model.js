/**
 * @file Contains all ShipGL.Model code.
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
 * Creates a new ShipGL.Model instance. Be sure to call initialize to prepare
 * the model for rendering and also to accurately set the instance's fields.
 *
 * @class ShipGL.Model
 * @classdesc ShipGL.Model is an abstract base class that provides a handful
 *            of useful and efficient model loading facilities.
 * @augments ShipGL.GLResource
 *
 * @param {WebGLRenderingContext} gl The rendering context
 * @param {string} pathToJSON The string path to the JSON model file
 * @example
 * // IMPORTANT: Please read this whole example!
 *
 * // Since this class is abstract, a subclass must be provided to create
 * // a valid ShipGL.Model.  Assume you have already written a subclass
 * // called MyModel.
 *
 * // Create an instance and initialize. Note that your subclass may have
 * // additional parameters for construction or initialization.
 * var model = new MyModel(gl, "model.json");
 * model.initialize();
 *
 * // After the model's been initialized, it is ready for rendering.
 *
 * // Assuming you've implemented rendering code in MyModel's draw method,
 * // you can render the model like this:
 * model.draw();
 *
 * // Calling initialize is very important as it does the following:
 * //   1) Stores all attribute info in the vbo and ibo fields.
 * //   2) Loads all of the model's textures.
 * //   3) Computes a normal matrix for each node.
 * //   4) Computes the model's extents info.
 *
 * // After calling initialize, every mesh will have the following additional
 * // fields:
 * //   hasTexture, a boolean for whether or not the mesh's material has a texture
 * //   hasIndices, a boolean for whether or not the mesh has indices
 * //   positionsOffset, the starting array index in the vbo for the mesh's vertices
 * //   normalsOffset, the starting array index in the vbo for the mesh's normals
 * //   stride, the stride between quantities in the array (in terms of array indices, NOT bytes)
 *
 * // If the mesh has a texture (hasTexture == true), it will also have:
 * //   texCoordsOffset, the starting array index in the vbo for the mesh's texture coordinates
 *
 * // If the mesh has indices (hasIndices == true), it will also have:
 * //   indicesOffset, the starting array index in the ibo for the mesh's indices
 * //   indicesByteOffset, the starting byte in the ibo for the mesh's indices (useful for drawElements)
 *
 * // After calling initialize, every material that has a texture will have the
 * // following additional field:
 * //   texture, the material's ShipGL.Texture instance
 *
 * // After calling initialize, every node will have the following additional
 * // field:
 * //   normalMatrix, a matrix used to transform the normal to world space and ensure
 * //                 that it is still perpendicular to the surface
 */
ShipGL.Model = function(gl, pathToJSON)
{
    ShipGL.GLResource.call(this, gl);
    
    var jsonStr = ShipGL.FileLoader.loadLocal(pathToJSON, "application/json") ||
                  ShipGL.FileLoader.loadHttp(pathToJSON, "application/json");

    /**
     * @memberof ShipGL.Model#
     * @description The parsed JSON model data
     * @name json
     */
    this.json = JSON.parse(jsonStr);

    /**
     * @memberof ShipGL.Model#
     * @description The model's vertex buffer object (of type ShipGL.Buffer)
     * @name vbo
     */
    
    /**
     * @memberof ShipGL.Model#
     * @description The model's index buffer object (of type ShipGL.Buffer)
     * @name ibo
     */
    this.vbo = new ShipGL.Buffer(gl, gl.ARRAY_BUFFER, Float32Array);
    this.ibo = new ShipGL.Buffer(gl, gl.ELEMENT_ARRAY_BUFFER, Uint16Array);

    /**
     * @memberof ShipGL.Model#
     * @description The model's minimum extent
     * @name min
     */
    this.min = vec3.create();
    
    /**
     * @memberof ShipGL.Model#
     * @description The model's maximum extent
     * @name max
     */
    this.max = vec3.create();
    
    /**
     * @memberof ShipGL.Model#
     * @description The model's center
     * @name center
     */
    this.center = vec3.create();
    
    /**
     * @memberof ShipGL.Model#
     * @description The model's diagonal distance
     * @name diagonal
     */
    this.diagonal = 0;

    this._imageDirHelper = pathToJSON.replace("model.json", "");
};

ShipGL.Model.prototype = Object.create(ShipGL.GLResource.prototype);

/**
 * Initialize the model.
 *
 * @this {ShipGL.Model}
 */
ShipGL.Model.prototype.initialize = function()
{
    this._initBuffers();
    this._initMaterialTextures();
    this._initNormalMatrices();
    this._computeExtents();
};

/**
 * Render the model. This is abstract.
 *
 * @this {ShipGL.Model}
 */
ShipGL.Model.prototype.draw = function()
{
    throw "ShipGL.Model.draw is abstract!";
};

ShipGL.Model.prototype._initBuffers = function()
{
    var i, curMesh, curMaterial, vboSize = 0, iboSize = 0, stride = 0;

    // This loop computes sizes of VBO and IBO. It also attaches
    // stride, hasIndices, and hasTexture info to the json mesh.
    for (i = 0; i < this.json.meshes.length; i++)
    {
        curMesh = this.json.meshes[i];
        stride = 0;

        vboSize += curMesh.vertexPositions.length;
        stride += 3;

        vboSize += curMesh.vertexNormals.length;
        stride += 3;
        
        curMesh.hasTexture = false;
        if (curMesh.vertexTexCoordinates &&
            curMesh.vertexTexCoordinates[0] &&
            curMesh.vertexTexCoordinates[0].length > 0)
        {
            curMaterial = this.json.materials[curMesh.materialIndex];
            curMesh.hasTexture = curMaterial.diffuseTexture.length > 0;

            if (curMesh.hasTexture)
            {
                vboSize += curMesh.vertexTexCoordinates[0].length;
                stride += 2;
            }
        }

        curMesh.stride = stride;

        curMesh.hasIndices = false;
        if (curMesh.indices && curMesh.indices.length > 0)
        {
            curMesh.hasIndices = true;
            curMesh.indicesOffset = iboSize;
            curMesh.indicesByteOffset = Uint16Array.BYTES_PER_ELEMENT * iboSize;
            iboSize += curMesh.indices.length;
        }
    }

    this.vbo.bind();
    this.ibo.bind();

    this.vbo.allocate(vboSize);
    this.ibo.allocate(iboSize);

    // This loop writes all the vertex/index data into the buffers.
    var j, k, writeIdx = 0;
    for (i = 0; i < this.json.meshes.length; i++)
    {
        curMesh = this.json.meshes[i];

        curMesh.positionsOffset = writeIdx;
        curMesh.normalsOffset = 3 + writeIdx;

        if (curMesh.hasTexture)
        {
            curMesh.texCoordsOffset = 6 + writeIdx;
        }

        for (j = 0, k = 0 ; j < curMesh.vertexPositions.length; j += 3)
        {
            this.vbo.write(curMesh.vertexPositions.slice(j, j+3), writeIdx);
            writeIdx += 3;

            this.vbo.write(curMesh.vertexNormals.slice(j, j+3), writeIdx);
            writeIdx += 3;

            if (curMesh.hasTexture)
            {
                this.vbo.write(curMesh.vertexTexCoordinates[0].slice(k, k+2), writeIdx);
                writeIdx += 2;
                k += 2;
            }
        }

        if (curMesh.hasIndices)
        {
            this.ibo.write(curMesh.indices, curMesh.indicesOffset);
        }
    }
    
    this.vbo.unbind();
    this.ibo.unbind();
};

ShipGL.Model.prototype._initMaterialTextures = function()
{
    var i, curMaterial;

    // This loop loads all textures and stores each one in its
    // corresponding json material (if material has texture).
    for (i = 0; i < this.json.materials.length; i++)
    {
        curMaterial = this.json.materials[i];

        if (curMaterial.diffuseTexture.length > 0)
        {
            curMaterial.texture = new ShipGL.Texture(this.gl);
            curMaterial.texture.load(this._imageDirHelper +
                                     curMaterial.diffuseTexture[0]);
        }
    }
};

ShipGL.Model.prototype._initNormalMatrices = function()
{
    var i, curNode;

    // This loop computes the inverse transpose of each node's model matrix
    // and stores it right back in the json node.
    for (i = 0; i < this.json.nodes.length; i++)
    {
        curNode = this.json.nodes[i];

        curNode.normalMatrix = mat4.create();
        mat4.inverse(curNode.modelMatrix, curNode.normalMatrix);
        mat4.transpose(curNode.normalMatrix);
    }
};

// Defines min, max, center, and diagonal on the model.
ShipGL.Model.prototype._computeExtents = function()
{
    function makeExtentsUpdater(pred)
    {
        return function(v1, v2, dest)
        {
            var extX = v2[0], extY = v2[1], extZ = v2[2];

            if (pred(v1[0], v2[0]))
                extX = v1[0];

            if (pred(v1[1], v2[1]))
                extY = v1[1];

            if (pred(v1[2], v2[2]))
                extZ = v1[2];

            dest[0] = extX;
            dest[1] = extY;
            dest[2] = extZ;
        };
    };

    var updateMinExtents = makeExtentsUpdater(
            function(val1, val2) { return val1 < val2; });

    var updateMaxExtents = makeExtentsUpdater(
            function(val1, val2) { return val1 > val2; });
    
    var minExtent = vec3.createFrom(Number.MAX_VALUE, Number.MAX_VALUE,
                                    Number.MAX_VALUE);
    var maxExtent = vec3.createFrom(-Number.MIN_VALUE, -Number.MIN_VALUE,
                                    -Number.MIN_VALUE);
    var tmpVec = vec3.create();

    var i, j, k, curNode, curVerts;
    for (i = 0; i < this.json.nodes.length; i++)
    {
        curNode = this.json.nodes[i];

        for (j = 0; j < curNode.meshIndices.length; j++)
        {
            curVerts = this.json.meshes[curNode.meshIndices[j]].vertexPositions;

            for (k = 0; k < curVerts.length; k += 3)
            {
                tmpVec[0] = curVerts[k];
                tmpVec[1] = curVerts[k + 1];
                tmpVec[2] = curVerts[k + 2];

                mat4.multiplyVec3(curNode.modelMatrix, tmpVec);

                updateMinExtents(minExtent, tmpVec, minExtent);
                updateMaxExtents(maxExtent, tmpVec, maxExtent);
            }
        }
    }
    
    var center = vec3.create();
    vec3.add(minExtent, maxExtent, center);
    vec3.scale(center, 0.5);

    vec3.set(minExtent, this.min);
    vec3.set(maxExtent, this.max);
    vec3.set(center, this.center);
    this.diagonal = vec3.dist(this.min, this.max);
};
