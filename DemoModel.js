DemoModel = function(gl, pathToJSON)
{
    ShipGL.Model.call(this, gl, pathToJSON);

    this.program = new ShipGL.ShaderProgram(gl);
    this.projMat = mat4.create();
    this.viewMat = mat4.create();

    this.drawType = this.gl.TRIANGLES;
};

DemoModel.prototype = Object.create(ShipGL.Model.prototype);

DemoModel.prototype.initialize = function(shaderProgram)
{
    ShipGL.Model.prototype.initialize.call(this);

    this.program = shaderProgram;
};

DemoModel.prototype.draw = function(elapsed)
{
    this.program.bind();
    this.program.enableAttributeArray("aPosition");

    this.program.setUniformMat4("uProjMat", this.projMat);
    this.program.setUniformMat4("uViewMat", this.viewMat);

    this.vbo.bind();
    
    var i, j, curNode, curMesh, curMaterial;
    for (i = 0; i < this.json.nodes.length; i++)
    {
        curNode = this.json.nodes[i];
        this.program.setUniformMat4("uModelMat", curNode.modelMatrix);

        for (j = 0; j < curNode.meshIndices.length; j++)
        {
            curMesh = this.json.meshes[curNode.meshIndices[j]];
            this.program.setAttributeBuffer3f("aPosition", curMesh.stride,
                                              curMesh.positionsOffset);
            
            curMaterial = this.json.materials[curMesh.materialIndex];

            this.program.setUniformVec4f("uDiffuseRefl", curMaterial.diffuseReflectance);

            if (curMesh.hasTexture)
            {
                this.program.enableAttributeArray("aTexCoord");
                this.program.setAttributeBuffer2f("aTexCoord", curMesh.stride,
                                                  curMesh.texCoordsOffset);

                curMaterial.texture.bind(0);
                this.program.setUniform1i("uTex", 0);
                this.program.setUniform1i("uTexCount", 1);
            }
            else
            {
                this.program.disableAttributeArray("aTexCoord");
                this.program.setUniform1i("uTexCount", 0);
            }

            if (curMesh.hasIndices)
            {
                this.ibo.bind();
                this.gl.drawElements(this.drawType, curMesh.indices.length,
                                     this.gl.UNSIGNED_SHORT, curMesh.indicesByteOffset);
                this.ibo.unbind();
            }
            else
            {
                this.gl.drawArrays(this.drawType, 0, curMesh.vertexPositions.length / 3);
            }
        }
    }

    ShipGL.Texture.unbindAll(this.gl);

    this.vbo.unbind();

    this.program.disableAttributeArray("aPosition");
    this.program.unbind();
};

DemoModel.prototype.setProjection = function(projMat)
{
    mat4.set(projMat, this.projMat);
};

DemoModel.prototype.setView = function(viewMat)
{
    mat4.set(viewMat, this.viewMat);
};
