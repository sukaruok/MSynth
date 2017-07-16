// 全てのモジュールをハッシュ形式で管理する
// key:name, value:moduleオブジェクト 
var modules = {}

var module = function(name, inputNode, outputNode, device){

	var id = 1;

	var module = function(name, inputNode, outputNode, device){
		this.id = id;
		this.name = name + id; // モジュールの識別
		this.device = device; // モジュールの種類
		this.inputNode = inputNode;
		this.outputNode = outputNode;
		this.inputModule;
		this.outputModule;
		this.selected;
		this.status = 0;
		this.type = name;

		id++;
	}

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
	module.prototype.createModule = function(){
		// 作成するモジュールの種類を取得
		var name = document.querySelector(".module-list").value;
		var m;

		// guiの生成("osc")
		if (name === "osc") {
			// 中身を追加する。配列に格納するのがいい。
			var m = new module(name, new node(name, "input"), new node(name, "output"), Device.createOscModule());

			element = document.createElement("div");
			element.className = "module module-input " + m.name;
			element.innerHTML = "<div class=\"node node-output " +  m.outputNode.name + "\"></div>" +
								"<div class=\"play module-play\"></div>" +
								"<div class=\"knob freq-knob\"><input type=\"text\" value=\"440\" class=\"dial\"></div>" +
								"<div class=\"knob-name\">freq</div>" +
								"<div class=\"module-name\">osc</div>" + 
								"</div>";
			document.querySelector(".module-area").appendChild(element);
			gui.makeknob(m);
		}

		if (name === "gain") {
			// 中身を追加する。配列に格納するのがいい。
			var m = new module(name, new node(name, "input"), new node(name, "output"), Device.createGainModule());			

			element = document.createElement("div");
			element.className = "module module-effect " + m.name;
			element.innerHTML = "<div class=\"node node-input " + m.inputNode.name + "\"></div>" +
								"<div class=\"node node-output " + m.outputNode.name + "\"></div>" +
								"<div class=\"knob gain-knob\"><input type=\"text\" value=\"0.5\" class=\"gain-dial\"></div>" +
								"<div class=\"knob-name\">vol</div>" +
								"<div class=\"module-name\">gain</div>" + 
								"</div>";

			document.querySelector(".module-area").appendChild(element);
			gui.makeknob(m);
		}

		if (name === "dest") {
			// 中身を追加する。配列に格納するのがいい。
			var m = new module(name, new node(name, "input"), new node(name, "output"), Device.createDestModule());

			element = document.createElement("div");
			element.className = "module module-destination " + m.name;
			element.innerHTML = "<div class=\"node node-input " + m.inputNode.name + "\"></div>" +
								"<div class=\"module-speaker\"></div>" +
								"<div class=\"module-name\">speaker</div>" +
								"</div>";

			document.querySelector(".module-area").appendChild(element);
			gui.makeknob(m);

		}

		if (name === "keyboard") {
			var m = new module(name, new node(name, "input"), new node(name, "output"), Device.createKeyboardModule());

			// element1 = document.createElement("div");
			// element1.className = "keyboard-area";
			element = document.createElement("div");
			element.id = "keyboard " + m.name;
			element.className = "keyboard " + m.name;
			element.innerHTML = "<ul id=\"white-key-set\">" + 
								 "<li class=\"key\" id=\"key-a\">a</li>" +
								 "<li class=\"key\" id=\"key-s\">s</li>" +
								 "<li class=\"key\" id=\"key-d\">d</li>" +
								 "<li class=\"key\" id=\"key-f\">f</li>" +
								 "<li class=\"key\" id=\"key-g\">g</li>" +
								 "<li class=\"key\" id=\"key-h\">h</li>" +
								 "<li class=\"key\" id=\"key-j\">j</li>" +
								 "<li class=\"key\" id=\"key-k\">k</li>" +
								 "</ul>" +
								 "<ul id=\"black-key-set\">" +
								 "<li class=\"key\" id=\"key-w\">w<li>" +
								 "<li class=\"key\" id=\"key-e\">e<li>" +
								 "<li class=\"key hidden\"><li>" +
								 "<li class=\"key\" id=\"key-t\">t<li>" +
								 "<li class=\"key\" id=\"key-y\">y<li>" +
								 "<li class=\"key\" id=\"key-u\">u<li>" +
								 "</ul>" + 
								 "<div class=\"node node-output " + m.outputNode.name + "\"></div>";

			document.querySelector(".module-area").appendChild(element);
			gui.makeknob(m);
		}

		// module一覧に追加
		modules[m.name] = m;
	
		return m
	};

	// moduleの結合（self -> other）
	module.prototype.connectModule = function(other){
		this.device.connect(other.device);
	};

	module.prototype.disconnectModule = function(other){
		this.device.disconnect(other.device);
	};

	module.prototype.play = function(){
		this.device.start();
		this.status = 1;
		event.target.classList.remove("module-play");
		event.target.classList.add("module-stop");
	};

	module.prototype.stop = function(){
		this.device.stop();
		this.status = 0;
		event.target.classList.remove("module-stop");
		event.target.classList.add("module-play");
	};

	return module;
}();


