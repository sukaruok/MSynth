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

	// Device.play = function(osc) {
	// 	osc.play(0);
	// };

	Device.stop = function() {
		osc.stop(0);
	};
	return Device;
}();