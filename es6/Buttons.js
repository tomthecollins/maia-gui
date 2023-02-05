/**
 * Class representing the Buttons.
 * @class
 */
class Buttons {
  /**
   * Creates an instance of Buttons.
   * @constructor
   * @param {p5} _sketch - The p5 instance.
   * @param {Object} _buttonsStruct - The buttons structure object.
   * @param {Object} _containerDimensions - The container dimensions object.
   */
   constructor(_sketch, _buttonsStruct, _containerDimensions){
    this.sk = _sketch
    this.buttonsStruct = _buttonsStruct
    this.keys = Object.keys(this.buttonsStruct)
    this.x = _containerDimensions.x
    this.y = _containerDimensions.y
    this.w = _containerDimensions.width
    this.h = _containerDimensions.height
  }

  /**
   * Draws the buttons on the sketch.
   */
  draw(){
    const self = this
    self.keys.forEach(function(k, idx){
      self.buttonsStruct[k].draw(self.buttonsStruct[k].x)
    })
  }

  /**
   * Helper function for touch_check() method in Buttons class.
   * Determines if a button has been clicked and which one it is.
   *
   * @return {object} Object with "click" and "index" properties indicating if
   * a button has been clicked and which button was clicked, respectively.
   * "click" is a boolean and "index" is an integer.
   */
  touch_check_helper(){
    let self = this
    // Check general area.
    // Currently removed any possibility of select menus.
    if (
      this.sk.mouseX < self.x || this.sk.mouseX > self.x + self.w ||
      this.sk.mouseY < self.y || this.sk.mouseY > self.y + self.h
    ){
      return { "click": false, "index": -1 }
    }

    // Move on to checking individual buttons.
    let buttonClick = false
    let bidx = 0
    while (bidx < self.keys.length && !buttonClick){
      // console.log("GOT INSIDE WHILE!")
      buttonClick = self.buttonsStruct[self.keys[bidx]].touch_check()
      if (buttonClick){
        return { "click": true, "index": bidx }
      }
      bidx++
    }
    return { "click": false, "index": -1 }
  }

}
export default Buttons
