// import mu from "maia-util"

export default class Cell {
  constructor(
    theSketch, theCheckTint, theRowNo, theColNo, theNosRow, theNosCol,
    theGridX, theGridY, theGridWidth, theGridHeight
  ){
    // Workaround for JS context peculiarities.
    // var self = this;
    this.sk = theSketch
    this.checkTint = theCheckTint // Handles b/w of keyboard notes.
    this.rowNo = theRowNo
    this.colNo = theColNo
    this.nosRow = theNosRow
    this.nosCol = theNosCol
    this.gridX = theGridX
    this.gridY = theGridY
    this.gridWidth = theGridWidth
    this.gridHeight = theGridHeight
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
