/**
 * A class that extends the Buttons class and provides extra methods for touch checking in a grid editing context.
 * @extends Buttons
 */

class EditButtons extends Buttons {
  /**
   * Creates a new instance of EditButtons.
   * @param {p5} _sketch - A p5.js sketch instance.
   * @param {Object} _buttonsStruct - An object containing button structure information.
   * @param {Object} _containerDimensions - An object containing dimensions of the container holding the buttons.
   */
  constructor(_sketch, _buttonsStruct, _containerDimensions){
    super(_sketch, _buttonsStruct, _containerDimensions)
    // Any extra properties/actions here, which could have been
    // passed into the constructor also...
    // this.subject = subject

  }

  /**
   * Handles touch checking for EditButtons instances.
   * @param {Grid} theGrid - An instance of the Grid class.
   * @param {NavButtons} navignBtns - An instance of the NavButtons class.
   */
  touch_check(theGrid, navignBtns){
    const self = this
    const helperResult = self.touch_check_helper()
    if (!helperResult.click) { return }
    const buttonClick = helperResult.click
    const bidx = helperResult.index

    // Must be a button click of an enabled button if we're going to do anything
    // else about it.
    if (!self.buttonsStruct[self.keys[bidx]].disabled){
      // Enforce inability to deselect a selected button.
      if (theGrid.param.editMode == self.keys[bidx]){
        self.buttonsStruct[self.keys[bidx]].clicked = true
        self.buttonsStruct[self.keys[bidx]].draw()
      }
      // Enforce mutual exclusivity of the clicked-ness of the edit buttons.
      theGrid.param.prevEditMode = theGrid.param.editMode
      theGrid.param.editMode = self.keys[bidx]
      // console.log("theGrid.param.editMode:", theGrid.param.editMode)
      self.keys.forEach(function(k, idx){
        // console.log("idx:", idx, "bidx:", bidx)
        if (idx !== bidx){
          self.buttonsStruct[k].clicked = false
          self.buttonsStruct[k].draw()
        }
      })

      // If this is cursor/note edit mode, we should highlight a note and the
      // nav buttons.
      if (theGrid.param.editMode == "cursor"){
        // let notes = compObj.notes.filter(function(n){ return n.stampDelete == null })
        if (theGrid.inner.oblongs.length == 0){
          alert("Use the pencil icon to write a note before trying to edit note properties.")
          // Could do extra logic here, or revise above blocks to not allow
          // transition to cursor mode.
          return
        }
        navignBtns.buttonsStruct["right"].toggle_disabled()
        navignBtns.buttonsStruct["left"].toggle_disabled()
        navignBtns.keys.forEach(function(k){
          navignBtns.buttonsStruct[k].toggle_clicked()
        })
        theGrid.inner.selectedOblong = mu.choose_one(theGrid.inner.oblongs)
        theGrid.inner.selectedOblong.toggle_highlight()
      }
      else if (theGrid.param.prevEditMode == "cursor" && theGrid.param.editMode !== "cursor"){
        // Turn off all highlighting.
        if (theGrid.inner.selectedOblong !== undefined || theGrid.inner.selectedOblong !== null){
          theGrid.inner.selectedOblong.toggle_highlight()
        }
        theGrid.inner.selectedOblong = null
        navignBtns.buttonsStruct["right"].toggle_disabled()
        navignBtns.buttonsStruct["left"].toggle_disabled()
        navignBtns.keys.forEach(function(k){
          navignBtns.buttonsStruct[k].toggle_clicked()
        })
      }
      self.draw()
      navignBtns.draw()
      theGrid.draw()
    }
  }

}
export default EditButtons
