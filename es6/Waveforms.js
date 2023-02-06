export default class Waveforms {
  constructor(_sketch, _x, _y, _w, _h, _xInSec, _wInSec, _wfHeight, _secPerBox){
    this.sk = _sketch
    this.x = _x
    this.y = _y
    this.w = _w
    this.h = _h
    this.xInSec = _xInSec
    this.wInSec = _wInSec
    this.wfHeight = _wfHeight
    this.secPerBox = _secPerBox

    this.arr = []
    this.movingIdx = -1
  }


  add_waveform(_url, _x, _y){
    this.arr.push(
      new Waveform(this.sk, _url, _x, _y, this)
    )
  }


  draw(){
    const self = this
    self.sk.background(220)
    // Outer rectangle
    self.sk.push()
    self.sk.noFill()
    self.sk.stroke(100, 100, 130)
    self.sk.strokeWeight(6)
    self.sk.rect(self.x - 3, self.y - 3, self.w + 6, self.h + 6, 5)
    self.sk.pop()

    // Waveforms
    self.sk.push()
    self.sk.fill(220); self.sk.noStroke()
    self.sk.rect(self.x, self.y, self.w, self.h)
    self.sk.drawingContext.clip()
    self.arr.forEach(function(wf){
      // console.log("idx:", idx, wf)
      if (wf.graphicsBuffer){
        wf.draw()
      }
    })
    self.sk.pop()

    // Playhead
    if (
      Tone.Transport.seconds >= self.xInSec &&
      Tone.Transport.seconds < self.xInSec + self.wInSec
    ){
      self.sk.stroke(100, 100, 130)
      const x = self.sk.map(
        Tone.Transport.seconds,
        self.xInSec,
        self.xInSec + self.wInSec,
        self.x,
        self.x + self.w
      )
      self.sk.line(
        x, self.y, x, self.y + self.h
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
