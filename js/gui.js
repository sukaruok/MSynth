var gui = function($) {

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
	gui.bindable = function(m) {
		var element = document.querySelector("." + m.name);
		var inputNode = document.querySelector("." + m.inputNode.name);
		var outputNode = document.querySelector("." + m.outputNode.name);

		// 汚い
		var array = [];
		if (inputNode) {
			array.push(inputNode)
		}

		if (outputNode) {
			array.push(outputNode)
		}
		
		// for文の中を別メソッドで定義すること
		for(var i = 0; i < array.length; i++) {

			array[i].addEventListener("click", function(){

				// targetからオブジェクトを検索
				if(m.type === "osc"){
					// 親要素（module）の特定
					
					// 選択機能
					if(m.outputNode.selected === false) {
						m.outputNode.selected = true;
						document.querySelector("." + m.outputNode.name).classList.add('node-selected');
						// モジュールを変数にセットする
						if (gui.module1) {
							gui.module2 = m;
						} else {
							gui.module1 = m;
						}

					// キャンセル
					} else {
						m.outputNode.selected = false;
						document.querySelector("." + m.outputNode.name).classList.remove('node-selected');
						gui.module1 = null;
					}
					// } 
				}

				// targetからオブジェクトを検索
				if(m.type === "gain" || m.type === "keyboard"){
					// 親要素（module）の特定
					if (event.target.classList.contains("node-input")) {

						// 選択機能
						if(m.inputNode.selected === false) {
							// ノードが選択された際の処理
							m.inputNode.selected = true;
							document.querySelector("." + m.inputNode.name).classList.add('node-selected');

							if (gui.module1) {
								if (gui.module1.name !== m.name) {
									gui.module2 = m;
								}
							} else {
								gui.module1 = m;
							}

						// キャンセル機能
						} else {
							m.inputNode.selected = false;
							document.querySelector("." + m.inputNode.name).classList.remove('node-selected');
							gui.module1 = null;
						}
					} 

					// 選択
					if(event.target.classList.contains("node-output")) {

						// 選択機能
						if(m.outputNode.selected === false) {

							m.outputNode.selected = true;
							document.querySelector("." + m.outputNode.name).classList.add('node-selected');

							if (gui.module1) {
								if (gui.module1.name !== m.name) {
									gui.module2 = m;
								}
							} else {
								gui.module1 = m;
							}

						// キャンセル機能
						} else {
							m.outputNode.selected = false;
							document.querySelector("." + m.outputNode.name).classList.remove('node-selected');
							gui.module1 = null;
						}
					}
				}

				// targetからオブジェクトを検索
				if(m.type === "dest"){
					if(m.inputNode.selected === false) {

						m.inputNode.selected = true;
						document.querySelector("."+ m.inputNode.name).classList.add('node-selected');

						// モジュールを変数にセットする
						if (gui.module1) {
							gui.module2 = m;
						} else {
							gui.module1 = m;
						}

					} else {
						m.inputNode.selected = false;
						document.querySelector("." + m.inputNode.name).classList.remove('node-selected');
						gui.module1 = null;
					}

				}

				if (gui.module1 && gui.module2) {
					if (gui.module1.name !== gui.module2.name) {
						_connect()
					}
				}
			});
		}
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

	gui.makeknob = function(m) {

		// モジュールによりより場合分けが必要
		if (m.type == "osc") {
			makeFreqKnob(m);
			makePlayButton(m);
		}

		if (m.type == "gain") {
			makeGainKnob(m);
		}

		// モジュールのドラッグアンドドロップ操作を可能にする
        gui.draggable(document.querySelector("." + m.name));
		
		// ノードにイベントを追加
        gui.bindable(m);
	};

	function makeFreqKnob(m) {

		// ノブの生成
		$(".dial").knob({
			max: 14000,
			min: 20,
			width : 80,
			height: 80,
		});

		// ノブ操作のバインド
		document.querySelector("." + m.name + " .dial").addEventListener("change", function(){
			m.device.frequency.value = $("." + m.name + " .dial").val();
		});

	};

	function makeGainKnob(m) {
		
		// ノブの生成
		$(".gain-dial").knob({
			max: 100,
			min: 0,
			width : 80,
			height: 80,
		});	
	};

	function makePlayButton(m) {
		// 再生ボタンのバインド
		document.querySelector("." + m.name + " .module-play").addEventListener("click", function(){
			if (m.status == 0) {
				m.play();
			} else {
				m.stop();
			}
		});
	};

	return gui;

}($);