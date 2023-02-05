// import mu from "maia-util"

/**
* The Cell class makes small (rounded) rectangles that live inside an instance
* of the {@link Grid} class. They can be informational (members of the top-,
* bottom-, left-, or right-most rows/columns of the grid, acting as time or
* pitch labels), or they can  be members of the inner grid, where musical events
* may be represented.
* @class Cell
*/

class Cell {
  /**
   * Creates a Cell.
   * @param {Object} _sketch - The sketch object to be used.
   * @param {Boolean} _checkTint - Handles the black or white of keyboard notes.
   * @param {Number} _rowNo - The row number of the cell.
   * @param {Number} _colNo - The column number of the cell.
   * @param {Number} _nosRow - The number of rows in the grid.
   * @param {Number} _nosCol - The number of columns in the grid.
   * @param {Number} _gridX - The x coordinate of the grid.
   * @param {Number} _gridY - The y coordinate of the grid.
   * @param {Number} _gridWidth - The width of the grid.
   * @param {Number} _gridHeight - The height of the grid.
   */
  constructor(
    _sketch, _checkTint, _rowNo, _colNo, _nosRow, _nosCol, _gridX, _gridY,
    _gridWidth, _gridHeight
  ){
    // Workaround for JS context peculiarities.
    // var self = this;
    this.sk = _sketch
    this.checkTint = _checkTint // Handles b/w of keyboard notes.
    this.rowNo = _rowNo
    this.colNo = _colNo
    this.nosRow = _nosRow
    this.nosCol = _nosCol
    this.gridX = _gridX
    this.gridY = _gridY
    this.gridWidth = _gridWidth
    this.gridHeight = _gridHeight
    this.x = this.gridX + this.colNo/this.nosCol*this.gridWidth
    this.y = this.gridY + this.rowNo/this.nosRow*this.gridHeight
    this.w = this.gridWidth/this.nosCol
    this.h = this.gridHeight/this.nosRow
    this.text = ""
    this.type = null
    this.startVal = null
    this.sf = null
    // Possible to return something.
    // return sth;
  }

  /**
   * Adds text to the cell.
   * @param {String} type - The type of text to be added.
   * @param {Number} startVal - The starting value of the text.
   * @param {Number} sf - The scaling factor of the text.
   * @param {Array} mnns - An array of musical note numbers.
   */
  add_text(type, startVal, sf, mnns){
    if (this.type == null){
      this.type = type
    }
    if (this.startVal == null){
      this.startVal = startVal
    }
    if (this.sf == null){
      this.sf = sf
    }
    if (type == "pitch"){
      const mnn = mnns[startVal - this.rowNo]
      this.text = mu.mnn2pitch_simple(mnn)
    }
    else if (type == "ontime"){
      this.text = "" + Math.round(10*parseFloat(sf)*(startVal + this.colNo))/10
    }
    this.sk.textAlign(this.sk.CENTER, this.sk.CENTER)
    this.sk.textSize(10)
    this.sk.noStroke()
    this.sk.fill(50)
    this.sk.text(this.text, this.x + this.w/2, this.y + this.h/2)
  }


  /**
   * Draw the cell based on the given render data and highlight flag.
   * @param {Object} rd - Render data object that contains gridX, gridY,
   * gridWidth, gridHeight, colNo and rowNo.
   * @param {boolean} highlight - Whether to highlight the cell.
   * @param {Array} mnns - Array of MIDI note numbers.
   * @param {number} topMnn - Top MIDI note number.
   */
   draw(rd, highlight, mnns, topMnn){
    if (rd){
      this.gridX = rd.gridX
      this.gridY = rd.gridY
      this.gridWidth = rd.gridWidth
      this.gridHeight = rd.gridHeight
      this.x = this.gridX + this.colNo/this.nosCol*this.gridWidth
      this.y = this.gridY + this.rowNo/this.nosRow*this.gridHeight
      this.w = this.gridWidth/this.nosCol
      this.h = this.gridHeight/this.nosRow
    }
    this.sk.strokeWeight(1)
    this.sk.stroke(50)
    this.sk.rectMode(this.sk.CORNER)
    if (highlight){
      this.sk.fill(190, 250, 190)
    }
    else {
      this.sk.fill(230, 230, 230)
    }
    // this.sk.imageMode(this.sk.CORNER)
    if (this.checkTint){
      const mnn = mnns[topMnn - this.rowNo]
      if ([0, 2, 4, 5, 7, 9, 11].indexOf(mnn % 12) >= 0){
        // White key on piano keyboard.
        this.sk.fill(230, 230, 230, 50)
        // this.sk.tint(255, 80)
      }
      else {
        // Black key on piano keyboard.
        this.sk.fill(90, 90, 90, 50)
        // this.sk.tint(255, 200)
      }
    }
    this.sk.rect(
      this.x + 0.05*this.w, this.y + 0.05*this.h, 0.9*this.w, 0.9*this.h, 10
    )
    // this.sk.image(this.bgnImg, this.x + 2, this.y + 2, 5, this.h - 4)
    // this.sk.image(this.midImg, this.x + 7, this.y + 2, this.w - 14, this.h - 4)
    // this.sk.image(this.endImg, this.x + this.w - 7, this.y + 2, 5, this.h - 4)
    // this.sk.noTint()
  }

  /**
   * Set the background of the cell
   *
   * @param {string} str - The type of background to set. Either "highlight" or anything else.
   */
  set_background(str){
    if (str == "highlight"){
      this.draw(null, true)
    }
    else {
      this.draw()
    }
    this.add_text()
  }
  // set_background(bgnImg, midImg, endImg){
  //   this.bgnImg = bgnImg, this.midImg = midImg, this.endImg = endImg
  //   this.draw()
  //   this.add_text()
  // }

  /**
   * Check if mouse touch is inside the cell.
   * @return {Object} An object containing the row number and column number of the cell if the mouse touch is inside the cell, otherwise undefined.
   */
  touch_check(){
    if (
      this.sk.mouseX > this.x && this.sk.mouseX < this.x + this.w &&
      this.sk.mouseY > this.y && this.sk.mouseY < this.y + this.h
    ){
      // if (prm.printConsoleLogs) { console.log("In cell row " + this.rowNo + ", col " + this.colNo + ".") }
      return { rowNo: this.rowNo, colNo: this.colNo }
    }
  }
}
export default Cell
