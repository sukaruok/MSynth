// この書き方が正しいのかどうかがわからない
var node = function(name, type){

	var id = 1;

	var node = function(name, type){
		this.id = id;
		this.name = name;
		this.type = type; // "input or output" 
		// this.input;
		// this.output;
		this.selected = false;

		id++;
	};

	node.prototype.setId = function(id){
		this.id = id;
	};

	node.prototype.getId = function(){
		return this.id;
	};

	node.prototype.setName = function(name){
		this.name = name;
	};

	node.prototype.getName = function(){
		return this.name;
	};


	node.prototype.setType = function(type){
		this.type = type;
	};

	node.prototype.getType = function(){
		return this.type;
	};

	// node.prototype.setInput = function(input){
	// 	this.input = input;
	// };

	// node.prototype.getInput = function(){
	// 	return this.input;
	// };

	// node.prototype.setOutput = function(output){
	// 	this.output = output;
	// };

	// node.prototype.getOutput = function(){
	// 	return this.output;
	// };

	node.prototype.changeStatus = function(flag){
		if (this.selected === true) {
			this.selected = false;
		} else if (this.selected === false) {
			this.selected = true;
		}
	};

	node.prototype.isSelected = function(){
		return this.selected;
	}

	return node;
}();