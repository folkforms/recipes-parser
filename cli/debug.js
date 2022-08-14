const debug = (debugMode, text) => {
  if(debugMode) {
    console.log(`DEBUG: ${text}`);
  }
}

module.exports = debug;
