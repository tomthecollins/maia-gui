/**
 * Class that represents a help functionality for a sketch.
 */
class Help {
  /**
   * Creates an instance of Help.
   * @param {object} _sketch - The sketch to be used with this help functionality.
   * @param {boolean} _mode - The current mode of this help functionality.
   */
  constructor(_sketch, _mode){
    // Workaround for JS context peculiarities.
    // const self = this
    this.sk = _sketch
    this.mode = _mode
    this.idCurr = "Help home"
    this.displayInfo = [
      {
        "id": "Help home",
        "prev": null,
        "prevNextY": 800,
        "next": "Basic controls",
        "text": "This is a basic sequencer and work in progress. There are some\n bugs and planned feature developments. Press the ? button at any time\n to return to this \"legibility overlay\" and find out more about the\n interface and how it works.\n\n Feedback: contact@musicintelligence.co\n\n This interface was coded by Tom Collins and Christian Coulon.\n\n Press the arrow below for information on how to use the interface."
      },
      {
        "id": "Basic controls",
        "prev": "Help home",
        "prevNextY": 650,
        "next": "Changing a note",
        "text": "There is a play/pause button, as with most music interfaces!\n\n You can edit the default melody as you wish, or upload a MIDI file of\n your own containing a short (four-bar) melody by dragging and dropping\n it in the window.\n\n There are three edit modes (add note, change note, delete note)\n accessed by pressing the pencil (default), cursor, and eraser buttons,\n respectively. You can move up and down the musical scale using the up\n and down arrows. This project considered short melodies only, so the\n left and right arrows are disabled."
      },
      {
        "id": "Changing a note",
        "prev": "Basic controls",
        "prevNextY": 650,
        "next": "Granularity",
        "text": "Musical notes are represented by oblongs in the grid, with\n x-location corresponding to start time, y-location corresponding to\n pitch, and width corresponding to duration.\n\n To change an existing note, press the cursor button to enter the \"change\n note\" edit mode. The up, down, left, and right arrows switch colour\n to indicate that they can be used to move whichever note is highlighted.\n Press different notes to begin changing their properties.\n\n To change a note's duration, press the highlighted note repeatedly.\n It's duration will cycle through several options. See the next section\n to find out how to alter the granularity level at which edits can be made."
      },
      {
        "id": "Granularity",
        "prev": "Changing a note",
        "prevNextY": 450,
        "next": "Automation",
        "text": "The button inbetween the eraser and up arrow can be used to\n alter the granularity level at which edits can be made. A granularity\n of 1 (default) means edits apply at the level of whole cells on the grid;\n a granularity of 1/2 means edits apply at the level of half-cells on the\n grid, and so on."
      },
      {
        "id": "Automation",
        "prev": "Granularity",
        "prevNextY": 450,
        "next": null,
        "text": "There are four automation modes for setting time-varying levels\n (for tempo, loudness, reverb room size, and reverb mix signal), accessed\n by pressing the metronome (default), speaker, echo, and circuit buttons,\n respectively. The levels can be altered by clicking and dragging the\n nodes in the so-called \"envelope editor\" at the bottom of the interface."
      }
    ]

    this.arrowLength = 150
    this.arrowHeadHeight = 20
    this.textArrowGap = 70
    this.prevX = this.sk.width/2 - this.arrowLength - 150
    this.nextX = this.sk.width/2 + this.arrowLength + 150

    // Style
    this.bgColor = 90 // this.sk.color("#999999")
    this.opacity = 215
    this.textColor = 230

    // Possible to return something.
    // return sth;
  }

  /**
   * Draws the help content.
   */
  draw(){
    const self = this
    this.sk.noStroke()
    this.sk.fill(self.bgColor, this.opacity)
    this.sk.rect(0, 0, this.sk.width, this.sk.height)
    // Display text.
    const currInfo = self.displayInfo.find(function(di){
      return di.id === self.idCurr
    })
    const textStr = currInfo["text"]
    // this.sk.strokeWeight(1)
    this.sk.textAlign(this.sk.CENTER, this.sk.TOP)
    this.sk.textSize(28)
    this.sk.fill(self.textColor)
    this.sk.text(textStr, this.sk.width/2, this.sk.height/10)
    // White-ish
    this.sk.strokeWeight(4)
    self.draw_close_button(self.textColor)
    // Purple
    this.sk.strokeWeight(2)
    self.draw_close_button(200, 20, 200)
    if (currInfo.prev !== null){
      // White-ish
      this.sk.strokeWeight(4)
      self.draw_prev_arrow(
        self.prevX,
        currInfo["prevNextY"], self.arrowLength, self.arrowHeadHeight,
        self.textColor
      )
      // Purple
      this.sk.strokeWeight(2)
      self.draw_prev_arrow(
        self.prevX,
        currInfo["prevNextY"], self.arrowLength, self.arrowHeadHeight,
        200, 20, 200
      )
      self.draw_prev_text(
        currInfo["prev"], self.prevX,
        currInfo["prevNextY"] - self.textArrowGap
      )
    }
    if (currInfo.next !== null){
      // White-ish. -/+2s for the shadow/highlight effect.
      this.sk.strokeWeight(4)
      self.draw_next_arrow(
        self.nextX,
        currInfo["prevNextY"], self.arrowLength, self.arrowHeadHeight,
        self.textColor
      )
      // Purple
      this.sk.strokeWeight(2)
      self.draw_next_arrow(
        self.nextX,
        currInfo["prevNextY"], self.arrowLength, self.arrowHeadHeight,
        200, 20, 200
      )
      self.draw_next_text(
        currInfo["next"], self.nextX,
        currInfo["prevNextY"] - self.textArrowGap
      )
    }

  }

  /**
   * Draws the close button in the top-right corner.
   * @param {number} r - The red value of the color of the close button.
   * @param {number} g - The green value of the color of the close button.
   * @param {number} b - The blue value of the color of the close button.
   */
  draw_close_button(r, g, b){
    //  Close button in top-right corner
    if (g == undefined && b == undefined){
      this.sk.stroke(r)
    }
    else {
      this.sk.stroke(r, g, b)
    }
    this.sk.noFill()
    this.sk.ellipseMode(this.sk.CENTER)
    this.sk.ellipse(this.sk.width - 100, 100, 100, 100)
    this.sk.line(this.sk.width - 100 - 35.36, 100 - 35.36, this.sk.width - 100 + 35.36, 100 + 35.36)
    this.sk.line(this.sk.width - 100 - 35.36, 100 + 35.36, this.sk.width - 100 + 35.36, 100 - 35.36)
  }

  draw_next_arrow(x, y, w, h, r, g, b){
    if (g == undefined && b == undefined){
      this.sk.stroke(r)
    }
    else {
      this.sk.stroke(r, g, b)
    }
    this.sk.noFill()
    this.sk.beginShape()
    this.sk.vertex(x - w, y - 5)
    this.sk.vertex(x - 20, y - 5)
    this.sk.vertex(x - 20, y - h/2)
    this.sk.vertex(x, y)
    this.sk.vertex(x - 20, y + h/2)
    this.sk.vertex(x - 20, y + 5)
    this.sk.vertex(x - w, y + 5)
    this.sk.endShape(this.sk.CLOSE)
  }

  draw_next_text(str, x, y){
    this.sk.textAlign(this.sk.RIGHT, this.sk.TOP)
    this.sk.textSize(28)
    this.sk.noStroke()
    this.sk.fill(this.textColor)
    this.sk.text(str, x, y)
  }

  draw_prev_arrow(x, y, w, h, r, g, b){
    if (g == undefined && b == undefined){
      this.sk.stroke(r)
    }
    else {
      this.sk.stroke(r, g, b)
    }
    this.sk.noFill()
    this.sk.beginShape()
    this.sk.vertex(x + w, y - 5)
    this.sk.vertex(x + 20, y - 5)
    this.sk.vertex(x + 20, y - h/2)
    this.sk.vertex(x, y)
    this.sk.vertex(x + 20, y + h/2)
    this.sk.vertex(x + 20, y + 5)
    this.sk.vertex(x + w, y + 5)
    this.sk.endShape(this.sk.CLOSE)
  }

  draw_prev_text(str, x, y){
    this.sk.textAlign(this.sk.LEFT, this.sk.TOP)
    this.sk.textSize(28)
    this.sk.noStroke()
    this.sk.fill(this.textColor)
    this.sk.text(str, x, y)
  }

  link(idStr){
    console.log("idStr:", idStr)
    const idCandidate = this.displayInfo.find(function(di){
      return di.id === idStr
    })
    console.log("idCandidate:", idCandidate)
    if (idCandidate !== undefined){
      this.idCurr = idCandidate.id
      draw_components()
    }
    else {
      console.log("SHOULD NOT GET HERE IN HELP!")
    }
  }

  toggle_help(theVisual){
    this.mode = !this.mode
    theVisual.trans.buttons.buttonsStruct["help"].toggle_clicked()
    theVisual.draw()
  }

  touch_check(theVisual){
    const self = this
    const currInfo = self.displayInfo.find(function(di){
      return di.id === self.idCurr
    })
    if (this.sk.dist(this.sk.mouseX, this.sk.mouseY, self.prevX, currInfo["prevNextY"]) < self.arrowLength){
      console.log("Touch left arrow")
      if (currInfo["prev"] !== null){
        self.link(currInfo["prev"])
      }
    }
    else if (this.sk.dist(this.sk.mouseX, this.sk.mouseY, self.nextX, currInfo["prevNextY"]) < self.arrowLength){
      console.log("Touch right arrow")
      if (currInfo["next"] !== null){
        self.link(currInfo["next"])
      }
    }
    else {
      self.toggle_help(theVisual)
    }
  }

}
export default Help
