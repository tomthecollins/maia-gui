const path = require("path");

// Require the fastify framework and instantiate it
const fastify = require("fastify")({
  // Set this to true for detailed logging:
  logger: false
});


// Setup our static files
fastify.register(require("fastify-static"), {
  root: [
    path.join(__dirname, "public"),
    path.join(__dirname, "..", "..")
  ],
  prefix: "/" // optional: default '/'
});


// Run the server and report out to the logs
fastify.listen("3000", '127.0.0.1', function(err, address) {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  console.log(`Your app is listening on ${address}`);
  fastify.log.info(`server listening on ${address}`);
});
