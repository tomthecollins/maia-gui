const sketchy = function(p){
  // Define the sketch's parameters in an object for ease of collapse.
  let prm = {
    "printConsoleLogs": false,
    "path": {
      "img": "./src/img/",
      "instr": "./src/instrument/"
    },
    "canvas": {
      "width": window.innerWidth,
      "height": 1200
    },
    // Autoplay and double-touch bug
    "lastTimeTouchStarted": Tone.now(),
    "audioContextBegun": false,
    "isFirefox": false,
    "isMobile": false,
    // Stuff relating to instruments
    "instr": {
      "keys": ["sawtooth_synth", "electric_bass_finger", "edm_drum_kit"],
      "staffNo": 0,
      "selectedInstr": null,
      "iicons": [],
      "iiconsName": []
    },
    // "instrKeys": ,
    // let , selectedInstr, iicons

    // Help/legibility overlay
    "helpMode": null,
    "help": null,
    // Granularity
    "gran": {
      "options": ["1", "1/2", "1/3", "1/4"],
      "value": null,
      "index": null,
      "img": [],
      "imgName": [
        "granularity_1.png",
        "granularity_1_2.png",
        "granularity_1_3.png",
        "granularity_1_4.png"
      ],
      "buttons": null
    },
    // Main melody editor
    "melEd": {
      "x": null,
      "y": null,
      "width": null,
      "height": null
    },
    // Edit buttons (pencil, cursor, rubber)
    "edBtn": {
      "x": null,
      "y": null,
      "width": null,
      "height": null,
      "img": [],
      "imgName": [
        "pencil_256_0_ecf0f1_none.png",
        "mouse-pointer_256_0_ecf0f1_none.png",
        "eraser_256_0_ecf0f1_none.png"
      ],
      "buttons": null
    },
    "range": [48, 86],
    // Grids
    "grid": {
      "inner": {
        "oblongImgName": ["obBgn.png", "obMid.png", "obEnd.png"],
        "oblongImg": [],
        "backImgName": ["midi_drop_msg.png", "logo_maia.png"],
        "backImg": []
      },
      "param": {
        "pcs": [0, 1, 2, 3, 5, 7, 8, 9, 10, 11]
      }
    },
    // Navigation buttons
    "navign": {
      "x": null,
      "y": null,
      "width": null,
      "height": null,
      "buttons": null,
      "img": [],
      "imgName": [
        "arrow-up_256_0_ecf0f1_none.png",
        "arrow-down_256_0_ecf0f1_none.png",
        "arrow-left_256_0_ecf0f1_none.png",
        "arrow-right_256_0_ecf0f1_none.png"
      ],

    },
    // Transport bar
    "trans": {
      "x": null,
      "y": null,
      "width": null,
      "height": null,
      "img": [],
      "imgName": [
        "question_mark.png",
        ["play_256_0_ecf0f1_none.png", "pause_256_0_ecf0f1_none.png"],
        ["noun_ben_davis_piano.png", "noun_eucalyp_bass.png", "noun_hafiudin_drums.png"]
      ],
      "buttons": null
    },
    // Envelope editor
    "envEd": {
      "x": null,
      "y": null,
      "width": null,
      "height": null,
      "inner": {
        "x": null,
        "y": null,
        "width": null,
        "height": null,
        "nodeDiameter": null
      },
      "buttons": {
        "x": null,
        "y": null,
        "width": null,
        "height": null,
        "img": [],
        "imgName": [
          "env_temp_3401691.png",
          "env_volume_1724091.png",
          "env_echo_2010331.png",
          "env_circuit_1685926.png"
        ],
        "buttons": null
      },
      "mode": null,
      "prevMode": null,
      "envelope": null
    },


  }
  let interface
  // Instrument stuff
  let pianoImg, bassImg, drumsImg


  p.preload = function(){
    prm.grid.inner.oblongImgName.forEach(function(nam, idx){
      prm.grid.inner.oblongImg[idx] = p.loadImage(prm.path.img + nam)
    })
    prm.grid.inner.backImgName.forEach(function(nam, idx){
      prm.grid.inner.backImg[idx] = p.loadImage(prm.path.img + nam)
    })
    prm.edBtn.imgName.forEach(function(nam, idx){
      prm.edBtn.img[idx] = p.loadImage(prm.path.img + nam)
    })
    prm.navign.imgName.forEach(function(nam, idx){
      prm.navign.img[idx] = p.loadImage(prm.path.img + nam)
    })
    prm.trans.imgName.forEach(function(nam, idx){
      if (typeof nam === "string"){
        prm.trans.img[idx] = p.loadImage(prm.path.img + nam)
      }
      else {
        prm.trans.img[idx] = []
        nam.forEach(function(aNam, jdx){
          prm.trans.img[idx][jdx] = p.loadImage(prm.path.img + aNam)
        })
      }
    })
    // playImg = p.loadImage(prm.path.img + "play_256_0_ecf0f1_none.png")
    // pauseImg = p.loadImage(prm.path.img + "pause_256_0_ecf0f1_none.png")
    // helpImg = p.loadImage(prm.path.img + "question_mark.png")
    prm.gran.imgName.forEach(function(nam, idx){
      prm.gran.img[idx] = p.loadImage(prm.path.img + nam)
    })
    // Instrument
    prm.trans.imgName[2].forEach(function(nam, idx){
      prm.instr.iiconsName[idx] = nam
      prm.instr.iicons[idx] = prm.trans.img[2][idx]
    })
    // Envelope
    prm.envEd.buttons.imgName.forEach(function(nam, idx){
      prm.envEd.buttons.img[idx] = p.loadImage(prm.path.img + nam)
    })
    // Logos
    midiDropImg = p.loadImage(prm.path.img + "midi_drop_msg.png")
    maiaImg = p.loadImage(prm.path.img + "logo_maia.png")
  }


  p.setup = function(){
    interface = new Interface(p, prm)
    const c = interface.get_canvas()
    // c.drop(got_file)
    interface.visual.draw()
  }


  p.draw = function(){
    interface.visual.cursor_draw()
  }


  p.mousePressed = function(){
    if (interface.isFirefox){
      p.touchStarted()
    }
  }


  p.touchStarted = function(){
    interface.touch_started()
  }


  p.touchMoved = function(){
    interface.touch_moved()
  }


  p.touchEnded = function(){
    interface.touch_ended()
  }
}


class Interface {
  constructor(theSketch, param){
    const self = this
    self.sk = theSketch
    self.isMobile = false
    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ){
      self.isMobile = true
    }
    self.isFirefox = false
    if( /Mozilla|Firefox/i.test(navigator.userAgent) ){
      self.isFirefox = true
    }

    self.printConsoleLogs = param.printConsoleLogs || false
    self.path = {}
    self.path.img = (param.path && param.path.img) || "./src/img/"
    self.path.instr = (param.path && param.path.instr) || "./src/instrument/"
    // "canvas": {
    //   "width": window.innerWidth,
    //   "height": 1200
    // }
    // Autoplay and double-touch bug
    self.lastTimeTouchStarted = Tone.now()
    self.audioContextBegun = Tone.context.state === "running"

    // Set up the granularity icon handling.
    self.gran = {}
    self.gran.options = (param.gran && param.gran.options) || ["1", "1/2", "1/3", "1/4"]
    self.gran.index = (param.gran && param.gran.index) || 0
    self.gran.value = self.gran.options[self.gran.index]
    self.gran.img = (param.gran && param.gran.img) || []
    self.gran.imgName = (param.gran && param.gran.imgName) || [
      "granularity_1.png",
      "granularity_1_2.png",
      "granularity_1_3.png",
      "granularity_1_4.png"
    ]
    param.gran = self.gran
    // param.gran = mu.copy_array_object(self.gran)

    // self.helpMode = param.helpMode || true
    // param.helpMode = self.helpMode

    self.visual = new Visual(self.sk, param)
    self.sonic = new Sonic(param)


    // Needs a review:
    // Not sure if this one's of any use.
    window.addEventListener("resize", function(){
      self.visual = new Visual(self.sk, prm)
      self.draw()
      // set_component_dimensions()
      // draw_components(true)
    }, false)

    // Not sure if this one's of any use.
    window.addEventListener("orientationchange", function(){
      self.visual = new Visual(self.sk, prm)
      self.draw()
      // set_component_dimensions()
      // draw_components(true)
    }, false)
  }


  draw(){
    this.visual.draw()
  }


  get_canvas(){
    return this.visual.get_canvas()
  }


  touch_ended(){
    if (this.printConsoleLogs) { console.log("touchEnded!") }
    if (this.printConsoleLogs) { console.log("p.mouseX:", p.mouseX, "p.mouseY:", p.mouseY) }
    this.visual.grid.touch_check("touchEnded", this.sonic)
    this.visual.envEd.envelope.touch_check(
      "touchEnded", this.visual.envEd.mode, this.visual.grid, this.sonic
    )
  }


  touch_moved(){
    if (this.printConsoleLogs) { console.log("touchMoved!") }
    if (this.printConsoleLogs) { console.log("p.mouseX:", p.mouseX, "p.mouseY:", p.mouseY) }
    this.visual.grid.touch_check("touchMoved", this.sonic)
    this.visual.envEd.envelope.touch_check(
      "touchMoved", this.visual.envEd.mode, this.visual.grid, this.sonic
    )
  }


  touch_started(){
    if (!this.audioContextBegun){
      Tone.start()
      this.audioContextBegun = true
      this.touch_started_helper()
      return
    }

    if (this.isMobile){
      if (Tone.now() - this.lastTimeTouchStarted < 0.2){
        this.lastTimeTouchStarted = Tone.now()
        return
      }
      this.lastTimeTouchStarted = Tone.now()
    }

    this.touch_started_helper()
  }


  touch_started_helper(){
    console.log("GOT TO TOUCH_HELPER!")
    if (this.printConsoleLogs){
      console.log("my_touch_started()!")
      console.log("this.sk.mouseX:", this.sk.mouseX, "this.sk.mouseY:", this.sk.mouseY)
    }
    if (this.visual.help.mode){
      this.visual.help.touch_check(this.visual)
    }
    else {
      this.visual.edBtn.buttons.touch_check(this.visual.grid, this.visual.navign.buttons)
      this.visual.gran.buttons.touch_check(this.visual.grid)
      this.visual.trans.buttons.touch_check(this.visual.grid, this.sonic, this.visual)
      this.visual.navign.buttons.touch_check(this.visual.grid, this.sonic)
      this.visual.grid.touch_check("touchStarted", this.sonic)
      this.visual.envEd.buttons.buttons.touch_check(this.visual.envEd)
      this.visual.envEd.envelope.touch_check(
        "touchStarted", this.visual.envEd.mode, this.visual.grid, this.sonic
      )
    }
  }

}


class Visual {
  constructor(theSketch, param){
    this.sk = theSketch
    // Whole visual space
    this.canvas = {}
    this.canvas.width = (param.canvas && param.canvas.width) || window.innerWidth
    this.canvas.height = (param.canvas && param.canvas.heigh) || 1200

    // melEd is the editor within the space (needs renaming to ed).
    this.melEd = {}
    this.melEd.x = (param.melEd && param.melEd.x) || 0
    this.melEd.width = (param.melEd && param.melEd.width) || 800
    if (this.canvas.width > this.melEd.width){
      // Whole visual space is bigger than that required for the edtior.
      // Create an even border on either side.
      this.melEd.x = this.canvas.width/2 - this.melEd.width/2
    }
    else {
      // Make the editor as big as the width we have.
      this.melEd.width = this.canvas.width
    }
    this.melEd.y = (param.melEd && param.melEd.y) || 0
    this.melEd.height = (param.melEd && param.melEd.height) || 1000
    if (this.canvas.height > this.melEd.height){
      // Whole visual space is bigger than that required for the edtior.
      // Create an even border on either side.
      this.melEd.y = this.canvas.height/2 - this.melEd.height/2
    }
    else {
      // Make the editor as big as the height we have.
      this.melEd.height = this.canvas.height
    }

    this.grid = new mg.Grid(this.sk, param, this.melEd)
    this.grid.cycle_logos(this)

    // Editor buttons
    this.edBtn = {}
    this.edBtn.x = this.melEd.x
    this.edBtn.y = this.melEd.y + 0.5/10*this.melEd.height
    this.edBtn.width = this.melEd.width
    this.edBtn.height = 0.75/10*this.melEd.height
    this.edBtn.img = (param.edBtn && param.edBtn.img) || []

    // Envelope editor
    this.envEd = { "buttons": {}, "inner": {}, "envelope": null, "mode": null }
    this.envEd.x = this.melEd.x
    this.envEd.y = this.melEd.y + 7.5/10*this.melEd.height
    this.envEd.width = this.melEd.width
    this.envEd.height = 2.5/10*this.melEd.height
    this.envEd.buttons.x = this.melEd.x
    this.envEd.buttons.y = this.melEd.y + 6.5/10*this.melEd.height
    this.envEd.buttons.width = this.melEd.width
    this.envEd.buttons.height = 1/10*this.melEd.height
    this.envEd.buttons.img = (param.envEd.buttons && param.envEd.buttons.img) || []
    this.envEd.buttons.imgName = (param.envEd.buttons && param.envEd.buttons.imgName) || [
      "env_temp_3401691.png",
      "env_volume_1724091.png",
      "env_echo_2010331.png",
      "env_circuit_1685926.png"
    ]
    this.envEd.inner.x = this.grid.inner.x
    this.envEd.inner.y = this.envEd.y
    this.envEd.inner.width = this.grid.inner.width
    this.envEd.inner.height = this.envEd.height
    this.envEd.inner.nodeDiameter = (param.envEd && param.envEd.inner && param.envEd.inner.nodeDiameter) || 25

    // Construct buttons.
    this.trans = {}
    this.trans.img = (param.trans && param.trans.img) || []
    this.gran = param.gran
    this.navign = {}
    this.navign.x = (param.navign && param.navign.x) || this.edBtn.x + this.edBtn.width
    this.navign.y = (param.navign && param.navign.y) || this.edBtn.y
    this.navign.width = (param.navign && param.navign.width) || this.edBtn.width
    this.navign.height = (param.navign && param.navign.height) || this.edBtn.height
    this.navign.img = (param.navign && param.navign.img) || []
    this.navign.imgName = (param.navign && param.navign.imgName) || [
      "arrow-up_256_0_ecf0f1_none.png",
      "arrow-down_256_0_ecf0f1_none.png",
      "arrow-left_256_0_ecf0f1_none.png",
      "arrow-right_256_0_ecf0f1_none.png"
    ]
    this.edBtn.buttons = new mg.EditButtons(
      this.sk,
      {
        "pencil": new mg.Button(this.sk, this.edBtn.img[0], false, true, this.edBtn.x, this.edBtn.y, 60, 60),
        "cursor": new mg.Button(this.sk, this.edBtn.img[1], false, false, this.edBtn.x + 80, this.edBtn.y, 60, 60),
        "rubber": new mg.Button(this.sk, this.edBtn.img[2], false, false, this.edBtn.x + 160, this.edBtn.y, 60, 60)
      },
      { "x": this.edBtn.x, "y": this.edBtn.y, "width": this.edBtn.width, "height": this.edBtn.height }
    )
    this.trans.buttons = new mg.TransportButtons(
      this.sk,
      {
        "help": new mg.Button(
          this.sk, this.trans.img[0], false, true,
          this.envEd.buttons.x, this.grid.y + this.grid.height + 10, 60, 60
        ),
        "playPause": new mg.Button(
          this.sk, this.trans.img[1][0], false, false,
          this.envEd.buttons.x + 80, this.grid.y + this.grid.height + 10, 60, 60
        ),
        "changeInstr": new mg.Button(
          this.sk, param.instr.iicons[param.instr.staffNo], false, false,
          this.envEd.buttons.x + 160, this.grid.y + this.grid.height + 10, 60, 60
        )
      },
      { "x": this.envEd.buttons.x, "y": this.envEd.buttons.y, "width": this.envEd.buttons.width, "height": this.envEd.buttons.height }
    )
    this.gran.buttons = new mg.GranularityButtons(
      this.sk,
      {
        "granularity": new mg.Button(
          this.sk, this.gran.img[this.gran.index], false, false,
          this.edBtn.x + 300, this.edBtn.y, 60, 60
        )
        // "changeInstr": new mg.Button(
        //   bassImg, false, false,
        //   prm.trans.x + 100, prm.trans.y + prm.trans.height - 80, 60, 60
        // )
      },
      { "x": this.edBtn.x, "y": this.edBtn.y, "width": this.edBtn.width, "height": this.edBtn.height }
    )
    this.navign.buttons = new mg.NavigationButtons(
      this.sk,
      {
        "up": new mg.Button(
          this.sk, this.navign.img[0], false, false,
          this.navign.x - 300, this.navign.y, 60, 60
        ),
        "down": new mg.Button(
          this.sk, this.navign.img[1], false, false,
          this.navign.x - 220, this.navign.y, 60, 60
        ),
        "left": new mg.Button(
          this.sk, this.navign.img[2], true, false,
          this.navign.x - 140, this.navign.y, 60, 60
        ),
        "right": new mg.Button(
          this.sk, this.navign.img[3], true, false,
          this.navign.x - 60, this.navign.y, 60, 60
        )
      },
      { "x": this.navign.x - 300, "y": this.navign.y, "width": this.navign.width, "height": this.edBtn.height }
    )
    this.envEd.buttons.buttons = new mg.EnvelopeButtons(
      this.sk,
      {
        "tempo": new mg.Button(
          this.sk, this.envEd.buttons.img[0], false, false,
          this.envEd.buttons.x + this.envEd.buttons.width - 300, this.envEd.buttons.y + this.envEd.buttons.height - 70, 60, 60
        ),
        "volume": new mg.Button(
          this.sk, this.envEd.buttons.img[1], false, true,
          this.envEd.buttons.x + this.envEd.buttons.width - 220, this.envEd.buttons.y + this.envEd.buttons.height - 70, 60, 60
        ),
        "reverb room size": new mg.Button(
          this.sk, this.envEd.buttons.img[2], false, false,
          this.envEd.buttons.x + this.envEd.buttons.width - 140, this.envEd.buttons.y + this.envEd.buttons.height - 70, 60, 60
        ),
        "reverb wet": new mg.Button(
          this.sk, this.envEd.buttons.img[3], false, false,
          this.envEd.buttons.x + this.envEd.buttons.width - 60, this.envEd.buttons.y + this.envEd.buttons.height - 70, 60, 60
        )
      },
      { "x": this.envEd.buttons.x + this.envEd.buttons.width - 300, "y": this.envEd.buttons.y, "width": this.envEd.buttons.width, "height": this.envEd.buttons.height }
    )

    this.envEd.envelope = new mg.Envelope(
      this.sk, "blah", 2/3, false, this.envEd.x, this.envEd.y, this.envEd.width,
      this.envEd.height, this.envEd.inner.nodeDiameter
    )
    this.envEd.mode = param.envEd.mode || "volume"
    this.envEd.envelope.load(this.envEd.mode)

    // this.helpMode = param.helpMode
    this.help = new mg.Help(this.sk, param.helpMode)

    this.path = param.path

    this.canvas.canvas = this.sk.createCanvas(this.canvas.width, this.canvas.height)

  }


  cursor_draw(){
    // Cursor changes
    if (
      !this.help.mode &&
      this.sk.mouseX > this.grid.inner.x && this.sk.mouseX < this.grid.inner.x + this.grid.inner.width &&
      this.sk.mouseY > this.grid.inner.y && this.sk.mouseY < this.grid.inner.y + this.grid.inner.height
    ){
      switch (this.grid.param.editMode){
        case "pencil":
        // console.log("YOO!")
        this.sk.cursor('grab')
        // this.sk.cursor(imgPath + "pencil_256_0_ecf0f1_none_32x32.png", 1, 32)
        break
        case "cursor":
        this.sk.cursor(this.path.img + "mouse-pointer_256_0_ecf0f1_none_32x32.png")
        break
        case "rubber":
        this.sk.cursor(this.path.img + "eraser_256_0_ecf0f1_none_32x32.png", 1, 32)
        break
        default:
        console.log("Should not get here in draw() editMode switch!")
      }
      this.grid.param.cursorType = this.grid.param.editMode
    }
    else {
      if (this.grid.param.cursorType !== "arrow"){
        this.grid.param.cursorType = "arrow"
        this.sk.cursor(this.sk.ARROW)
      }
    }
  }


  draw(recalculateDimensions, componentStr){
    const self = this
    if (Tone.Transport.state == "started"){
      Tone.Draw.schedule(function(time){
        self.draw_helper(recalculateDimensions, componentStr)
      }, "+0.1")
    }
    else {
      self.draw_helper(recalculateDimensions, componentStr)
    }
  }


  draw_helper(recalculateDimensions, componentStr){
    const self = this
    this.sk.background(235)
    this.sk.noFill()
    this.sk.textAlign(this.sk.LEFT, this.sk.TOP)
    this.sk.stroke(180)
    self.edBtn.buttons.draw()
    self.gran.buttons.draw()
    self.trans.buttons.draw()
    self.navign.buttons.draw()
    self.envEd.buttons.buttons.draw()

    this.sk.stroke(0)
    this.sk.noFill()
    this.sk.textAlign(this.sk.LEFT, this.sk.TOP)

    self.grid.draw(recalculateDimensions)
    self.envEd.envelope.draw(recalculateDimensions)

    if (self.help.sk.mode){
      self.help.sk.draw()
    }
  }


  get_canvas(){ return this.canvas.canvas }

}


class Sonic {
  constructor(param){
    const self = this
    // self.sk = theSketch
    self.path = param.path

    Tone.Transport.loop = true
    Tone.Transport.loopEnd = "4:0:0"
    Tone.Transport.bpm.value = 110

    self.reverb = new Tone.JCReverb().toDestination()
    // console.log("self.reverb:", self.reverb)
    self.reverb.roomSize.value = 0
    self.reverb.wet.value = 0

    // Handle instruments.
    self.instrKeys = param.instr.keys
    self.staffNo = param.instr.staffNo
    console.log("self.staffNo:", self.staffNo)
    self.iicons = param.instr.iicons
    // Way to do loading with multiple instruments.
    self.loadCountTotal = self.instrKeys.length
    self.loadCounter = 0
    self.instr = self.instrKeys.map(function(k){
      return instrData[k]["tonejsDef"].call()
    })
    // self.selectedInstr = self.instr[self.instrKeys[self.staffNo]]
    // console.log("self.selectedInstr:", self.selectedInstr)


    // Needs a review:
    // Enables the MIDI file uploading.
    document
    .querySelector("#mySequencer")
    .addEventListener("change", function(e){
      console.log("GOT FIRED!")
      const files = e.target.files
      if (files.length > 0){
        const file = files[0]
        self.parse_file(file)
      }
    })

    // Not sure if this one's of any use.
    document
    .querySelector("#mySequencer")
    .addEventListener("click", function(e){
      e.preventDefault();
    })
  }


  check_and_implement_edit(c, alteration, theGrid){// idNote, gran = "1", theGrid){
    const gran = theGrid.string_fraction2decimal(theGrid.param.gran.value)
    console.log("gran at outset of check_and_implement_edit:", gran)
    const oldNoteIdx = c.notes.findIndex(function(n){ return n.id == theGrid.inner.selectedOblong.idNote })
    let newNote = mu.copy_array_object(c.notes[oldNoteIdx])
    newNote.idEditOf = newNote.id
    newNote.id = uuid()
    newNote.stampCreate = Date.now()
    c.notes[oldNoteIdx].stampDelete = Date.now()
    let bb
    switch (alteration){
      case "up":
      newNote.MNN++
      newNote.MPN = mu.guess_morphetic(
        newNote.MNN, c.keySignatures[0].fifthSteps,
        c.keySignatures[0].mode
      )
      newNote.pitch = mu.midi_note_morphetic_pair2pitch_and_octave(
        newNote.MNN, newNote.MPN
      )
      break
      case "down":
      newNote.MNN--
      newNote.MPN = mu.guess_morphetic(
        newNote.MNN, c.keySignatures[0].fifthSteps,
        c.keySignatures[0].mode
      )
      newNote.pitch = mu.midi_note_morphetic_pair2pitch_and_octave(
        newNote.MNN, newNote.MPN
      )
      break
      case "shorten":
      console.log("GOT TO SHORTEN!")
      if (
        newNote.duration - gran < 0 ||
        Math.abs(newNote.duration - gran) < 0.01
      ){
        newNote.duration = 4
      }
      else {
        newNote.duration -= gran
        console.log("GOT TO DURATION REDUCTION!")
      }
      newNote.offtime = newNote.ontime + newNote.duration
      bb = mu.bar_and_beat_number_of_ontime(newNote.offtime, compObj.timeSignatures)
      newNote.barOff = bb[0]
      newNote.beatOff = bb[1]
      break
      case "left":
      newNote.ontime -= gran
      bb = mu.bar_and_beat_number_of_ontime(newNote.ontime, compObj.timeSignatures)
      newNote.barOn = bb[0]
      newNote.beatOn = bb[1]
      newNote.offtime -= gran
      bb = mu.bar_and_beat_number_of_ontime(newNote.offtime, compObj.timeSignatures)
      newNote.barOff = bb[0]
      newNote.beatOff = bb[1]
      break
      case "right":
      newNote.ontime += gran
      bb = mu.bar_and_beat_number_of_ontime(newNote.ontime, compObj.timeSignatures)
      newNote.barOn = bb[0]
      newNote.beatOn = bb[1]
      newNote.offtime += gran
      bb = mu.bar_and_beat_number_of_ontime(newNote.offtime, compObj.timeSignatures)
      newNote.barOff = bb[0]
      newNote.beatOff = bb[1]
      break
      default:
      console.log("SHOULD NOT GET HERE!")
    }
    c.notes.push(newNote)
    // Check temporal min, max, and range.
    const onMin = mu.min_argmin(
      c.notes.filter(function(n){ return n.stampDelete == null })
      .map(function(n){ return n.ontime })
    )
    const offMax = mu.max_argmax(
      c.notes.filter(function(n){ return n.stampDelete == null })
      .map(function(n){ return n.offtime })
    )
    if (onMin[0] < 0 || offMax[0] > 16 || Math.abs(offMax[0] - onMin[0]) > 16){
      alert("Temporal aspect of the edit is problematic (please keep within sixteen beats). Reverting...")
      c.notes[oldNoteIdx].stampDelete = null
      c.notes.pop()
      return
    }
    // Check pitch min, max, and range.
    const mnnMin = mu.min_argmin(
      c.notes.filter(function(n){ return n.stampDelete == null })
      .map(function(n){ return n.MNN })
    )
    const mnnMax = mu.max_argmax(
      c.notes.filter(function(n){ return n.stampDelete == null })
      .map(function(n){ return n.MNN })
    )
    if (mnnMin[0] < 21 || mnnMax[0] > 108 || Math.abs(mnnMax[0] - mnnMin[0]) > 24){
      alert("Pitched aspect of the edit is problematic (please keep within two octaves). Reverting...")
      c.notes[oldNoteIdx].stampDelete = null
      c.notes.pop()
      return
    }
    if (mnnMin[0] <= theGrid.param.mnns[theGrid.param.topMnn - theGrid.inner.nosRow]){
      theGrid.param.topMnn-- // Components will be drawn by calling context.
    }
    if (mnnMax[0] > theGrid.param.mnns[theGrid.param.topMnn]){
      // console.log("THIS HAPPENED!")
      theGrid.param.topMnn++  // Components will be drawn by calling context.
    }
    // console.log("topMnn from check_and_implement_edit:", topMnn)
    // Check for any polyphony.
    // let sortedNotes = compObj.notes.filter(function(n){ return n.stampDelete == null})
    // .sort(mu.sort_points_asc)
    // let points = mu.comp_obj2note_point_set({ "notes": sortedNotes })
    // let problemSegments = mu.segment(points)
    // .filter(function(seg){
    //   return seg.points.length > 1
    // })
    // if (problemSegments.length > 0){
    //   alert("Oi Mozart, please keep your composition monophonic! (We appreciate it might be our editor's fault.)")
    //   c.notes[oldNoteIdx].stampDelete = null
    //   c.notes.pop()
    //   return
    // }
    // console.log("compObj:", compObj)

    // Important for transferring the highlighted property.
    theGrid.inner.oblongs = theGrid.comp_obj2oblongs(compObj)
    // theGrid.inner.oblongs = theGrid.comp_obj2oblongs(compObj, theGrid.param.leftInt, theGrid.inner.nosCol, theGrid.param.topMnn, theGrid.inner.nosRow, prm.gran.value, newNote.id)
    theGrid.inner.selectedOblong = theGrid.inner.oblongs.find(function(o){ return o.highlight })

    this.schedule_events(compObj, prodObj, theGrid)
  }


  schedule_events(co, po, theGrid){
    const self = this
    // Remove anything that was on the Transport.
    Tone.Transport.cancel()
    // Highlighting of top and bottom outer grids
    let interval = "4n"
    const ontimes = new Array(theGrid.inner.nosCol)
    for (let i = 0; i < theGrid.inner.nosCol; i++){
      ontimes[i] = i
    }
    ontimes.forEach(function(o){
      Tone.Transport.schedule(function(aTime){
        Tone.Draw.schedule(function(time){
          theGrid.outer.top.cells[o].set_background("highlight")
          theGrid.outer.bottom.cells[o].set_background("highlight")
          if (o > 0){
            theGrid.outer.top.cells[o - 1].set_background()
            theGrid.outer.bottom.cells[o - 1].set_background()
          }
          else {
            theGrid.outer.top.cells[theGrid.inner.nosCol - 1].set_background()
            theGrid.outer.bottom.cells[theGrid.inner.nosCol - 1].set_background()
          }
        }, aTime)
      }, "0:" + o + ":0")
    })

    // Schedule tempo, reverb, etc.
    console.log("active tempi:", co.tempi.filter(function(t){ return t.stampDelete == null }))
    co.tempi.filter(function(t){ return t.stampDelete == null })
    .map(function(t){
      Tone.Transport.schedule(function(time){
         Tone.Transport.bpm.value = t.bpm
      }, "0:0:" + (4 * (t.ontime + 0.00)).toString())
    })
    // console.log("po.pan:", po.pan)
    // po.pan.map(function(pn){
    //   Tone.Transport.schedule(function(time){
    //      panner.pan = pn
    //   }, "0:0:" + (4 * (pn.ontime + 0.00)).toString())
    // })
    console.log("active reverb roomSize:", po.reverb.roomSize.filter(function(r){ return r.stampDelete == null }))
    po.reverb.roomSize.filter(function(r){ return r.stampDelete == null })
    .map(function(r){
      Tone.Transport.schedule(function(time){
        self.reverb.roomSize.value = r.val
      }, "0:0:" + (4 * (r.ontime + 0.00)).toString())
    })
    console.log("active reverb wet:", po.reverb.wet.filter(function(r){ return r.stampDelete == null }))
    po.reverb.wet.filter(function(r){ return r.stampDelete == null })
    .map(function(r){
      Tone.Transport.schedule(function(time){
        self.reverb.wet.value = r.val
      }, "0:0:" + (4 * (r.ontime + 0.00)).toString())
    })

    // Schedule notes.
    // console.log("co.notes.length:", co.notes.length)
    co.notes.filter(function(n){ return n.stampDelete == null })
    .forEach(function(n){
      const beginTime = "0:0:" + (4*(n.ontime + 0.00)).toString()
      let endTime
      // Concerned that looping might result in not catching an edge-case
      // offtime.
      if (n.offtime == 16){
        endTime = "0:0:" + (4*(n.offtime - 0.05)).toString()
      }
      else {
        endTime = "0:0:" + (4*n.offtime).toString()
      }

      // Find the greatest volume node ontime such that the note ontime is
      // greater than or equal to it. (Inefficient implementation follows!)
      let vel = po.volume.filter(function(v){ return v.stampDelete == null })
      .slice(0).reverse().find(function(v){
        // console.log("n.ontime:", n.ontime)
        // console.log("v.ontime:", v.ontime)
        return n.ontime >= v.ontime
      })["val"]
      // console.log("vel:", vel)

      // Simpler.
      // let vel = 0.5
      Tone.Transport.schedule(function(time){
        self.instr[n.staffNo].triggerAttack(n.pitch, time, vel)
      }, beginTime)
      Tone.Transport.schedule(function(time){
        self.instr[n.staffNo].triggerRelease(n.pitch, time, vel)
      }, endTime)
    })
    // Tone.Transport.start()
  }


  increment_staff_no(){
    console.log("this.instr:", this.instr)
    this.staffNo = (this.staffNo + 1) % this.instr.length
  }


  instr_load_progress_monitor(){
    loadCounter++
    if (loadCounter == loadCountTotal) {
      console.log("We're ready to begin!")
      this.selectedInstr = this.instr[this.instrKeys[this.staffNo]]
    }
  }


  parse_file(aFile){
    const reader = new FileReader()
    reader.onload = function(e){
      const midi = new Midi(e.target.result)
      // console.log("midi:")
      // console.log(JSON.stringify(midi, undefined, 2))
      overwrite_comp_obj_with_midi(midi)
    }
    reader.readAsArrayBuffer(aFile)
  }


  overwrite_comp_obj_with_midi(amaj, theGrid){
    // Get points, then segment to skyline, then convert to notes.
    // const segs = mu.segment()
    const points = amaj.tracks[0].notes.map(function(n){
      const mpn = mu.guess_morphetic(
        n.midi,
        compObj.keySignatures[0].fifthSteps,
        compObj.keySignatures[0].mode
      )
      return [n.time, n.midi, mpn, n.duration]
    })
    let showMonophonyAlert = false
    let topPoints = mu.segment(points, true, 0, 3).filter(function(seg){
      return seg.points.length > 0
    })
    // console.log("topPoints:", topPoints)
    topPoints = topPoints
    .map(function(seg){
      if (seg.points.length === 1){
        return seg.points[0]
      }
      else {
        showMonophonyAlert = true
        const relPoints = seg.points.filter(function(pt){
          return pt[0] === seg.ontime
        })
        .map(function(pt){
          const offtime = pt[0] + pt[3]
          if (offtime > seg.offtime){
            return [pt[0], pt[1], pt[2], seg.offtime - pt[0]]
          }
          else {
            return pt
          }
        })

        const sortedPoints = relPoints.sort(function(a, b){
          return b[1] - a[1]
        })
        return sortedPoints[0]
      }
    })
    // console.log("topPoints:", topPoints)
    let monoPoints = mu.unique_rows(topPoints)[0]
    // console.log("monoPoints:", monoPoints)
    if (showMonophonyAlert){
      alert("We monophonized your polyphony!")
    }
    if (monoPoints[monoPoints.length - 1][0] + monoPoints[monoPoints.length - 1][3] > theGrid.inner.nosCol){
      monoPoints = monoPoints.filter(function(pt){
        return pt[0] + pt[3] <= theGrid.inner.nosCol
      })
      alert("We truncated your melody!")
    }

    compObj.notes = monoPoints.map(function(pt){
      const note = {
        "ontime": pt[0],
        "MNN": pt[1],
        "MPN": pt[2],
        "duration": pt[3],
        "offtime": pt[0] + pt[3],

        "MPN": pt[2],
        "pitch": mu.midi_note_morphetic_pair2pitch_and_octave(pt[1], pt[2]),
        "staffNo": 0,
        "velocity": 0.5,
        "stampCreate": Date.now(),
        "stampDelete": null

        // "ontime": 1,
        // "MNN": 62,
        // "duration": 1,
        // "velocity": 0.5,
        // "staffNo": 0,
        // "voiceNo": 0,
        // "oblongEntry": {
        //   "granularity": "1",
        //   "colNo": 1
        // },
        // "barOn": 1,
        // "beatOn": 2,
        // "offtime": 2,
        // "barOff": 1,
        // "beatOff": 3,
        // "MPN": 61,
        // "pitch": "D4",
        // "stampCreate": 1583940476727,
        // "stampDelete": 1583940526954
      }
      console.log("note:", note)
      return note
    })

    // Update the interface.
    theGrid.inner.oblongs = theGrid.comp_obj2oblongs(compObj)
    // theGrid.inner.oblongs = theGrid.comp_obj2oblongs(compObj, theGrid.param.leftInt, theGrid.inner.nosCol, theGrid.param.topMnn, theGrid.inner.nosRow, prm.gran.options[prm.gran.index])
    this.schedule_events(compObj, prodObj, theGrid)
    theGrid.draw()
    // draw_components()
  }


  // Obsolete
  // Helps with iOS. Could probably be updated with Tone.start() or similar.
  // userStartAudio(elements, callback){
  //   var elt = elements
  //   if (elements instanceof p5.Element) {
  //     elt = elements.elt
  //   }
  //   else if (elements instanceof Array && elements[0] instanceof p5.Element){
  //     elt = elements.map(function(e){
  //       return e.elt
  //     })
  //   }
  //   return StartAudioContext(Tone.context, elt, callback)
  // }

}


new p5(sketchy, "mySequencer")
