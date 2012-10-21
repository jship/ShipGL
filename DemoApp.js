DemoApp = function(canvasId, contextOptions)
{
    ShipGL.BaseApp.call(this, canvasId, contextOptions);

    this.modelOptions = document.getElementById("model_selector");
    this.models = [];
    this.curModel = null;
    this.prevModel = null;

    this.camera = null;
    
    this.projMatrix = mat4.create();
 
    this.skyBoxOptions = document.getElementById("skybox_selector");
    this.skyBoxes = [];
    this.curSkyBox = null;
    this.prevSkyBox = null;

    this.floorOptions = document.getElementById("floor_selector");
    this.floors = [];
    this.curFloor = null;
    this.prevFloor = null;
};

DemoApp.prototype = Object.create(ShipGL.BaseApp.prototype);

DemoApp.prototype.initialize = function()
{
    this._initializeModels();
    this._initializeCamera();
    this._initializeSkyBoxes();
    this._initializeFloors();
};

DemoApp.prototype.update = function(elapsed)
{
    var changedActiveModel, changedActiveSkyBox, changedActiveFloor;

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
    
    this.prevSkyBox = this.curSkyBox;
    this.curSkyBox = this.skyBoxes[this.skyBoxOptions.selectedIndex];
    this.curSkyBox.setCenter(this.camera.position);
    this.curSkyBox.setProjection(this.projMatrix);
    this.curSkyBox.setView(this.camera.viewMatrix);

    changedActiveSkyBox = this.prevSkyBox != this.curSkyBox;

    if (changedActiveModel || changedActiveSkyBox)
    {
        this.curSkyBox.setWidth(50 * this.curModel.diagonal);
    }

    this.prevFloor = this.curFloor;
    this.curFloor = this.floors[this.floorOptions.selectedIndex];
    this.curFloor.setProjection(this.projMatrix);
    this.curFloor.setView(this.camera.viewMatrix);

    changedActiveFloor = this.prevFloor != this.curFloor;

    if (changedActiveModel || changedActiveFloor)
    {
        this.curFloor.setCenter(this._computeFloorCenter());
        this.curFloor.setWidth(5 * this.curModel.diagonal);
    }
};

DemoApp.prototype.draw = function(elapsed)
{
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

    this.curSkyBox.draw();
    this.curFloor.draw();
    this.curModel.draw(elapsed);
};

DemoApp.prototype.handleHeldKeys = function(elapsed)
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

DemoApp.prototype._initializeModels = function()
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
        model = new DemoModel(this.gl, this.modelOptions[i].value);
        model.initialize(shaderProgram);
        this.models.push(model);
    }
    
    this.curModel = this.models[this.modelOptions.selectedIndex];
};

DemoApp.prototype._initializeCamera = function()
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

DemoApp.prototype._initializeSkyBoxes = function()
{
    this.skyBoxOptions.selectedIndex = 0;

    var i, skyBox;
    for (i = 0; i < this.skyBoxOptions.length; i++)
    {
        skyBox = new ShipGL.SkyBox(this.gl);
        skyBox.setDirectory(this.skyBoxOptions[i].value, ".jpg");
        this.skyBoxes.push(skyBox);
    }

    this.curSkyBox = this.skyBoxes[0];
    this.prevSkyBox = this.curSkyBox;

    this.curSkyBox.setWidth(50 * this.curModel.diagonal);
    this.curSkyBox.setCenter(this.camera.position);
};

DemoApp.prototype._initializeFloors = function()
{
    this.floorOptions.selectedIndex = 0;

    var i, floor, floorPos;
    for (i = 0; i < this.floorOptions.length; i++)
    {
        floor = new ShipGL.Floor(this.gl);
        floor.setTexture(this.floorOptions[i].value);
        this.floors.push(floor);
    }

    this.curFloor = this.floors[0];
    this.prevFloor = this.curFloor;
    
    this.curFloor.setWidth(5 * this.curModel.diagonal);
    this.curFloor.setCenter(this._computeFloorCenter());
};

DemoApp.prototype._computeFloorCenter = function()
{
    var floorPos = [];
    floorPos[0] = (this.curModel.min[0] + this.curModel.max[0]) / 2;
    floorPos[1] = this.curModel.min[1];
    floorPos[2] = (this.curModel.min[2] + this.curModel.max[2]) / 2;

    return floorPos;
};

function startWebGL()
{
    var app = new DemoApp("glCanvas");
    app.initialize();
    
    document.onkeydown = function(e) { app.handleKeyPressed(e.keyCode); };
    document.onkeyup   = function(e) { app.handleKeyReleased(e.keyCode); };

    var gl = app.gl;
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    
    app.run();
};
