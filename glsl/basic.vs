uniform mat4 uProjMat;
uniform mat4 uViewMat;
uniform mat4 uModelMat;

attribute vec3 aPosition;
attribute vec2 aTexCoord;

varying vec2 texCoord;

void main()
{
	gl_Position = uProjMat * uViewMat * uModelMat * vec4(aPosition, 1.0);
    texCoord = aTexCoord;
}
