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
    this.sk = _sketch
    this.name = _name
    this.active = _active
    this.x = _x
    this.y = _y
    this.w = _width
    this.h = _height
    this.inner = { "x": this.x, "y": this.y, "width": this.w, "height": this.h }
    this.nodeDiameter = _nodeDiameter
    this.nodeFill = this.sk.color("#17baef")
    this.lineFill = this.sk.color("#17baef")
    this.aboveLineFill = this.sk.color("#074f66")
    this.belowLineFill = this.sk.color("#074f66")
    this.minU = 0
    this.maxU = 16
    this.minV, this.maxV, this.uvData

    // Making nodes.
    this.nodeId = 2 // Unique id for each node.
    if (_yVal == undefined){
      this.nodes = [
        new EnvelopeNode(
          this.sk, 0, null, 0.1, 0.5, false, this.nodeFill, this.nodeDiameter, this.inner
        ),
        new EnvelopeNode(
          this.sk, 1, null, 0.9, 0.5, false, this.nodeFill, this.nodeDiameter, this.inner
        )
      ]
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
      ]
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
      console.log("Shouldn't be drawn. Is not active!")
      return
    }
    if (newX !== undefined){
      this.x = newX
    }
    this.sk.fill(240)
    this.sk.stroke(150)
    this.sk.rect(this.x, this.y, this.w, this.h)
    for (let i = 0; i < this.nodes.length - 1; i++){
      this.sk.line(
        this.nodes[i].pixelX, this.nodes[i].pixelY,
        this.nodes[i + 1].pixelX, this.nodes[i + 1].pixelY
      )
    }
    this.nodes.map(function(n){
      n.draw()
    })
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
    let self = this
    let uvData
    switch (str){
      case "tempo":
      this.minV = 50, this.maxV = 150
      uvData = compObj.tempi.filter(function(v){
        return v.stampDelete == null
      })
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
        ]
        uvData = compObj.tempi
        this.nodeId = 2
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
        ]
      }
      else if (uvData.length == 1){
        compObj.tempi.push({
          "id": uuid(),
          "ontime": 16,
          "barNo": 5,
          "bpm": uvData[0].bpm,
          "stampCreate": Date.now(),
          "stampDelete": null
        })
        this.nodeId = 2
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
        ]
      }
      else {
        this.nodes = []
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
          )
        })
        this.nodeId = this.nodes.length
      }
      break
      case "volume":
      this.minV = 0, this.maxV = 1
      uvData = prodObj.volume.filter(function(v){
        return v.stampDelete == null
      })
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
        ]
        uvData = prodObj.volume
        this.nodeId = 2
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
        ]
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
        })
        this.nodeId = 2
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
        ]
      }
      else {
        this.nodes = []
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
          )
        })
        this.nodeId = this.nodes.length
      }
      break
      case "pan":
      this.minV = -1, this.maxV = 1
      uvData = prodObj.pan.filter(function(v){
        return v.stampDelete == null
      })
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
        ]
        uvData = prodObj.pan
        this.nodeId = 2
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
        ]
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
        })
        this.nodeId = 2
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
        ]
      }
      else {
        this.nodes = []
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
          )
        })
        this.nodeId = this.nodes.length
      }
      break
      case "reverb room size":
      this.minV = 0, this.maxV = 1
      uvData = prodObj.reverb.roomSize.filter(function(v){
        return v.stampDelete == null
      })
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
        ]
        uvData = prodObj.reverb.roomSize
        this.nodeId = 2
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
        ]
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
        })
        this.nodeId = 2
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
        ]
      }
      else {
        this.nodes = []
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
          )
        })
        this.nodeId = this.nodes.length
      }
      break
      case "reverb wet":
      this.minV = 0, this.maxV = 1
      uvData = prodObj.reverb.wet.filter(function(v){
        return v.stampDelete == null
      })
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
        ]
        uvData = prodObj.reverb.wet
        this.nodeId = 2
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
        ]
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
        })
        this.nodeId = 2
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
        ]
      }
      else {
        this.nodes = []
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
          )
        })
        this.nodeId = this.nodes.length
      }
      break
      default:
      console.log("SHOULD NOT GET HERE!")
    }
    this.active = true
    this.draw()
  }

  /**
   * onclick method for Envelope class
   * @param {string} str - The type of node to be created
   * @param {object} _grid - The grid object
   * @param {object} _sonic - The sonic object
   */
  onclick(str, _grid, _sonic){
    // if (prm.printConsoleLogs) { console.log("Envelope \"" + this.name + "\" has been clicked!") }
    const xLoc = (this.sk.mouseX - this.inner.x - this.nodeDiameter/2)/(this.inner.width - this.nodeDiameter)
    const yLoc = 1 - (this.sk.mouseY - this.inner.y - this.nodeDiameter/2)/(this.inner.height - this.nodeDiameter)
    // if (prm.printConsoleLogs) { console.log("xLoc:", xLoc, "yLoc:", yLoc) }
    // Check if the click is on an existing node.
    let nodeClick = false
    let nidx = 0
    while (nidx < this.nodes.length && !nodeClick){
      nodeClick = this.nodes[nidx].touch_check(
        str, this, nidx, _grid, _sonic
      )
      nidx++
    }
    // if (prm.printConsoleLogs) { console.log("nodeClick:", nodeClick) }

    if (nodeClick){
      nidx--
      // if (prm.printConsoleLogs) { console.log("nidx:", nidx) }
      // A touch has started on an existing node. The node needs to move with
      // the touch.
      this.nodes[nidx].move("touchStarted", this, nidx, _grid, _sonic)
      // Delete and create.
    }
    else {
      // The touch started was not on an existing node. Make a new one.
      if (this.nodes.filter(function(n){ return n.stampDelete !== null }).length == 8){
        alert("No more than eight nodes please!")
        return
      }
      // Create.
      let id, ontime, bb, ctx, val
      switch (str){
        case "tempo":
        id = uuid()
        ontime = this.minU + (this.maxU - this.minU)*xLoc
        bb = mu.bar_and_beat_number_of_ontime(
          ontime, compObj.timeSignatures
        )
        const bpm = this.minV + (this.maxV - this.minV)*yLoc
        ctx = {
          "object": "compObj",
          "property": "tempi",
          "id": id,
          "u": { "min": this.minU, "max": this.maxU },
          "v": { "min": this.minV, "max": this.maxV }
        }
        compObj.tempi.push({
          "id": id,
          "ontime": ontime,
          "barNo": bb[0],
          "bpm": bpm,
          "stampCreate": Date.now(),
          "stampDelete": null
        })
        compObj.tempi = compObj.tempi.sort(function(a, b){ return a.ontime - b.ontime })
        // console.log("compObj.tempi:", compObj.tempi)
        break
        case "volume":
        id = uuid()
        ontime = this.minU + (this.maxU - this.minU)*xLoc
        bb = mu.bar_and_beat_number_of_ontime(
          ontime, compObj.timeSignatures
        )
        val = this.minV + (this.maxV - this.minV)*yLoc
        ctx = {
          "object": "prodObj",
          "property": "volume",
          "id": id,
          "u": { "min": this.minU, "max": this.maxU },
          "v": { "min": this.minV, "max": this.maxV }
        }
        prodObj.volume.push({
          "id": id,
          "ontime": ontime,
          "barNo": bb[0],
          "beatNo": bb[1],
          "val": val,
          "staffNo": 0,
          "stampCreate": Date.now(),
          "stampDelete": null
        })
        prodObj.volume = prodObj.volume.sort(function(a, b){ return a.ontime - b.ontime })
        // console.log("prodObj.volume:", prodObj.volume)
        break
        case "pan":
        id = uuid()
        ontime = this.minU + (this.maxU - this.minU)*xLoc
        bb = mu.bar_and_beat_number_of_ontime(
          ontime, compObj.timeSignatures
        )
        val = this.minV + (this.maxV - this.minV)*yLoc
        ctx = {
          "object": "prodObj",
          "property": "pan",
          "id": id,
          "u": { "min": this.minU, "max": this.maxU },
          "v": { "min": this.minV, "max": this.maxV }
        }
        prodObj.pan.push({
          "id": id,
          "ontime": ontime,
          "barNo": bb[0],
          "beatNo": bb[1],
          "val": val,
          "staffNo": 0,
          "stampCreate": Date.now(),
          "stampDelete": null
        })
        prodObj.pan = prodObj.pan.sort(function(a, b){ return a.ontime - b.ontime })
        // console.log("prodObj.pan:", prodObj.pan)
        break
        case "reverb room size":
        id = uuid()
        ontime = this.minU + (this.maxU - this.minU)*xLoc
        bb = mu.bar_and_beat_number_of_ontime(
          ontime, compObj.timeSignatures
        )
        val = this.minV + (this.maxV - this.minV)*yLoc
        ctx = {
          "object": "prodObj",
          "property": ["reverb", "roomSize"],
          "id": id,
          "u": { "min": this.minU, "max": this.maxU },
          "v": { "min": this.minV, "max": this.maxV }
        }
        prodObj.reverb.roomSize.push({
          "id": id,
          "ontime": ontime,
          "barNo": bb[0],
          "beatNo": bb[1],
          "val": val,
          "staffNo": 0,
          "stampCreate": Date.now(),
          "stampDelete": null
        })
        prodObj.reverb.roomSize = prodObj.reverb.roomSize.sort(function(a, b){ return a.ontime - b.ontime })
        // console.log("prodObj.reverb.roomSize:", prodObj.reverb.roomSize)
        break
        case "reverb wet":
        id = uuid()
        ontime = this.minU + (this.maxU - this.minU)*xLoc
        bb = mu.bar_and_beat_number_of_ontime(
          ontime, compObj.timeSignatures
        )
        val = this.minV + (this.maxV - this.minV)*yLoc
        ctx = {
          "object": "prodObj",
          "property": ["reverb", "wet"],
          "id": id,
          "u": { "min": this.minU, "max": this.maxU },
          "v": { "min": this.minV, "max": this.maxV }
        }
        prodObj.reverb.wet.push({
          "id": id,
          "ontime": ontime,
          "barNo": bb[0],
          "beatNo": bb[1],
          "val": val,
          "staffNo": 0,
          "stampCreate": Date.now(),
          "stampDelete": null
        })
        prodObj.reverb.wet = prodObj.reverb.wet.sort(function(a, b){ return a.ontime - b.ontime })
        // console.log("prodObj.reverb.wet:", prodObj.reverb.wet)
        break
        default:
        console.log("Should not get to default here!")
      }
      let newEnv = new EnvelopeNode(
        this.sk, this.nodeId, ctx, xLoc, yLoc, true, this.nodeFill, this.nodeDiameter,
        this.inner
      )
      this.push_sorted(newEnv)
      // if (prm.printConsoleLogs) { console.log("this.nodes:", this.nodes) }
      this.nodeId++
      this.draw()
      _sonic.schedule_events(compObj, prodObj, _grid)
    }
  }


  /**
   * Push a time/value pair onto this envelope's data, maintaining sorted order.
   * @param {number} time - The time of the pair to add.
   * @param {number} value - The value of the pair to add.
   */
  push_sorted(aNode){
    let relIdx
    let i = 0
    while (i < this.nodes.length){
      if (this.nodes[i].compare_to(aNode) !== -1){
        relIdx = i
        i = this.nodes.length - 1
      }
      i++
    }
    if (relIdx !== undefined){
      this.nodes.splice(relIdx, 0, aNode)
    }
    else {
      this.nodes.push(aNode)
    }
  }

  /**
   * Toggle the active status of this envelope.
   */
  toggle_active(){
    this.active = !this.active
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
    let nodeIdx
    this.nodes.map(function(n, idx){
      if (n.beingMoved){
        nodeIdx = idx
      }
    })

    switch (touchType){
      case "touchStarted":
      this.onclick(str, _grid, _sonic)
      break
      case "touchMoved":
      if (nodeIdx !== undefined){
        // Move node, taking into account location of left- and right-hand nodes.
        this.nodes[nodeIdx].move(touchType, this, nodeIdx, _grid, _sonic)
      }
      break
      case "touchEnded":
      if (nodeIdx !== undefined){
        this.nodes[nodeIdx].move(touchType, this, nodeIdx, _grid, _sonic)
      }
      break
      default:
      console.log("Shouldn't get to default in this switch!")
    }
  }

}
export default Envelope
