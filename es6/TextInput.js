class TextInput {
  constructor(
    _sketch, _inputPlaceholder, _inputX, _inputY, _inputW, _btnText, _btnX, _btnY
  ){
    // this.sk = _sketch,
    this.input = _sketch.createInput(_inputPlaceholder)
    this.input.position(_inputX, _inputY)
    this.input.size(_inputW)
    this.subBtn = _sketch.createButton(_btnText)
    this.subBtn.position(_btnX, _btnY)
    this.subBtn.mousePressed(this.mouse_pressed.bind(this))
  }


  mouse_pressed(wavfs){
    try {
      // console.log("this:", this)
      wavfs.add_waveform(this.input.elt.value, 30, 100, rectH, secPerBox, wavfs)
    }
    catch (error){
      console.error(error)
    }
  }
}
export default TextInput
