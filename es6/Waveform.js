export default class Waveform {
  constructor(_sketch, _url, _x, _y, _wvfs){
    this.sk = _sketch
    this.x = _x
    this.y = _y
    this.dragOffset = {}
    this.moving = false

    // Player
    const self = this
    self.player = new Tone.Player(
      _url,
      function(){
        console.log("Loaded!")
        self.player.volume.value = -15
        // Handle scheduling of waveforms.
        const startTime = map(
          self.x, _wvfs.x, _wvfs.x + _wvfs.w,
          screenLRepresents, screenLRepresents + screenWRepresents
        )
        console.log("startTime:", startTime)
        if (startTime >= 0){
          self.player.sync().start(startTime)
        }
        else {
          self.player.sync().start(0, -startTime)
        }
        // self.player.sync().start(0)
        self.player.connect(Tone.Destination)
        // src2.connect(myPanner)
        // myPanner.connect(Tone.Destination)

        // Programmatic alteration of SFX parameters.
        // Tone.Transport.schedule(function(time){
        //   myPanner.pan.value = -1
        //   myPanner.pan.rampTo(1, 1.5)
        // }, "0:0:0")

        // Buffer
        const buffer = self.player.buffer
        console.log("buffer:", buffer)
        self.duration = buffer._buffer.duration
        self.fs = buffer._buffer.sampleRate
        self.nosSamples = buffer._buffer.length
        self.w = _wvfs.w*self.duration/screenWRepresents
        // Potentially obsolete but render() uses it still at the mo.
        self.nBox = self.duration/boxDuration
        self.h = wavfHeight

        // Do something with the buffer.
        self.vals = self.get_wav_summary(buffer)
        self.render()
        _wvfs.draw()

      }
    )
  }


  draw(){
    image(this.graphicsBuffer, this.x, this.y)
  }


  get_wav_summary(buff){
    let chData = Array.from(buff.getChannelData(0))
    // console.log(chData.length)

    if (this.nBox === undefined){
      // No boxing/summary required.
      return chData
    }
    else {
      // Boxing/summary required.
      const idxSpacing = Math.round(this.fs*boxDuration)
      const boxesToDraw = new Array(
        Math.ceil(this.nosSamples/idxSpacing)
      )
      for (let i = 0; i < boxesToDraw.length; i++){
        // Calculate local value.
        const localPoints = chData.slice(
          idxSpacing*i,
          Math.min(idxSpacing*(i + 1), this.nosSamples)
        )
        // Could do RMS instead.
        const localRms = Math.sqrt(
          localPoints.reduce(function(a, b){
            return a + Math.pow(b, 2)
          }, 0)/localPoints.length
        )
        boxesToDraw[i] = [
          idxSpacing*i/this.nosSamples, localRms
        ]
      }
      return boxesToDraw
    }
  }


  move(){
    this.x = mouseX - this.dragOffset.x
    this.y = mouseY - this.dragOffset.y
  }


  render(){
    const self = this
    const x = self.x
    const y = self.y
    const w = self.w
    const h = self.h
    // console.log("[x, y, w, h]:", [x, y, w, h])

    // Save to a graphics buffer for ease of use with playback.
    self.graphicsBuffer = self.sk.createGraphics(w, h)
    self.graphicsBuffer.fill(255, 215, 0)
    self.graphicsBuffer.noStroke()
    self.graphicsBuffer.rect(0, 0, w, h)
    // image(self.graphicsBuffer, x, y)

    console.log("self.nBox:", self.nBox)
    if (self.nBox === undefined){
      // Untested!
      self.graphicsBuffer.stroke(0)
      self.vals.forEach(function(val, idx){
        self.graphicsBuffer.line(
          w*idx/self.vals.length,
          h*(1 - (val + 1)/2),
          w*(idx + 1)/self.vals.length,
          h*(1 - (self.vals[idx + 1] + 1)/2)
        )
      })
    }
    else {
      self.graphicsBuffer.fill(245)
      self.graphicsBuffer.noStroke()
      self.vals.forEach(function(val, idx){
        if (idx < self.vals.length - 1){
          self.graphicsBuffer.rect(
            w*val[0],
            h*(1 - val[1])/2,
            w*(self.vals[idx + 1][0] - val[0]),
            h*val[1]
          )
        }
        else {
          self.graphicsBuffer.rect(
            w*val[0],
            h*(1 - val[1])/2,
            w*(1 - val[0]),
            h*val[1]
          )
        }
      })
    }

    // self.graphicsBuffer.copy(
    //   // source
    //   canvas,
    //   // source x, y, w, h
    //   x, y, w, h,
    //   // destination x, y, w, h
    //   0, 0, self.graphicsBuffer.width, self.graphicsBuffer.height
    // )
  }


  touch_check(){
    if (mouseX >= this.x &&
      mouseX < this.x + this.w &&
      mouseY >= this.y &&
      mouseY < this.y + this.h
    ){
      this.dragOffset = {
        "x": mouseX - this.x,
        "y": mouseY - this.y
      }
      this.moving = true
      return true
    }
  }


  touch_end(_x, _w){
    this.player.unsync()
    const startTime = map(
      this.x, _x, _x + _w,
      screenLRepresents, screenLRepresents + screenWRepresents
    )
    console.log("startTime:", startTime)
    if (startTime >= 0){
      this.player.sync().start(startTime)
    }
    else {
      this.player.sync().start(0, -startTime)
    }
    this.moving = false
  }
}
