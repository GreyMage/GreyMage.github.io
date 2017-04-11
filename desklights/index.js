'use strict';

var SerialPort = require('serialport');
SerialPort.list(function (err, ports) {
	ports.forEach(function(stub) {
		var port = new SerialPort(stub.comName, { autoOpen: false, baudRate: 9600 });
		// the open event will always be emitted
		port.once('data', function (data) {
			if(data == "!") hookPort(port);
			else port.close();
		});
		port.open(function (err) {
			if (err) {
				return console.log('Error opening port: ', err.message);
			}
			setTimeout(()=>{
				port.write('?', function () {
					port.drain();
				});
			},1000)
		});
	});
});

let hookPort = port => {

	const device = {};
	
	device.sleep = () => {
		return new Promise(done => {
			port.write('..', function () {
				port.drain(done);
			});
		})
	}
	
	device.wake = () => {
		return new Promise(done => {
			port.write('.DREAM.', function () {
				port.drain(done);
			});
		})
	}
	
	device.sleep().then(()=>{
		setTimeout(device.wake,5000);
	});
	
}