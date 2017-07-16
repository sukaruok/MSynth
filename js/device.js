// create context
(function(){
	try {
		ctx = new (window.AudioContext || window.webkitAudioContext)();
	} catch(e) {
		console.log('Web Audio API is not supported in this browser');
	}
}());


var Device = function(){

	var Device = function(){
	}

	// moduleの新規作成
	Device.createOscModule = function(){
		var osc = ctx.createOscillator();
		osc.frequency.value = 440;
		return osc;
	};

	Device.createGainModule = function(){
		var gain = ctx.createGain();
		gain.gain.value = 1.0;
		return ctx.createGain();
	};

	Device.createDestModule = function(){
		return ctx.destination;
	};

	Device.createKeyboardModule = function(){
		var myWebAudios = [];
		var refTone = 440;
		var octave  = 0;
		var masterGainNode = ctx.createGain();
		masterGainNode.gain.value = 1.0;

		var keyboards = [
			{ id: "key-a", name: "C4",  diff: -9 },    // ド  (C4)
			{ id: "key-w", name: "C#4", diff: -8 },    // ド# (C#4)
			{ id: "key-s", name: "D4",  diff: -7 },    // レ  (D4)
			{ id: "key-e", name: "D#4", diff: -6 },    // レ# (D#4)
			{ id: "key-d", name: "E4",  diff: -5 },    // ミ  (E4)
			{ id: "key-f", name: "F4",  diff: -4 },    // ファ  (F4)
			{ id: "key-t", name: "F#4", diff: -3 },    // ファ# (F#4)
			{ id: "key-g", name: "G4",  diff: -2 },    // ソ  (G4)
			{ id: "key-y", name: "G#4", diff: -1 },    // ソ# (G#4)
			{ id: "key-h", name: "A4",  diff:  0 },    // ラ  (A4)
			{ id: "key-u", name: "A#4", diff:  1 },    // ラ# (A#4)
			{ id: "key-j", name: "B4",  diff:  2 },    // シ  (B4)
			{ id: "key-k", name: "C5",  diff:  3 }     // ド  (C5)
		];

		for (var i = 0; i < keyboards.length; i++) {
			var key = keyboards[i];    // 鍵盤情報

			myWebAudios[ key.id ] = {};
			// オーディオノードの生成
			//   - 音源ノード（OscillatorNode）
			myWebAudios[ key.id ].oscNode = ctx.createOscillator();
			myWebAudios[ key.id ].oscNode.frequency.value = refTone * Math.pow(2, key.diff / 12) * Math.pow(2, octave);    // 鍵盤の音高に対応する周波数を計算
			//   - 音量ノード（GainNode）
			myWebAudios[ key.id ].gainNode = ctx.createGain();
			myWebAudios[ key.id ].gainNode.gain.value = 0;

			// オーディオノードの接続
			myWebAudios[ key.id ].oscNode.connect( myWebAudios[ key.id ].gainNode );
			myWebAudios[ key.id ].gainNode.connect(masterGainNode);        


			// ミュート状態で音源を再生開始
			myWebAudios[ key.id ].oscNode.start( 0 );

		}

		// キーボードの設定
		$( window ).on( "keydown", { myWebAudios : myWebAudios } , keydown );
		$( window ).on( "keyup", { myWebAudios : myWebAudios } , keyup );

		return masterGainNode;

	};


	/**
	 * キーボードのkeydownイベント
	 *   - キーボード文字と対応する鍵盤の音を再生する
	 */
	function keydown( e ) {
		var keyChar = String.fromCharCode( e.keyCode ).toLowerCase();  // キーボード文字を取得
		console.log( "down:" + keyChar );

		var id = "key-" + keyChar;      // キーボード文字を鍵盤のID名に変換

		// keyDOMを取得
		var keyDOM = $("li#" + id);
		if( keyDOM.length == 0) return;

		// 鍵盤をハイライト
		keyDOM.addClass("keydown");

		// イベント時のデータの受け渡し
		var myWebAudios = e.data.myWebAudios;

		// 鍵盤の音を再生（ミュートOFF）
		myWebAudios[id].gainNode.gain.value = 1;

	}

	/**
	 * キーボードのkeyupイベントハンドラ
	 *   - キーボード文字と対応する鍵盤の音を停止する
	 */
	function keyup( e ) {
		var keyChar = String.fromCharCode( e.keyCode ).toLowerCase();  // キーボード文字を取得
		console.log( "down:" + keyChar );

		var id = "key-" + keyChar;      // キーボード文字を鍵盤のID名に変換

		// keyDOMを取得
		var keyDOM = $("li#" + id);
		if( keyDOM.length == 0) return;

		// 鍵盤をハイライトを解除
		keyDOM.removeClass( "keydown" );

		// イベント時のデータの受け渡し
		var myWebAudios = e.data.myWebAudios;

		// 鍵盤の音をミュート
		myWebAudios[ id ].gainNode.gain.value = 0;

	}

	Device.stop = function() {
		osc.stop(0);
	};

	return Device;
}();