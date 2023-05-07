const path=require('path');
const fs = require('fs');
const readline = require('readline');
const output = fs.createWriteStream(path.join(__dirname, 'text.txt'), 'utf-8');
const EventEmitter = require('events');
const emitter = new EventEmitter();
process.on('exit', () => console.log('End task'));

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.on('line', (input) => {
  if(input.toString()==='exit'){
    process.exit();
  }
  else{
    output.write(input.toString());
    console.log('Your input:', input);
    emitter.emit('input');
  }
});
emitter.on('start', () => console.log('Start task'));

emitter.emit('start');

emitter.on('input', ()=>console.log('Enter the text: '));

emitter.emit('input');
