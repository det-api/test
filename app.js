const nrf = require('nrf');

// Create an NRF instance
const radio = nrf.connect('/dev/ttyUSB0', { baudRate: 250000 });

// Configure the NRF instance
radio.channel(0x4c).dataRate('250kbps').crcBytes(2);

// Receive data from the NRF device
radio.on('data', function (data) {
  console.log('Received data:', data);
});

// Handle NRF errors
radio.on('error', function (err) {
  console.log('NRF error:', err);
});