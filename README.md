# maia-gui
Classes for building MAIA GUIs supporting various applications by Music Artificial Intelligence Algorithms, Inc.

### User

The examples folder contains working examples, such as waveform sequencer (relatively simple) and piano_roll+env_sequencer (more complex). For each example, the most important file to study to see how to build interfaces with MAIA GUI is public -> sketch.js.

To run these examples locally,

1. You will need [Node.js](https://nodejs.org/en/) installed.
2. In Terminal or GitBASH, navigate to the directory containing the example (if you run the `ls` command, one of the files should be server.js)
3. Execute `npm install` to obtain the dependencies for your example of choice. (The dependencies are minimal -- just fastify and fastify-static to serve the page and associated resources.)
4. Execute `node server.js` from the command line, then point your browser at http://127.0.0.1:3000/


### Developer

For documentation, execute `jsdoc --configure .jsdoc.config.js es6` to update
the documentation, which gets written to the docs folder, and check it looks
good and reads well.

There is some helpful advice on documenting classes [here](https://stackoverflow.com/questions/41715994/how-to-document-ecma6-classes-with-jsdoc).
