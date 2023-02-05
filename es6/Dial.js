/**
* The Dial class makes a circular interactive element that can be turned up or
* down by moving a marker round.
* @class Dial
*/

class Dial {
  constructor(_sketch, _id, _x, _y, _radius, _min = 0, _max = 1, _val = 0.5, _step = null){
    this.sk = _sketch
    this.id = _id
    this.x = _x
    this.y = _y
    this.radius = _radius
    this.min = _min
    this.max = _max
    this.val = _val
    this.step = _step
    this.gradations = null
    if (this.step !== null){
      let n = Math.floor((this.max - this.min)/this.step) + 1
      this.gradations = new Array(n)
      for (let i = 0; i < n; i++){
        this.gradations[i] = this.min + this.step*i
      }
    }
    // console.log("this.gradations:", this.gradations)

    // Pairing with Tone.js
    // this.toneObj = null
    // this.toneObjProperty = null

    // Defaults
    this.sk.colorMode(this.sk.RGB, 255)
    this.bgCol = this.sk.color(50, 55, 100)
    this.sk.colorMode(this.sk.HSB, 100)
    this.fgCol = this.sk.color(50, 55, 100)
    this.moving = false
  }


  draw(){
    this.sk.strokeWeight(3)
    this.sk.stroke(this.fgCol)
    this.sk.fill(this.bgCol)
    this.sk.circle(this.x, this.y, 2*this.radius)
    this.sk.stroke(100)
    this.sk.line(this.x, this.y, this.x, this.y + this.radius)
    this.sk.stroke(this.fgCol)
    const prop = (this.val - this.min)/(this.max - this.min)
    this.sk.line(
      this.x,
      this.y,
      this.x + this.radius*this.sk.cos(this.sk.TWO_PI*prop - this.sk.HALF_PI),
      this.y - this.radius*this.sk.sin(this.sk.TWO_PI*prop - this.sk.HALF_PI)
    )
    let displayVal = this.val
    if (Math.round(this.val) !== this.val){
      displayVal = Math.round(100*this.val)/100
    }
    if (this.val >= 1000 || this.val <= -1000){
      displayVal = this.val.toExponential()
    }
    this.sk.strokeWeight(3/5)
    this.sk.stroke(100)
    this.sk.noFill()
    this.sk.textAlign(this.sk.CENTER, this.sk.BOTTOM)
    this.sk.textSize(9)
    this.sk.text(displayVal, this.x, this.y - 4)
    this.sk.fill(this.bgCol)
    this.sk.stroke(this.fgCol)
    this.sk.textAlign(this.sk.CENTER, this.sk.CENTER)
    this.sk.textSize(12)
    this.sk.text(this.id, this.x, this.y + this.radius + 13)
  }


  pair(toneObj, toneObjProperty){
    this.toneObj = toneObj
    this.toneObjProperty = toneObjProperty
  }


  set_pair_val(){
    // console.log("this.val:", this.val)
    switch(this.toneObjProperty){
      case "volume":
      // console.log("dB:", 40*Math.log(this.val))
      this.toneObj[this.toneObjProperty].value = 40*Math.log(this.val)
      break
      case "portamento":
      this.toneObj[this.toneObjProperty] = this.val
      // const key = this.toneObjProperty
      // this.toneObj.set({
      //   key: this.val
      // })
      break
      case "spread":
      this.toneObj[this.toneObjProperty] = this.val
      break
      case "detune":
      this.toneObj[this.toneObjProperty].value = this.val
      break
      case "seconds":
      this.toneObj[this.toneObjProperty] = this.val
      break
      default:
      // Er?
    }

      // this.toneObj.set({
      //   toneObjProperty: this.val
      // })
  }


  set_val(){
    // Alpha is small +ve in first quadrant,
    // approaching +PI by end of second quadrant,
    // flips to -PI in third quadrant,
    // approaching small -ve by end of fourth quadrant.
    const alpha = this.sk.atan2(
      this.y - this.sk.mouseY,
      this.sk.mouseX - this.x
    )
    // Beta is -PI in fourth quadrant,
    // approaching small -ve by end of first quadrant,
    // flips to small +ve in second quadrant,
    // approaching +PI by end of third quadrant.
    let beta
    if (alpha > -this.sk.HALF_PI){
      beta = alpha - this.sk.HALF_PI
    }
    else {
      beta = 3*this.sk.PI/2 + alpha
    }
    // console.log("alpha:", alpha, "beta:", beta)
    const candidateVal = this.sk.map(
      beta,
      -this.sk.PI, this.sk.PI,
      this.min, this.max
    )
    // Map the candidate value to the closest gradation,
    // if a step argument was provided when constructing
    // the dial.
    if (this.step !== null){
      const ma = mu.min_argmin(
        this.gradations.map(function(g){
          return Math.abs(g - candidateVal)
        })
      )
      this.val = this.gradations[ma[1]]
    }
    else {
      this.val = candidateVal
    }

    // If a Tone.js object property has been paired with
    // this dial, update the property on the Tone.js object.
    if (this.toneObj !== undefined && this.toneObjProperty !== undefined){
      this.set_pair_val()
    }
  }


  toggle_moving(){
    this.moving = !this.moving
  }


  touch_check(){
    return this.sk.dist(
      this.sk.mouseX, this.sk.mouseY, this.x, this.y
    ) <= this.radius
  }
}
export default Dial
