@ECHO OFF
SET lib=ShipGL.js

COPY src\Init.js /B + ^
     src\Files\FileLoader.js /B + ^
     src\Math\Math.js /B + ^
     src\Cameras\Camera.js /B + ^
     src\Buffers\Buffer.js /B + ^
     src\Buffers\BufferUtilities.js /B + ^
     src\Shaders\ShaderProgram.js /B + ^
     src\Textures\Texture.js /B + ^
     src\Textures\CubeTexture.js /B + ^
     src\Lights\Light.js /B + ^
     src\Lights\PointLight.js /B + ^
     src\Lights\DirectionalLight.js /B + ^
     src\Scene\Model.js /B + ^
     src\Scene\SkyBox.js /B + ^
     src\Scene\Floor.js /B + ^
     src\Application\BaseApp.js /B ^
     %lib%
