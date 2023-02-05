module.exports = {
  opts: {
    recurse: true,
    destination: "docs",
    // tutorials: "tutorials"
  },
  plugins: ["plugins/markdown"],
  templates: {
    default: {
      outputSourceFiles: false
    }
  }
}
