// Tom Collins, 6/2/2023

// Imports a MIDI file and exports it to a Composition object.

// Requires
const argv = require('minimist')(process.argv.slice(2))
const fs = require("fs")
const path = require("path")
const mm = require("maia-markov")

// Individual user paths.
const mainPaths = {
    "default": {
      "fNam": "802",
      "in": path.join(__dirname, "public", "src", "midi"),
      "out": path.join(__dirname, "public", "src", "composition"),
    },
    // ...
}

const quantSet = [0, 1/8, 1/6, 1/4, 1/3, 3/8, 1/2, 5/8, 2/3, 3/4, 5/6, 7/8, 1]

// Grab user name from command line to set path to data.
const mainPath = mainPaths[argv.u]

const midiObj = new mm.MidiImport(
  path.join(mainPath["in"], mainPath["fNam"] + ".mid"),
  quantSet
)
const co = midiObj["compObj"]
// console.log("co.notes.slice(0, 5):", co.notes.slice(0, 5))

// Write to file.
fs.writeFileSync(
  path.join(mainPath["out"], mainPath["fNam"] + ".js"),
  "const co = " + JSON.stringify(co, null, 2)
)
