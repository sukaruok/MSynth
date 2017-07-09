var gui = function() {

	var gui = function(){
		var module1;
		var module2;
	};

	gui.draggable = function(target){
		target.onmousedown = function(){
			document.onmousemove = _mouseMove;
		};

		document.onmouseup = function(){
			document.onmousemove = null;
		};

		function _mouseMove(e){
			var event = e ? e : window.event;
			target.style.top = event.clientY + 'px';
			target.style.left = event.clientX + 'px';
		};
	};

	// ノードにイベントを追加
	gui.bindable = function(target) {
		target.addEventListener("click", function(){

			// targetからオブジェクトを検索
			if(target.parentNode.classList.contains("module-input")){
				// 親要素（module）の特定
				
					// 選択機能
					if(moduleObjs["module-input"].outputNode.selected === false) {
						moduleObjs["module-input"].outputNode.selected = true;
						document.querySelector("." + moduleObjs["module-input"].outputNode.name).classList.add('node-selected');
						// モジュールを変数にセットする
						if (gui.module1) {
							gui.module2 = moduleObjs["module-input"];
						} else {
							gui.module1 = moduleObjs["module-input"];
						}

					// キャンセル
					} else {
						moduleObjs["module-input"].outputNode.selected = false;
						document.querySelector("." + moduleObjs["module-input"].outputNode.name).classList.remove('node-selected');
						gui.module1 = null;
					}
				// } 
			}

			// targetからオブジェクトを検索
			if(target.parentNode.classList.contains("module-effect")){
				// 親要素（module）の特定
				if (target.classList.contains("node-input")) {

					// 選択機能
					if(moduleObjs["module-effect"].inputNode.selected === false) {
						// ノードが選択された際の処理
						moduleObjs["module-effect"].inputNode.selected = true;
						document.querySelector("." + moduleObjs["module-effect"].inputNode.name).classList.add('node-selected');

						if (gui.module1) {
							if (gui.module1.name !== moduleObjs["module-effect"].name) {
								gui.module2 = moduleObjs["module-effect"];
							}
						} else {
							gui.module1 = moduleObjs["module-effect"];
						}

					// キャンセル機能
					} else {
						moduleObjs["module-effect"].inputNode.selected = false;
						document.querySelector("." + moduleObjs["module-effect"].inputNode.name).classList.remove('node-selected');
						gui.module1 = null;
					}
				} 

				// 選択
				if(target.classList.contains("node-output")) {

					// 選択機能
					if(moduleObjs["module-effect"].outputNode.selected === false) {

						moduleObjs["module-effect"].outputNode.selected = true;
						document.querySelector("." + moduleObjs["module-effect"].outputNode.name).classList.add('node-selected');

						if (gui.module1) {
							if (gui.module1.name !== moduleObjs["module-effect"].name) {
								gui.module2 = moduleObjs["module-effect"];
							}
						} else {
							gui.module1 = moduleObjs["module-effect"];
						}

					// キャンセル機能
					} else {
						moduleObjs["module-effect"].outputNode.selected = false;
						document.querySelector("." + moduleObjs["module-effect"].outputNode.name).classList.remove('node-selected');
						gui.module1 = null;
					}
				}
			}

			// targetからオブジェクトを検索
			if(target.parentNode.classList.contains("module-destination")){
				if(moduleObjs["module-destination"].inputNode.selected === false) {

					moduleObjs["module-destination"].inputNode.selected = true;
					document.querySelector("."+ moduleObjs["module-destination"].inputNode.name).classList.add('node-selected');

					// モジュールを変数にセットする
					if (gui.module1) {
						gui.module2 = moduleObjs["module-destination"];
					} else {
						gui.module1 = moduleObjs["module-destination"];
					}

				} else {
					moduleObjs["module-destination"].inputNode.selected = false;
					document.querySelector("." + moduleObjs["module-destination"].inputNode.name).classList.remove('node-selected');
					gui.module1 = null;
				}

			}

			if (gui.module1 && gui.module2) {
				if (gui.module1.name !== gui.module2.name) {
					_connect()
				}
			}
		});
	};

	// ノードオブジェクト同士をを結合したい・・・オブジェクトが必要？
	function _connect(){ 
		// Inputノードを選択状態の場合
		// if(module1.inputNode.selected === true){
		// 	module1.inputNode.selected = false;

		if(gui.module1.outputNode && (gui.module1.outputNode.selected === true)) {
			if(gui.module2.inputNode && (gui.module2.inputNode.selected === true)) {
				gui.module1.connectModule(gui.module2);

				gui.module1.outputNode.selected = false
				gui.module2.inputNode.selected = false

				document.querySelector("."+ gui.module1.outputNode.name).classList.remove('node-connected');
				document.querySelector("."+ gui.module1.outputNode.name).classList.add('node-connected');

				document.querySelector("."+ gui.module2.inputNode.name).classList.remove('node-connected');
				document.querySelector("."+ gui.module2.inputNode.name).classList.add('node-connected');
			}
		}

		if(gui.module1.inputNode && (gui.module1.inputNode.selected === true)) {
			if(gui.module2.outputNode && (gui.module2.outputNode.selected === true)) {
				gui.module2.connectModule(gui.module1);

				gui.module1.inputNode.selected = false
				gui.module2.outputNode.selected = false

				document.querySelector("."+ gui.module1.inputNode.name).classList.remove('node-connected');
				document.querySelector("."+ gui.module1.inputNode.name).classList.add('node-connected');

				document.querySelector("."+ gui.module2.outputNode.name).classList.remove('node-connected');
				document.querySelector("."+ gui.module2.outputNode.name).classList.add('node-connected');
			}
		}

		// 変数を初期化する
		gui.module1 = null;
		gui.module2 = null;
	};

	gui.updateStatus = function(){

	}

	return gui;

}();

// モジュールにイベントをを追加
modules = document.querySelectorAll(".module");
for (var i = 0; i < modules.length; i++){
	gui.draggable(modules[i]);
};

// ノードにイベントをを追加
nodes = document.querySelectorAll(".node");
for(var i = 0; i < nodes.length; i++) {
	gui.bindable(nodes[i]);
};

// モジュールにイベントを追加 
// document.querySelector(".button-createModule").addEventListener("click", function(){
// 	module.createModule();
// });

// deveiceに値の変更を反映させる
document.querySelector(".dial").addEventListener("change", function(){
	moduleObjs["module-input"].device.frequency.value = $('.dial').val();
});

// 再生ボタンの追加
document.querySelector(".module-play").addEventListener("click", function(){
	if (moduleObjs["module-input"].status == 0) {
		moduleObjs["module-input"].play();
	} else {
		moduleObjs["module-input"].stop();
	}
});
