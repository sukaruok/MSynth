var module = function(name, inputNode, outputNode, device){

	var id = 1;

	var module = function(name, inputNode, outputNode, device){
		this.id = id;
		this.name = name;
		this.device = device;
		this.inputNode = inputNode;
		this.outputNode = outputNode;
		this.inputModule;
		this.outputModule;
		this.selected;
		this.status = 0;

		id++;
	}

	module.prototype.getName = function(){
		return this.name;
	};

	module.prototype.setInputNode = function(node){
		this.inputNode = node;
	};

	module.prototype.getInputNode = function(){
		return this.inputNode;
	};

	module.prototype.setOutputNode = function(node){
		this.outputNode = node;
	};

	module.prototype.getOutputNode = function(){
		return this.outputNode;
	};

	module.prototype.setInputModule = function(module){
		this.inputModule = module;
	};

	module.prototype.getInputModule = function(){
		return this.inputModule;
	};

	module.prototype.setOutputModule = function(module){
		this.outputModule = module;
	};

	module.prototype.getOutputModule = function(){
		return this.outputModule;
	};

	module.prototype.changeStatus = function(flag){
		if (this.selected === true) {
			this.selected = false;
		} else if (this.selected === false) {
			this.selected = true;
		}
	};

	module.prototype.isSelected = function(){
		return this.selected;
	}

	// moduleの新規作成
	module.createModule = function(){
		// 書き方ががひどい
		element = document.createElement("div");
		element.className = "module module-input";
		element.innerHTML = "<div class=\"node node-output\"></div>";
		ctx.createGain();
		document.querySelector(".module-area").appendChild(element);
	};

	// moduleの結合（self -> other）
	module.prototype.connectModule = function(other){
		// var gain = Device.createGainModule();
		this.device.connect(other.device);
		// gain.connect(other.device);

		// 音源の再生
		// this.device.start();
	};

	module.prototype.disconnectModule = function(other){
		this.device.disconnect(other.device);
	};

	module.prototype.play = function(){
		this.device.start();
		this.status = 1;
		document.querySelector('.play').classList.remove("module-play");
		document.querySelector('.play').classList.add("module-stop");
	};

	module.prototype.stop = function(){
		this.device.stop();
		this.status = 0;
		document.querySelector('.play').classList.remove("module-stop");
		document.querySelector('.play').classList.add("module-play");
	};

	return module;
}();

// テスト用にモジュールの作成。即時関数でなければ、オブジェクトは作られないらしい
var m1 = new module("module-input", null, new node("node1", "output"), Device.createOscModule());
var m2 = new module("module-effect", new node("node2", "input"), new node("node3", "output"), Device.createGainModule());
var m3 = new module("module-destination", new node("node4", "input"), null, Device.createDestModule());

moduleObjs = {
	"module-input" : m1,
	"module-effect" : m2,
	"module-destination" : m3
};


