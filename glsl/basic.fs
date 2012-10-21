precision mediump float;

uniform int uTexCount;
uniform sampler2D uTex;
uniform vec4 uDiffuseRefl;

varying vec2 texCoord;

void main()
{
    vec4 color;

    if (uTexCount == 0)
        color = uDiffuseRefl;
    else
        color = texture2D(uTex, texCoord);
    
	gl_FragColor = color;
}
