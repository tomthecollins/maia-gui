/**
 * @file Welcome to the API for MAIA GUI!
 *
 * MAIA GUI is a JavaScript package used by Music Artificial Intelligence
 * Algorithms, Inc. in various applications that we have produced or are
 * developing currently.
 *
 * The examples folder contains working examples, such as waveform sequencer (relatively simple) and piano_roll+env_sequencer (more complex). For each example, the most important file to study to see how to build interfaces with MAIA GUI is public -> sketch.js.
 *
 * To run these examples locally,
 *
 * 1. You will need [Node.js](https://nodejs.org/en/) installed.
 * 2. In Terminal or GitBASH, navigate to the directory containing the example (if you run the `ls` command, one of the files should be server.js)
 * 3. Execute `npm install` to obtain the dependencies for your example of choice. (The dependencies are minimal -- just fastify and fastify-static to serve the page and associated resources.)
 * 4. Execute `node server.js` from the command line, then point your browser at http://127.0.0.1:3000/
 *
 * For the example piano_roll_plot, the provided MIDI file (public -> src -> midi -> 802.mid) must be converted into a Composition object **before** running server.js. The conversion script midi2comp_obj.js can be executed as follows:
 *  ```
 *  node midi2comp_obj.js -u default
 *  ```
 *
 * @version 0.0.1
 * @author Tom Collins
 * @copyright 2021-23
 *
 */

import Button_default from './Button'
import Buttons_default from './Buttons'
import EditButtons_default from './EditButtons'
import TransportButtons_default from './TransportButtons'
import GranularityButtons_default from './GranularityButtons'
import NavigationButtons_default from './NavigationButtons'
import EnvelopeButtons_default from './EnvelopeButtons'
import Cell_default from './Cell'
import Envelope_default from './Envelope'
import EnvelopeNode_default from './EnvelopeNode'
import Oblong_default from './Oblong'
import Help_default from './Help'
import Dial_default from './Dial'
import Grid_default from './Grid'
import PlayWheel_default from './PlayWheel'
import Waveform_default from './Waveform'
import Waveforms_default from './Waveforms'
import TextInput_default from './TextInput'
// import {
//   fifth_steps_mode as fifth_steps_mode_default,
//   aarden_key_profiles as aarden_key_profiles_default,
//   krumhansl_and_kessler_key_profiles as krumhansl_and_kessler_key_profiles_default
// } from './util_key'


export const Button = Button_default
export const Buttons = Buttons_default
export const EditButtons = EditButtons_default
export const TransportButtons = TransportButtons_default
export const GranularityButtons = GranularityButtons_default
export const NavigationButtons = NavigationButtons_default
export const EnvelopeButtons = EnvelopeButtons_default
export const Cell = Cell_default
export const Envelope = Envelope_default
export const EnvelopeNode = EnvelopeNode_default
export const Oblong = Oblong_default
export const Help = Help_default
export const Dial = Dial_default
export const Grid = Grid_default
export const PlayWheel = PlayWheel_default
export const Waveform = Waveform_default
export const Waveforms = Waveforms_default
export const TextInput = TextInput_default


export default {
  Button,
  Buttons,
  EditButtons,
  TransportButtons,
  GranularityButtons,
  NavigationButtons,
  EnvelopeButtons,
  Cell,
  Envelope,
  EnvelopeNode,
  Oblong,
  Help,
  Dial,
  Grid,
  PlayWheel,
  Waveform,
  Waveforms,
  TextInput

}
