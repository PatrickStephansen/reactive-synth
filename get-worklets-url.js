const { readdir } = require('fs');
const { promisify } = require('util');

const readdirAsync = promisify(readdir);
readdirAsync('./src/assets/audio-worklet-processors').then(files => {
  console.log(`export const workletUrl = '/assets/audio-worklet-processors/${files[0]}';`);
}, console.error);
