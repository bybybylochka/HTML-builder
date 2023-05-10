const fsPromise = require('fs/promises');
const fs=require('fs');
const path = require('path');


const folderPath = path.join(__dirname, 'styles');

fs.access(path.join(__dirname, 'project-dist', 'bundle.css'), fs.constants.F_OK, (err)=>{
  if(!err){
    fs.writeFile(path.join(__dirname, 'project-dist', 'bundle.css'), '', (err)=>{
      if(err){
        console.log('Ошибка очистки файла');
      }
    });
  }
});
fsPromise.readdir(folderPath)
  .then((files) => {
    files.forEach((file) => {
      let filePath=path.join(__dirname, 'styles', file);
      fsPromise.lstat(filePath)
        .then((stats) => {
          if (stats.isFile()) {
            if(path.extname(filePath)==='.css'){
              fs.readFile(path.join(__dirname, 'styles', file), 'utf-8', (err, data) => {
                fs.appendFile(path.join(__dirname, 'project-dist', 'bundle.css'), data, 'utf-8', (err) => {
                  if (err) {
                    console.error('Ошибка при записи файла:', err);
                  }
                });

              });
            }
          }
        });
    });
  })
  .catch((error) => {
    console.error('Ошибка чтения папки:', error);
  });
