class Client {
  constructor(){
    this.sketch = new p5(this.load_sketch.bind(this), "mySequencer")
  }


  load_sketch(p){
    const prm = {
      "canvasWidth": 600,       // pixels
      "canvasHeight": 400,      // pixels
      "gridMargin": 20,         // pixels
      "screenLRepresents": 0,   // ontime
      "screenRRepresents": 75,  // ontime
      "screenTRepresents": 80,  // MIDI note number
      "screenBRepresents": 40,  // MIDI note number
      "oblongHeight": 5,        // pixels
      "oblongNudge": 2,         // pixels to avoid oblongs running into eachother
      "compObj": co,            // Composition object loaded from file
      "fillCol": [              // Mapping of staffNo to fill colour
        "#F4D06F",
        "#392F5A",
        "#FF8811"
      ]
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
      // console.log("Tone.Transport.state:", Tone.Transport.state)
      // if (Tone.context.state !== "running"){
      //   Tone.start()
      // }
      // if (Tone.Transport.state !== "started"){
      //   console.log("Starting the Transport!")
      //   myInterface.wavfs.playback()
      // }
      // else {
      //   Tone.Transport.pause()
      // }
    }


    p.touchStarted = function(){
      // myInterface.touch_check()
    }


    p.touchMoved = function(){
      // myInterface.move()
    }


    p.touchEnded = function(){
      // myInterface.touch_end()
    }

  }
}


class Interface {
  constructor(_sketch, param){
    this.sk = _sketch
    // this.param = param
    this.visual = new Visual(_sketch, param)

    // console.log("co.notes.slice(0, 5):", co.notes.slice(0, 5))
  }
}


class Visual {
  constructor(_sketch, param){
    this.sk = _sketch
    this.param = param
    this.render()
  }

  render(){
    const self = this
    const prm = self.param
    this.sk.createCanvas(prm.canvasWidth, prm.canvasHeight)
    // Draw bounding rectangle.
    this.sk.rect(
      prm.gridMargin, prm.gridMargin,
      prm.canvasWidth - 2*prm.gridMargin,
      prm.canvasHeight - 2*prm.gridMargin
    )
    const notes = prm.compObj.notes
    // Only keep the notes whose ontimes, offtimes, and MNNs mean that they are
    // (partially) within the bounding rectangle.
    notes.filter(function(n){
      return n.MNN > prm.screenBRepresents &&
      n.MNN < prm.screenTRepresents &&
      n.ontime < prm.screenRRepresents &&
      n.offtime > prm.screenLRepresents
    })
    .forEach(function(n){
      // Determine horizontal coordinates.
      let oblongL = prm.gridMargin + self.sk.map(
        n.ontime,
        // The endpoints in the music are the ontimes.
        prm.screenLRepresents, prm.screenRRepresents,
        // The endpoints in the graphics are determined by margin and width.
        prm.gridMargin, prm.canvasWidth - 2*prm.gridMargin
      )
      // Prevent drawing outside of the grid.
      oblongL = Math.max(oblongL, prm.gridMargin)
      let oblongR = prm.gridMargin + self.sk.map(
        n.offtime, prm.screenLRepresents, prm.screenRRepresents,
        prm.gridMargin, prm.canvasWidth - 2*prm.gridMargin
      )
      // Prevent drawing outside of the grid.
      oblongR = Math.min(oblongR, prm.canvasWidth - 2*prm.gridMargin)
      // Determine vertical coordinate.
      const oblongV = self.sk.map(
        n.MNN, prm.screenBRepresents, prm.screenTRepresents,
        prm.canvasHeight - 2*prm.gridMargin, prm.gridMargin
      )
      self.sk.noStroke()
      // Colour based on staff number/channel.
      self.sk.fill(
        prm.fillCol[n.staffNo]
      )
      self.sk.rect(
        oblongL + prm.oblongNudge, oblongV - prm.oblongHeight/2,
        oblongR - oblongL - 2*prm.oblongNudge, prm.oblongHeight,
        1 // Little bit of rounding on the edges
      )
    })
  }
}


new Client()
