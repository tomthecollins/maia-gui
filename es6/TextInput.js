class TextInput {
  constructor(
    _sketch, _wavfs, _idDiv, _inputPlaceholder, _inputX, _inputY, _inputW, _btnText, _btnX, _btnY
  ){
    // this.sk = _sketch,
    this.input = _sketch.createInput(_inputPlaceholder);
    // Calculate the (x, y)-offsets of the text input and button on the page.
    const bcr = document.querySelector("#" + _idDiv).getBoundingClientRect()
    const inputX = window.scrollX + bcr.left + _inputX
    const inputY = window.scrollY + bcr.top + _inputY
    const btnX = window.scrollX + bcr.left + _btnX
    const btnY = window.scrollY + bcr.top + _btnY
    this.input.position(inputX, inputY)
    this.input.size(_inputW)
    this.subBtn = _sketch.createButton(_btnText)
    this.subBtn.position(btnX, btnY)
    this.subBtn.mousePressed(this.mouse_pressed.bind(this))
    this.wavfs = _wavfs
  }


  mouse_pressed(){
    try {
      this.wavfs.add_waveform(this.input.elt.value, 30, 100)
    }
    catch (error){
      console.error(error)
    }
  }
}
export default TextInput
