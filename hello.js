async function onStartButtonClick() {
    try {
      const port = await navigator.serial.requestPort();
      console.log("Requesting access to serial port");
  
      await port.open({
        baudRate: 19200,
        dataBits: 8,
        stopBits: 1,
        parity: "none",
        flowControl: "none",
      });
  
      // Use the `port` variable here
      const {usbProductId, usbVendorId} = port.getInfo();
      document.getElementById("sdata").innerHTML = usbProductId + " " + "<br>" + usbVendorId;
  
      console.log("Serial port opened");
  
      const writer = port.writable.getWriter();
      console.log("Writer obtained");
  
      const data = new Uint8Array([0x32]); // Send "2" over the serial port
      await writer.write(data);
      console.log("Data sent");
  
      writer.releaseLock();
  
      while (port.readable) {
        const textDecoder = new TextDecoderStream();
        const readableStreamClosed = port.readable.pipeTo(textDecoder.writable);
        const reader = textDecoder.readable
          .pipeThrough(new TransformStream(new LineBreakTransformer()))
          .getReader();
        console.log("Reading from serial port");
  
        try {
          while (true) {
            const { value, done } = await reader.read();
            if (done) {
              console.log("Canceled");
              break;
            }
            console.log("Received data: " + value);
          }
        } catch (error) {
          console.log("Error reading from serial port: " + error);
        } finally {
          reader.releaseLock();
        }
      }
    } catch (error) {
      console.log("Error opening serial port: " + error);
    }
  }


  onStartButtonClick()