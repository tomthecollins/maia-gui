/**
 * Class representing a button
 * @class
 */
class Button {
  /**
   * Creates a button
   * @param {p5} _sketch - The p5 sketch
   * @param {p5.Image} _labelImg - The image for the button label
   * @param {Boolean} _disabled - Flag for whether the button is disabled
   * @param {Boolean} _clicked - Flag for whether the button is clicked
   * @param {Number} _x - The x-coordinate for the button's position
   * @param {Number} _y - The y-coordinate for the button's position
   * @param {Number} _width - The width of the button
   * @param {Number} _height - The height of the button
   */
   constructor(
    _sketch, _labelImg, _disabled, _clicked, _x, _y, _width, _height
  ){
    // Workaround for JS context peculiarities.
    // var self = this;
    this.sk = _sketch
    this.labelImg = _labelImg
    // this.label = theLabel
    this.disabled = _disabled
    this.clicked = _clicked
    this.x = _x
    this.y = _y
    this.w = _width
    this.h = _height
    this.buttonStroke = this.sk.color("#17baef")
    this.buttonFill = this.sk.color("#074f66")
    // this.labelFill = this.sk.color(225)
    this.buttonStrokeClicked = this.sk.color("#eebf3f")
    this.buttonFillClicked = this.sk.color("#eebf3f")
    // this.labelFillClicked = this.sk.color(225)
    this.buttonStrokeDisabled = this.sk.color("#999999")
    this.buttonFillDisabled = this.sk.color("#cccccc")
    // this.labelFillDisabled = this.sk.color(225)

    // Possible to return something.
    // return sth;
  }

  draw(newX){
    if (newX !== undefined){
      this.x = newX
    }
    this.sk.ellipseMode(this.sk.CORNER)
    // this.sk.rectMode(this.sk.CORNER)
    if (this.disabled){
      this.sk.stroke(this.buttonStrokeDisabled)
      this.sk.fill(this.buttonFillDisabled)
    }
    else {
      if (this.clicked){
        this.sk.stroke(this.buttonStrokeClicked)
        this.sk.fill(this.buttonFillClicked)
      }
      else {
        this.sk.stroke(this.buttonStroke)
        this.sk.fill(this.buttonFill)
      }
    }
    this.sk.ellipse(this.x, this.y, this.w, this.h)
    // this.sk.rect(this.x, this.y, this.w, this.h)
    this.sk.imageMode(this.sk.CENTER)
    this.sk.image(
      this.labelImg, this.x + this.w/2, this.y + this.h/2, 0.5*this.h,
      0.5*this.h
    )
  }

  onclick(){
    if (this.disabled){
      return
    }
    // if (prm.printConsoleLogs) { console.log("Button \"" + this.label + "\" has been clicked!") }
    this.toggle_clicked()
    this.draw()
  }

  set_image(anImg){
    this.labelImg = anImg
  }

  toggle_clicked(){
    this.clicked = !this.clicked
  }

  toggle_disabled(){
    this.disabled = !this.disabled
  }

  touch_check(){
    if (
      this.sk.mouseX > this.x && this.sk.mouseX < this.x + this.w &&
      this.sk.mouseY > this.y && this.sk.mouseY < this.y + this.h
    ){
      // if (prm.printConsoleLogs) {
        console.log("GOT TO A TOUCH CHECK IN BUTTON!")
      // }
      this.onclick()
      return true
    }
    return false
  }

}
export default Button
