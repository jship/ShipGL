lib=ShipGL.js

cat src/Init.js \
    src/Files/FileLoader.js \
    src/Math/Math.js \
    src/Cameras/Camera.js \
    src/Buffers/Buffer.js \
    src/Buffers/BufferUtilities.js \
    src/Shaders/ShaderProgram.js \
    src/Textures/Texture.js \
    src/Textures/CubeTexture.js \
    src/Lights/Light.js \
    src/Lights/PointLight.js \
    src/Lights/DirectionalLight.js \
    src/Scene/Model.js \
    src/Scene/SkyBox.js \
    src/Scene/Floor.js \
    src/Application/BaseApp.js \
    > $lib
