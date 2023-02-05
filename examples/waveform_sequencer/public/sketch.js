class Client {
  constructor(){
    this.sketch = new p5(this.load_sketch.bind(this), "mySequencer")
  }


  load_sketch(p){
    const prm = {
      "canvasWidth": 600,      // pixels
      "canvasHeight": 400,     // pixels
      "screenLRepresents": 0,  // sec
      "screenWRepresents": 10, // sec
      "wavfHeight": 50,        // pixels
      "boxDuration": 0.05      // sec
    }
    let myInterface

    // This bit could be bundled into the Interface constructor.
    Tone.Transport.loop = true
    Tone.Transport.loopStart = prm.screenLRepresents // "0:0:0"
    Tone.Transport.loopEnd = prm.screenWRepresents // "2:0:0"
    // Tone.Transport.bpm.value = 130
    // console.log("Tone.Transport.bpm.value:", Tone.Transport.bpm.value)
    // End suggested bundling.

    p.setup = function(){
      myInterface = new Interface(p, prm)
    }


    p.keyPressed = function(){
      console.log("Tone.Transport.state:", Tone.Transport.state)
      if (Tone.context.state !== "running"){
        Tone.start()
      }
      if (Tone.Transport.state !== "started"){
        console.log("Starting the Transport!")
        myInterface.wavfs.playback()
      }
      else {
        Tone.Transport.pause()
      }
    }


    p.touchStarted = function(){
      myInterface.wavfs.touch_check()
      console.log(
        "myInterface.wavfs.movingIdx:", myInterface.wavfs.movingIdx
      )
      myInterface.wavfs.draw()
    }


    p.touchMoved = function(){
      myInterface.wavfs.move()
      myInterface.wavfs.draw()
    }


    p.touchEnded = function(){
      myInterface.wavfs.touch_end()
      myInterface.wavfs.draw()
    }

  }
}


class Interface {
  constructor(_sketch, param){
    this.sk = _sketch
    // this.param = param
    this.sk.createCanvas(param.canvasWidth, param.canvasHeight)
    new mg.TextInput(
      this.sk, "Add URL to another sound here.", 30, 30, 490,
      "Add file!", 530, 30
    )

    this.wavfs = new mg.Waveforms(
      this.sk, 30, 70, 540, 220, param.screenLRepresents,
      param.screenWRepresents
    )
    this.wavfs.add_waveform(
      "https://tomcollinsresearch.net/mc/ex/src/instrument/edm_samples/drum_3.wav",
      129.5, 110, param.wavfHeight, param.boxDuration
    )
    this.wavfs.add_waveform(
      "https://tomcollinsresearch.net/mc/ex/src/instrument/edm_samples/bass.wav",
      30, 200, param.wavfHeight, param.boxDuration
    )
    this.wavfs.draw()
  }
}


new Client()
