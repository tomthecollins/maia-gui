export default class PlayWheel extends Dial {
  constructor(_sketch, _id, _x, _y, _radius, _min = 0, _max = 1, _val = 0.5, _step = null){
    super(_sketch, _id, _x, _y, _radius, _min, _max, _val, _step)
    // Any extra properties/actions here, which could have been
    // passed into the constructor also...
    this.disabled = true
    this.playing = false

  }


  draw(){
    // Draw play/pause button.
    this.sk.strokeWeight(3)
    this.sk.stroke(this.fgCol)
    this.sk.fill(this.bgCol)
    if (this.playing){
      // Draw pause button.
      this.sk.rectMode(this.sk.CORNER)
      this.sk.rect(
        this.x - 2/3*this.radius, this.y - 0.5*this.radius,
        2/3*this.radius, 4/3*this.radius,
        5
      )
      this.sk.rect(
        this.x - 2/3*this.radius, this.y - 0.5*this.radius,
        2/3*this.radius, 4/3*this.radius,
        5
      )
    }
    else {
      // Draw play button.
      this.sk.triangle(
        this.x - 0.5*this.radius, this.y - 0.5*this.radius,
        this.x - 0.5*this.radius, this.y + 0.5*this.radius,
        this.x + 0.5*this.radius, this.y,
        5
      )
    }

    // Draw dial.
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
    // Do not do display of value or id here.
    // let displayVal = this.val
    // if (Math.round(this.val) !== this.val){
    //   displayVal = Math.round(100*this.val)/100
    // }
    // if (this.val >= 1000 || this.val <= -1000){
    //   displayVal = this.val.toExponential()
    // }
    // this.sk.strokeWeight(3/5)
    // this.sk.stroke(100)
    // this.sk.noFill()
    // this.sk.textAlign(this.sk.CENTER, this.sk.BOTTOM)
    // this.sk.textSize(9)
    // this.sk.text(displayVal, this.x, this.y - 4)
    // this.sk.fill(this.bgCol)
    // this.sk.stroke(this.fgCol)
    // this.sk.textAlign(this.sk.CENTER, this.sk.CENTER)
    // this.sk.textSize(12)
    // this.sk.text(this.id, this.x, this.y + this.radius + 13)
  }


  set_max(_max){
    this.max = _max
    if (this.step !== null){
      let n = Math.floor((this.max - this.min)/this.step) + 1
      this.gradations = new Array(n)
      for (let i = 0; i < n; i++){
        this.gradations[i] = this.min + this.step*i
      }
    }
  }


  toggle_disabled(){
    this.disabled = !this.disabled
  }


  toggle_play(){
    this.playing = !this.playing
  }


  touch_check(){
    // Establish general proximity to dial.
    const d = this.sk.dist(
      this.sk.mouseX, this.sk.mouseY, this.x, this.y
    )
    if (d > this.radius){ return false }
    // Toggle play if it's within 3/4 of the radius.
    if (d < 0.75*this.radius){ return "toggle play" }
    // Otherwise control the outer wheel (dial).
    else { return "move dial" }
  }

}
