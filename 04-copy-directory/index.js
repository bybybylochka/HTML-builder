const fsPromises = require('fs/promises');
const path = require('path');
const fs=require('fs');

const destinationPath = path.join(__dirname, 'files-copy');
const sourcePath = path.join(__dirname, 'files');

function copyDir(source, destination){
  fs.readdir(source, (err, files) => {
    fsPromises.mkdir(destination, { recursive: true })
      .then(() => {
        console.log('Директория успешно создана');
      })
      .catch((error) => {
        console.error('Ошибка при создании директории:', error);
      });
    files.forEach((file) => {
      const sourceFile = path.join(source, file);
      const destinationFile = path.join(destination, file);
      fs.copyFile(sourceFile, destinationFile, (err) => {
        if (err) {
          console.error('Ошибка при копировании файла:', err);
        }
      });
    });
  });
  fs.access(destination, fs.constants.F_OK, (err)=> {
    if (!err) {
      fs.readdir(destination, (err, files) => {
        files.forEach(file => {
          fs.access(path.join(__dirname, 'files', file), fs.constants.F_OK, (err) => {
            if (err) {
              fs.unlink(path.join(__dirname, 'files-copy', file), (err) => {
                if (err) {
                  console.error('Ошибка при удалении файла:', err);
                }
              });
            }
          });
        });
      });
    }
  });
}

copyDir(sourcePath, destinationPath);


