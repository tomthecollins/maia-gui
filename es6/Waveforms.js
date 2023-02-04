export default class Waveforms {
  constructor(_sketch, _x, _y, _w, _h){
    this.sk = _sketch
    this.x = _x
    this.y = _y
    this.w = _w
    this.h = _h

    this.arr = []
    this.movingIdx = -1
  }


  add_waveform(_url, _x, _y){
    this.arr.push(
      new Waveform(_sketch, _url, _x, _y, this)
    )
  }


  draw(){
    this.sk.background(220)
    // Outer rectangle
    this.sk.push()
    this.sk.noFill()
    this.sk.stroke(100, 100, 130)
    this.sk.strokeWeight(6)
    this.sk.rect(this.x - 3, this.y - 3, this.w + 6, this.h + 6, 5)
    this.sk.pop()

    // Waveforms
    this.sk.push()
    this.sk.fill(220); this.sk.noStroke()
    this.sk.rect(this.x, this.y, this.w, this.h)
    this.sk.drawingContext.clip()
    this.arr.forEach(function(wf){
      if (wf.graphicsBuffer){
        wf.draw()
      }
    })
    this.sk.pop()

    // Playhead
    if (
      Tone.Transport.seconds >= screenLRepresents &&
      Tone.Transport.seconds < screenLRepresents + screenWRepresents
    ){
      this.sk.stroke(100, 100, 130)
      const x = this.sk.map(
        Tone.Transport.seconds,
        screenLRepresents,
        screenLRepresents + screenWRepresents,
        this.x,
        this.x + this.w
      )
      this.sk.line(
        x, this.y, x, this.y + this.h
      )
    }
  }


  move(){
    if (this.movingIdx >= 0){
      this.arr[this.movingIdx].move()
    }
  }


  playback(){
    const self = this
    Tone.Transport.scheduleRepeat(function(){
      Tone.Draw.schedule(function(){
        self.draw()
      }, Tone.now())
    }, 0.05)
    // Tone.Transport.seconds = 0
    Tone.Transport.start()
  }


  touch_check(){
    this.movingIdx = this.arr.findIndex(function(wf){
      return wf.touch_check()
    })
    return this.movingIdx
  }


  touch_end(){
    if (this.movingIdx >= 0){
      this.arr[this.movingIdx].touch_end(this.x, this.w)
      this.movingIdx = -1
    }
  }
}
