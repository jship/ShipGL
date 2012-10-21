ShipGL.DemoApp = function(canvasId, contextOptions)
{
    ShipGL.BaseApp.call(this, canvasId, contextOptions);

    this.modelOptions = document.getElementById("model_selector");
    this.models = [];
    this.curModel = null;
    this.prevModel = null;

    this.camera = null;
    
    this.projMatrix = mat4.create();
};

ShipGL.DemoApp.prototype = Object.create(ShipGL.BaseApp.prototype);

ShipGL.DemoApp.prototype.initialize = function()
{
    this._initializeModels();
    this._initializeCamera();
};

ShipGL.DemoApp.prototype.update = function(elapsed)
{
    var changedActiveModel;

    this.handleHeldKeys(elapsed);
    
    mat4.perspective(90, this.canvas.width / this.canvas.height,
                     0.01 * this.curModel.diagonal,
                     100  * this.curModel.diagonal, this.projMatrix);

    this.prevModel = this.curModel;
    this.curModel = this.models[this.modelOptions.selectedIndex];
    this.curModel.setProjection(this.projMatrix);
    this.curModel.setView(this.camera.viewMatrix);

    changedActiveModel = this.prevModel != this.curModel;

    if (changedActiveModel)
    {
        this._initializeCamera();
    }
};

ShipGL.DemoApp.prototype.draw = function(elapsed)
{
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

    this.curModel.draw(elapsed);
};

ShipGL.DemoApp.prototype.handleHeldKeys = function(elapsed)
{
    // 87 is 'w'.
    if (this.heldKeys[87])
        this.camera.moveForward();
    
    // 83 is 's'.
    if (this.heldKeys[83])
        this.camera.moveBackward();

    // 65 is 'a'.
    if (this.heldKeys[65])
        this.camera.moveLeft();

    // 68 is 'd'.
    if (this.heldKeys[68])
        this.camera.moveRight();

    // 72 is 'h'.
    if (this.heldKeys[72])
        this.camera.lookLeft();

    // 76 is 'l'.
    if (this.heldKeys[76])
        this.camera.lookRight();
    
    // 75 is 'k'.
    if (this.heldKeys[75])
        this.camera.moveUp();
    
    // 74 is 'j'.
    if (this.heldKeys[74])
        this.camera.moveDown();
};

ShipGL.DemoApp.prototype._initializeModels = function()
{
    this.modelOptions.selectedIndex = 0;

    var vShaderCode = ShipGL.FileLoader.loadLocal("glsl/basic.vs") ||
                      ShipGL.FileLoader.loadHttp("glsl/basic.vs");
    var fShaderCode = ShipGL.FileLoader.loadLocal("glsl/basic.fs") ||
                      ShipGL.FileLoader.loadHttp("glsl/basic.fs");

    var shaderProgram = new ShipGL.ShaderProgram(this.gl);
    shaderProgram.create(vShaderCode, fShaderCode);

    var i, model;
    for (i = 0; i < this.modelOptions.length; i++)
    {
        model = new ShipGL.DemoModel(this.gl, this.modelOptions[i].value);
        model.initialize(shaderProgram);
        this.models.push(model);
    }
    
    this.curModel = this.models[this.modelOptions.selectedIndex];
};

ShipGL.DemoApp.prototype._initializeCamera = function()
{
    var camPos = vec3.create(this.curModel.center);
    var camTranslate = vec3.createFrom(0, 0, 2 * this.curModel.diagonal);
    vec3.add(camPos, camTranslate);
    
    camDir = vec4.create();
    vec3.direction(this.curModel.center, camPos, camDir);

    var camUp = vec3.createFrom(0, 1, 0);

    camMoveSpeed = (this.curModel.diagonal / 100) + 1;
    
    this.camera = new ShipGL.Camera(camPos, this.curModel.center, camUp);
    this.camera.setMoveSpeed(camMoveSpeed);
};

function startWebGL()
{
    var app = new ShipGL.DemoApp("glCanvas");
    app.initialize();
    
    document.onkeydown = function(e) { app.handleKeyPressed(e.keyCode); };
    document.onkeyup   = function(e) { app.handleKeyReleased(e.keyCode); };

    var gl = app.gl;
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    
    app.run();
};
