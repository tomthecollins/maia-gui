/**
 * Class for representing a set of waveforms
 * @class
 */
class Waveforms {

  /**
   * Constructor for the Waveforms class
   * @constructor
   * @param {Object} _sketch - the p5.js sketch object
   * @param {number} _x - the x-coordinate of the Waveforms object
   * @param {number} _y - the y-coordinate of the Waveforms object
   * @param {number} _w - the width of the Waveforms object
   * @param {number} _h - the height of the Waveforms object
   * @param {number} _xInSec - the x-coordinate of the Waveforms object, in seconds
   * @param {number} _wInSec - the width of the Waveforms object, in seconds
   * @param {number} _wfHeight - the height of each individual waveform in the set
   * @param {number} _secPerBox - the number of seconds per grid box in the Waveforms object
   */
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

  /**
   * Adds a waveform to the array of waveforms.
   * @param {string} _url - URL of the waveform audio file
   * @param {number} _x - x-coordinate of the waveform
   * @param {number} _y - y-coordinate of the waveform
   */
  add_waveform(_url, _x, _y){
    this.arr.push(
      new Waveform(this.sk, _url, _x, _y, this)
    )
  }

  /**
   * Draws the waveforms.
   */
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

  /**
   * Moves one of the waveforms.
   */
  move(){
    if (this.movingIdx >= 0){
      this.arr[this.movingIdx].move()
    }
  }

  /**
   * Starts the playback of the waveforms.
   */
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

  /**
   * Checks and stores which waveform is being touched.
   */
  touch_check(){
    this.movingIdx = this.arr.findIndex(function(wf){
      return wf.touch_check()
    })
    return this.movingIdx
  }

  /**
   * Calls `touch_end()` for an indiviual waveform that was being touched, and
   * resets the class' `movingIdx` property to -1 (indicating that no waveform
   * is being touched).
   */
  touch_end(){
    if (this.movingIdx >= 0){
      this.arr[this.movingIdx].touch_end(this.x, this.w)
      this.movingIdx = -1
    }
  }
}
export default Waveforms
