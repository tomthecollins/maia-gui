export default class EnvelopeButtons extends Buttons {
  constructor(_sketch, _buttonsStruct, _containerDimensions){
    super(_sketch, _buttonsStruct, _containerDimensions)
    // Any extra properties/actions here, which could have been
    // passed into the constructor also...
    // this.subject = subject

  }

  touch_check(envEd){
    const self = this
    const helperResult = self.touch_check_helper()
    if (!helperResult.click) { return }
    const buttonClick = helperResult.click
    const bidx = helperResult.index

    if (!self.buttonsStruct[self.keys[bidx]].disabled){
      // if (prm.printConsoleLogs) { console.log("self.keys[bidx]:", self.keys[bidx]) }

      // Enforce inability to deselect a selected env button.
      if (envEd.mode == self.keys[bidx]){
        self.buttonsStruct[self.keys[bidx]].clicked = true
        self.buttonsStruct[self.keys[bidx]].draw()
      }
      // Enforce mutual exclusivity of the clicked-ness of the env buttons.
      envEd.prevMode = envEd.mode
      console.log("self.keys[bidx]:", self.keys[bidx])
      envEd.mode = self.keys[bidx]
      envEd.envelope.load(envEd.mode)
      self.keys.forEach(function(k, idx){
        if (idx !== bidx){
          self.buttonsStruct[k].clicked = false
          // self.buttonsStruct[k].draw() // About to call draw_components() anyway...
        }
      })
      self.draw()
      envEd.envelope.draw()
    }
  }

}
