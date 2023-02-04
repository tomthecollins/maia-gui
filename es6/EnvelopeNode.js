export default class EnvelopeNode {
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
    this.pixelX = theInner.x + this.diameter/2 + (theInner.width - this.diameter)*this.x
    this.pixelY = theInner.y + this.diameter/2 + (theInner.height - this.diameter)*(1 - this.y)
    this.pPixelX = null
    this.pPixelY = null

    // Possible to return something.
    // return sth
  }

  // This method returns:
  // * -1 if the node represented by "this" is lexicographically less than the
  //   node represented by "aNode" (that is this.x < aNode.x);
  // * 0 if "this" and "aNode" have exactly the same x- and y-values;
  // * +1 otherwise.
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


  draw(){
    // if (prm.printConsoleLogs) { console.log("AGAIN YES!") }
    this.sk.fill(this.fillColor)
    this.sk.ellipseMode(this.sk.CENTER)
    // console.log("this.pixelX:", this.pixelX, "this.pixelY:", this.pixelY)
    this.sk.circle(this.pixelX, this.pixelY, this.diameter)
  }


  move(touchType, theEnv, theNodeIdx, theGrid, theSound){
    let self = this
    // if (touchType == "touchMoved" || touchType == "touchEnded"){
      if (
        this.sk.mouseX < self.inner.x || this.sk.mouseX > self.inner.x + self.inner.width ||
        this.sk.mouseY < self.inner.y || this.sk.mouseY > self.inner.y + self.inner.height
      ){
        return;
      }

      if (touchType == "touchStarted"){
        // Store previous node location, so we can decide on touch ending
        // whether it's an attempt to delete the node.
        this.pPixelX = this.pixelX
        this.pPixelY = this.pixelY
      }
      else if (touchType == "touchMoved"){
        // We may need to move the oblong node.
        // Check whether moving it would go behind or beyond an existing node,
        // which we will disallow.
        let nodeL = theEnv.nodes[theNodeIdx - 1]
        let nodeR = theEnv.nodes[theNodeIdx + 1]
        if (nodeL !== undefined && nodeR !== undefined){
          const behindOrBeyond = this.sk.mouseX < nodeL.pixelX || this.sk.mouseX > nodeR.pixelX
          // if (prm.printConsoleLogs) { console.log("behindOrBeyond:", behindOrBeyond) }
          if (!behindOrBeyond){
            this.pixelX = this.sk.mouseX
            this.pixelY = this.sk.mouseY
            this.x = (this.pixelX - self.inner.x - this.diameter/2)/(self.inner.width - this.diameter)
            this.y = 1 - (this.pixelY - self.inner.y - this.diameter/2)/(self.inner.height - this.diameter)
          }
        }
        else {
          // Prevent moves in x-plane of outermost nodes.
          this.pixelY = this.sk.mouseY
          this.y = 1 - (this.pixelY - self.inner.y - this.diameter/2)/(self.inner.height - this.diameter)
        }
        theEnv.draw()
      }
      else if (touchType == "touchEnded"){
        // if (prm.printConsoleLogs) { console.log("Pixel positions:", this.pixelX, this.pixelY, this.pPixelX, this.pPixelY) }
        // Is this an attempt to delete the node?
        if (this.sk.dist(this.pixelX, this.pixelY, this.pPixelX, this.pPixelY) < 5){
          // console.log("GOT HERE!")
          // Prevent deletion of outermost nodes.
          let nodeL = theEnv.nodes[theNodeIdx - 1]
          let nodeR = theEnv.nodes[theNodeIdx + 1]
          if (nodeL !== undefined && nodeR !== undefined){
            // Communicate delete to the underlying data model here.
            let relIdx
            // if (prm.printConsoleLogs){
            //   console.log(this.ctx.object + ", " + this.ctx.property)
            // }
            switch (this.ctx.object){
              case "compObj":
              // console.log("this.ctx.property:", this.ctx.property)
              relIdx = compObj[this.ctx.property].findIndex(function(thing){
                // console.log("thing:", thing)
                return thing.id == self.ctx.id
              })
              if (relIdx >= 0){
                compObj[this.ctx.property][relIdx].stampDelete = Date.now()
              }
              else {
                console.log("relIdx = " + relIdx + " BUT REALLY OUGHT TO HAVE FOUND SOMETHING HERE...")
              }
              break
              case "prodObj":
              // console.log("this.ctx.property:", this.ctx.property)
              if ((typeof this.ctx.property) == "string"){
                relIdx = prodObj[this.ctx.property].findIndex(function(thing){
                  // console.log("thing:", thing)
                  return thing.id == self.ctx.id
                })
                if (relIdx >= 0){
                  prodObj[this.ctx.property][relIdx].stampDelete = Date.now()
                }
              }
              else if (this.ctx.property.length == 2){
                relIdx = prodObj[this.ctx.property[0]][this.ctx.property[1]].findIndex(function(thing){
                  return thing.id == self.ctx.id
                })
                if (relIdx >= 0){
                  prodObj[this.ctx.property[0]][this.ctx.property[1]][relIdx].stampDelete = Date.now()
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
            this.toggle_being_moved()
            // Not going to change compObj.
          }
        }
        else {
          // console.log("GOT HERE EVEN FOR A TOUCHSTARTED!")
          // console.log("touchType:", touchType)
          this.toggle_being_moved()
          // Communicate edit to the underlying data model here.
          let relIdx
          // if (prm.printConsoleLogs){
            console.log("this:", this)
          // }
          switch (this.ctx.object + "_" + this.ctx.property){
            case "compObj_tempi":
            relIdx = compObj[this.ctx.property].findIndex(function(thing){
              // console.log("thing:", thing)
              return thing.id == self.ctx.id
            })
            console.log("relIdx from inside an EnvelopeNode move:", relIdx)
            if (relIdx >= 0){
              console.log("this.ctx:", this.ctx)
              const currTempoObj = compObj[this.ctx.property][relIdx]
              console.log("currTempoObj:", currTempoObj)
              const ontime = this.ctx.u.min + (this.ctx.u.max - this.ctx.u.min)*this.x
              const bpm = this.ctx.v.min + (this.ctx.v.max - this.ctx.v.min)*this.y
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
                const idEditOf = this.ctx.id
                const bb = mu.bar_and_beat_number_of_ontime(
                  ontime, compObj.timeSignatures
                )
                ctx = {
                  "object": "compObj",
                  "property": "tempi",
                  "id": id,
                  "u": { "min": this.ctx.u.min, "max": this.ctx.u.max },
                  "v": { "min": this.ctx.v.min, "max": this.ctx.v.max }
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
                this.ctx = ctx
              }
            }
            else {
              console.log("relIdx = " + relIdx + " BUT REALLY OUGHT TO HAVE FOUND SOMETHING HERE...")
            }
            break
            case "prodObj_volume":
            relIdx = prodObj[this.ctx.property].findIndex(function(thing){
              // console.log("thing:", thing)
              return thing.id == self.ctx.id
            })
            if (relIdx >= 0){
              const currProdObj = prodObj[this.ctx.property][relIdx]
              const ontime = this.ctx.u.min + (this.ctx.u.max - this.ctx.u.min)*this.x
              const val = this.ctx.v.min + (this.ctx.v.max - this.ctx.v.min)*this.y
              // Are these sufficiently different?
              if (
                Math.abs(ontime - currProdObj.ontime) > 0.01 ||
                Math.abs(val - currProdObj.val) > 0.01
              ){
                // Handle stampDelete.
                currProdObj.stampDelete = Date.now()
                // Handle creation of new tempi object.
                const id = uuid()
                const idEditOf = this.ctx.id
                const bb = mu.bar_and_beat_number_of_ontime(
                  ontime, compObj.timeSignatures
                )
                ctx = {
                  "object": "prodObj",
                  "property": "volume",
                  "id": id,
                  "u": { "min": this.ctx.u.min, "max": this.ctx.u.max },
                  "v": { "min": this.ctx.v.min, "max": this.ctx.v.max }
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
                this.ctx = ctx
              }
            }
            else {
              console.log("relIdx = " + relIdx + " BUT REALLY OUGHT TO HAVE FOUND SOMETHING HERE...")
            }
            break
            case "prodObj_pan":
            relIdx = prodObj[this.ctx.property].findIndex(function(thing){
              // console.log("thing:", thing)
              return thing.id == self.ctx.id
            })
            if (relIdx >= 0){
              const currProdObj = prodObj[this.ctx.property][relIdx]
              const ontime = this.ctx.u.min + (this.ctx.u.max - this.ctx.u.min)*this.x
              const val = this.ctx.v.min + (this.ctx.v.max - this.ctx.v.min)*this.y
              // Are these sufficiently different?
              if (
                Math.abs(ontime - currProdObj.ontime) > 0.01 ||
                Math.abs(val - currProdObj.val) > 0.01
              ){
                // Handle stampDelete.
                currProdObj.stampDelete = Date.now()
                // Handle creation of new pan object.
                const id = uuid()
                const idEditOf = this.ctx.id
                const bb = mu.bar_and_beat_number_of_ontime(
                  ontime, compObj.timeSignatures
                )
                ctx = {
                  "object": "prodObj",
                  "property": "pan",
                  "id": id,
                  "u": { "min": this.ctx.u.min, "max": this.ctx.u.max },
                  "v": { "min": this.ctx.v.min, "max": this.ctx.v.max }
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
                this.ctx = ctx
              }
            }
            else {
              console.log("relIdx = " + relIdx + " BUT REALLY OUGHT TO HAVE FOUND SOMETHING HERE...")
            }
            break
            case "prodObj_reverb,roomSize":
            relIdx = prodObj[this.ctx.property[0]][this.ctx.property[1]].findIndex(function(thing){
              // console.log("thing:", thing)
              return thing.id == self.ctx.id
            })
            if (relIdx >= 0){
              const currProdObj = prodObj[this.ctx.property[0]][this.ctx.property[1]][relIdx]
              const ontime = this.ctx.u.min + (this.ctx.u.max - this.ctx.u.min)*this.x
              const val = this.ctx.v.min + (this.ctx.v.max - this.ctx.v.min)*this.y
              // Are these sufficiently different?
              if (
                Math.abs(ontime - currProdObj.ontime) > 0.01 ||
                Math.abs(val - currProdObj.val) > 0.01
              ){
                // Handle stampDelete.
                currProdObj.stampDelete = Date.now()
                // Handle creation of new tempi object.
                const id = uuid()
                const idEditOf = this.ctx.id
                const bb = mu.bar_and_beat_number_of_ontime(
                  ontime, compObj.timeSignatures
                )
                ctx = {
                  "object": "prodObj",
                  "property": ["reverb", "roomSize"],
                  "id": id,
                  "u": { "min": this.ctx.u.min, "max": this.ctx.u.max },
                  "v": { "min": this.ctx.v.min, "max": this.ctx.v.max }
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
                this.ctx = ctx
              }
            }
            else {
              console.log("relIdx = " + relIdx + " BUT REALLY OUGHT TO HAVE FOUND SOMETHING HERE...")
            }
            break
            case "prodObj_reverb,wet":
            relIdx = prodObj[this.ctx.property[0]][this.ctx.property[1]].findIndex(function(thing){
              // console.log("thing:", thing)
              return thing.id == self.ctx.id
            })
            if (relIdx >= 0){
              const currProdObj = prodObj[this.ctx.property[0]][this.ctx.property[1]][relIdx]
              const ontime = this.ctx.u.min + (this.ctx.u.max - this.ctx.u.min)*this.x
              const val = this.ctx.v.min + (this.ctx.v.max - this.ctx.v.min)*this.y
              // Are these sufficiently different?
              if (
                Math.abs(ontime - currProdObj.ontime) > 0.01 ||
                Math.abs(val - currProdObj.val) > 0.01
              ){
                // Handle stampDelete.
                currProdObj.stampDelete = Date.now()
                // Handle creation of new tempi object.
                const id = uuid()
                const idEditOf = this.ctx.id
                const bb = mu.bar_and_beat_number_of_ontime(
                  ontime, compObj.timeSignatures
                )
                ctx = {
                  "object": "prodObj",
                  "property": ["reverb", "wet"],
                  "id": id,
                  "u": { "min": this.ctx.u.min, "max": this.ctx.u.max },
                  "v": { "min": this.ctx.v.min, "max": this.ctx.v.max }
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
                this.ctx = ctx
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
        theSound.schedule_events(compObj, prodObj, theGrid)
      }
      else {
        console.log("Shouldn't get here!")
      }

    // }
  }


  toggle_being_moved(){
    this.beingMoved = !this.beingMoved
  }


  touch_check(){
    if (this.sk.dist(this.sk.mouseX, this.sk.mouseY, this.pixelX, this.pixelY) < this.diameter/2){
      // if (prm.printConsoleLogs) { console.log("GOT TO A TOUCH CHECK IN EnvelopeNode " + this.id + "!") }
      this.toggle_being_moved()
      return true
    }
    return false
  }

}
