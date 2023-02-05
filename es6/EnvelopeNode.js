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
    this.sk = theSketch
    this.id = theId
    // Whether it came from comp or prod, which property, and id. Also the min/max
    // values for the property.
    this.ctx = theCtx
    this.x = theX
    this.y = theY
    this.beingMoved = theBeingMoved
    this.fillColor = theFillColor
    this.diameter = theDiameter
    this.inner = theInner
    this.pixelX = this.sk.map(
      this.x, 0, 1, theInner.x + this.diameter/2,
      theInner.x + theInner.width - this.diameter/2
    )
    // this.pixelX = theInner.x + this.diameter/2 + (theInner.width - this.diameter)*this.x
    this.pixelY = this.sk.map(
      this.y, 0, 1, theInner.y + theInner.height - this.diameter,
      theInner.y + this.diameter/2
    )
    // this.pixelY = theInner.y + this.diameter/2 + (theInner.height - this.diameter)*(1 - this.y)
    this.pPixelX = null
    this.pPixelY = null

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
    this.sk.fill(this.fillColor)
    this.sk.ellipseMode(this.sk.CENTER)
    // console.log("this.pixelX:", this.pixelX, "this.pixelY:", this.pixelY)
    this.sk.circle(this.pixelX, this.pixelY, this.diameter)
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
    const self = this

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
        self.pPixelX = self.pixelX
        self.pPixelY = self.pixelY
      }
      else if (touchType == "touchMoved"){
        // We may need to move the oblong node.
        // Check whether moving it would go behind or beyond an existing node,
        // which we will disallow.
        let nodeL = theEnv.nodes[theNodeIdx - 1]
        let nodeR = theEnv.nodes[theNodeIdx + 1]
        if (nodeL !== undefined && nodeR !== undefined){
          const behindOrBeyond = self.sk.mouseX < nodeL.pixelX || self.sk.mouseX > nodeR.pixelX
          // if (prm.printConsoleLogs) { console.log("behindOrBeyond:", behindOrBeyond) }
          if (!behindOrBeyond){
            self.pixelX = self.sk.mouseX
            self.pixelY = self.sk.mouseY
            self.x = self.sk.map(
              self.pixelX, self.inner.x + self.diameter/2,
              self.inner.x + self.inner.width - self.diameter, 0, 1
            )
            // self.x = (self.pixelX - self.inner.x - self.diameter/2)/(self.inner.width - self.diameter)
            self.y = self.sk.map(
              self.pixelY, self.inner.y + self.diameter/2,
              self.inner.y + self.inner.height - self.diameter, 1, 0
            )
            // self.y = 1 - (self.pixelY - self.inner.y - self.diameter/2)/(self.inner.height - self.diameter)
          }
        }
        else {
          // Prevent moves in x-plane of outermost nodes.
          self.pixelY = self.sk.mouseY
          self.y = self.sk.map(
            self.pixelY, self.inner.y + self.diameter/2,
            self.inner.y + self.inner.height - self.diameter, 1, 0
          )
          // self.y = 1 - (self.pixelY - self.inner.y - self.diameter/2)/(self.inner.height - self.diameter)
        }
        theEnv.draw()
      }
      else if (touchType == "touchEnded"){
        // if (prm.printConsoleLogs) { console.log("Pixel positions:", self.pixelX, self.pixelY, self.pPixelX, self.pPixelY) }
        // Is this an attempt to delete the node?
        if (self.sk.dist(self.pixelX, self.pixelY, self.pPixelX, self.pPixelY) < 5){
          // console.log("GOT HERE!")
          // Prevent deletion of outermost nodes.
          let nodeL = theEnv.nodes[theNodeIdx - 1]
          let nodeR = theEnv.nodes[theNodeIdx + 1]
          if (nodeL !== undefined && nodeR !== undefined){
            // Communicate delete to the underlying data model here.
            let relIdx
            // if (prm.printConsoleLogs){
            //   console.log(self.ctx.object + ", " + self.ctx.property)
            // }
            switch (self.ctx.object){
              case "compObj":
              // console.log("self.ctx.property:", self.ctx.property)
              relIdx = compObj[self.ctx.property].findIndex(function(thing){
                // console.log("thing:", thing)
                return thing.id == self.ctx.id
              })
              if (relIdx >= 0){
                compObj[self.ctx.property][relIdx].stampDelete = Date.now()
              }
              else {
                console.log("relIdx = " + relIdx + " BUT REALLY OUGHT TO HAVE FOUND SOMETHING HERE...")
              }
              break
              case "prodObj":
              // console.log("self.ctx.property:", self.ctx.property)
              if ((typeof self.ctx.property) == "string"){
                relIdx = prodObj[self.ctx.property].findIndex(function(thing){
                  // console.log("thing:", thing)
                  return thing.id == self.ctx.id
                })
                if (relIdx >= 0){
                  prodObj[self.ctx.property][relIdx].stampDelete = Date.now()
                }
              }
              else if (self.ctx.property.length == 2){
                relIdx = prodObj[self.ctx.property[0]][self.ctx.property[1]].findIndex(function(thing){
                  return thing.id == self.ctx.id
                })
                if (relIdx >= 0){
                  prodObj[self.ctx.property[0]][self.ctx.property[1]][relIdx].stampDelete = Date.now()
                }
              }
              else {
                console.log("relIdx = " + relIdx + " BUT REALLY OUGHT TO HAVE FOUND SOMETHING HERE...")
              }
              break
              default:
              console.log("Should not get here!")
            }
            theEnv.nodes.splice(theNodeIdx, 1)
            theEnv.draw()
          }
          else {
            // Dealing with an outernmost node.
            self.toggle_being_moved()
            // Not going to change compObj.
          }
        }
        else {
          // console.log("GOT HERE EVEN FOR A TOUCHSTARTED!")
          // console.log("touchType:", touchType)
          self.toggle_being_moved()
          // Communicate edit to the underlying data model here.
          let relIdx
          // if (prm.printConsoleLogs){
            console.log("this:", this)
          // }
          switch (self.ctx.object + "_" + self.ctx.property){
            case "compObj_tempi":
            relIdx = compObj[self.ctx.property].findIndex(function(thing){
              // console.log("thing:", thing)
              return thing.id == self.ctx.id
            })
            console.log("relIdx from inside an EnvelopeNode move:", relIdx)
            if (relIdx >= 0){
              console.log("self.ctx:", self.ctx)
              const currTempoObj = compObj[self.ctx.property][relIdx]
              console.log("currTempoObj:", currTempoObj)
              const ontime = self.ctx.u.min + (self.ctx.u.max - self.ctx.u.min)*self.x
              const bpm = self.ctx.v.min + (self.ctx.v.max - self.ctx.v.min)*self.y
              console.log("bpm:", bpm)
              // Are these sufficiently different?
              if (
                Math.abs(ontime - currTempoObj.ontime) > 0.01 ||
                Math.abs(bpm - currTempoObj.bpm) > 0.01
              ){
                console.log("Sufficiently different. Proceeding to underlying data model.")
                // Handle stampDelete.
                currTempoObj.stampDelete = Date.now()
                // Handle creation of new tempi object.
                const id = uuid()
                const idEditOf = self.ctx.id
                const bb = mu.bar_and_beat_number_of_ontime(
                  ontime, compObj.timeSignatures
                )
                const ctx = {
                  "object": "compObj",
                  "property": "tempi",
                  "id": id,
                  "u": { "min": self.ctx.u.min, "max": self.ctx.u.max },
                  "v": { "min": self.ctx.v.min, "max": self.ctx.v.max }
                }
                compObj.tempi.push({
                  "id": id,
                  "idEditOf": idEditOf,
                  "ontime": ontime,
                  "barNo": bb[0],
                  "bpm": bpm,
                  "stampCreate": Date.now(),
                  "stampDelete": null
                })
                compObj.tempi = compObj.tempi.sort(function(a, b){ return a.ontime - b.ontime })
                // Transfer context.
                // console.log("ctx:", ctx)
                self.ctx = ctx
              }
            }
            else {
              console.log("relIdx = " + relIdx + " BUT REALLY OUGHT TO HAVE FOUND SOMETHING HERE...")
            }
            break
            case "prodObj_volume":
            relIdx = prodObj[self.ctx.property].findIndex(function(thing){
              // console.log("thing:", thing)
              return thing.id == self.ctx.id
            })
            if (relIdx >= 0){
              const currProdObj = prodObj[self.ctx.property][relIdx]
              const ontime = self.ctx.u.min + (self.ctx.u.max - self.ctx.u.min)*self.x
              const val = self.ctx.v.min + (self.ctx.v.max - self.ctx.v.min)*self.y
              // Are these sufficiently different?
              if (
                Math.abs(ontime - currProdObj.ontime) > 0.01 ||
                Math.abs(val - currProdObj.val) > 0.01
              ){
                // Handle stampDelete.
                currProdObj.stampDelete = Date.now()
                // Handle creation of new tempi object.
                const id = uuid()
                const idEditOf = self.ctx.id
                const bb = mu.bar_and_beat_number_of_ontime(
                  ontime, compObj.timeSignatures
                )
                const ctx = {
                  "object": "prodObj",
                  "property": "volume",
                  "id": id,
                  "u": { "min": self.ctx.u.min, "max": self.ctx.u.max },
                  "v": { "min": self.ctx.v.min, "max": self.ctx.v.max }
                }
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
                })
                prodObj.volume = prodObj.volume.sort(function(a, b){ return a.ontime - b.ontime })
                // Transfer context.
                // console.log("ctx:", ctx)
                self.ctx = ctx
              }
            }
            else {
              console.log("relIdx = " + relIdx + " BUT REALLY OUGHT TO HAVE FOUND SOMETHING HERE...")
            }
            break
            case "prodObj_pan":
            relIdx = prodObj[self.ctx.property].findIndex(function(thing){
              // console.log("thing:", thing)
              return thing.id == self.ctx.id
            })
            if (relIdx >= 0){
              const currProdObj = prodObj[self.ctx.property][relIdx]
              const ontime = self.ctx.u.min + (self.ctx.u.max - self.ctx.u.min)*self.x
              const val = self.ctx.v.min + (self.ctx.v.max - self.ctx.v.min)*self.y
              // Are these sufficiently different?
              if (
                Math.abs(ontime - currProdObj.ontime) > 0.01 ||
                Math.abs(val - currProdObj.val) > 0.01
              ){
                // Handle stampDelete.
                currProdObj.stampDelete = Date.now()
                // Handle creation of new pan object.
                const id = uuid()
                const idEditOf = self.ctx.id
                const bb = mu.bar_and_beat_number_of_ontime(
                  ontime, compObj.timeSignatures
                )
                const ctx = {
                  "object": "prodObj",
                  "property": "pan",
                  "id": id,
                  "u": { "min": self.ctx.u.min, "max": self.ctx.u.max },
                  "v": { "min": self.ctx.v.min, "max": self.ctx.v.max }
                }
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
                })
                prodObj.pan = prodObj.pan.sort(function(a, b){ return a.ontime - b.ontime })
                // Transfer context.
                // console.log("ctx:", ctx)
                self.ctx = ctx
              }
            }
            else {
              console.log("relIdx = " + relIdx + " BUT REALLY OUGHT TO HAVE FOUND SOMETHING HERE...")
            }
            break
            case "prodObj_reverb,roomSize":
            relIdx = prodObj[self.ctx.property[0]][self.ctx.property[1]].findIndex(function(thing){
              // console.log("thing:", thing)
              return thing.id == self.ctx.id
            })
            if (relIdx >= 0){
              const currProdObj = prodObj[self.ctx.property[0]][self.ctx.property[1]][relIdx]
              const ontime = self.ctx.u.min + (self.ctx.u.max - self.ctx.u.min)*self.x
              const val = self.ctx.v.min + (self.ctx.v.max - self.ctx.v.min)*self.y
              // Are these sufficiently different?
              if (
                Math.abs(ontime - currProdObj.ontime) > 0.01 ||
                Math.abs(val - currProdObj.val) > 0.01
              ){
                // Handle stampDelete.
                currProdObj.stampDelete = Date.now()
                // Handle creation of new tempi object.
                const id = uuid()
                const idEditOf = self.ctx.id
                const bb = mu.bar_and_beat_number_of_ontime(
                  ontime, compObj.timeSignatures
                )
                const ctx = {
                  "object": "prodObj",
                  "property": ["reverb", "roomSize"],
                  "id": id,
                  "u": { "min": self.ctx.u.min, "max": self.ctx.u.max },
                  "v": { "min": self.ctx.v.min, "max": self.ctx.v.max }
                }
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
                })
                prodObj.reverb.roomSize = prodObj.reverb.roomSize.sort(function(a, b){ return a.ontime - b.ontime })
                // Transfer context.
                // console.log("ctx:", ctx)
                self.ctx = ctx
              }
            }
            else {
              console.log("relIdx = " + relIdx + " BUT REALLY OUGHT TO HAVE FOUND SOMETHING HERE...")
            }
            break
            case "prodObj_reverb,wet":
            relIdx = prodObj[self.ctx.property[0]][self.ctx.property[1]].findIndex(function(thing){
              // console.log("thing:", thing)
              return thing.id == self.ctx.id
            })
            if (relIdx >= 0){
              const currProdObj = prodObj[self.ctx.property[0]][self.ctx.property[1]][relIdx]
              const ontime = self.ctx.u.min + (self.ctx.u.max - self.ctx.u.min)*self.x
              const val = self.ctx.v.min + (self.ctx.v.max - self.ctx.v.min)*self.y
              // Are these sufficiently different?
              if (
                Math.abs(ontime - currProdObj.ontime) > 0.01 ||
                Math.abs(val - currProdObj.val) > 0.01
              ){
                // Handle stampDelete.
                currProdObj.stampDelete = Date.now()
                // Handle creation of new tempi object.
                const id = uuid()
                const idEditOf = self.ctx.id
                const bb = mu.bar_and_beat_number_of_ontime(
                  ontime, compObj.timeSignatures
                )
                const ctx = {
                  "object": "prodObj",
                  "property": ["reverb", "wet"],
                  "id": id,
                  "u": { "min": self.ctx.u.min, "max": self.ctx.u.max },
                  "v": { "min": self.ctx.v.min, "max": self.ctx.v.max }
                }
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
                })
                prodObj.reverb.wet = prodObj.reverb.wet.sort(function(a, b){ return a.ontime - b.ontime })
                // Transfer context.
                // console.log("ctx:", ctx)
                self.ctx = ctx
              }
            }
            else {
              console.log("relIdx = " + relIdx + " BUT REALLY OUGHT TO HAVE FOUND SOMETHING HERE...")
            }
            break
            default:
            console.log("Should not get here!")
          }
        }
        // console.log("compObj:", compObj)
        theSonic.schedule_events(compObj, prodObj, theGrid)
      }
      else {
        console.log("Shouldn't get here!")
      }

    // }
  }

  /**
   * Toggles the "beingMoved" property of the node.
   */
  toggle_being_moved(){
    this.beingMoved = !this.beingMoved
  }

  /**
   * Checks if the mouse touch is within the bounds of the node.
   * @returns {boolean} Returns true if the mouse touch is within the node bounds, else returns false.
   */
  touch_check(){
    if (this.sk.dist(this.sk.mouseX, this.sk.mouseY, this.pixelX, this.pixelY) < this.diameter/2){
      // if (prm.printConsoleLogs) { console.log("GOT TO A TOUCH CHECK IN EnvelopeNode " + this.id + "!") }
      this.toggle_being_moved()
      return true
    }
    return false
  }

}
export default EnvelopeNode
