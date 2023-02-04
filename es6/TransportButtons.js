export default class TransportButtons extends Buttons {
  constructor(_sketch, _buttonsStruct, _containerDimensions){
    super(_sketch, _buttonsStruct, _containerDimensions)
    // Any extra properties/actions here, which could have been
    // passed into the constructor also...
    // this.subject = subject

  }

  touch_check(theGrid, theSound, theVisual){
    const self = this
    const helperResult = self.touch_check_helper()
    if (!helperResult.click) { return }
    const buttonClick = helperResult.click
    const bidx = helperResult.index

    if (!self.buttonsStruct[self.keys[bidx]].disabled){
      // if (prm.printConsoleLogs) { console.log("self.keys[bidx]:", self.keys[bidx]) }
      switch (self.keys[bidx]){
        case "playPause":
        if (Tone.Transport.state == "started"){
          Tone.Transport.pause()
          self.buttonsStruct["playPause"].set_image(playImg)
        }
        else {
          theSound.schedule_events(compObj, prodObj, theGrid)
          Tone.Transport.start()
          self.buttonsStruct["playPause"].set_image(pauseImg)
        }
        self.keys.forEach(function(k, idx){
          self.buttonsStruct[k].draw()
        })
        break
        case "changeInstr":
        theSound.increment_staff_no()
        theSound.selectedInstr = theSound.instr[theSound.staffNo]
        self.buttonsStruct["changeInstr"].set_image(theSound.iicons[theSound.staffNo])
        theGrid.param.mnns = theGrid.get_mnns(theGrid.param.pcs, instrData[theSound.instrKeys[theSound.staffNo]].range)
        // Alter appearance of cells based on this new range.
        self.keys.forEach(function(k, idx){
          self.buttonsStruct[k].draw()
        })
        break
        case "help":
        theVisual.help.toggle_help()
        if (Tone.Transport.state == "started"){
          Tone.Transport.pause()
          self.buttonsStruct["playPause"].toggle_clicked()
          self.buttonsStruct["playPause"].set_image(playImg)
        }
        theVisual.draw()
        break
        default:
        console.log("SHOULD NOT GET HERE!")
      }


    }
  }

}
