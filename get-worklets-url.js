const { readdir } = require('fs');
const { promisify } = require('util');

const readdirAsync = promisify(readdir);
readdirAsync('./src/assets/audio-worklet-processors').then(files => {
  // ensure we don't try read the map file
  const sourceFiles = files.filter(f => /worklets.*\.js$/.test(f));
  console.log(`export const workletUrl = '/assets/audio-worklet-processors/${sourceFiles[0]}';`);
}, console.error);
