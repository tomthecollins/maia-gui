export default class Oblong {
  constructor(
    theSketch, theBgnImg, theMidImg, theEndImg,
    theBeingDrawn, theRowNo, theColNo, theExtraCols = 0, idNote = null,
    gridInner
  ){
    // Workaround for JS context peculiarities.
    // var self = this;
    this.sk = theSketch
    this.bgnImg = theBgnImg
    this.midImg = theMidImg
    this.endImg = theEndImg
    this.beingDrawn = theBeingDrawn
    this.rowNo = theRowNo
    // console.log("this.rowNo:", this.rowNo)
    this.colNo = theColNo
    this.extraCols = theExtraCols
    this.idNote = idNote
    this.x = gridInner.x + this.colNo/gridInner.nosCol*gridInner.width
    this.y = gridInner.y + this.rowNo/gridInner.nosRow*gridInner.height
    this.w = gridInner.width/gridInner.nosCol*(1 + this.extraCols)
    this.h = gridInner.height/gridInner.nosRow
    this.highlight = false
    // Possible to return something.
    // return sth;
  }


  draw(recalculateDimensions, gridInner){
    if (recalculateDimensions){
      this.x = gridInner.x + this.colNo/gridInner.nosCol*gridInner.width
      this.y = gridInner.y + this.rowNo/gridInner.nosRow*gridInner.height
      this.w = gridInner.width/gridInner.nosCol*(1 + this.extraCols)
      this.h = gridInner.height/gridInner.nosRow
    }
    if (this.highlight){
      this.sk.tint(225, 191, 105, 250)
    }
    this.sk.imageMode(this.sk.CORNER)
    this.sk.image(this.bgnImg, this.x, this.y, 20, this.h)
    this.sk.image(this.midImg, this.x + 20, this.y, this.w - 40, this.h)
    this.sk.image(this.endImg, this.x + this.w - 20, this.y, 20, this.h)
    if (this.highlight){
      this.sk.noTint()
    }
  }


  widen(touchType, theGrid, theSound){
    // if (prm.printConsoleLogs) {
    //   console.log("touchType from inside Oblong.resize():", touchType)
    // }
    let self = this;
    if (touchType == "touchMoved" || touchType == "touchEnded"){
      if (this.sk.mouseX > theGrid.inner.x + theGrid.inner.width){
        const extraCols = Math.floor(
          (theGrid.inner.x + theGrid.inner.width - this.x)/(theGrid.inner.width/theGrid.inner.nosCol)
        ) - 1
        // if (prm.printConsoleLogs) { console.log("extraCols from special place:", extraCols) }
        this.extraCols = extraCols
        this.w = theGrid.inner.width/theGrid.inner.nosCol*(1 + this.extraCols)
      }
      else if (this.sk.mouseX > this.x + theGrid.inner.width/theGrid.inner.nosCol){
        // We may need to make the oblong wider.
        const extraCols = Math.floor((this.sk.mouseX - this.x)/(theGrid.inner.width/theGrid.inner.nosCol))
        // if (prm.printConsoleLogs) { console.log("extraCols:", extraCols) }
        // Check whether making the oblong wider will occlude an existing oblong.
        const occlusion = theGrid.inner.oblongs.filter(function(o){
          // if (prm.printConsoleLogs) { console.log("o:", o) }
          // if (prm.printConsoleLogs) { console.log("self:", self) }
          return !o.beingDrawn &&
          // o.rowNo == self.rowNo &&
          o.colNo > self.colNo &&
          o.colNo <= self.colNo + extraCols
        })[0]
        // if (prm.printConsoleLogs) { console.log("occlusion:", occlusion) }
        if (occlusion !== undefined){
          // if (prm.printConsoleLogs) { console.log("GOT TO A DEFINED OCCLUSION!") }
          return;
        }
        if (touchType == "touchMoved"){
          this.w = this.sk.mouseX - this.x
        }
        else if (touchType == "touchEnded"){
          // if (prm.printConsoleLogs) {
          //   console.log("GOT TO SNAP!")
          // }
          this.extraCols = extraCols
          this.w = theGrid.inner.width/theGrid.inner.nosCol*(1 + this.extraCols)
        }
      }
      this.draw()
    }
    if (touchType == "touchEnded"){
      // Update the Composition object.
      let note = {
        "id": uuid(),
        "ontime": parseFloat(theGrid.param.gran.value)*(this.colNo - theGrid.param.leftInt),
        "MNN": theGrid.param.mnns[theGrid.param.topMnn - this.rowNo],
        "duration": parseFloat(theGrid.param.gran.value)*(1 + this.extraCols),
        "velocity": 0.5, // NEEDS THINKING ABOUT!
        "staffNo": theSound.staffNo,
        "voiceNo": 0,
        "oblongEntry": {
          "granularity": theGrid.param.gran.value,
          "colNo": this.colNo
        }
      }
      const bbOn = mu.bar_and_beat_number_of_ontime(
        note.ontime,
        compObj.timeSignatures
      )
      note.barOn = bbOn[0]
      note.beatOn = bbOn[1]
      note.offtime = note.ontime + note.duration
      const bbOff = mu.bar_and_beat_number_of_ontime(
        note.offtime,
        compObj.timeSignatures
      )
      note.barOff = bbOff[0]
      note.beatOff = bbOff[1]
      let fsm
      if (compObj.notes.length > 0){
        fsm = mu.fifth_steps_mode(
          mu.comp_obj2note_point_set(compObj),
          mu.krumhansl_and_kessler_key_profiles
        )
      }
      else {
        fsm = ["C major", 1, 0, 0]
      }
      if (fsm[0] !== compObj.keySignatures[0]){
        compObj.keySignatures = [{
          "barNo": 1,
          "keyName": fsm[0],
          "fifthSteps": fsm[2],
          "mode": fsm[3],
          "staffNo": 0,
          "ontime": 0
        }]
      }
      note.MPN = mu.guess_morphetic(note.MNN, fsm[2], fsm[3])
      note.pitch = mu.midi_note_morphetic_pair2pitch_and_octave(
        note.MNN, note.MPN
      )
      note.stampCreate = Date.now()
      note.stampDelete = null
      compObj.notes.push(note)
      this.idNote = note.id
      theSound.schedule_events(compObj, prodObj, theGrid)
    }
  }


  touch_check(){
    if (
      this.sk.mouseX > this.x && this.sk.mouseX < this.x + this.w &&
      this.sk.mouseY > this.y && this.sk.mouseY < this.y + this.h
    ){
      // if (prm.printConsoleLogs) { console.log("Oblong at row " + this.rowNo + ", col " + this.colNo + ".") }
      return { row: this.rowNo, col: this.colNo }
    }
  }


  toggle_being_drawn(){
    this.beingDrawn = !this.beingDrawn
  }


  toggle_highlight(){
    this.highlight = !this.highlight
  }
}
