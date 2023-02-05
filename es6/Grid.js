/**
 * Class representing the grid in the melEd.
 * @class
 */
class Grid {
  /**
   * Creates a Grid.
   * @param {p5} _sketch - The p5.js sketch.
   * @param {Object} param - Object containing parameters.
   * @param {Object} melEd - The melEd object.
   */
  constructor(_sketch, param, melEd){
    this.sk = _sketch
    // Handle grid and inner grid.
    this.x = param.grid.x || melEd.x
    this.y = param.grid.y || melEd.y + 1.25/10*melEd.height
    this.width = param.grid.width || melEd.width
    this.height = param.grid.height || 5/10*melEd.height

    // Inner grid
    this.inner = {} // param.grid.inner
    this.inner.nosRow = param.grid.inner.nosRow || 25
    this.inner.nosCol = param.grid.inner.nosCol || 16
    this.inner.x = param.grid.inner.x || this.x + this.width/(this.inner.nosCol + 2)
    this.inner.y = param.grid.inner.y || this.y + this.height/(this.inner.nosRow + 2)
    this.inner.width = param.grid.inner.width || this.width - 2*(this.inner.x - this.x)
    this.inner.height = param.grid.inner.height || this.height - 2*(this.inner.y - this.y)
    this.inner.cells = param.grid.inner.cells || []
    // this.inner.oblongs = param.grid.inner.oblongs || [] // Defined below.
    this.inner.selectedOblong = param.grid.inner.selectedOblong || null
    this.inner.oblongImg = param.grid.inner.oblongImg || []
    this.inner.oblongImgName = param.grid.inner.oblongImgName || ["obBgn.png", "obMid.png", "obEnd.png"]
    this.inner.currBackImg = null
    this.inner.backImg = param.grid.inner.backImg || []
    this.inner.backImgName = param.grid.inner.backImgName || []

    // Outer grids
    this.outer = { "left": {}, "top": {}, "right": {}, "bottom": {} }
    this.outer.left.x = (param.grid.outer && param.grid.outer.left && param.grid.outer.left.x) || this.x
    this.outer.left.y = (param.grid.outer && param.grid.outer.left && param.grid.outer.left.y) || this.inner.y
    this.outer.left.width = (param.grid.outer && param.grid.outer.left && param.grid.outer.left.width) || this.width/(this.inner.nosCol + 2)
    this.outer.left.height = (param.grid.outer && param.grid.outer.left && param.grid.outer.left.height) || this.inner.height
    this.outer.left.cells = (param.grid.outer && param.grid.outer.left && param.grid.outer.left.cells) || []
    // Positioning of top outer grid
    this.outer.top.x = (param.grid.outer && param.grid.outer.top && param.grid.outer.top.x) || this.inner.x
    this.outer.top.y = (param.grid.outer && param.grid.outer.top && param.grid.outer.top.y) || this.y
    this.outer.top.width = (param.grid.outer && param.grid.outer.top && param.grid.outer.top.width) || this.inner.width
    this.outer.top.height = (param.grid.outer && param.grid.outer.top && param.grid.outer.top.height) || this.height/(this.inner.nosRow + 2)
    this.outer.top.cells = (param.grid.outer && param.grid.outer.top && param.grid.outer.top.cells) || []
    // Positioning of right outer grid
    this.outer.right.x = (param.grid.outer && param.grid.outer.right && param.grid.outer.right.x) || this.inner.x + this.inner.width
    this.outer.right.y = (param.grid.outer && param.grid.outer.right && param.grid.outer.right.y) || this.inner.y
    this.outer.right.width = (param.grid.outer && param.grid.outer.right && param.grid.outer.right.width) || this.width/(this.inner.nosCol + 2)
    this.outer.right.height = (param.grid.outer && param.grid.outer.right && param.grid.outer.right.height) || this.inner.height
    this.outer.right.cells = (param.grid.outer && param.grid.outer.right && param.grid.outer.right.cells) || []
    // Positioning of bottom outer grid
    this.outer.bottom.x = (param.grid.outer && param.grid.outer.bottom && param.grid.outer.bottom.x) || this.inner.x
    this.outer.bottom.y = (param.grid.outer && param.grid.outer.bottom && param.grid.outer.bottom.y) || this.inner.y + this.inner.height
    this.outer.bottom.width = (param.grid.outer && param.grid.outer.bottom && param.grid.outer.bottom.width) || this.inner.width
    this.outer.bottom.height = (param.grid.outer && param.grid.outer.bottom && param.grid.outer.bottom.height) || this.height/(this.inner.nosRow + 2)
    this.outer.bottom.cells = (param.grid.outer && param.grid.outer.bottom && param.grid.outer.bottom.cells) || []

    this.param = {}
    this.param.prevEditMode = (param.grid.param && param.grid.param.prevEditMode) || null
    this.param.editMode = (param.grid.param && param.grid.param.editMode) || "pencil"
    this.param.cursorType = (param.grid.param && param.grid.param.cursorType) || "arrow"
    this.param.leftInt = (param.grid.param && param.grid.param.leftInt) || 0
    this.param.pHeadInt = (param.grid.param && param.grid.param.pHeadInt) || 0 // Obsolete?
    // this.param.topMnn = (param.grid.param && param.grid.param.topMnn) || 30
    this.param.pcs = (param.grid.param && param.grid.param.pcs) || [0, 2, 4, 5, 7, 9]
    this.param.mnns = this.get_mnns(this.param.pcs, param.range)
    this.param.topMnn = this.param.mnns.length - 1
    console.log("this.param.mnns:", this.param.mnns)
    this.param.gran = param.gran

    this.inner.oblongs = this.comp_obj2oblongs(compObj)
    console.log("this.inner.oblongs:", this.inner.oblongs)
    // this.cycle_logos()

    // Construct inner grid.
    for (let i = 0; i < this.inner.nosRow; i++){
      this.inner.cells[i] = []
      for (let j = 0; j < this.inner.nosCol; j++){
        this.inner.cells[i][j] = new Cell(
          this.sk, true, i, j, this.inner.nosRow, this.inner.nosCol,
          this.inner.x, this.inner.y, this.inner.width, this.inner.height
        )
      }
    }
    // Construct outer grids.
    for (let i = 0; i < this.inner.nosRow; i++){
      if (i == 0){
        if (this.param.printConsoleLogs) { console.log("this.outer.left.x:", this.outer.left.x) }
      }
      this.outer.left.cells[i] = new Cell(
        this.sk, false, i, 0, this.inner.nosRow, 1,
        this.outer.left.x, this.outer.left.y, this.outer.left.width, this.outer.left.height
      )
      this.outer.right.cells[i] = new Cell(
        this.sk, false, i, 0, this.inner.nosRow, 1,
        this.outer.right.x, this.outer.right.y, this.outer.right.width, this.outer.right.height
      )
    }
    for (let j = 0; j < this.inner.nosCol; j++){
      this.outer.top.cells[j] = new Cell(
        this.sk, false, 0, j, 1, this.inner.nosCol,
        this.outer.top.x, this.outer.top.y, this.outer.top.width, this.outer.top.height
      )
      this.outer.bottom.cells[j] = new Cell(
        this.sk, false, 0, j, 1, this.inner.nosCol,
        this.outer.bottom.x, this.outer.bottom.y, this.outer.bottom.width, this.outer.bottom.height
      )
    }

  }

  /**
   * Creates an array of oblongs for the given component.
   * @param {Object} c - The Composition object for which to create the array of
   * oblongs.
   * @returns {Array} oblongs - The array of oblongs for the given component.
   */
  comp_obj2oblongs(c){
    const self = this
    // Dissociated granularity and zoom, so forcing this to 1 for now.
    // const gFloat = 1
    const gFloat = self.string_fraction2decimal(self.param.gran.value)
    if (self.param.printConsoleLogs){
      console.log(
        "gFloat*(self.param.leftInt + self.inner.nosCol:",
        gFloat*(self.param.leftInt + self.inner.nosCol)
      )
    }
    if (self.param.printConsoleLogs) {
      console.log("c.notes before filtering:", c.notes)
    }
    console.log("self.param.topMnn:", self.param.topMnn)
    console.log("self.inner.nosRow:", self.inner.nosRow)
    console.log("mnns[t]:", self.param.mnns[self.param.topMnn])
    console.log("mnns[t - nrow]:", self.param.mnns[self.param.topMnn - self.inner.nosRow + 1])
    const notes = c.notes.filter(function(n){
      return n.stampDelete == null &&
      n.ontime < gFloat*(self.param.leftInt + self.inner.nosCol) &&
      n.ontime + n.duration > gFloat*self.param.leftInt &&
      self.param.mnns.indexOf(n.MNN) >= 0 &&
      n.MNN <= self.param.mnns[self.param.topMnn] &&
      n.MNN >= self.param.mnns[self.param.topMnn - self.inner.nosRow + 1]
      // n.MNN <= t && n.MNN >= t - nrow
    })
    // if (prm.printConsoleLogs){
      console.log("notes:", notes)
    // }
    let oblongs = notes.map(function(n){
      return new Oblong(
        self.sk, self.inner.oblongImg[0], self.inner.oblongImg[1],
        self.inner.oblongImg[2], false,
        self.param.topMnn - self.param.mnns.indexOf(n.MNN),
        n.ontime/gFloat - self.param.leftInt,
        // Math.round(n.ontime/gFloat - l),
        n.duration/gFloat - self.param.leftInt - 1,
        // Math.round((n.ontime + n.duration)/gFloat - l - 1),
        n.id, self.inner
      )
    })
    if (self.inner.selectedOblong !== null){
      console.log("self.inner.selectedOblong.idNote:", self.inner.selectedOblong.idNote)
      let idxHighlight = notes.findIndex(function(n){
        return n.id == self.inner.selectedOblong.idNote
      })
      console.log("idxHighlight:", idxHighlight)
      if (idxHighlight >= 0){
        oblongs[idxHighlight].highlight = true
      }
    }
    return oblongs

  }

  /**
   * Cycles through logos in the inner object every 5 seconds.
   * @param {Visual} _visual - The {@link Visual} class instance.
   */
  cycle_logos(_visual){
    const self = this
    setInterval(function(){
      self.inner.currBackImg = mu.choose_one(self.inner.backImg)
      _visual.draw()
    }, 5000)
  }

  /**
   * Draws the grid.
   * @param {Boolean} recalculateDimensions - Whether to recalculate the dimensions.
   */
  draw(recalculateDimensions){
    const self = this
    const gFloat = self.string_fraction2decimal(self.param.gran.value)
    self.sk.fill(255)
    self.sk.noStroke()
    self.sk.rectMode(self.sk.CORNER)
    self.sk.rect(this.x, this.y, this.width, this.height)

    // Logo behind the cells.
    if (self.inner.currBackImg !== null){
      self.sk.imageMode(self.sk.CENTER)
      self.sk.tint(255, 50)
      let imgHeight = 280
      let imgWidth = self.inner.currBackImg.width*280/self.inner.currBackImg.height
      if (imgWidth > 600){
        imgWidth = 600
        imgHeight = self.inner.currBackImg.height*imgWidth/self.inner.currBackImg.width
      }
      self.sk.image(
        self.inner.currBackImg, self.inner.x + self.inner.width/2,
        self.inner.y + self.inner.height/2, imgWidth, imgHeight)
      self.sk.noTint()
    }


    // Draw inner grid.
    for (let i = 0; i < self.inner.nosRow; i++){
      for (let j = 0; j < self.inner.nosCol; j++){
        if (recalculateDimensions){
          self.inner.cells[i][j].draw({
            "gridX": self.inner.x,
            "gridY": self.inner.y,
            "gridWidth": self.inner.width,
            "gridHeight": self.inner.height
          }, false, self.param.mnns, self.param.topMnn)
        }
        else {
          self.inner.cells[i][j].draw(null, false, self.param.mnns, self.param.topMnn)
        }
      }
    }
    // Draw outer grids.
    self.outer.left.cells.forEach(function(c){
      c.draw({
        "gridX": self.outer.left.x,
        "gridY": self.outer.left.y,
        "gridWidth": self.outer.left.width,
        "gridHeight": self.outer.left.height
      })
      c.add_text("pitch", self.param.topMnn, null, self.param.mnns)
    })
    self.outer.top.cells.forEach(function(c){
      c.draw({
        "gridX": self.outer.top.x,
        "gridY": self.outer.top.y,
        "gridWidth": self.outer.top.width,
        "gridHeight": self.outer.top.height
      })
      c.add_text("ontime", self.param.leftInt, gFloat)
    })
    self.outer.right.cells.forEach(function(c){
      c.draw({
        "gridX": self.outer.right.x,
        "gridY": self.outer.right.y,
        "gridWidth": self.outer.right.width,
        "gridHeight": self.outer.right.height
      })
      c.add_text("pitch", self.param.topMnn, null, self.param.mnns)
    })
    self.outer.bottom.cells.forEach(function(c){
      c.draw({
        "gridX": self.outer.bottom.x,
        "gridY": self.outer.bottom.y,
        "gridWidth": self.outer.bottom.width,
        "gridHeight": self.outer.bottom.height
      })
      c.add_text("ontime", self.param.leftInt, gFloat)
    })
    // Draw oblongs.
    self.sk.imageMode(self.sk.CORNER)
    self.inner.oblongs.forEach(function(o){
      o.draw(recalculateDimensions, self.inner)
    })
  }

  /**
   * Gets MIDI note numbers within the given range, given the array of pitch classes.
   * @param {Array} pitchClasses - The array of pitch classes.
   * @param {Array} mnnRange - The range of MIDI note numbers.
   * @returns {Array} allMnns - The array of MIDI note numbers.
   */
  get_mnns(pitchClasses, mnnRange){
    // console.log("pitchClasses:", pitchClasses)
    // console.log("mnnRange:", mnnRange)
    const minMod12 = mnnRange[0] % 12
    // console.log("minMod12:", minMod12)
    // Find appropriate beginning MIDI note number, given the pitch classes
    // we're working with.
    let ipc = 0
    while (ipc < pitchClasses.length && minMod12 > pitchClasses[ipc]){
      ipc++
    }
    console.log("ipc:", ipc)
    // Find appropriate ending MIDI note number, given the pitch classes we're
    // working with.
    const maxMod12 = mnnRange[1] % 12
    let jpc = 0
    while (jpc < pitchClasses.length && maxMod12 > pitchClasses[jpc]){
      jpc++
    }
    console.log("jpc:", jpc)
    // Generate the MIDI note numbers.
    let allMnns = [mnnRange[0]]
    let imnn = 0
    let octaveIncrement = Math.floor(mnnRange[0]/12)
    while (allMnns[imnn] < mnnRange[1]){
      ipc++, imnn++
      if (ipc == pitchClasses.length){
        ipc = 0
        octaveIncrement++
      }
      allMnns.push(12*octaveIncrement + pitchClasses[ipc])
    }
    // console.log("allMnns:", allMnns)
    return allMnns
  }

  /**
   * Checks for touch events.
   * @param {String} touchType - The type of touch event.
   * @param {Sonic} sonic - The {@link Sonic} class instance.
   */
  touch_check(touchType, _sonic){
    const self = this
    // Check if a select submenu is showing?
    switch (touchType){
      case "touchStarted":
      // Check if the touch is outside the grid.
      // 9.3.2020. I think it might be better to replace this with innerGrid...
      if (
        self.sk.mouseX < self.x || self.sk.mouseX > self.x + self.width ||
        self.sk.mouseY < self.y || self.sk.mouseY > self.y + self.height
      ){
        return
      }

      // Move on to checking the grid.
      let rowCol
      if (self.param.editMode == "pencil"){
        // Check inner grid cells.
        let i = 0
        while (i < self.inner.nosRow && rowCol == undefined){
          let j = 0
          while (j < self.inner.nosCol && rowCol == undefined){
            rowCol = self.inner.cells[i][j].touch_check()
            j++
          }
          i++
        }
        // console.log("rowCol:", rowCol)
        // Check to avoid introducing polyphony.
        const polyphony = self.inner.oblongs.find(function(o){
          return rowCol.colNo >= o.colNo &&
          rowCol.colNo <= o.colNo + o.extraCols
        })
        // Check to avoid drawing a duplicate.
        const duplicate = self.inner.oblongs.find(function(o){
          return o.rowNo == rowCol.rowNo &&
          o.colNo == rowCol.colNo
        })
        if (
          rowCol !== undefined &&
          duplicate == undefined &&
          polyphony == undefined
        ){
          let oblong = new Oblong(
            self.sk, self.inner.oblongImg[0], self.inner.oblongImg[1],
            self.inner.oblongImg[2], true, rowCol.rowNo, rowCol.colNo,
            null, null, self.inner
          )
          oblong.draw()
          self.inner.oblongs.push(oblong);
        }
      }
      break
      case "touchMoved":
      if (self.param.editMode == "pencil"){
        // Get the oblong that's being drawn.
        const oblong = self.inner.oblongs.find(function(o){
          return o.beingDrawn
        })
        // console.log("oblong:", oblong)
        if (oblong !== undefined){
          oblong.widen(touchType, self, _sonic)
        }
      }
      break
      case "touchEnded":
      if (self.param.editMode == "pencil"){
        // Get the oblong that's being drawn.
        const oblong = self.inner.oblongs.find(function(o){ return o.beingDrawn })
        // console.log("oblong:", oblong)
        if (oblong !== undefined){
          oblong.widen(touchType, self, _sonic)
          oblong.toggle_being_drawn()
        }
      }
      else if (self.param.editMode == "rubber"){
        if (
          self.sk.mouseX < self.inner.x || self.sk.mouseX > self.inner.x + self.inner.width ||
          self.sk.mouseY < self.inner.y || self.sk.mouseY > self.inner.y + self.inner.height
        ){
          return
        }
        // Check oblongs.
        const relIdx = self.inner.oblongs.findIndex(function(o){
          return o.touch_check()
        })
        // console.log("relIdx:", relIdx)
        if (relIdx >= 0){
          // console.log("self.inner.oblongs[relIdx]:", self.inner.oblongs[relIdx])
          // Alter stampDelete of associated note and remove oblong.
          let relNote = compObj.notes.find(function(n){
            return n.id == self.inner.oblongs[relIdx].idNote
          })
          if (relNote !== undefined){
            relNote.stampDelete = Date.now()
          }
          else {
            console.log("Shouldn't get here, but I have noticed it happen for oblongs created during playback, when the snap doesn't seem to resolve.")
          }
          self.inner.oblongs.splice(relIdx, 1)
          // Redraw. Could be constrained to redrawing a single row...
          self.draw()
          _sonic.schedule_events(compObj, prodObj, self)
        }


      }
      else if (self.param.editMode == "cursor"){
        if (
          self.sk.mouseX < self.inner.x || self.sk.mouseX > self.inner.x + self.inner.width ||
          self.sk.mouseY < self.inner.y || self.sk.mouseY > self.inner.y + self.inner.height
        ){
          return
        }
        // Check oblongs.
        const relIdx = self.inner.oblongs.findIndex(function(o){
          return o.touch_check()
        })
        console.log("relIdx from cursor editing:", relIdx)
        if (relIdx >= 0){
          if (self.inner.selectedOblong.idNote == self.inner.oblongs[relIdx].idNote){
            // Clicked on the already-highlighted oblong. Change it's duration.
            _sonic.check_and_implement_edit(compObj, "shorten", self)
          }
          else {
            // Change which oblong is highlighted.
            if (self.inner.selectedOblong !== null){
              self.inner.selectedOblong.toggle_highlight()
            }
            self.inner.selectedOblong = self.inner.oblongs[relIdx]
            self.inner.selectedOblong.toggle_highlight()
          }
          self.draw()
          // draw_components()
        }
      }
      break
      default:
      console.log("Shouldn't get to default in this switch!")
    }

  }

  /**
   * Converts a string fraction to a decimal.
   * @param {String} str - The string fraction.
   * @returns {Number} ans - The decimal representation of the string fraction.
   */
  string_fraction2decimal(str){
    let ans
    if (str.indexOf("/") >= 0){
      let split = str.split("/")
      ans = split[0]/split[1]
    }
    else {
      ans = parseInt(str)
    }
    return ans
  }


}
export default Grid
