var node = function(name, type){

	var id = 1;

	var node = function(name, type){
		this.id = id;
		this.name = name + id + "-" + type;
		this.type = type; // "input or output" 
		// this.input;
		// this.output;
		this.selected = false;

		id++;
	};

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