class GranularityButtons extends Buttons {
  constructor(_sketch, _buttonsStruct, _containerDimensions){
    super(_sketch, _buttonsStruct, _containerDimensions)
    // Any extra properties/actions here, which could have been
    // passed into the constructor also...
    // this.subject = subject

  }

  touch_check(theGrid){
    const self = this
    const helperResult = self.touch_check_helper()
    if (!helperResult.click) { return }
    const buttonClick = helperResult.click
    const bidx = helperResult.index

    if (!self.buttonsStruct[self.keys[bidx]].disabled){
      // if (prm.printConsoleLogs) { console.log("self.keys[bidx]:", self.keys[bidx]) }
      switch (self.keys[bidx]){
        case "granularity":
        console.log("We got to granularity touch!!!")
        theGrid.param.gran.index = (theGrid.param.gran.index + 1) % theGrid.param.gran.options.length
        theGrid.param.gran.value = theGrid.param.gran.options[theGrid.param.gran.index]
        self.buttonsStruct["granularity"].set_image(theGrid.param.gran.img[theGrid.param.gran.index])
        // Suppress the toggle for this type of button.
        self.buttonsStruct[self.keys[bidx]].toggle_clicked()
        self.buttonsStruct[self.keys[bidx]].draw()
        break
        // case "changeInstr":
        // staffNo = (staffNo + 1) % instr.length
        // console.log("staffNo:", staffNo)
        // selectedInstr = instr[staffNo]
        // self.buttonsStruct["changeInstr"].set_image(iicons[staffNo])
        // mnns = get_mnns(pcs, instrData[instrKeys[staffNo]].range)
        // Alter appearance of cells based on this new range.
        break
        default:
        console.log("SHOULD NOT GET HERE!")
      }
      // General draw.
      // self.keys.forEach(function(k, idx){
      //   self.buttonsStruct[k].draw()
      // })

    }
  }

}
export default GranularityButtons
