lib=ShipGL.min.js
optimize=SIMPLE_OPTIMIZATIONS

java -jar "$CLOSURE_COMPILER_DIR/compiler.jar" \
    --js_output_file=$lib \
    --compilation_level=$optimize \
    --language_in=ECMASCRIPT5_STRICT \
    --js=src/Init.js \
    --js=src/Files/FileLoader.js \
    --js=src/Math/Math.js \
    --js=src/Cameras/Camera.js \
    --js=src/Buffers/Buffer.js \
    --js=src/Buffers/BufferUtilities.js \
    --js=src/Shaders/ShaderProgram.js \
    --js=src/Textures/Texture.js \
    --js=src/Textures/CubeTexture.js \
    --js=src/Lights/Light.js \
    --js=src/Lights/PointLight.js \
    --js=src/Lights/DirectionalLight.js \
    --js=src/Scene/Model.js \
    --js=src/Scene/SkyBox.js \
    --js=src/Scene/Floor.js \
    --js=src/Application/BaseApp.js
