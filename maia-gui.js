var mg = (function () {
  'use strict';

  /**
   * Class representing a button
   * @class
   */
  class Button {
    /**
     * Creates a button
     * @param {p5} _sketch - The p5 sketch
     * @param {p5.Image} _labelImg - The image for the button label
     * @param {Boolean} _disabled - Flag for whether the button is disabled
     * @param {Boolean} _clicked - Flag for whether the button is clicked
     * @param {Number} _x - The x-coordinate for the button's position
     * @param {Number} _y - The y-coordinate for the button's position
     * @param {Number} _width - The width of the button
     * @param {Number} _height - The height of the button
     */
     constructor(
      _sketch, _labelImg, _disabled, _clicked, _x, _y, _width, _height
    ){
      // Workaround for JS context peculiarities.
      // var self = this;
      this.sk = _sketch;
      this.labelImg = _labelImg;
      // this.label = theLabel
      this.disabled = _disabled;
      this.clicked = _clicked;
      this.x = _x;
      this.y = _y;
      this.w = _width;
      this.h = _height;
      this.buttonStroke = this.sk.color("#17baef");
      this.buttonFill = this.sk.color("#074f66");
      // this.labelFill = this.sk.color(225)
      this.buttonStrokeClicked = this.sk.color("#eebf3f");
      this.buttonFillClicked = this.sk.color("#eebf3f");
      // this.labelFillClicked = this.sk.color(225)
      this.buttonStrokeDisabled = this.sk.color("#999999");
      this.buttonFillDisabled = this.sk.color("#cccccc");
      // this.labelFillDisabled = this.sk.color(225)

      // Possible to return something.
      // return sth;
    }

    draw(newX){
      if (newX !== undefined){
        this.x = newX;
      }
      this.sk.ellipseMode(this.sk.CORNER);
      // this.sk.rectMode(this.sk.CORNER)
      if (this.disabled){
        this.sk.stroke(this.buttonStrokeDisabled);
        this.sk.fill(this.buttonFillDisabled);
      }
      else {
        if (this.clicked){
          this.sk.stroke(this.buttonStrokeClicked);
          this.sk.fill(this.buttonFillClicked);
        }
        else {
          this.sk.stroke(this.buttonStroke);
          this.sk.fill(this.buttonFill);
        }
      }
      this.sk.ellipse(this.x, this.y, this.w, this.h);
      // this.sk.rect(this.x, this.y, this.w, this.h)
      this.sk.imageMode(this.sk.CENTER);
      this.sk.image(
        this.labelImg, this.x + this.w/2, this.y + this.h/2, 0.5*this.h,
        0.5*this.h
      );
    }

    onclick(){
      if (this.disabled){
        return
      }
      // if (prm.printConsoleLogs) { console.log("Button \"" + this.label + "\" has been clicked!") }
      this.toggle_clicked();
      this.draw();
    }

    set_image(anImg){
      this.labelImg = anImg;
    }

    toggle_clicked(){
      this.clicked = !this.clicked;
    }

    toggle_disabled(){
      this.disabled = !this.disabled;
    }

    touch_check(){
      if (
        this.sk.mouseX > this.x && this.sk.mouseX < this.x + this.w &&
        this.sk.mouseY > this.y && this.sk.mouseY < this.y + this.h
      ){
        // if (prm.printConsoleLogs) {
          console.log("GOT TO A TOUCH CHECK IN BUTTON!");
        // }
        this.onclick();
        return true
      }
      return false
    }

  }

  /**
   * Class representing the Buttons.
   * @class
   */
  class Buttons {
    /**
     * Creates an instance of Buttons.
     * @constructor
     * @param {p5} _sketch - The p5 instance.
     * @param {Object} _buttonsStruct - The buttons structure object.
     * @param {Object} _containerDimensions - The container dimensions object.
     */
     constructor(_sketch, _buttonsStruct, _containerDimensions){
      this.sk = _sketch;
      this.buttonsStruct = _buttonsStruct;
      this.keys = Object.keys(this.buttonsStruct);
      this.x = _containerDimensions.x;
      this.y = _containerDimensions.y;
      this.w = _containerDimensions.width;
      this.h = _containerDimensions.height;
    }

    /**
     * Draws the buttons on the sketch.
     */
    draw(){
      const self = this;
      self.keys.forEach(function(k, idx){
        self.buttonsStruct[k].draw(self.buttonsStruct[k].x);
      });
    }

    /**
     * Helper function for touch_check() method in Buttons class.
     * Determines if a button has been clicked and which one it is.
     *
     * @return {object} Object with "click" and "index" properties indicating if
     * a button has been clicked and which button was clicked, respectively.
     * "click" is a boolean and "index" is an integer.
     */
    touch_check_helper(){
      let self = this;
      // Check general area.
      // Currently removed any possibility of select menus.
      if (
        this.sk.mouseX < self.x || this.sk.mouseX > self.x + self.w ||
        this.sk.mouseY < self.y || this.sk.mouseY > self.y + self.h
      ){
        return { "click": false, "index": -1 }
      }

      // Move on to checking individual buttons.
      let buttonClick = false;
      let bidx = 0;
      while (bidx < self.keys.length && !buttonClick){
        // console.log("GOT INSIDE WHILE!")
        buttonClick = self.buttonsStruct[self.keys[bidx]].touch_check();
        if (buttonClick){
          return { "click": true, "index": bidx }
        }
        bidx++;
      }
      return { "click": false, "index": -1 }
    }

  }

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
      super(_sketch, _buttonsStruct, _containerDimensions);
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
      const self = this;
      const helperResult = self.touch_check_helper();
      if (!helperResult.click) { return }
      const buttonClick = helperResult.click;
      const bidx = helperResult.index;

      // Must be a button click of an enabled button if we're going to do anything
      // else about it.
      if (!self.buttonsStruct[self.keys[bidx]].disabled){
        // Enforce inability to deselect a selected button.
        if (theGrid.param.editMode == self.keys[bidx]){
          self.buttonsStruct[self.keys[bidx]].clicked = true;
          self.buttonsStruct[self.keys[bidx]].draw();
        }
        // Enforce mutual exclusivity of the clicked-ness of the edit buttons.
        theGrid.param.prevEditMode = theGrid.param.editMode;
        theGrid.param.editMode = self.keys[bidx];
        // console.log("theGrid.param.editMode:", theGrid.param.editMode)
        self.keys.forEach(function(k, idx){
          // console.log("idx:", idx, "bidx:", bidx)
          if (idx !== bidx){
            self.buttonsStruct[k].clicked = false;
            self.buttonsStruct[k].draw();
          }
        });

        // If this is cursor/note edit mode, we should highlight a note and the
        // nav buttons.
        if (theGrid.param.editMode == "cursor"){
          // let notes = compObj.notes.filter(function(n){ return n.stampDelete == null })
          if (theGrid.inner.oblongs.length == 0){
            alert("Use the pencil icon to write a note before trying to edit note properties.");
            // Could do extra logic here, or revise above blocks to not allow
            // transition to cursor mode.
            return
          }
          navignBtns.buttonsStruct["right"].toggle_disabled();
          navignBtns.buttonsStruct["left"].toggle_disabled();
          navignBtns.keys.forEach(function(k){
            navignBtns.buttonsStruct[k].toggle_clicked();
          });
          theGrid.inner.selectedOblong = mu.choose_one(theGrid.inner.oblongs);
          theGrid.inner.selectedOblong.toggle_highlight();
        }
        else if (theGrid.param.prevEditMode == "cursor" && theGrid.param.editMode !== "cursor"){
          // Turn off all highlighting.
          if (theGrid.inner.selectedOblong !== undefined || theGrid.inner.selectedOblong !== null){
            theGrid.inner.selectedOblong.toggle_highlight();
          }
          theGrid.inner.selectedOblong = null;
          navignBtns.buttonsStruct["right"].toggle_disabled();
          navignBtns.buttonsStruct["left"].toggle_disabled();
          navignBtns.keys.forEach(function(k){
            navignBtns.buttonsStruct[k].toggle_clicked();
          });
        }
        self.draw();
        navignBtns.draw();
        theGrid.draw();
      }
    }

  }

  class TransportButtons extends Buttons {
    constructor(_sketch, _buttonsStruct, _containerDimensions){
      super(_sketch, _buttonsStruct, _containerDimensions);
      // Any extra properties/actions here, which could have been
      // passed into the constructor also...
      // this.subject = subject

    }

    touch_check(theGrid, theSound, theVisual){
      const self = this;
      const helperResult = self.touch_check_helper();
      if (!helperResult.click) { return }
      const buttonClick = helperResult.click;
      const bidx = helperResult.index;

      if (!self.buttonsStruct[self.keys[bidx]].disabled){
        // if (prm.printConsoleLogs) { console.log("self.keys[bidx]:", self.keys[bidx]) }
        switch (self.keys[bidx]){
          case "playPause":
          console.log("theVisual.trans:", theVisual.trans);
          if (Tone.Transport.state == "started"){
            Tone.Transport.pause();
            self.buttonsStruct["playPause"].set_image(
              theVisual.trans.img[1][1]
            );
          }
          else {
            theSound.schedule_events(compObj, prodObj, theGrid);
            Tone.Transport.start();
            self.buttonsStruct["playPause"].set_image(
              theVisual.trans.img[1][0]
            );
          }
          self.keys.forEach(function(k, idx){
            self.buttonsStruct[k].draw();
          });
          break
          case "changeInstr":
          theSound.increment_staff_no();
          theSound.selectedInstr = theSound.instr[theSound.staffNo];
          self.buttonsStruct["changeInstr"].set_image(theSound.iicons[theSound.staffNo]);
          theGrid.param.mnns = theGrid.get_mnns(theGrid.param.pcs, instrData[theSound.instrKeys[theSound.staffNo]].range);
          // Alter appearance of cells based on this new range.
          self.keys.forEach(function(k, idx){
            self.buttonsStruct[k].draw();
          });
          break
          case "help":
          theVisual.help.toggle_help();
          if (Tone.Transport.state == "started"){
            Tone.Transport.pause();
            self.buttonsStruct["playPause"].toggle_clicked();
            self.buttonsStruct["playPause"].set_image(
              theVisual.trans.img[1][1]
            );
          }
          theVisual.draw();
          break
          default:
          console.log("SHOULD NOT GET HERE!");
        }


      }
    }

  }

  /**
   * Class representing GranularityButtons.
   * @extends Buttons
   */
  class GranularityButtons extends Buttons {
    /**
     * Create a GranularityButtons.
     * @param {Object} _sketch - p5.js sketch object.
     * @param {Object} _buttonsStruct - Object containing button properties.
     * @param {Object} _containerDimensions - Object containing button container dimensions.
     */
    constructor(_sketch, _buttonsStruct, _containerDimensions) {
      super(_sketch, _buttonsStruct, _containerDimensions);
      // Any extra properties/actions here, which could have been
      // passed into the constructor also...
      // this.subject = subject
    }

    /**
     * Check if the button is touched and update the granularity value.
     * @param {Object} theGrid - Object containing grid properties.
     */
    touch_check(theGrid) {
      const self = this;
      const helperResult = self.touch_check_helper();
      if (!helperResult.click) { return }
      const buttonClick = helperResult.click;
      const bidx = helperResult.index;

      if (!self.buttonsStruct[self.keys[bidx]].disabled){
        // if (prm.printConsoleLogs) { console.log("self.keys[bidx]:", self.keys[bidx]) }
        switch (self.keys[bidx]){
          case "granularity":
          console.log("We got to granularity touch!!!");
          theGrid.param.gran.index = (theGrid.param.gran.index + 1) % theGrid.param.gran.options.length;
          theGrid.param.gran.value = theGrid.param.gran.options[theGrid.param.gran.index];
          self.buttonsStruct["granularity"].set_image(theGrid.param.gran.img[theGrid.param.gran.index]);
          // Suppress the toggle for this type of button.
          self.buttonsStruct[self.keys[bidx]].toggle_clicked();
          self.buttonsStruct[self.keys[bidx]].draw();
          break
          default:
          console.log("SHOULD NOT GET HERE!");
        }
        // General draw.
        // self.keys.forEach(function(k, idx){
        //   self.buttonsStruct[k].draw()
        // })

      }
    }
  }

  class NavigationButtons extends Buttons {
    constructor(_sketch, _buttonsStruct, _containerDimensions){
      super(_sketch, _buttonsStruct, _containerDimensions);
      // Any extra properties/actions here, which could have been
      // passed into the constructor also...
      // this.subject = subject

    }

    touch_check(theGrid, theSound){
      const self = this;
      const helperResult = self.touch_check_helper();
      if (!helperResult.click) { return }
      const buttonClick = helperResult.click;
      const bidx = helperResult.index;

      if (!self.buttonsStruct[self.keys[bidx]].disabled){
        // if (prm.printConsoleLogs) { console.log("self.keys[bidx]:", self.keys[bidx]) }

        // Remember, these buttons serve a dual purpose (moving the screen and
        // moving selected notes) so differentiate between that here.
        if (theGrid.param.editMode == "cursor"){
          theSound.check_and_implement_edit(compObj, theGrid.inner.selectedOblong.idNote, self.keys[bidx], theGrid.param.gran.value);
        }
        else {
          switch (self.keys[bidx]){
            case "up":
            if (theGrid.param.topMnn == theGrid.param.mnns.length - 2){
              // Can't go any higher after this, because the top row would be
              // above indices of mnns. Disable button.
              self.buttonsStruct["up"].toggle_disabled();
            }
            if (self.buttonsStruct["down"].disabled){
              // Re-enable a previously disabled button.
              self.buttonsStruct["down"].toggle_disabled();
            }
            theGrid.param.topMnn++;
            break
            case "down":
            if (theGrid.param.topMnn - theGrid.inner.nosRow == 0){
              // Can't go any lower after this, because the bottom row would be
              // below zeroth index of mnns. Disable button.
              self.buttonsStruct["down"].toggle_disabled();
            }
            if (self.buttonsStruct["up"].disabled){
              // Re-enable a previously disabled button.
              self.buttonsStruct["up"].toggle_disabled();
            }
            theGrid.param.topMnn--;
            break
            case "left":
            theGrid.param.leftInt--;
            break
            case "right":
            theGrid.param.leftInt++;
            break
            default:
            console.log("SHOULD NOT GET HERE!");
          }
          console.log("topMnn from touch_navign_buttons_check:", theGrid.param.topMnn);
          theGrid.inner.oblongs = comp_obj2oblongs(compObj, theGrid.param.leftInt, theGrid.inner.nosCol, theGrid.param.topMnn, theGrid.inner.nosRow, theGrid.param.gran.value);
        }
        // Suppress the toggle for this type of button.
        self.buttonsStruct[self.keys[bidx]].toggle_clicked();
        theGrid.draw();

      }
    }

  }

  /**
   * Class for creating and managing buttons for a visual envelope editor
   * @extends Buttons
   */
  class EnvelopeButtons extends Buttons {
    /**
     * Create a new instance of EnvelopeButtons
     * @param {p5} _sketch - A p5.js sketch instance
     * @param {Object} _buttonsStruct - An object representing the buttons to be created
     * @param {Object} _containerDimensions - An object with width and height properties that represent the dimensions of the button container
     */
    constructor(_sketch, _buttonsStruct, _containerDimensions){
      super(_sketch, _buttonsStruct, _containerDimensions);
      // Any extra properties/actions here, which could have been
      // passed into the constructor also...
      // this.subject = subject

    }

    /**
     * Check if a button has been touched
     *
     * @param {Object} envEd - An object representing the visual envelope editor
     */
    touch_check(envEd){
      const self = this;
      const helperResult = self.touch_check_helper();
      if (!helperResult.click) { return }
      const buttonClick = helperResult.click;
      const bidx = helperResult.index;

      if (!self.buttonsStruct[self.keys[bidx]].disabled){
        // if (prm.printConsoleLogs) { console.log("self.keys[bidx]:", self.keys[bidx]) }

        // Enforce inability to deselect a selected env button.
        if (envEd.mode == self.keys[bidx]){
          self.buttonsStruct[self.keys[bidx]].clicked = true;
          self.buttonsStruct[self.keys[bidx]].draw();
        }
        // Enforce mutual exclusivity of the clicked-ness of the env buttons.
        envEd.prevMode = envEd.mode;
        console.log("self.keys[bidx]:", self.keys[bidx]);
        envEd.mode = self.keys[bidx];
        envEd.envelope.load(envEd.mode);
        self.keys.forEach(function(k, idx){
          if (idx !== bidx){
            self.buttonsStruct[k].clicked = false;
            // self.buttonsStruct[k].draw() // About to call draw_components() anyway...
          }
        });
        self.draw();
        envEd.envelope.draw();
      }
    }

  }

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
      this.sk = _sketch;
      this.checkTint = _checkTint; // Handles b/w of keyboard notes.
      this.rowNo = _rowNo;
      this.colNo = _colNo;
      this.nosRow = _nosRow;
      this.nosCol = _nosCol;
      this.gridX = _gridX;
      this.gridY = _gridY;
      this.gridWidth = _gridWidth;
      this.gridHeight = _gridHeight;
      this.x = this.gridX + this.colNo/this.nosCol*this.gridWidth;
      this.y = this.gridY + this.rowNo/this.nosRow*this.gridHeight;
      this.w = this.gridWidth/this.nosCol;
      this.h = this.gridHeight/this.nosRow;
      this.text = "";
      this.type = null;
      this.startVal = null;
      this.sf = null;
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
        this.type = type;
      }
      if (this.startVal == null){
        this.startVal = startVal;
      }
      if (this.sf == null){
        this.sf = sf;
      }
      if (type == "pitch"){
        const mnn = mnns[startVal - this.rowNo];
        this.text = mu.mnn2pitch_simple(mnn);
      }
      else if (type == "ontime"){
        this.text = "" + Math.round(10*parseFloat(sf)*(startVal + this.colNo))/10;
      }
      this.sk.textAlign(this.sk.CENTER, this.sk.CENTER);
      this.sk.textSize(10);
      this.sk.noStroke();
      this.sk.fill(50);
      this.sk.text(this.text, this.x + this.w/2, this.y + this.h/2);
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
        this.gridX = rd.gridX;
        this.gridY = rd.gridY;
        this.gridWidth = rd.gridWidth;
        this.gridHeight = rd.gridHeight;
        this.x = this.gridX + this.colNo/this.nosCol*this.gridWidth;
        this.y = this.gridY + this.rowNo/this.nosRow*this.gridHeight;
        this.w = this.gridWidth/this.nosCol;
        this.h = this.gridHeight/this.nosRow;
      }
      this.sk.strokeWeight(1);
      this.sk.stroke(50);
      this.sk.rectMode(this.sk.CORNER);
      if (highlight){
        this.sk.fill(190, 250, 190);
      }
      else {
        this.sk.fill(230, 230, 230);
      }
      // this.sk.imageMode(this.sk.CORNER)
      if (this.checkTint){
        const mnn = mnns[topMnn - this.rowNo];
        if ([0, 2, 4, 5, 7, 9, 11].indexOf(mnn % 12) >= 0){
          // White key on piano keyboard.
          this.sk.fill(230, 230, 230, 50);
          // this.sk.tint(255, 80)
        }
        else {
          // Black key on piano keyboard.
          this.sk.fill(90, 90, 90, 50);
          // this.sk.tint(255, 200)
        }
      }
      this.sk.rect(
        this.x + 0.05*this.w, this.y + 0.05*this.h, 0.9*this.w, 0.9*this.h, 10
      );
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
        this.draw(null, true);
      }
      else {
        this.draw();
      }
      this.add_text();
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

  /**
  * The Envelope class makes a rectangular space in which instances of the
  * {@link EnvelopeNode} can be created, edited, and deleted.
  * @class Envelope
  */

  class Envelope {

    /**
     * Constructor for making a new instance of the Envelope class.
     * @param {Object} _sketch The p5 sketch in which one or more instances of the
     * Envelope class will exist.
     * @param {String} _name Unused at present, but a potentially useful label for
     * distinguishing between multiple envelopes.
     * @param {Number} _yVal In [0, 1], giving the initial/default value of nodes
     * inside the envelope.
     * @param {Boolean} _active Unused at present, but potentially useful for
     * switching between envelopes that are applied to different channels or staff
     * numbers.
     * @param {Number} _x `x`-location of top-left corner of the envelope in
     * pixels.
     * @param {Number} _y `y`-location of top-left corner of the envelope in
     * pixels.
     * @param {Number} _width Width of the envelope in pixels.
     * @param {Number} _height Height of the envelope in pixels.
     * @param {Number} _nodeDiameter Diameter of the nodes appearing inside the
     * envelope.
     */
    constructor(
      _sketch, _name, _yVal, _active, _x, _y, _width, _height, _nodeDiameter
    ){
      // Workaround for JS context peculiarities
      // const self = this
      this.sk = _sketch;
      this.name = _name;
      this.active = _active;
      this.x = _x;
      this.y = _y;
      this.w = _width;
      this.h = _height;
      this.inner = { "x": this.x, "y": this.y, "width": this.w, "height": this.h };
      this.nodeDiameter = _nodeDiameter;
      this.nodeFill = this.sk.color("#17baef");
      this.lineFill = this.sk.color("#17baef");
      this.aboveLineFill = this.sk.color("#074f66");
      this.belowLineFill = this.sk.color("#074f66");
      this.minU = 0;
      this.maxU = 16;
      this.minV, this.maxV, this.uvData;

      // Making nodes.
      this.nodeId = 2; // Unique id for each node.
      if (_yVal == undefined){
        this.nodes = [
          new EnvelopeNode(
            this.sk, 0, null, 0.1, 0.5, false, this.nodeFill, this.nodeDiameter, this.inner
          ),
          new EnvelopeNode(
            this.sk, 1, null, 0.9, 0.5, false, this.nodeFill, this.nodeDiameter, this.inner
          )
        ];
      }
      else {
        this.nodes = [
          new EnvelopeNode(
            this.sk, 0, null, 0.1, _yVal, false, this.nodeFill, this.nodeDiameter,
            this.inner
          ),
          new EnvelopeNode(
            this.sk, 1, null, 0.9, _yVal, false, this.nodeFill, this.nodeDiameter,
            this.inner
          )
        ];
      }
      // Possible to return something.
      // return sth
    }

    /**
     * Draws the instance of the Envelope class. This includes the outer
     * rectangle, the lines between each envelope node, and the nodes themselves.
     * @param {Number} newX An altered value of the envelope's `x`-location
     * (useful if the screen has been resized I think).
     */
    draw(newX){
      if (!this.active){
        console.log("Shouldn't be drawn. Is not active!");
        return
      }
      if (newX !== undefined){
        this.x = newX;
      }
      this.sk.fill(240);
      this.sk.stroke(150);
      this.sk.rect(this.x, this.y, this.w, this.h);
      for (let i = 0; i < this.nodes.length - 1; i++){
        this.sk.line(
          this.nodes[i].pixelX, this.nodes[i].pixelY,
          this.nodes[i + 1].pixelX, this.nodes[i + 1].pixelY
        );
      }
      this.nodes.map(function(n){
        n.draw();
      });
    }

    /**
   * Load an envelope from an input string specifying the type of musical
   * dimension.
   * @param {string} str - The string specifying the type of musical dimension.
   */
    load(str){
      // if (prm.printConsoleLogs){
      //   console.log("Loading envelope for str:", str)
      // }
      let self = this;
      let uvData;
      switch (str){
        case "tempo":
        this.minV = 50, this.maxV = 150;
        uvData = compObj.tempi.filter(function(v){
          return v.stampDelete == null
        });
        // console.log("uvData:", uvData)
        if (uvData.length == 0){
          // Stick in a default tempo of 100 bpm.
          compObj.tempi = [
            {
              "id": uuid(),
              "ontime": 0,
              "barNo": 1,
              "bpm": 100,
              "stampCreate": Date.now(),
              "stampDelete": null
            },
            {
              "id": uuid(),
              "ontime": 16,
              "barNo": 5,
              "bpm": 100,
              "stampCreate": Date.now(),
              "stampDelete": null
            }
          ];
          uvData = compObj.tempi;
          this.nodeId = 2;
          this.nodes = [
            new EnvelopeNode(
              this.sk, 0,
              {
                "object": "compObj",
                "property": "tempi",
                "id": uvData[0].id,
                "u": { "min": this.minU, "max": this.maxU },
                "v": { "min": this.minV, "max": this.maxV }
              },
              (uvData[0].ontime - this.minU)/(this.maxU - this.minU),
              (uvData[0].bpm - this.minV)/(this.maxV - this.minV),
              false, this.nodeFill, this.nodeDiameter, this.inner
            ),
            new EnvelopeNode(
              this.sk, 1,
              {
                "object": "compObj",
                "property": "tempi",
                "id": compObj.tempi[1].id,
                "u": { "min": this.minU, "max": this.maxU },
                "v": { "min": this.minV, "max": this.maxV }
              },
              1,
              (uvData[0].bpm - this.minV)/(this.maxV - this.minV),
              false, this.nodeFill, this.nodeDiameter, this.inner
            )
          ];
        }
        else if (uvData.length == 1){
          compObj.tempi.push({
            "id": uuid(),
            "ontime": 16,
            "barNo": 5,
            "bpm": uvData[0].bpm,
            "stampCreate": Date.now(),
            "stampDelete": null
          });
          this.nodeId = 2;
          this.nodes = [
            new EnvelopeNode(
              this.sk, 0,
              {
                "object": "compObj",
                "property": "tempi",
                "id": uvData[0].id,
                "u": { "min": this.minU, "max": this.maxU },
                "v": { "min": this.minV, "max": this.maxV }
              },
              (uvData[0].ontime - this.minU)/(this.maxU - this.minU),
              (uvData[0].bpm - this.minV)/(this.maxV - this.minV),
              false, this.nodeFill, this.nodeDiameter, this.inner
            ),
            new EnvelopeNode(
              this.sk, 1,
              {
                "object": "compObj",
                "property": "tempi",
                "id": compObj.tempi[1].id,
                "u": { "min": this.minU, "max": this.maxU },
                "v": { "min": this.minV, "max": this.maxV }
              },
              1,
              (compObj.tempi[1].bpm - this.minV)/(this.maxV - this.minV),
              false, this.nodeFill, this.nodeDiameter, this.inner
            )
          ];
        }
        else {
          this.nodes = [];
          uvData.forEach(function(uvd, idx){
            self.push_sorted(
              new EnvelopeNode(
                self.sk, idx,
                {
                  "object": "compObj",
                  "property": "tempi",
                  "id": uvd.id,
                  "u": { "min": self.minU, "max": self.maxU },
                  "v": { "min": self.minV, "max": self.maxV }
                },
                (uvd.ontime - self.minU)/(self.maxU - self.minU),
                (uvd.bpm - self.minV)/(self.maxV - self.minV),
                false, self.nodeFill, self.nodeDiameter, self.inner
              )
            );
          });
          this.nodeId = this.nodes.length;
        }
        break
        case "volume":
        this.minV = 0, this.maxV = 1;
        uvData = prodObj.volume.filter(function(v){
          return v.stampDelete == null
        });
        if (uvData.length == 0){
          // Populate with a default.
          prodObj.volume = [
            {
              "id": uuid(),
              "ontime": 0,
              "barNo": 1,
              "beatNo": 1,
              "val": 0.5,
              "staffNo": 0,
              "stampCreate": Date.now(),
              "stampDelete": null
            },
            {
              "id": uuid(),
              "ontime": 16,
              "barNo": 5,
              "beatNo": 1,
              "val": 0.5,
              "staffNo": 0,
              "stampCreate": Date.now(),
              "stampDelete": null
            }
          ];
          uvData = prodObj.volume;
          this.nodeId = 2;
          this.nodes = [
            new EnvelopeNode(
              this.sk, 0,
              {
                "object": "prodObj",
                "property": "volume",
                "id": uvData[0].id,
                "u": { "min": this.minU, "max": this.maxU },
                "v": { "min": this.minV, "max": this.maxV }
              },
              (uvData[0].ontime - this.minU)/(this.maxU - this.minU),
              (uvData[0].val - this.minV)/(this.maxV - this.minV),
              false, this.nodeFill, this.nodeDiameter, this.inner
            ),
            new EnvelopeNode(
              this.sk, 1,
              {
                "object": "prodObj",
                "property": "volume",
                "id": prodObj.volume[1].id,
                "u": { "min": this.minU, "max": this.maxU },
                "v": { "min": this.minV, "max": this.maxV }
              },
              1,
              (uvData[0].val - this.minV)/(this.maxV - this.minV),
              false, this.nodeFill, this.nodeDiameter, this.inner
            )
          ];
        }
        else if (uvData.length == 1){
          prodObj.volume.push({
            "id": uuid(),
            "ontime": 16,
            "barNo": 5,
            "beatNo": 1,
            "val": uvData[0].val,
            "staffNo": 0,
            "stampCreate": Date.now(),
            "stampDelete": null
          });
          this.nodeId = 2;
          this.nodes = [
            new EnvelopeNode(
              this.sk, 0,
              {
                "object": "prodObj",
                "property": "volume",
                "id": uvData[0].id,
                "u": { "min": this.minU, "max": this.maxU },
                "v": { "min": this.minV, "max": this.maxV }
              },
              (uvData[0].ontime - this.minU)/(this.maxU - this.minU),
              (uvData[0].val - this.minV)/(this.maxV - this.minV),
              false, this.nodeFill, this.nodeDiameter, this.inner
            ),
            new EnvelopeNode(
              this.sk, 1,
              {
                "object": "prodObj",
                "property": "volume",
                "id": prodObj.volume[1].id,
                "u": { "min": this.minU, "max": this.maxU },
                "v": { "min": this.minV, "max": this.maxV }
              },
              1,
              (prodObj.volume[1].val - this.minV)/(this.maxV - this.minV),
              false, this.nodeFill, this.nodeDiameter, this.inner
            )
          ];
        }
        else {
          this.nodes = [];
          uvData.forEach(function(uvd, idx){
            self.push_sorted(
              new EnvelopeNode(
                self.sk, idx,
                {
                  "object": "prodObj",
                  "property": "volume",
                  "id": uvd.id,
                  "u": { "min": self.minU, "max": self.maxU },
                  "v": { "min": self.minV, "max": self.maxV }
                },
                (uvd.ontime - self.minU)/(self.maxU - self.minU),
                (uvd.val - self.minV)/(self.maxV - self.minV),
                false, self.nodeFill, self.nodeDiameter, self.inner
              )
            );
          });
          this.nodeId = this.nodes.length;
        }
        break
        case "pan":
        this.minV = -1, this.maxV = 1;
        uvData = prodObj.pan.filter(function(v){
          return v.stampDelete == null
        });
        if (uvData.length == 0){
          // Stick in a default pan of 0 (centre).
          prodObj.pan = [
            {
              "id": uuid(),
              "ontime": 0,
              "barNo": 1,
              "beatNo": 1,
              "val": 0,
              "staffNo": 0,
              "stampCreate": Date.now(),
              "stampDelete": null
            },
            {
              "id": uuid(),
              "ontime": 16,
              "barNo": 5,
              "beatNo": 1,
              "val": 0,
              "staffNo": 0,
              "stampCreate": Date.now(),
              "stampDelete": null
            }
          ];
          uvData = prodObj.pan;
          this.nodeId = 2;
          this.nodes = [
            new EnvelopeNode(
              this.sk, 0,
              {
                "object": "prodObj",
                "property": "pan",
                "id": uvData[0].id,
                "u": { "min": this.minU, "max": this.maxU },
                "v": { "min": this.minV, "max": this.maxV }
              },
              (uvData[0].ontime - this.minU)/(this.maxU - this.minU),
              (uvData[0].val - this.minV)/(this.maxV - this.minV),
              false, this.nodeFill, this.nodeDiameter, this.inner
            ),
            new EnvelopeNode(
              this.sk, 1,
              {
                "object": "prodObj",
                "property": "pan",
                "id": prodObj.pan[1].id,
                "u": { "min": this.minU, "max": this.maxU },
                "v": { "min": this.minV, "max": this.maxV }
              },
              1,
              (uvData[0].val - this.minV)/(this.maxV - this.minV),
              false, this.nodeFill, this.nodeDiameter, this.inner
            )
          ];
        }
        else if (uvData.length == 1){
          prodObj.pan.push({
            "id": uuid(),
            "ontime": 16,
            "barNo": 5,
            "beatNo": 1,
            "val": uvData[0].val,
            "staffNo": 0,
            "stampCreate": Date.now(),
            "stampDelete": null
          });
          this.nodeId = 2;
          this.nodes = [
            new EnvelopeNode(
              this.sk, 0,
              {
                "object": "prodObj",
                "property": "pan",
                "id": uvData[0].id,
                "u": { "min": this.minU, "max": this.maxU },
                "v": { "min": this.minV, "max": this.maxV }
              },
              (uvData[0].ontime - this.minU)/(this.maxU - this.minU),
              (uvData[0].val - this.minV)/(this.maxV - this.minV),
              false, this.nodeFill, this.nodeDiameter, this.inner
            ),
            new EnvelopeNode(
              this.sk, 1,
              {
                "object": "prodObj",
                "property": "pan",
                "id": prodObj.pan[1].id,
                "u": { "min": this.minU, "max": this.maxU },
                "v": { "min": this.minV, "max": this.maxV }
              },
              1,
              (prodObj.pan[1].val - this.minV)/(this.maxV - this.minV),
              false, this.nodeFill, this.nodeDiameter, this.inner
            )
          ];
        }
        else {
          this.nodes = [];
          uvData.forEach(function(uvd, idx){
            self.push_sorted(
              new EnvelopeNode(
                self.sk, idx,
                {
                  "object": "prodOb",
                  "property": "pan",
                  "id": uvd.id,
                  "u": { "min": self.minU, "max": self.maxU },
                  "v": { "min": self.minV, "max": self.maxV }
                },
                (uvd.ontime - self.minU)/(self.maxU - self.minU),
                (uvd.val - self.minV)/(self.maxV - self.minV),
                false, self.nodeFill, self.nodeDiameter, self.inner
              )
            );
          });
          this.nodeId = this.nodes.length;
        }
        break
        case "reverb room size":
        this.minV = 0, this.maxV = 1;
        uvData = prodObj.reverb.roomSize.filter(function(v){
          return v.stampDelete == null
        });
        if (uvData.length == 0){
          // Populate with a default.
          prodObj.reverb.roomSize = [
            {
              "id": uuid(),
              "ontime": 0,
              "barNo": 1,
              "beatNo": 1,
              "val": 0,
              "staffNo": 0,
              "stampCreate": Date.now(),
              "stampDelete": null
            },
            {
              "id": uuid(),
              "ontime": 16,
              "barNo": 5,
              "beatNo": 1,
              "val": 0,
              "staffNo": 0,
              "stampCreate": Date.now(),
              "stampDelete": null
            }
          ];
          uvData = prodObj.reverb.roomSize;
          this.nodeId = 2;
          this.nodes = [
            new EnvelopeNode(
              this.sk, 0,
              {
                "object": "prodObj",
                "property": ["reverb", "roomSize"],
                "id": uvData[0].id,
                "u": { "min": this.minU, "max": this.maxU },
                "v": { "min": this.minV, "max": this.maxV }
              },
              (uvData[0].ontime - this.minU)/(this.maxU - this.minU),
              (uvData[0].val - this.minV)/(this.maxV - this.minV),
              false, this.nodeFill, this.nodeDiameter, this.inner
            ),
            new EnvelopeNode(
              this.sk, 1,
              {
                "object": "prodObj",
                "property": ["reverb", "roomSize"],
                "id": prodObj.reverb.roomSize[1].id,
                "u": { "min": this.minU, "max": this.maxU },
                "v": { "min": this.minV, "max": this.maxV }
              },
              1,
              (uvData[0].val - this.minV)/(this.maxV - this.minV),
              false, this.nodeFill, this.nodeDiameter, this.inner
            )
          ];
        }
        else if (uvData.length == 1){
          prodObj.reverb.roomSize.push({
            "id": uuid(),
            "ontime": 16,
            "barNo": 5,
            "beatNo": 1,
            "val": uvData[0].val,
            "staffNo": 0,
            "stampCreate": Date.now(),
            "stampDelete": null
          });
          this.nodeId = 2;
          this.nodes = [
            new EnvelopeNode(
              this.sk, 0,
              {
                "object": "prodObj",
                "property": ["reverb", "roomSize"],
                "id": uvData[0].id,
                "u": { "min": this.minU, "max": this.maxU },
                "v": { "min": this.minV, "max": this.maxV }
              },
              (uvData[0].ontime - this.minU)/(this.maxU - this.minU),
              (uvData[0].val - this.minV)/(this.maxV - this.minV),
              false, this.nodeFill, this.nodeDiameter, this.inner
            ),
            new EnvelopeNode(
              this.sk, 1,
              {
                "object": "prodObj",
                "property": ["reverb", "roomSize"],
                "id": prodObj.reverb.roomSize[1].id,
                "u": { "min": this.minU, "max": this.maxU },
                "v": { "min": this.minV, "max": this.maxV }
              },
              1,
              (prodObj.reverb.roomSize[1].val - this.minV)/(this.maxV - this.minV),
              false, this.nodeFill, this.nodeDiameter, this.inner
            )
          ];
        }
        else {
          this.nodes = [];
          uvData.forEach(function(uvd, idx){
            self.push_sorted(
              new EnvelopeNode(
                self.sk, idx,
                {
                  "object": "prodObj",
                  "property": ["reverb", "roomSize"],
                  "id": uvd.id,
                  "u": { "min": self.minU, "max": self.maxU },
                  "v": { "min": self.minV, "max": self.maxV }
                },
                (uvd.ontime - self.minU)/(self.maxU - self.minU),
                (uvd.val - self.minV)/(self.maxV - self.minV),
                false, self.nodeFill, self.nodeDiameter, self.inner
              )
            );
          });
          this.nodeId = this.nodes.length;
        }
        break
        case "reverb wet":
        this.minV = 0, this.maxV = 1;
        uvData = prodObj.reverb.wet.filter(function(v){
          return v.stampDelete == null
        });
        if (uvData.length == 0){
          // Populate with a default.
          prodObj.reverb.wet = [
            {
              "id": uuid(),
              "ontime": 0,
              "barNo": 1,
              "beatNo": 1,
              "val": 0,
              "staffNo": 0,
              "stampCreate": Date.now(),
              "stampDelete": null
            },
            {
              "id": uuid(),
              "ontime": 16,
              "barNo": 5,
              "beatNo": 1,
              "val": 0,
              "staffNo": 0,
              "stampCreate": Date.now(),
              "stampDelete": null
            }
          ];
          uvData = prodObj.reverb.wet;
          this.nodeId = 2;
          this.nodes = [
            new EnvelopeNode(
              this.sk, 0,
              {
                "object": "prodObj",
                "property": ["reverb", "wet"],
                "id": uvData[0].id,
                "u": { "min": this.minU, "max": this.maxU },
                "v": { "min": this.minV, "max": this.maxV }
              },
              (uvData[0].ontime - this.minU)/(this.maxU - this.minU),
              (uvData[0].val - this.minV)/(this.maxV - this.minV),
              false, this.nodeFill, this.nodeDiameter, this.inner
            ),
            new EnvelopeNode(
              this.sk, 1,
              {
                "object": "prodObj",
                "property": ["reverb", "wet"],
                "id": prodObj.reverb.wet[1].id,
                "u": { "min": this.minU, "max": this.maxU },
                "v": { "min": this.minV, "max": this.maxV }
              },
              1,
              (uvData[0].val - this.minV)/(this.maxV - this.minV),
              false, this.nodeFill, this.nodeDiameter, this.inner
            )
          ];
        }
        else if (uvData.length == 1){
          prodObj.reverb.wet.push({
            "id": uuid(),
            "ontime": 16,
            "barNo": 5,
            "beatNo": 1,
            "val": uvData[0].val,
            "staffNo": 0,
            "stampCreate": Date.now(),
            "stampDelete": null
          });
          this.nodeId = 2;
          this.nodes = [
            new EnvelopeNode(
              this.sk, 0,
              {
                "object": "prodObj",
                "property": ["reverb", "wet"],
                "id": uvData[0].id,
                "u": { "min": this.minU, "max": this.maxU },
                "v": { "min": this.minV, "max": this.maxV }
              },
              (uvData[0].ontime - this.minU)/(this.maxU - this.minU),
              (uvData[0].val - this.minV)/(this.maxV - this.minV),
              false, this.nodeFill, this.nodeDiameter, this.inner
            ),
            new EnvelopeNode(
              this.sk, 1,
              {
                "object": "prodObj",
                "property": ["reverb", "wet"],
                "id": prodObj.reverb.wet[1].id,
                "u": { "min": this.minU, "max": this.maxU },
                "v": { "min": this.minV, "max": this.maxV }
              },
              1,
              (prodObj.reverb.wet[1].val - this.minV)/(this.maxV - this.minV),
              false, this.nodeFill, this.nodeDiameter, this.inner
            )
          ];
        }
        else {
          this.nodes = [];
          uvData.forEach(function(uvd, idx){
            self.push_sorted(
              new EnvelopeNode(
                self.sk, idx,
                {
                  "object": "prodObj",
                  "property": ["reverb", "wet"],
                  "id": uvd.id,
                  "u": { "min": self.minU, "max": self.maxU },
                  "v": { "min": self.minV, "max": self.maxV }
                },
                (uvd.ontime - self.minU)/(self.maxU - self.minU),
                (uvd.val - self.minV)/(self.maxV - self.minV),
                false, self.nodeFill, self.nodeDiameter, self.inner
              )
            );
          });
          this.nodeId = this.nodes.length;
        }
        break
        default:
        console.log("SHOULD NOT GET HERE!");
      }
      this.active = true;
      this.draw();
    }

    /**
     * onclick method for Envelope class
     * @param {string} str - The type of node to be created
     * @param {object} _grid - The grid object
     * @param {object} _sonic - The sonic object
     */
    onclick(str, _grid, _sonic){
      // if (prm.printConsoleLogs) { console.log("Envelope \"" + this.name + "\" has been clicked!") }
      const xLoc = (this.sk.mouseX - this.inner.x - this.nodeDiameter/2)/(this.inner.width - this.nodeDiameter);
      const yLoc = 1 - (this.sk.mouseY - this.inner.y - this.nodeDiameter/2)/(this.inner.height - this.nodeDiameter);
      // if (prm.printConsoleLogs) { console.log("xLoc:", xLoc, "yLoc:", yLoc) }
      // Check if the click is on an existing node.
      let nodeClick = false;
      let nidx = 0;
      while (nidx < this.nodes.length && !nodeClick){
        nodeClick = this.nodes[nidx].touch_check(
          str, this, nidx, _grid, _sonic
        );
        nidx++;
      }
      // if (prm.printConsoleLogs) { console.log("nodeClick:", nodeClick) }

      if (nodeClick){
        nidx--;
        // if (prm.printConsoleLogs) { console.log("nidx:", nidx) }
        // A touch has started on an existing node. The node needs to move with
        // the touch.
        this.nodes[nidx].move("touchStarted", this, nidx, _grid, _sonic);
        // Delete and create.
      }
      else {
        // The touch started was not on an existing node. Make a new one.
        if (this.nodes.filter(function(n){ return n.stampDelete !== null }).length == 8){
          alert("No more than eight nodes please!");
          return
        }
        // Create.
        let id, ontime, bb, ctx, val;
        switch (str){
          case "tempo":
          id = uuid();
          ontime = this.minU + (this.maxU - this.minU)*xLoc;
          bb = mu.bar_and_beat_number_of_ontime(
            ontime, compObj.timeSignatures
          );
          const bpm = this.minV + (this.maxV - this.minV)*yLoc;
          ctx = {
            "object": "compObj",
            "property": "tempi",
            "id": id,
            "u": { "min": this.minU, "max": this.maxU },
            "v": { "min": this.minV, "max": this.maxV }
          };
          compObj.tempi.push({
            "id": id,
            "ontime": ontime,
            "barNo": bb[0],
            "bpm": bpm,
            "stampCreate": Date.now(),
            "stampDelete": null
          });
          compObj.tempi = compObj.tempi.sort(function(a, b){ return a.ontime - b.ontime });
          // console.log("compObj.tempi:", compObj.tempi)
          break
          case "volume":
          id = uuid();
          ontime = this.minU + (this.maxU - this.minU)*xLoc;
          bb = mu.bar_and_beat_number_of_ontime(
            ontime, compObj.timeSignatures
          );
          val = this.minV + (this.maxV - this.minV)*yLoc;
          ctx = {
            "object": "prodObj",
            "property": "volume",
            "id": id,
            "u": { "min": this.minU, "max": this.maxU },
            "v": { "min": this.minV, "max": this.maxV }
          };
          prodObj.volume.push({
            "id": id,
            "ontime": ontime,
            "barNo": bb[0],
            "beatNo": bb[1],
            "val": val,
            "staffNo": 0,
            "stampCreate": Date.now(),
            "stampDelete": null
          });
          prodObj.volume = prodObj.volume.sort(function(a, b){ return a.ontime - b.ontime });
          // console.log("prodObj.volume:", prodObj.volume)
          break
          case "pan":
          id = uuid();
          ontime = this.minU + (this.maxU - this.minU)*xLoc;
          bb = mu.bar_and_beat_number_of_ontime(
            ontime, compObj.timeSignatures
          );
          val = this.minV + (this.maxV - this.minV)*yLoc;
          ctx = {
            "object": "prodObj",
            "property": "pan",
            "id": id,
            "u": { "min": this.minU, "max": this.maxU },
            "v": { "min": this.minV, "max": this.maxV }
          };
          prodObj.pan.push({
            "id": id,
            "ontime": ontime,
            "barNo": bb[0],
            "beatNo": bb[1],
            "val": val,
            "staffNo": 0,
            "stampCreate": Date.now(),
            "stampDelete": null
          });
          prodObj.pan = prodObj.pan.sort(function(a, b){ return a.ontime - b.ontime });
          // console.log("prodObj.pan:", prodObj.pan)
          break
          case "reverb room size":
          id = uuid();
          ontime = this.minU + (this.maxU - this.minU)*xLoc;
          bb = mu.bar_and_beat_number_of_ontime(
            ontime, compObj.timeSignatures
          );
          val = this.minV + (this.maxV - this.minV)*yLoc;
          ctx = {
            "object": "prodObj",
            "property": ["reverb", "roomSize"],
            "id": id,
            "u": { "min": this.minU, "max": this.maxU },
            "v": { "min": this.minV, "max": this.maxV }
          };
          prodObj.reverb.roomSize.push({
            "id": id,
            "ontime": ontime,
            "barNo": bb[0],
            "beatNo": bb[1],
            "val": val,
            "staffNo": 0,
            "stampCreate": Date.now(),
            "stampDelete": null
          });
          prodObj.reverb.roomSize = prodObj.reverb.roomSize.sort(function(a, b){ return a.ontime - b.ontime });
          // console.log("prodObj.reverb.roomSize:", prodObj.reverb.roomSize)
          break
          case "reverb wet":
          id = uuid();
          ontime = this.minU + (this.maxU - this.minU)*xLoc;
          bb = mu.bar_and_beat_number_of_ontime(
            ontime, compObj.timeSignatures
          );
          val = this.minV + (this.maxV - this.minV)*yLoc;
          ctx = {
            "object": "prodObj",
            "property": ["reverb", "wet"],
            "id": id,
            "u": { "min": this.minU, "max": this.maxU },
            "v": { "min": this.minV, "max": this.maxV }
          };
          prodObj.reverb.wet.push({
            "id": id,
            "ontime": ontime,
            "barNo": bb[0],
            "beatNo": bb[1],
            "val": val,
            "staffNo": 0,
            "stampCreate": Date.now(),
            "stampDelete": null
          });
          prodObj.reverb.wet = prodObj.reverb.wet.sort(function(a, b){ return a.ontime - b.ontime });
          // console.log("prodObj.reverb.wet:", prodObj.reverb.wet)
          break
          default:
          console.log("Should not get to default here!");
        }
        let newEnv = new EnvelopeNode(
          this.sk, this.nodeId, ctx, xLoc, yLoc, true, this.nodeFill, this.nodeDiameter,
          this.inner
        );
        this.push_sorted(newEnv);
        // if (prm.printConsoleLogs) { console.log("this.nodes:", this.nodes) }
        this.nodeId++;
        this.draw();
        _sonic.schedule_events(compObj, prodObj, _grid);
      }
    }


    /**
     * Push a time/value pair onto this envelope's data, maintaining sorted order.
     * @param {number} time - The time of the pair to add.
     * @param {number} value - The value of the pair to add.
     */
    push_sorted(aNode){
      let relIdx;
      let i = 0;
      while (i < this.nodes.length){
        if (this.nodes[i].compare_to(aNode) !== -1){
          relIdx = i;
          i = this.nodes.length - 1;
        }
        i++;
      }
      if (relIdx !== undefined){
        this.nodes.splice(relIdx, 0, aNode);
      }
      else {
        this.nodes.push(aNode);
      }
    }

    /**
     * Toggle the active status of this envelope.
     */
    toggle_active(){
      this.active = !this.active;
    }

    /**
     * Touch check method for Envelope class
     *
     * @param {string} touchType - touch type ('touchStarted', 'touchMoved', 'touchEnded')
     * @param {string} str - string parameter
     * @param {Object} _grid - grid object
     * @param {Object} _sonic - sonic object
     */
    touch_check(touchType, str, _grid, _sonic){
      // Check if a select menu is showing or the touch is outside the envelope
      // area.
      if (
        // selectMenuShowingIdx >= 0 ||
        this.sk.mouseX < this.x || this.sk.mouseX > this.x + this.width ||
        this.sk.mouseY < this.y + this.nodeDiameter/2 ||
        this.sk.mouseY > this.y + this.height - this.nodeDiameter/2
      ){
        return
      }

      // Get the index of the node that's being moved.
      let nodeIdx;
      this.nodes.map(function(n, idx){
        if (n.beingMoved){
          nodeIdx = idx;
        }
      });

      switch (touchType){
        case "touchStarted":
        this.onclick(str, _grid, _sonic);
        break
        case "touchMoved":
        if (nodeIdx !== undefined){
          // Move node, taking into account location of left- and right-hand nodes.
          this.nodes[nodeIdx].move(touchType, this, nodeIdx, _grid, _sonic);
        }
        break
        case "touchEnded":
        if (nodeIdx !== undefined){
          this.nodes[nodeIdx].move(touchType, this, nodeIdx, _grid, _sonic);
        }
        break
        default:
        console.log("Shouldn't get to default in this switch!");
      }
    }

  }

  /**
  * The EnvelopeNode class makes small draggable nodes or circles in a
  * rectangular space that we refer to as an Envelope. Lines are drawn from one
  * instance of EnvelopeNode to the next, and so can be used to determine or
  * shape the profile or production of some aspect of musical events, such as
  * their volume.
  * @class EnvelopeNode
  */

  class EnvelopeNode {

    /**
     * constructor description
     * @constructor
     * @param {Number} config [description]
     */
    constructor(
      theSketch, theId, theCtx, theX, theY, theBeingMoved, theFillColor, theDiameter,
      theInner
    ){
      // Workaround for JS context peculiarities
      // const self = this
      this.sk = theSketch;
      this.id = theId;
      // Whether it came from comp or prod, which property, and id. Also the min/max
      // values for the property.
      this.ctx = theCtx;
      this.x = theX;
      this.y = theY;
      this.beingMoved = theBeingMoved;
      this.fillColor = theFillColor;
      this.diameter = theDiameter;
      this.inner = theInner;
      this.pixelX = this.sk.map(
        this.x, 0, 1, theInner.x + this.diameter/2,
        theInner.x + theInner.width - this.diameter/2
      );
      // this.pixelX = theInner.x + this.diameter/2 + (theInner.width - this.diameter)*this.x
      this.pixelY = this.sk.map(
        this.y, 0, 1, theInner.y + theInner.height - this.diameter,
        theInner.y + this.diameter/2
      );
      // this.pixelY = theInner.y + this.diameter/2 + (theInner.height - this.diameter)*(1 - this.y)
      this.pPixelX = null;
      this.pPixelY = null;

      // Possible to return something.
      // return sth
    }

    /**
     * Method to compare this node with surrounding nodes.
     * @param  {Object} fruit      [description]
     * @param  {String} fruit.name [description]
     * @return {String}            [description]
     */
    compare_to(aNode){
      if (this.x < aNode.x){
        return -1
      }
      else if (this.x > aNode.x){
        return 1
      }
      else {
        if (this.y < aNode.y){
          return -1
        }
        else if (this.y > aNode.y){
          return 1
        }
        else {
          return 0
        }
      }
    }

    /**
     * Draw the EnvelopeNode on the canvas.
     */
    draw(){
      // if (prm.printConsoleLogs) { console.log("AGAIN YES!") }
      this.sk.fill(this.fillColor);
      this.sk.ellipseMode(this.sk.CENTER);
      // console.log("this.pixelX:", this.pixelX, "this.pixelY:", this.pixelY)
      this.sk.circle(this.pixelX, this.pixelY, this.diameter);
    }

    /**
     * Method to move the node.
     * @param {string} touchType - Type of touch event (touchStarted, touchMoved, touchEnded).
     * @param {object} theEnv - The Envelope object that this node belongs to.
     * @param {number} theNodeIdx - The index of this node within the Envelope's nodes array.
     * @param {object} theGrid - The Grid object that this node belongs to.
     * @param {object} theSonic - The Sonic object that this node belongs to.
     */
    move(touchType, theEnv, theNodeIdx, theGrid, theSonic){
      const self = this;

      // if (
      //   self.sk.mouseX > self.inner.x + self.diameter/2 &&
      //   self.sk.mouseX < self.inner.x + self.inner.width - self.diameter/2 &&
      //   self.sk.mouseY > self.inner.y + self.diameter/2 &&
      //   self.sk.mouseY < self.inner.y + self.inner.height - self.diameter/2
      // ){
      //   console.log("Meh")
      // }

      // if (touchType == "touchMoved" || touchType == "touchEnded"){
        if (
          self.sk.mouseX < self.inner.x + self.diameter/2 ||
          self.sk.mouseX > self.inner.x + self.inner.width - self.diameter/2 ||
          self.sk.mouseY < self.inner.y + self.diameter/2 ||
          self.sk.mouseY > self.inner.y + self.inner.height - self.diameter/2
        ){
          return;
        }

        if (touchType == "touchStarted"){
          // Store previous node location, so we can decide on touch ending
          // whether it's an attempt to delete the node.
          self.pPixelX = self.pixelX;
          self.pPixelY = self.pixelY;
        }
        else if (touchType == "touchMoved"){
          // We may need to move the oblong node.
          // Check whether moving it would go behind or beyond an existing node,
          // which we will disallow.
          let nodeL = theEnv.nodes[theNodeIdx - 1];
          let nodeR = theEnv.nodes[theNodeIdx + 1];
          if (nodeL !== undefined && nodeR !== undefined){
            const behindOrBeyond = self.sk.mouseX < nodeL.pixelX || self.sk.mouseX > nodeR.pixelX;
            // if (prm.printConsoleLogs) { console.log("behindOrBeyond:", behindOrBeyond) }
            if (!behindOrBeyond){
              self.pixelX = self.sk.mouseX;
              self.pixelY = self.sk.mouseY;
              self.x = self.sk.map(
                self.pixelX, self.inner.x + self.diameter/2,
                self.inner.x + self.inner.width - self.diameter, 0, 1
              );
              // self.x = (self.pixelX - self.inner.x - self.diameter/2)/(self.inner.width - self.diameter)
              self.y = self.sk.map(
                self.pixelY, self.inner.y + self.diameter/2,
                self.inner.y + self.inner.height - self.diameter, 1, 0
              );
              // self.y = 1 - (self.pixelY - self.inner.y - self.diameter/2)/(self.inner.height - self.diameter)
            }
          }
          else {
            // Prevent moves in x-plane of outermost nodes.
            self.pixelY = self.sk.mouseY;
            self.y = self.sk.map(
              self.pixelY, self.inner.y + self.diameter/2,
              self.inner.y + self.inner.height - self.diameter, 1, 0
            );
            // self.y = 1 - (self.pixelY - self.inner.y - self.diameter/2)/(self.inner.height - self.diameter)
          }
          theEnv.draw();
        }
        else if (touchType == "touchEnded"){
          // if (prm.printConsoleLogs) { console.log("Pixel positions:", self.pixelX, self.pixelY, self.pPixelX, self.pPixelY) }
          // Is this an attempt to delete the node?
          if (self.sk.dist(self.pixelX, self.pixelY, self.pPixelX, self.pPixelY) < 5){
            // console.log("GOT HERE!")
            // Prevent deletion of outermost nodes.
            let nodeL = theEnv.nodes[theNodeIdx - 1];
            let nodeR = theEnv.nodes[theNodeIdx + 1];
            if (nodeL !== undefined && nodeR !== undefined){
              // Communicate delete to the underlying data model here.
              let relIdx;
              // if (prm.printConsoleLogs){
              //   console.log(self.ctx.object + ", " + self.ctx.property)
              // }
              switch (self.ctx.object){
                case "compObj":
                // console.log("self.ctx.property:", self.ctx.property)
                relIdx = compObj[self.ctx.property].findIndex(function(thing){
                  // console.log("thing:", thing)
                  return thing.id == self.ctx.id
                });
                if (relIdx >= 0){
                  compObj[self.ctx.property][relIdx].stampDelete = Date.now();
                }
                else {
                  console.log("relIdx = " + relIdx + " BUT REALLY OUGHT TO HAVE FOUND SOMETHING HERE...");
                }
                break
                case "prodObj":
                // console.log("self.ctx.property:", self.ctx.property)
                if ((typeof self.ctx.property) == "string"){
                  relIdx = prodObj[self.ctx.property].findIndex(function(thing){
                    // console.log("thing:", thing)
                    return thing.id == self.ctx.id
                  });
                  if (relIdx >= 0){
                    prodObj[self.ctx.property][relIdx].stampDelete = Date.now();
                  }
                }
                else if (self.ctx.property.length == 2){
                  relIdx = prodObj[self.ctx.property[0]][self.ctx.property[1]].findIndex(function(thing){
                    return thing.id == self.ctx.id
                  });
                  if (relIdx >= 0){
                    prodObj[self.ctx.property[0]][self.ctx.property[1]][relIdx].stampDelete = Date.now();
                  }
                }
                else {
                  console.log("relIdx = " + relIdx + " BUT REALLY OUGHT TO HAVE FOUND SOMETHING HERE...");
                }
                break
                default:
                console.log("Should not get here!");
              }
              theEnv.nodes.splice(theNodeIdx, 1);
              theEnv.draw();
            }
            else {
              // Dealing with an outernmost node.
              self.toggle_being_moved();
              // Not going to change compObj.
            }
          }
          else {
            // console.log("GOT HERE EVEN FOR A TOUCHSTARTED!")
            // console.log("touchType:", touchType)
            self.toggle_being_moved();
            // Communicate edit to the underlying data model here.
            let relIdx;
            // if (prm.printConsoleLogs){
              console.log("this:", this);
            // }
            switch (self.ctx.object + "_" + self.ctx.property){
              case "compObj_tempi":
              relIdx = compObj[self.ctx.property].findIndex(function(thing){
                // console.log("thing:", thing)
                return thing.id == self.ctx.id
              });
              console.log("relIdx from inside an EnvelopeNode move:", relIdx);
              if (relIdx >= 0){
                console.log("self.ctx:", self.ctx);
                const currTempoObj = compObj[self.ctx.property][relIdx];
                console.log("currTempoObj:", currTempoObj);
                const ontime = self.ctx.u.min + (self.ctx.u.max - self.ctx.u.min)*self.x;
                const bpm = self.ctx.v.min + (self.ctx.v.max - self.ctx.v.min)*self.y;
                console.log("bpm:", bpm);
                // Are these sufficiently different?
                if (
                  Math.abs(ontime - currTempoObj.ontime) > 0.01 ||
                  Math.abs(bpm - currTempoObj.bpm) > 0.01
                ){
                  console.log("Sufficiently different. Proceeding to underlying data model.");
                  // Handle stampDelete.
                  currTempoObj.stampDelete = Date.now();
                  // Handle creation of new tempi object.
                  const id = uuid();
                  const idEditOf = self.ctx.id;
                  const bb = mu.bar_and_beat_number_of_ontime(
                    ontime, compObj.timeSignatures
                  );
                  const ctx = {
                    "object": "compObj",
                    "property": "tempi",
                    "id": id,
                    "u": { "min": self.ctx.u.min, "max": self.ctx.u.max },
                    "v": { "min": self.ctx.v.min, "max": self.ctx.v.max }
                  };
                  compObj.tempi.push({
                    "id": id,
                    "idEditOf": idEditOf,
                    "ontime": ontime,
                    "barNo": bb[0],
                    "bpm": bpm,
                    "stampCreate": Date.now(),
                    "stampDelete": null
                  });
                  compObj.tempi = compObj.tempi.sort(function(a, b){ return a.ontime - b.ontime });
                  // Transfer context.
                  // console.log("ctx:", ctx)
                  self.ctx = ctx;
                }
              }
              else {
                console.log("relIdx = " + relIdx + " BUT REALLY OUGHT TO HAVE FOUND SOMETHING HERE...");
              }
              break
              case "prodObj_volume":
              relIdx = prodObj[self.ctx.property].findIndex(function(thing){
                // console.log("thing:", thing)
                return thing.id == self.ctx.id
              });
              if (relIdx >= 0){
                const currProdObj = prodObj[self.ctx.property][relIdx];
                const ontime = self.ctx.u.min + (self.ctx.u.max - self.ctx.u.min)*self.x;
                const val = self.ctx.v.min + (self.ctx.v.max - self.ctx.v.min)*self.y;
                // Are these sufficiently different?
                if (
                  Math.abs(ontime - currProdObj.ontime) > 0.01 ||
                  Math.abs(val - currProdObj.val) > 0.01
                ){
                  // Handle stampDelete.
                  currProdObj.stampDelete = Date.now();
                  // Handle creation of new tempi object.
                  const id = uuid();
                  const idEditOf = self.ctx.id;
                  const bb = mu.bar_and_beat_number_of_ontime(
                    ontime, compObj.timeSignatures
                  );
                  const ctx = {
                    "object": "prodObj",
                    "property": "volume",
                    "id": id,
                    "u": { "min": self.ctx.u.min, "max": self.ctx.u.max },
                    "v": { "min": self.ctx.v.min, "max": self.ctx.v.max }
                  };
                  prodObj.volume.push({
                    "id": id,
                    "idEditOf": idEditOf,
                    "ontime": ontime,
                    "barNo": bb[0],
                    "beatNo": bb[1],
                    "val": val,
                    "staffNo": 0,
                    "stampCreate": Date.now(),
                    "stampDelete": null
                  });
                  prodObj.volume = prodObj.volume.sort(function(a, b){ return a.ontime - b.ontime });
                  // Transfer context.
                  // console.log("ctx:", ctx)
                  self.ctx = ctx;
                }
              }
              else {
                console.log("relIdx = " + relIdx + " BUT REALLY OUGHT TO HAVE FOUND SOMETHING HERE...");
              }
              break
              case "prodObj_pan":
              relIdx = prodObj[self.ctx.property].findIndex(function(thing){
                // console.log("thing:", thing)
                return thing.id == self.ctx.id
              });
              if (relIdx >= 0){
                const currProdObj = prodObj[self.ctx.property][relIdx];
                const ontime = self.ctx.u.min + (self.ctx.u.max - self.ctx.u.min)*self.x;
                const val = self.ctx.v.min + (self.ctx.v.max - self.ctx.v.min)*self.y;
                // Are these sufficiently different?
                if (
                  Math.abs(ontime - currProdObj.ontime) > 0.01 ||
                  Math.abs(val - currProdObj.val) > 0.01
                ){
                  // Handle stampDelete.
                  currProdObj.stampDelete = Date.now();
                  // Handle creation of new pan object.
                  const id = uuid();
                  const idEditOf = self.ctx.id;
                  const bb = mu.bar_and_beat_number_of_ontime(
                    ontime, compObj.timeSignatures
                  );
                  const ctx = {
                    "object": "prodObj",
                    "property": "pan",
                    "id": id,
                    "u": { "min": self.ctx.u.min, "max": self.ctx.u.max },
                    "v": { "min": self.ctx.v.min, "max": self.ctx.v.max }
                  };
                  prodObj.pan.push({
                    "id": id,
                    "idEditOf": idEditOf,
                    "ontime": ontime,
                    "barNo": bb[0],
                    "beatNo": bb[1],
                    "val": val,
                    "staffNo": 0,
                    "stampCreate": Date.now(),
                    "stampDelete": null
                  });
                  prodObj.pan = prodObj.pan.sort(function(a, b){ return a.ontime - b.ontime });
                  // Transfer context.
                  // console.log("ctx:", ctx)
                  self.ctx = ctx;
                }
              }
              else {
                console.log("relIdx = " + relIdx + " BUT REALLY OUGHT TO HAVE FOUND SOMETHING HERE...");
              }
              break
              case "prodObj_reverb,roomSize":
              relIdx = prodObj[self.ctx.property[0]][self.ctx.property[1]].findIndex(function(thing){
                // console.log("thing:", thing)
                return thing.id == self.ctx.id
              });
              if (relIdx >= 0){
                const currProdObj = prodObj[self.ctx.property[0]][self.ctx.property[1]][relIdx];
                const ontime = self.ctx.u.min + (self.ctx.u.max - self.ctx.u.min)*self.x;
                const val = self.ctx.v.min + (self.ctx.v.max - self.ctx.v.min)*self.y;
                // Are these sufficiently different?
                if (
                  Math.abs(ontime - currProdObj.ontime) > 0.01 ||
                  Math.abs(val - currProdObj.val) > 0.01
                ){
                  // Handle stampDelete.
                  currProdObj.stampDelete = Date.now();
                  // Handle creation of new tempi object.
                  const id = uuid();
                  const idEditOf = self.ctx.id;
                  const bb = mu.bar_and_beat_number_of_ontime(
                    ontime, compObj.timeSignatures
                  );
                  const ctx = {
                    "object": "prodObj",
                    "property": ["reverb", "roomSize"],
                    "id": id,
                    "u": { "min": self.ctx.u.min, "max": self.ctx.u.max },
                    "v": { "min": self.ctx.v.min, "max": self.ctx.v.max }
                  };
                  prodObj.reverb.roomSize.push({
                    "id": id,
                    "idEditOf": idEditOf,
                    "ontime": ontime,
                    "barNo": bb[0],
                    "beatNo": bb[1],
                    "val": val,
                    "staffNo": 0,
                    "stampCreate": Date.now(),
                    "stampDelete": null
                  });
                  prodObj.reverb.roomSize = prodObj.reverb.roomSize.sort(function(a, b){ return a.ontime - b.ontime });
                  // Transfer context.
                  // console.log("ctx:", ctx)
                  self.ctx = ctx;
                }
              }
              else {
                console.log("relIdx = " + relIdx + " BUT REALLY OUGHT TO HAVE FOUND SOMETHING HERE...");
              }
              break
              case "prodObj_reverb,wet":
              relIdx = prodObj[self.ctx.property[0]][self.ctx.property[1]].findIndex(function(thing){
                // console.log("thing:", thing)
                return thing.id == self.ctx.id
              });
              if (relIdx >= 0){
                const currProdObj = prodObj[self.ctx.property[0]][self.ctx.property[1]][relIdx];
                const ontime = self.ctx.u.min + (self.ctx.u.max - self.ctx.u.min)*self.x;
                const val = self.ctx.v.min + (self.ctx.v.max - self.ctx.v.min)*self.y;
                // Are these sufficiently different?
                if (
                  Math.abs(ontime - currProdObj.ontime) > 0.01 ||
                  Math.abs(val - currProdObj.val) > 0.01
                ){
                  // Handle stampDelete.
                  currProdObj.stampDelete = Date.now();
                  // Handle creation of new tempi object.
                  const id = uuid();
                  const idEditOf = self.ctx.id;
                  const bb = mu.bar_and_beat_number_of_ontime(
                    ontime, compObj.timeSignatures
                  );
                  const ctx = {
                    "object": "prodObj",
                    "property": ["reverb", "wet"],
                    "id": id,
                    "u": { "min": self.ctx.u.min, "max": self.ctx.u.max },
                    "v": { "min": self.ctx.v.min, "max": self.ctx.v.max }
                  };
                  prodObj.reverb.wet.push({
                    "id": id,
                    "idEditOf": idEditOf,
                    "ontime": ontime,
                    "barNo": bb[0],
                    "beatNo": bb[1],
                    "val": val,
                    "staffNo": 0,
                    "stampCreate": Date.now(),
                    "stampDelete": null
                  });
                  prodObj.reverb.wet = prodObj.reverb.wet.sort(function(a, b){ return a.ontime - b.ontime });
                  // Transfer context.
                  // console.log("ctx:", ctx)
                  self.ctx = ctx;
                }
              }
              else {
                console.log("relIdx = " + relIdx + " BUT REALLY OUGHT TO HAVE FOUND SOMETHING HERE...");
              }
              break
              default:
              console.log("Should not get here!");
            }
          }
          // console.log("compObj:", compObj)
          theSonic.schedule_events(compObj, prodObj, theGrid);
        }
        else {
          console.log("Shouldn't get here!");
        }

      // }
    }

    /**
     * Toggles the "beingMoved" property of the node.
     */
    toggle_being_moved(){
      this.beingMoved = !this.beingMoved;
    }

    /**
     * Checks if the mouse touch is within the bounds of the node.
     * @returns {boolean} Returns true if the mouse touch is within the node bounds, else returns false.
     */
    touch_check(){
      if (this.sk.dist(this.sk.mouseX, this.sk.mouseY, this.pixelX, this.pixelY) < this.diameter/2){
        // if (prm.printConsoleLogs) { console.log("GOT TO A TOUCH CHECK IN EnvelopeNode " + this.id + "!") }
        this.toggle_being_moved();
        return true
      }
      return false
    }

  }

  class Oblong {
    constructor(
      theSketch, theBgnImg, theMidImg, theEndImg,
      theBeingDrawn, theRowNo, theColNo, theExtraCols = 0, idNote = null,
      gridInner
    ){
      // Workaround for JS context peculiarities.
      // var self = this;
      this.sk = theSketch;
      this.bgnImg = theBgnImg;
      this.midImg = theMidImg;
      this.endImg = theEndImg;
      this.beingDrawn = theBeingDrawn;
      this.rowNo = theRowNo;
      // console.log("this.rowNo:", this.rowNo)
      this.colNo = theColNo;
      this.extraCols = theExtraCols;
      this.idNote = idNote;
      this.x = gridInner.x + this.colNo/gridInner.nosCol*gridInner.width;
      this.y = gridInner.y + this.rowNo/gridInner.nosRow*gridInner.height;
      this.w = gridInner.width/gridInner.nosCol*(1 + this.extraCols);
      this.h = gridInner.height/gridInner.nosRow;
      this.highlight = false;
      // Possible to return something.
      // return sth;
    }


    draw(recalculateDimensions, gridInner){
      if (recalculateDimensions){
        this.x = gridInner.x + this.colNo/gridInner.nosCol*gridInner.width;
        this.y = gridInner.y + this.rowNo/gridInner.nosRow*gridInner.height;
        this.w = gridInner.width/gridInner.nosCol*(1 + this.extraCols);
        this.h = gridInner.height/gridInner.nosRow;
      }
      if (this.highlight){
        this.sk.tint(225, 191, 105, 250);
      }
      this.sk.imageMode(this.sk.CORNER);
      this.sk.image(this.bgnImg, this.x, this.y, 20, this.h);
      this.sk.image(this.midImg, this.x + 20, this.y, this.w - 40, this.h);
      this.sk.image(this.endImg, this.x + this.w - 20, this.y, 20, this.h);
      if (this.highlight){
        this.sk.noTint();
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
          ) - 1;
          // if (prm.printConsoleLogs) { console.log("extraCols from special place:", extraCols) }
          this.extraCols = extraCols;
          this.w = theGrid.inner.width/theGrid.inner.nosCol*(1 + this.extraCols);
        }
        else if (this.sk.mouseX > this.x + theGrid.inner.width/theGrid.inner.nosCol){
          // We may need to make the oblong wider.
          const extraCols = Math.floor((this.sk.mouseX - this.x)/(theGrid.inner.width/theGrid.inner.nosCol));
          // if (prm.printConsoleLogs) { console.log("extraCols:", extraCols) }
          // Check whether making the oblong wider will occlude an existing oblong.
          const occlusion = theGrid.inner.oblongs.filter(function(o){
            // if (prm.printConsoleLogs) { console.log("o:", o) }
            // if (prm.printConsoleLogs) { console.log("self:", self) }
            return !o.beingDrawn &&
            // o.rowNo == self.rowNo &&
            o.colNo > self.colNo &&
            o.colNo <= self.colNo + extraCols
          })[0];
          // if (prm.printConsoleLogs) { console.log("occlusion:", occlusion) }
          if (occlusion !== undefined){
            // if (prm.printConsoleLogs) { console.log("GOT TO A DEFINED OCCLUSION!") }
            return;
          }
          if (touchType == "touchMoved"){
            this.w = this.sk.mouseX - this.x;
          }
          else if (touchType == "touchEnded"){
            // if (prm.printConsoleLogs) {
            //   console.log("GOT TO SNAP!")
            // }
            this.extraCols = extraCols;
            this.w = theGrid.inner.width/theGrid.inner.nosCol*(1 + this.extraCols);
          }
        }
        this.draw();
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
        };
        const bbOn = mu.bar_and_beat_number_of_ontime(
          note.ontime,
          compObj.timeSignatures
        );
        note.barOn = bbOn[0];
        note.beatOn = bbOn[1];
        note.offtime = note.ontime + note.duration;
        const bbOff = mu.bar_and_beat_number_of_ontime(
          note.offtime,
          compObj.timeSignatures
        );
        note.barOff = bbOff[0];
        note.beatOff = bbOff[1];
        let fsm;
        if (compObj.notes.length > 0){
          fsm = mu.fifth_steps_mode(
            mu.comp_obj2note_point_set(compObj),
            mu.krumhansl_and_kessler_key_profiles
          );
        }
        else {
          fsm = ["C major", 1, 0, 0];
        }
        if (fsm[0] !== compObj.keySignatures[0]){
          compObj.keySignatures = [{
            "barNo": 1,
            "keyName": fsm[0],
            "fifthSteps": fsm[2],
            "mode": fsm[3],
            "staffNo": 0,
            "ontime": 0
          }];
        }
        note.MPN = mu.guess_morphetic(note.MNN, fsm[2], fsm[3]);
        note.pitch = mu.midi_note_morphetic_pair2pitch_and_octave(
          note.MNN, note.MPN
        );
        note.stampCreate = Date.now();
        note.stampDelete = null;
        compObj.notes.push(note);
        this.idNote = note.id;
        theSound.schedule_events(compObj, prodObj, theGrid);
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
      this.beingDrawn = !this.beingDrawn;
    }


    toggle_highlight(){
      this.highlight = !this.highlight;
    }
  }

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
      this.sk = _sketch;
      this.mode = _mode;
      this.idCurr = "Help home";
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
      ];

      this.arrowLength = 150;
      this.arrowHeadHeight = 20;
      this.textArrowGap = 70;
      this.prevX = this.sk.width/2 - this.arrowLength - 150;
      this.nextX = this.sk.width/2 + this.arrowLength + 150;

      // Style
      this.bgColor = 90; // this.sk.color("#999999")
      this.opacity = 215;
      this.textColor = 230;

      // Possible to return something.
      // return sth;
    }

    /**
     * Draws the help content.
     */
    draw(){
      const self = this;
      this.sk.noStroke();
      this.sk.fill(self.bgColor, this.opacity);
      this.sk.rect(0, 0, this.sk.width, this.sk.height);
      // Display text.
      const currInfo = self.displayInfo.find(function(di){
        return di.id === self.idCurr
      });
      const textStr = currInfo["text"];
      // this.sk.strokeWeight(1)
      this.sk.textAlign(this.sk.CENTER, this.sk.TOP);
      this.sk.textSize(28);
      this.sk.fill(self.textColor);
      this.sk.text(textStr, this.sk.width/2, this.sk.height/10);
      // White-ish
      this.sk.strokeWeight(4);
      self.draw_close_button(self.textColor);
      // Purple
      this.sk.strokeWeight(2);
      self.draw_close_button(200, 20, 200);
      if (currInfo.prev !== null){
        // White-ish
        this.sk.strokeWeight(4);
        self.draw_prev_arrow(
          self.prevX,
          currInfo["prevNextY"], self.arrowLength, self.arrowHeadHeight,
          self.textColor
        );
        // Purple
        this.sk.strokeWeight(2);
        self.draw_prev_arrow(
          self.prevX,
          currInfo["prevNextY"], self.arrowLength, self.arrowHeadHeight,
          200, 20, 200
        );
        self.draw_prev_text(
          currInfo["prev"], self.prevX,
          currInfo["prevNextY"] - self.textArrowGap
        );
      }
      if (currInfo.next !== null){
        // White-ish. -/+2s for the shadow/highlight effect.
        this.sk.strokeWeight(4);
        self.draw_next_arrow(
          self.nextX,
          currInfo["prevNextY"], self.arrowLength, self.arrowHeadHeight,
          self.textColor
        );
        // Purple
        this.sk.strokeWeight(2);
        self.draw_next_arrow(
          self.nextX,
          currInfo["prevNextY"], self.arrowLength, self.arrowHeadHeight,
          200, 20, 200
        );
        self.draw_next_text(
          currInfo["next"], self.nextX,
          currInfo["prevNextY"] - self.textArrowGap
        );
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
        this.sk.stroke(r);
      }
      else {
        this.sk.stroke(r, g, b);
      }
      this.sk.noFill();
      this.sk.ellipseMode(this.sk.CENTER);
      this.sk.ellipse(this.sk.width - 100, 100, 100, 100);
      this.sk.line(this.sk.width - 100 - 35.36, 100 - 35.36, this.sk.width - 100 + 35.36, 100 + 35.36);
      this.sk.line(this.sk.width - 100 - 35.36, 100 + 35.36, this.sk.width - 100 + 35.36, 100 - 35.36);
    }

    draw_next_arrow(x, y, w, h, r, g, b){
      if (g == undefined && b == undefined){
        this.sk.stroke(r);
      }
      else {
        this.sk.stroke(r, g, b);
      }
      this.sk.noFill();
      this.sk.beginShape();
      this.sk.vertex(x - w, y - 5);
      this.sk.vertex(x - 20, y - 5);
      this.sk.vertex(x - 20, y - h/2);
      this.sk.vertex(x, y);
      this.sk.vertex(x - 20, y + h/2);
      this.sk.vertex(x - 20, y + 5);
      this.sk.vertex(x - w, y + 5);
      this.sk.endShape(this.sk.CLOSE);
    }

    draw_next_text(str, x, y){
      this.sk.textAlign(this.sk.RIGHT, this.sk.TOP);
      this.sk.textSize(28);
      this.sk.noStroke();
      this.sk.fill(this.textColor);
      this.sk.text(str, x, y);
    }

    draw_prev_arrow(x, y, w, h, r, g, b){
      if (g == undefined && b == undefined){
        this.sk.stroke(r);
      }
      else {
        this.sk.stroke(r, g, b);
      }
      this.sk.noFill();
      this.sk.beginShape();
      this.sk.vertex(x + w, y - 5);
      this.sk.vertex(x + 20, y - 5);
      this.sk.vertex(x + 20, y - h/2);
      this.sk.vertex(x, y);
      this.sk.vertex(x + 20, y + h/2);
      this.sk.vertex(x + 20, y + 5);
      this.sk.vertex(x + w, y + 5);
      this.sk.endShape(this.sk.CLOSE);
    }

    draw_prev_text(str, x, y){
      this.sk.textAlign(this.sk.LEFT, this.sk.TOP);
      this.sk.textSize(28);
      this.sk.noStroke();
      this.sk.fill(this.textColor);
      this.sk.text(str, x, y);
    }

    link(idStr){
      console.log("idStr:", idStr);
      const idCandidate = this.displayInfo.find(function(di){
        return di.id === idStr
      });
      console.log("idCandidate:", idCandidate);
      if (idCandidate !== undefined){
        this.idCurr = idCandidate.id;
        draw_components();
      }
      else {
        console.log("SHOULD NOT GET HERE IN HELP!");
      }
    }

    toggle_help(theVisual){
      this.mode = !this.mode;
      theVisual.trans.buttons.buttonsStruct["help"].toggle_clicked();
      theVisual.draw();
    }

    touch_check(theVisual){
      const self = this;
      const currInfo = self.displayInfo.find(function(di){
        return di.id === self.idCurr
      });
      if (this.sk.dist(this.sk.mouseX, this.sk.mouseY, self.prevX, currInfo["prevNextY"]) < self.arrowLength){
        console.log("Touch left arrow");
        if (currInfo["prev"] !== null){
          self.link(currInfo["prev"]);
        }
      }
      else if (this.sk.dist(this.sk.mouseX, this.sk.mouseY, self.nextX, currInfo["prevNextY"]) < self.arrowLength){
        console.log("Touch right arrow");
        if (currInfo["next"] !== null){
          self.link(currInfo["next"]);
        }
      }
      else {
        self.toggle_help(theVisual);
      }
    }

  }

  /**
  * The Dial class makes a circular interactive element that can be turned up or
  * down by moving a marker round.
  * @class Dial
  */

  class Dial {
    /**
     * Constructor for the Dial class, representing a dial in a sketch.
     * @param {p5} _sketch - The p5 instance that creates the dial.
     * @param {number} _id - A unique identifier for the dial.
     * @param {number} _x - The x-coordinate of the center of the dial.
     * @param {number} _y - The y-coordinate of the center of the dial.
     * @param {number} _radius - The radius of the dial.
     * @param {number} [_min=0] - The minimum value of the dial.
     * @param {number} [_max=1] - The maximum value of the dial.
     * @param {number} [_val=0.5] - The starting value of the dial.
     * @param {number} [_step=null] - The step size of the dial.
     */
    constructor(
      _sketch, _id, _x, _y, _radius, _min = 0, _max = 1, _val = 0.5, _step = null
    ){
      this.sk = _sketch;
      this.id = _id;
      this.x = _x;
      this.y = _y;
      this.radius = _radius;
      this.min = _min;
      this.max = _max;
      this.val = _val;
      this.step = _step;
      this.gradations = null;
      if (this.step !== null){
        let n = Math.floor((this.max - this.min)/this.step) + 1;
        this.gradations = new Array(n);
        for (let i = 0; i < n; i++){
          this.gradations[i] = this.min + this.step*i;
        }
      }
      // console.log("this.gradations:", this.gradations)

      // Pairing with Tone.js
      // this.toneObj = null
      // this.toneObjProperty = null

      // Defaults
      this.sk.colorMode(this.sk.RGB, 255);
      this.bgCol = this.sk.color(50, 55, 100);
      this.sk.colorMode(this.sk.HSB, 100);
      this.fgCol = this.sk.color(50, 55, 100);
      this.moving = false;
    }

    /**
     * Draws the dial on the canvas.
     */
    draw(){
      this.sk.strokeWeight(3);
      this.sk.stroke(this.fgCol);
      this.sk.fill(this.bgCol);
      this.sk.circle(this.x, this.y, 2*this.radius);
      this.sk.stroke(100);
      this.sk.line(this.x, this.y, this.x, this.y + this.radius);
      this.sk.stroke(this.fgCol);
      const prop = (this.val - this.min)/(this.max - this.min);
      this.sk.line(
        this.x,
        this.y,
        this.x + this.radius*this.sk.cos(this.sk.TWO_PI*prop - this.sk.HALF_PI),
        this.y - this.radius*this.sk.sin(this.sk.TWO_PI*prop - this.sk.HALF_PI)
      );
      let displayVal = this.val;
      if (Math.round(this.val) !== this.val){
        displayVal = Math.round(100*this.val)/100;
      }
      if (this.val >= 1000 || this.val <= -1000){
        displayVal = this.val.toExponential();
      }
      this.sk.strokeWeight(3/5);
      this.sk.stroke(100);
      this.sk.noFill();
      this.sk.textAlign(this.sk.CENTER, this.sk.BOTTOM);
      this.sk.textSize(9);
      this.sk.text(displayVal, this.x, this.y - 4);
      this.sk.fill(this.bgCol);
      this.sk.stroke(this.fgCol);
      this.sk.textAlign(this.sk.CENTER, this.sk.CENTER);
      this.sk.textSize(12);
      this.sk.text(this.id, this.x, this.y + this.radius + 13);
    }

    /**
     * Pairs a dial with a Tone.js object and its property.
     * @param {Object} toneObj - The Tone.js object to pair the dial with.
     * @param {string} toneObjProperty - The property of the Tone.js object to pair the dial with.
     */
    pair(toneObj, toneObjProperty){
      this.toneObj = toneObj;
      this.toneObjProperty = toneObjProperty;
    }

    /**
     * Method to set the value of a property on a Tone.js object based on the value of the dial.
     */
    set_pair_val(){
      // console.log("this.val:", this.val)
      switch(this.toneObjProperty){
        case "volume":
        // console.log("dB:", 40*Math.log(this.val))
        this.toneObj[this.toneObjProperty].value = 40*Math.log(this.val);
        break
        case "portamento":
        this.toneObj[this.toneObjProperty] = this.val;
        // const key = this.toneObjProperty
        // this.toneObj.set({
        //   key: this.val
        // })
        break
        case "spread":
        this.toneObj[this.toneObjProperty] = this.val;
        break
        case "detune":
        this.toneObj[this.toneObjProperty].value = this.val;
        break
        case "seconds":
        this.toneObj[this.toneObjProperty] = this.val;
        break
        // Er?
      }

        // this.toneObj.set({
        //   toneObjProperty: this.val
        // })
    }

    /**
     * Map mouse position to dial value
     *
     * This method maps the mouse position relative to the dial
     * to a value between `min` and `max` properties. The value
     * is also rounded to the nearest `step` if a `step` has been
     * provided in the dial constructor. The value is stored in the
     * `val` property and if a Tone.js object property has been paired
     * with this dial, the value is also updated on the paired Tone.js
     * object property.
     */
    set_val(){
      // Alpha is small +ve in first quadrant,
      // approaching +PI by end of second quadrant,
      // flips to -PI in third quadrant,
      // approaching small -ve by end of fourth quadrant.
      const alpha = this.sk.atan2(
        this.y - this.sk.mouseY,
        this.sk.mouseX - this.x
      );
      // Beta is -PI in fourth quadrant,
      // approaching small -ve by end of first quadrant,
      // flips to small +ve in second quadrant,
      // approaching +PI by end of third quadrant.
      let beta;
      if (alpha > -this.sk.HALF_PI){
        beta = alpha - this.sk.HALF_PI;
      }
      else {
        beta = 3*this.sk.PI/2 + alpha;
      }
      // console.log("alpha:", alpha, "beta:", beta)
      const candidateVal = this.sk.map(
        beta,
        -this.sk.PI, this.sk.PI,
        this.min, this.max
      );
      // Map the candidate value to the closest gradation,
      // if a step argument was provided when constructing
      // the dial.
      if (this.step !== null){
        const ma = mu.min_argmin(
          this.gradations.map(function(g){
            return Math.abs(g - candidateVal)
          })
        );
        this.val = this.gradations[ma[1]];
      }
      else {
        this.val = candidateVal;
      }

      // If a Tone.js object property has been paired with
      // this dial, update the property on the Tone.js object.
      if (this.toneObj !== undefined && this.toneObjProperty !== undefined){
        this.set_pair_val();
      }
    }

    /**
     * Toggles the moving state of the dial.
     */
    toggle_moving(){
      this.moving = !this.moving;
    }

    /**
     * Determines whether the current mouse position is within the radius of the dial's center point.
     *
     * @function
     * @returns {boolean} - True if the mouse position is within the dial's radius; false otherwise.
     */
    touch_check(){
      return this.sk.dist(
        this.sk.mouseX, this.sk.mouseY, this.x, this.y
      ) <= this.radius
    }
  }

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
      this.sk = _sketch;
      // Handle grid and inner grid.
      this.x = param.grid.x || melEd.x;
      this.y = param.grid.y || melEd.y + 1.25/10*melEd.height;
      this.width = param.grid.width || melEd.width;
      this.height = param.grid.height || 5/10*melEd.height;

      // Inner grid
      this.inner = {}; // param.grid.inner
      this.inner.nosRow = param.grid.inner.nosRow || 25;
      this.inner.nosCol = param.grid.inner.nosCol || 16;
      this.inner.x = param.grid.inner.x || this.x + this.width/(this.inner.nosCol + 2);
      this.inner.y = param.grid.inner.y || this.y + this.height/(this.inner.nosRow + 2);
      this.inner.width = param.grid.inner.width || this.width - 2*(this.inner.x - this.x);
      this.inner.height = param.grid.inner.height || this.height - 2*(this.inner.y - this.y);
      this.inner.cells = param.grid.inner.cells || [];
      // this.inner.oblongs = param.grid.inner.oblongs || [] // Defined below.
      this.inner.selectedOblong = param.grid.inner.selectedOblong || null;
      this.inner.oblongImg = param.grid.inner.oblongImg || [];
      this.inner.oblongImgName = param.grid.inner.oblongImgName || ["obBgn.png", "obMid.png", "obEnd.png"];
      this.inner.currBackImg = null;
      this.inner.backImg = param.grid.inner.backImg || [];
      this.inner.backImgName = param.grid.inner.backImgName || [];

      // Outer grids
      this.outer = { "left": {}, "top": {}, "right": {}, "bottom": {} };
      this.outer.left.x = (param.grid.outer && param.grid.outer.left && param.grid.outer.left.x) || this.x;
      this.outer.left.y = (param.grid.outer && param.grid.outer.left && param.grid.outer.left.y) || this.inner.y;
      this.outer.left.width = (param.grid.outer && param.grid.outer.left && param.grid.outer.left.width) || this.width/(this.inner.nosCol + 2);
      this.outer.left.height = (param.grid.outer && param.grid.outer.left && param.grid.outer.left.height) || this.inner.height;
      this.outer.left.cells = (param.grid.outer && param.grid.outer.left && param.grid.outer.left.cells) || [];
      // Positioning of top outer grid
      this.outer.top.x = (param.grid.outer && param.grid.outer.top && param.grid.outer.top.x) || this.inner.x;
      this.outer.top.y = (param.grid.outer && param.grid.outer.top && param.grid.outer.top.y) || this.y;
      this.outer.top.width = (param.grid.outer && param.grid.outer.top && param.grid.outer.top.width) || this.inner.width;
      this.outer.top.height = (param.grid.outer && param.grid.outer.top && param.grid.outer.top.height) || this.height/(this.inner.nosRow + 2);
      this.outer.top.cells = (param.grid.outer && param.grid.outer.top && param.grid.outer.top.cells) || [];
      // Positioning of right outer grid
      this.outer.right.x = (param.grid.outer && param.grid.outer.right && param.grid.outer.right.x) || this.inner.x + this.inner.width;
      this.outer.right.y = (param.grid.outer && param.grid.outer.right && param.grid.outer.right.y) || this.inner.y;
      this.outer.right.width = (param.grid.outer && param.grid.outer.right && param.grid.outer.right.width) || this.width/(this.inner.nosCol + 2);
      this.outer.right.height = (param.grid.outer && param.grid.outer.right && param.grid.outer.right.height) || this.inner.height;
      this.outer.right.cells = (param.grid.outer && param.grid.outer.right && param.grid.outer.right.cells) || [];
      // Positioning of bottom outer grid
      this.outer.bottom.x = (param.grid.outer && param.grid.outer.bottom && param.grid.outer.bottom.x) || this.inner.x;
      this.outer.bottom.y = (param.grid.outer && param.grid.outer.bottom && param.grid.outer.bottom.y) || this.inner.y + this.inner.height;
      this.outer.bottom.width = (param.grid.outer && param.grid.outer.bottom && param.grid.outer.bottom.width) || this.inner.width;
      this.outer.bottom.height = (param.grid.outer && param.grid.outer.bottom && param.grid.outer.bottom.height) || this.height/(this.inner.nosRow + 2);
      this.outer.bottom.cells = (param.grid.outer && param.grid.outer.bottom && param.grid.outer.bottom.cells) || [];

      this.param = {};
      this.param.prevEditMode = (param.grid.param && param.grid.param.prevEditMode) || null;
      this.param.editMode = (param.grid.param && param.grid.param.editMode) || "pencil";
      this.param.cursorType = (param.grid.param && param.grid.param.cursorType) || "arrow";
      this.param.leftInt = (param.grid.param && param.grid.param.leftInt) || 0;
      this.param.pHeadInt = (param.grid.param && param.grid.param.pHeadInt) || 0; // Obsolete?
      // this.param.topMnn = (param.grid.param && param.grid.param.topMnn) || 30
      this.param.pcs = (param.grid.param && param.grid.param.pcs) || [0, 2, 4, 5, 7, 9];
      this.param.mnns = this.get_mnns(this.param.pcs, param.range);
      this.param.topMnn = this.param.mnns.length - 1;
      console.log("this.param.mnns:", this.param.mnns);
      this.param.gran = param.gran;

      this.inner.oblongs = this.comp_obj2oblongs(compObj);
      console.log("this.inner.oblongs:", this.inner.oblongs);
      // this.cycle_logos()

      // Construct inner grid.
      for (let i = 0; i < this.inner.nosRow; i++){
        this.inner.cells[i] = [];
        for (let j = 0; j < this.inner.nosCol; j++){
          this.inner.cells[i][j] = new Cell(
            this.sk, true, i, j, this.inner.nosRow, this.inner.nosCol,
            this.inner.x, this.inner.y, this.inner.width, this.inner.height
          );
        }
      }
      // Construct outer grids.
      for (let i = 0; i < this.inner.nosRow; i++){
        if (i == 0){
          if (this.param.printConsoleLogs) { console.log("this.outer.left.x:", this.outer.left.x); }
        }
        this.outer.left.cells[i] = new Cell(
          this.sk, false, i, 0, this.inner.nosRow, 1,
          this.outer.left.x, this.outer.left.y, this.outer.left.width, this.outer.left.height
        );
        this.outer.right.cells[i] = new Cell(
          this.sk, false, i, 0, this.inner.nosRow, 1,
          this.outer.right.x, this.outer.right.y, this.outer.right.width, this.outer.right.height
        );
      }
      for (let j = 0; j < this.inner.nosCol; j++){
        this.outer.top.cells[j] = new Cell(
          this.sk, false, 0, j, 1, this.inner.nosCol,
          this.outer.top.x, this.outer.top.y, this.outer.top.width, this.outer.top.height
        );
        this.outer.bottom.cells[j] = new Cell(
          this.sk, false, 0, j, 1, this.inner.nosCol,
          this.outer.bottom.x, this.outer.bottom.y, this.outer.bottom.width, this.outer.bottom.height
        );
      }

    }

    /**
     * Creates an array of oblongs for the given component.
     * @param {Object} c - The Composition object for which to create the array of
     * oblongs.
     * @returns {Array} oblongs - The array of oblongs for the given component.
     */
    comp_obj2oblongs(c){
      const self = this;
      // Dissociated granularity and zoom, so forcing this to 1 for now.
      // const gFloat = 1
      const gFloat = self.string_fraction2decimal(self.param.gran.value);
      if (self.param.printConsoleLogs){
        console.log(
          "gFloat*(self.param.leftInt + self.inner.nosCol:",
          gFloat*(self.param.leftInt + self.inner.nosCol)
        );
      }
      if (self.param.printConsoleLogs) {
        console.log("c.notes before filtering:", c.notes);
      }
      console.log("self.param.topMnn:", self.param.topMnn);
      console.log("self.inner.nosRow:", self.inner.nosRow);
      console.log("mnns[t]:", self.param.mnns[self.param.topMnn]);
      console.log("mnns[t - nrow]:", self.param.mnns[self.param.topMnn - self.inner.nosRow + 1]);
      const notes = c.notes.filter(function(n){
        return n.stampDelete == null &&
        n.ontime < gFloat*(self.param.leftInt + self.inner.nosCol) &&
        n.ontime + n.duration > gFloat*self.param.leftInt &&
        self.param.mnns.indexOf(n.MNN) >= 0 &&
        n.MNN <= self.param.mnns[self.param.topMnn] &&
        n.MNN >= self.param.mnns[self.param.topMnn - self.inner.nosRow + 1]
        // n.MNN <= t && n.MNN >= t - nrow
      });
      // if (prm.printConsoleLogs){
        console.log("notes:", notes);
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
      });
      if (self.inner.selectedOblong !== null){
        console.log("self.inner.selectedOblong.idNote:", self.inner.selectedOblong.idNote);
        let idxHighlight = notes.findIndex(function(n){
          return n.id == self.inner.selectedOblong.idNote
        });
        console.log("idxHighlight:", idxHighlight);
        if (idxHighlight >= 0){
          oblongs[idxHighlight].highlight = true;
        }
      }
      return oblongs

    }

    /**
     * Cycles through logos in the inner object every 5 seconds.
     * @param {Visual} _visual - The {@link Visual} class instance.
     */
    cycle_logos(_visual){
      const self = this;
      setInterval(function(){
        self.inner.currBackImg = mu.choose_one(self.inner.backImg);
        _visual.draw();
      }, 5000);
    }

    /**
     * Draws the grid.
     * @param {Boolean} recalculateDimensions - Whether to recalculate the dimensions.
     */
    draw(recalculateDimensions){
      const self = this;
      const gFloat = self.string_fraction2decimal(self.param.gran.value);
      self.sk.fill(255);
      self.sk.noStroke();
      self.sk.rectMode(self.sk.CORNER);
      self.sk.rect(this.x, this.y, this.width, this.height);

      // Logo behind the cells.
      if (self.inner.currBackImg !== null){
        self.sk.imageMode(self.sk.CENTER);
        self.sk.tint(255, 50);
        let imgHeight = 280;
        let imgWidth = self.inner.currBackImg.width*280/self.inner.currBackImg.height;
        if (imgWidth > 600){
          imgWidth = 600;
          imgHeight = self.inner.currBackImg.height*imgWidth/self.inner.currBackImg.width;
        }
        self.sk.image(
          self.inner.currBackImg, self.inner.x + self.inner.width/2,
          self.inner.y + self.inner.height/2, imgWidth, imgHeight);
        self.sk.noTint();
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
            }, false, self.param.mnns, self.param.topMnn);
          }
          else {
            self.inner.cells[i][j].draw(null, false, self.param.mnns, self.param.topMnn);
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
        });
        c.add_text("pitch", self.param.topMnn, null, self.param.mnns);
      });
      self.outer.top.cells.forEach(function(c){
        c.draw({
          "gridX": self.outer.top.x,
          "gridY": self.outer.top.y,
          "gridWidth": self.outer.top.width,
          "gridHeight": self.outer.top.height
        });
        c.add_text("ontime", self.param.leftInt, gFloat);
      });
      self.outer.right.cells.forEach(function(c){
        c.draw({
          "gridX": self.outer.right.x,
          "gridY": self.outer.right.y,
          "gridWidth": self.outer.right.width,
          "gridHeight": self.outer.right.height
        });
        c.add_text("pitch", self.param.topMnn, null, self.param.mnns);
      });
      self.outer.bottom.cells.forEach(function(c){
        c.draw({
          "gridX": self.outer.bottom.x,
          "gridY": self.outer.bottom.y,
          "gridWidth": self.outer.bottom.width,
          "gridHeight": self.outer.bottom.height
        });
        c.add_text("ontime", self.param.leftInt, gFloat);
      });
      // Draw oblongs.
      self.sk.imageMode(self.sk.CORNER);
      self.inner.oblongs.forEach(function(o){
        o.draw(recalculateDimensions, self.inner);
      });
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
      const minMod12 = mnnRange[0] % 12;
      // console.log("minMod12:", minMod12)
      // Find appropriate beginning MIDI note number, given the pitch classes
      // we're working with.
      let ipc = 0;
      while (ipc < pitchClasses.length && minMod12 > pitchClasses[ipc]){
        ipc++;
      }
      console.log("ipc:", ipc);
      // Find appropriate ending MIDI note number, given the pitch classes we're
      // working with.
      const maxMod12 = mnnRange[1] % 12;
      let jpc = 0;
      while (jpc < pitchClasses.length && maxMod12 > pitchClasses[jpc]){
        jpc++;
      }
      console.log("jpc:", jpc);
      // Generate the MIDI note numbers.
      let allMnns = [mnnRange[0]];
      let imnn = 0;
      let octaveIncrement = Math.floor(mnnRange[0]/12);
      while (allMnns[imnn] < mnnRange[1]){
        ipc++, imnn++;
        if (ipc == pitchClasses.length){
          ipc = 0;
          octaveIncrement++;
        }
        allMnns.push(12*octaveIncrement + pitchClasses[ipc]);
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
      const self = this;
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
        let rowCol;
        if (self.param.editMode == "pencil"){
          // Check inner grid cells.
          let i = 0;
          while (i < self.inner.nosRow && rowCol == undefined){
            let j = 0;
            while (j < self.inner.nosCol && rowCol == undefined){
              rowCol = self.inner.cells[i][j].touch_check();
              j++;
            }
            i++;
          }
          // console.log("rowCol:", rowCol)
          // Check to avoid introducing polyphony.
          const polyphony = self.inner.oblongs.find(function(o){
            return rowCol.colNo >= o.colNo &&
            rowCol.colNo <= o.colNo + o.extraCols
          });
          // Check to avoid drawing a duplicate.
          const duplicate = self.inner.oblongs.find(function(o){
            return o.rowNo == rowCol.rowNo &&
            o.colNo == rowCol.colNo
          });
          if (
            rowCol !== undefined &&
            duplicate == undefined &&
            polyphony == undefined
          ){
            let oblong = new Oblong(
              self.sk, self.inner.oblongImg[0], self.inner.oblongImg[1],
              self.inner.oblongImg[2], true, rowCol.rowNo, rowCol.colNo,
              null, null, self.inner
            );
            oblong.draw();
            self.inner.oblongs.push(oblong);
          }
        }
        break
        case "touchMoved":
        if (self.param.editMode == "pencil"){
          // Get the oblong that's being drawn.
          const oblong = self.inner.oblongs.find(function(o){
            return o.beingDrawn
          });
          // console.log("oblong:", oblong)
          if (oblong !== undefined){
            oblong.widen(touchType, self, _sonic);
          }
        }
        break
        case "touchEnded":
        if (self.param.editMode == "pencil"){
          // Get the oblong that's being drawn.
          const oblong = self.inner.oblongs.find(function(o){ return o.beingDrawn });
          // console.log("oblong:", oblong)
          if (oblong !== undefined){
            oblong.widen(touchType, self, _sonic);
            oblong.toggle_being_drawn();
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
          });
          // console.log("relIdx:", relIdx)
          if (relIdx >= 0){
            // console.log("self.inner.oblongs[relIdx]:", self.inner.oblongs[relIdx])
            // Alter stampDelete of associated note and remove oblong.
            let relNote = compObj.notes.find(function(n){
              return n.id == self.inner.oblongs[relIdx].idNote
            });
            if (relNote !== undefined){
              relNote.stampDelete = Date.now();
            }
            else {
              console.log("Shouldn't get here, but I have noticed it happen for oblongs created during playback, when the snap doesn't seem to resolve.");
            }
            self.inner.oblongs.splice(relIdx, 1);
            // Redraw. Could be constrained to redrawing a single row...
            self.draw();
            _sonic.schedule_events(compObj, prodObj, self);
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
          });
          console.log("relIdx from cursor editing:", relIdx);
          if (relIdx >= 0){
            if (self.inner.selectedOblong.idNote == self.inner.oblongs[relIdx].idNote){
              // Clicked on the already-highlighted oblong. Change it's duration.
              _sonic.check_and_implement_edit(compObj, "shorten", self);
            }
            else {
              // Change which oblong is highlighted.
              if (self.inner.selectedOblong !== null){
                self.inner.selectedOblong.toggle_highlight();
              }
              self.inner.selectedOblong = self.inner.oblongs[relIdx];
              self.inner.selectedOblong.toggle_highlight();
            }
            self.draw();
            // draw_components()
          }
        }
        break
        default:
        console.log("Shouldn't get to default in this switch!");
      }

    }

    /**
     * Converts a string fraction to a decimal.
     * @param {String} str - The string fraction.
     * @returns {Number} ans - The decimal representation of the string fraction.
     */
    string_fraction2decimal(str){
      let ans;
      if (str.indexOf("/") >= 0){
        let split = str.split("/");
        ans = split[0]/split[1];
      }
      else {
        ans = parseInt(str);
      }
      return ans
    }


  }

  class PlayWheel extends Dial {
    constructor(_sketch, _id, _x, _y, _radius, _min = 0, _max = 1, _val = 0.5, _step = null){
      super(_sketch, _id, _x, _y, _radius, _min, _max, _val, _step);
      // Any extra properties/actions here, which could have been
      // passed into the constructor also...
      this.disabled = true;
      this.playing = false;

    }


    draw(){
      // Draw play/pause button.
      this.sk.strokeWeight(3);
      this.sk.stroke(this.fgCol);
      this.sk.fill(this.bgCol);
      if (this.playing){
        // Draw pause button.
        this.sk.rectMode(this.sk.CORNER);
        this.sk.rect(
          this.x - 2/3*this.radius, this.y - 0.5*this.radius,
          2/3*this.radius, 4/3*this.radius,
          5
        );
        this.sk.rect(
          this.x - 2/3*this.radius, this.y - 0.5*this.radius,
          2/3*this.radius, 4/3*this.radius,
          5
        );
      }
      else {
        // Draw play button.
        this.sk.triangle(
          this.x - 0.5*this.radius, this.y - 0.5*this.radius,
          this.x - 0.5*this.radius, this.y + 0.5*this.radius,
          this.x + 0.5*this.radius, this.y,
          5
        );
      }

      // Draw dial.
      this.sk.strokeWeight(3);
      this.sk.stroke(this.fgCol);
      this.sk.fill(this.bgCol);
      this.sk.circle(this.x, this.y, 2*this.radius);
      this.sk.stroke(100);
      this.sk.line(this.x, this.y, this.x, this.y + this.radius);
      this.sk.stroke(this.fgCol);
      const prop = (this.val - this.min)/(this.max - this.min);
      this.sk.line(
        this.x,
        this.y,
        this.x + this.radius*this.sk.cos(this.sk.TWO_PI*prop - this.sk.HALF_PI),
        this.y - this.radius*this.sk.sin(this.sk.TWO_PI*prop - this.sk.HALF_PI)
      );
      // Do not do display of value or id here.
      // let displayVal = this.val
      // if (Math.round(this.val) !== this.val){
      //   displayVal = Math.round(100*this.val)/100
      // }
      // if (this.val >= 1000 || this.val <= -1000){
      //   displayVal = this.val.toExponential()
      // }
      // this.sk.strokeWeight(3/5)
      // this.sk.stroke(100)
      // this.sk.noFill()
      // this.sk.textAlign(this.sk.CENTER, this.sk.BOTTOM)
      // this.sk.textSize(9)
      // this.sk.text(displayVal, this.x, this.y - 4)
      // this.sk.fill(this.bgCol)
      // this.sk.stroke(this.fgCol)
      // this.sk.textAlign(this.sk.CENTER, this.sk.CENTER)
      // this.sk.textSize(12)
      // this.sk.text(this.id, this.x, this.y + this.radius + 13)
    }


    set_max(_max){
      this.max = _max;
      if (this.step !== null){
        let n = Math.floor((this.max - this.min)/this.step) + 1;
        this.gradations = new Array(n);
        for (let i = 0; i < n; i++){
          this.gradations[i] = this.min + this.step*i;
        }
      }
    }


    toggle_disabled(){
      this.disabled = !this.disabled;
    }


    toggle_play(){
      this.playing = !this.playing;
    }


    touch_check(){
      // Establish general proximity to dial.
      const d = this.sk.dist(
        this.sk.mouseX, this.sk.mouseY, this.x, this.y
      );
      if (d > this.radius){ return false }
      // Toggle play if it's within 3/4 of the radius.
      if (d < 0.75*this.radius){ return "toggle play" }
      // Otherwise control the outer wheel (dial).
      else { return "move dial" }
    }

  }

  /**
  * The Waveform class makes a draggable rectangle representing the waveform of an
  * audio file, which can be moved around the interior of a larger rectangle
  * instantiated by the {@link Waveforms} class.
  * @class Waveform
  */

  class Waveform {

    /**
     * Constructor for making a new instance of the Waveform class.
     * @param {Object} _sketch The p5 sketch in which one or more instances of the
     * Waveform class will exist.
     */
    constructor(_sketch, _url, _x, _y, _rectH, _secPerBox, _wvfs){
      this.sk = _sketch;
      this.x = _x;
      this.y = _y;
      this.rectH = _rectH;
      this.secPerBox = _secPerBox;
      this.wvfs = _wvfs;
      this.dragOffset = {};
      this.moving = false;

      // Player
      const self = this;
      self.player = new Tone.Player(
        _url,
        function(){
          console.log("Loaded!");
          self.player.volume.value = -15;
          // Handle scheduling of waveforms.
          const startTime = self.sk.map(
            self.x, _wvfs.x, _wvfs.x + _wvfs.w,
            _wvfs.xInSec, _wvfs.xInSec + _wvfs.wInSec
          );
          console.log("startTime:", startTime);
          if (startTime >= 0){
            self.player.sync().start(startTime);
          }
          else {
            self.player.sync().start(0, -startTime);
          }
          // self.player.sync().start(0)
          self.player.connect(Tone.Destination);
          // src2.connect(myPanner)
          // myPanner.connect(Tone.Destination)

          // Programmatic alteration of SFX parameters.
          // Tone.Transport.schedule(function(time){
          //   myPanner.pan.value = -1
          //   myPanner.pan.rampTo(1, 1.5)
          // }, "0:0:0")

          // Buffer
          const buffer = self.player.buffer;
          // console.log("buffer:", buffer)
          self.duration = buffer._buffer.duration;
          self.fs = buffer._buffer.sampleRate;
          self.nosSamples = buffer._buffer.length;
          self.w = _wvfs.w*self.duration/_wvfs.wInSec;
          // Potentially obsolete but render() uses it still at the mo.
          self.nBox = self.duration/self.secPerBox;
          self.h = self.rectH;

          // Do something with the buffer.
          self.vals = self.get_wav_summary(buffer);
          // console.log("self.vals:", self.vals)
          self.render();
          _wvfs.draw();

        }
      );
    }


    draw(){
      this.sk.image(this.graphicsBuffer, this.x, this.y);
    }

    /**
     * Gets and returns summary of amplitude values in the waveform, which can be
     * stored in a graphics buffer to avoid unncessary recalculation when
     * rendering the interface.
     * @param {Object} buff The audio buffer from which we can extract (typically)
     * the RMS, providing a summary of amplitude values in the waveform.
     * @return {Array} An array of pairs: the first element of each pair is the
     * proprtion through the waveform; the second element is (typically) the RMS
     * associated with the corresponding time window of the waveform.
     */
    get_wav_summary(buff){
      let chData = Array.from(buff.getChannelData(0));
      // console.log(chData.length)

      if (this.nBox === undefined){
        // No boxing/summary required.
        return chData
      }
      else {

        // Boxing/summary required.
        const idxSpacing = Math.round(this.fs*this.secPerBox);
        const boxesToDraw = new Array(
          Math.ceil(this.nosSamples/idxSpacing)
        );
        for (let i = 0; i < boxesToDraw.length; i++){
          // Calculate local value.
          const localPoints = chData.slice(
            idxSpacing*i,
            Math.min(idxSpacing*(i + 1), this.nosSamples)
          );
          // Could do RMS instead.
          const localRms = Math.sqrt(
            localPoints.reduce(function(a, b){
              return a + Math.pow(b, 2)
            }, 0)/localPoints.length
          );
          boxesToDraw[i] = [
            idxSpacing*i/this.nosSamples, localRms
          ];
        }
        return boxesToDraw
      }
    }


    move(){
      this.x = this.sk.mouseX - this.dragOffset.x;
      this.y = this.sk.mouseY - this.dragOffset.y;
    }


    render(){
      const self = this;
      const x = self.x;
      const y = self.y;
      const w = self.w;
      const h = self.h;
      // console.log("[x, y, w, h]:", [x, y, w, h])

      // Save to a graphics buffer for ease of use with playback.
      self.graphicsBuffer = self.sk.createGraphics(w, h);
      self.graphicsBuffer.fill(255, 215, 0);
      self.graphicsBuffer.noStroke();
      self.graphicsBuffer.rect(0, 0, w, h);
      // image(self.graphicsBuffer, x, y)

      // console.log("self.nBox:", self.nBox)
      if (self.nBox === undefined){
        // Untested!
        self.graphicsBuffer.stroke(0);
        self.vals.forEach(function(val, idx){
          self.graphicsBuffer.line(
            w*idx/self.vals.length,
            h*(1 - (val + 1)/2),
            w*(idx + 1)/self.vals.length,
            h*(1 - (self.vals[idx + 1] + 1)/2)
          );
        });
      }
      else {
        self.graphicsBuffer.fill(245);
        self.graphicsBuffer.noStroke();
        self.vals.forEach(function(val, idx){
          if (idx < self.vals.length - 1){
            self.graphicsBuffer.rect(
              w*val[0],
              h*(1 - val[1])/2,
              w*(self.vals[idx + 1][0] - val[0]),
              h*val[1]
            );
          }
          else {
            self.graphicsBuffer.rect(
              w*val[0],
              h*(1 - val[1])/2,
              w*(1 - val[0]),
              h*val[1]
            );
          }
        });
      }

      // self.graphicsBuffer.copy(
      //   // source
      //   canvas,
      //   // source x, y, w, h
      //   x, y, w, h,
      //   // destination x, y, w, h
      //   0, 0, self.graphicsBuffer.width, self.graphicsBuffer.height
      // )
    }


    touch_check(){
      if (this.sk.mouseX >= this.x &&
        this.sk.mouseX < this.x + this.w &&
        this.sk.mouseY >= this.y &&
        this.sk.mouseY < this.y + this.h
      ){
        this.dragOffset = {
          "x": this.sk.mouseX - this.x,
          "y": this.sk.mouseY - this.y
        };
        this.moving = true;
        return true
      }
    }


    touch_end(_x, _w){
      const self = this;
      self.player.unsync();
      const startTime = this.sk.map(
        self.x, _x, _x + _w,
        self.wvfs.xInSec, self.wvfs.xInSec + self.wvfs.wInSec
      );
      console.log("startTime:", startTime);
      if (startTime >= 0){
        self.player.sync().start(startTime);
      }
      else {
        self.player.sync().start(0, -startTime);
      }
      self.moving = false;
    }
  }

  class Waveforms {
    constructor(_sketch, _x, _y, _w, _h, _xInSec, _wInSec){
      this.sk = _sketch;
      this.x = _x;
      this.y = _y;
      this.w = _w;
      this.h = _h;
      this.xInSec = _xInSec;
      this.wInSec = _wInSec;

      this.arr = [];
      this.movingIdx = -1;
    }


    add_waveform(_url, _x, _y, _rectH, _secPerBox){
      this.arr.push(
        new Waveform(this.sk, _url, _x, _y, _rectH, _secPerBox, this)
      );
    }


    draw(){
      const self = this;
      self.sk.background(220);
      // Outer rectangle
      self.sk.push();
      self.sk.noFill();
      self.sk.stroke(100, 100, 130);
      self.sk.strokeWeight(6);
      self.sk.rect(self.x - 3, self.y - 3, self.w + 6, self.h + 6, 5);
      self.sk.pop();

      // Waveforms
      self.sk.push();
      self.sk.fill(220); self.sk.noStroke();
      self.sk.rect(self.x, self.y, self.w, self.h);
      self.sk.drawingContext.clip();
      self.arr.forEach(function(wf){
        if (wf.graphicsBuffer){
          wf.draw();
        }
      });
      self.sk.pop();

      // Playhead
      if (
        Tone.Transport.seconds >= self.xInSec &&
        Tone.Transport.seconds < self.xInSec + self.wInSec
      ){
        self.sk.stroke(100, 100, 130);
        const x = self.sk.map(
          Tone.Transport.seconds,
          self.xInSec,
          self.xInSec + self.wInSec,
          self.x,
          self.x + self.w
        );
        self.sk.line(
          x, self.y, x, self.y + self.h
        );
      }
    }


    move(){
      if (this.movingIdx >= 0){
        this.arr[this.movingIdx].move();
      }
    }


    playback(){
      const self = this;
      Tone.Transport.scheduleRepeat(function(){
        Tone.Draw.schedule(function(){
          self.draw();
        }, Tone.now());
      }, 0.05);
      // Tone.Transport.seconds = 0
      Tone.Transport.start();
    }


    touch_check(){
      this.movingIdx = this.arr.findIndex(function(wf){
        return wf.touch_check()
      });
      return this.movingIdx
    }


    touch_end(){
      if (this.movingIdx >= 0){
        this.arr[this.movingIdx].touch_end(this.x, this.w);
        this.movingIdx = -1;
      }
    }
  }

  class TextInput {
    constructor(
      _sketch, _inputPlaceholder, _inputX, _inputY, _inputW, _btnText, _btnX, _btnY
    ){
      // this.sk = _sketch,
      this.input = _sketch.createInput(_inputPlaceholder);
      this.input.position(_inputX, _inputY);
      this.input.size(_inputW);
      this.subBtn = _sketch.createButton(_btnText);
      this.subBtn.position(_btnX, _btnY);
      this.subBtn.mousePressed(this.mouse_pressed.bind(this));
    }


    mouse_pressed(wavfs){
      try {
        // console.log("this:", this)
        wavfs.add_waveform(this.input.elt.value, 30, 100, rectH, secPerBox, wavfs);
      }
      catch (error){
        console.error(error);
      }
    }
  }

  /**
   * @file Welcome to the API for MAIA GUI!
   *
   * MAIA GUI is a JavaScript package used by Music Artificial Intelligence
   * Algorithms, Inc. in various applications that we have produced or are
   * developing currently.
   *
   * @version 0.0.1
   * @author Tom Collins
   * @copyright 2021-23
   *
   */
  // import {
  //   fifth_steps_mode as fifth_steps_mode_default,
  //   aarden_key_profiles as aarden_key_profiles_default,
  //   krumhansl_and_kessler_key_profiles as krumhansl_and_kessler_key_profiles_default
  // } from './util_key'


  // const Button = Button;
  // const Buttons = Buttons;
  // const EditButtons = EditButtons;
  // const TransportButtons = TransportButtons;
  // const GranularityButtons = GranularityButtons;
  // const NavigationButtons = NavigationButtons;
  // const EnvelopeButtons = EnvelopeButtons;
  // const Cell = Cell;
  // const Envelope = Envelope;
  // const EnvelopeNode = EnvelopeNode;
  // const Oblong = Oblong;
  // const Help = Help;
  // const Dial = Dial;
  // const Grid = Grid;
  // const PlayWheel = PlayWheel;
  // const Waveform = Waveform;
  // const Waveforms = Waveforms;
  // const TextInput = TextInput;


  var maiaGui = {
    Button: Button,
    Buttons: Buttons,
    EditButtons: EditButtons,
    TransportButtons: TransportButtons,
    GranularityButtons: GranularityButtons,
    NavigationButtons: NavigationButtons,
    EnvelopeButtons: EnvelopeButtons,
    Cell: Cell,
    Envelope: Envelope,
    EnvelopeNode: EnvelopeNode,
    Oblong: Oblong,
    Help: Help,
    Dial: Dial,
    Grid: Grid,
    PlayWheel: PlayWheel,
    Waveform: Waveform,
    Waveforms: Waveforms,
    TextInput: TextInput

  };

  return maiaGui;

}());
