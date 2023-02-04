export default class NavigationButtons extends Buttons {
  constructor(_sketch, _buttonsStruct, _containerDimensions){
    super(_sketch, _buttonsStruct, _containerDimensions)
    // Any extra properties/actions here, which could have been
    // passed into the constructor also...
    // this.subject = subject

  }

  touch_check(theGrid, theSound){
    const self = this
    const helperResult = self.touch_check_helper()
    if (!helperResult.click) { return }
    const buttonClick = helperResult.click
    const bidx = helperResult.index

    if (!self.buttonsStruct[self.keys[bidx]].disabled){
      // if (prm.printConsoleLogs) { console.log("self.keys[bidx]:", self.keys[bidx]) }

      // Remember, these buttons serve a dual purpose (moving the screen and
      // moving selected notes) so differentiate between that here.
      if (theGrid.param.editMode == "cursor"){
        theSound.check_and_implement_edit(compObj, theGrid.inner.selectedOblong.idNote, self.keys[bidx], theGrid.param.gran.value)
      }
      else {
        switch (self.keys[bidx]){
          case "up":
          if (theGrid.param.topMnn == theGrid.param.mnns.length - 2){
            // Can't go any higher after this, because the top row would be
            // above indices of mnns. Disable button.
            self.buttonsStruct["up"].toggle_disabled()
          }
          if (self.buttonsStruct["down"].disabled){
            // Re-enable a previously disabled button.
            self.buttonsStruct["down"].toggle_disabled()
          }
          theGrid.param.topMnn++
          break
          case "down":
          if (theGrid.param.topMnn - theGrid.inner.nosRow == 0){
            // Can't go any lower after this, because the bottom row would be
            // below zeroth index of mnns. Disable button.
            self.buttonsStruct["down"].toggle_disabled()
          }
          if (self.buttonsStruct["up"].disabled){
            // Re-enable a previously disabled button.
            self.buttonsStruct["up"].toggle_disabled()
          }
          theGrid.param.topMnn--
          break
          case "left":
          theGrid.param.leftInt--
          break
          case "right":
          theGrid.param.leftInt++
          break
          default:
          console.log("SHOULD NOT GET HERE!")
        }
        console.log("topMnn from touch_navign_buttons_check:", theGrid.param.topMnn)
        theGrid.inner.oblongs = comp_obj2oblongs(compObj, theGrid.param.leftInt, theGrid.inner.nosCol, theGrid.param.topMnn, theGrid.inner.nosRow, theGrid.param.gran.value)
      }
      // Suppress the toggle for this type of button.
      self.buttonsStruct[self.keys[bidx]].toggle_clicked()
      theGrid.draw()

    }
  }

}
