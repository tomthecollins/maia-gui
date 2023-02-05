const sketchy = function(p){
  let wavfs

  const screenLRepresents = 0 // sec
  const screenWRepresents = 10 // sec
  const wavfHeight = 50 // pixels
  const boxDuration = 0.05 // sec
  
  Tone.Transport.loop = true
  Tone.Transport.loopStart = screenLRepresents // "0:0:0"
  Tone.Transport.loopEnd = screenWRepresents // "2:0:0"
  // Tone.Transport.bpm.value = 130
  // console.log("Tone.Transport.bpm.value:", Tone.Transport.bpm.value)
  // const myPanner = new Tone.Panner(0)

  p.setup = function(){
    p.createCanvas(600, 400)
    new mg.TextInput(
      p, "Add URL to another sound here.", 30, 30, 490, "Add file!", 530, 30
    )

    wavfs = new mg.Waveforms(
      p, 30, 70, 540, 220, screenLRepresents, screenWRepresents
    )
    wavfs.add_waveform(
      "https://tomcollinsresearch.net/mc/ex/src/instrument/edm_samples/drum_3.wav",
      129.5, 110, wavfHeight, boxDuration
    )
    wavfs.add_waveform(
      "https://tomcollinsresearch.net/mc/ex/src/instrument/edm_samples/bass.wav",
      30, 200, wavfHeight, boxDuration
    )
    wavfs.draw()

  }


  p.keyPressed = function(){
    console.log("Tone.Transport.state:", Tone.Transport.state)
    if (Tone.context.state !== "running"){
      Tone.start()
    }
    if (Tone.Transport.state !== "started"){
      console.log("Starting the Transport!")
      wavfs.playback()
    }
    else {
      Tone.Transport.pause()
    }
  }


  p.touchStarted = function(){
    wavfs.touch_check()
    console.log("wavfs.movingIdx:", wavfs.movingIdx)
    wavfs.draw()
  }


  p.touchMoved = function(){
    wavfs.move()
    wavfs.draw()
  }


  p.touchEnded = function(){
    wavfs.touch_end()
    wavfs.draw()
  }

}


new p5(sketchy, "mySequencer")
