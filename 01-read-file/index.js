const path=require('path');
const fs = require('fs');
const readableStream = fs.createReadStream(path.join(__dirname, 'text.txt'), 'utf-8');

readableStream.on('data', text => console.log(text));
