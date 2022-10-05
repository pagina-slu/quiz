// initial file reader

const {readFileSync, promises: fsPromises} = require('fs');

function syncReadFile(filename) {
  const contents = readFileSync(filename, 'utf-8');

  const arr = contents.split(/\r?\n/);


  return arr;
}
const data = syncReadFile('./questions.txt');

console.log(data[1]);
