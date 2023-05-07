const fs = require('fs/promises');
const path = require('path');

const folderPath = path.join(__dirname, 'secret-folder');

fs.readdir(folderPath)
  .then((files) => {
    files.forEach((file) => {
      let filePath=path.join(__dirname, 'secret-folder', file);
      fs.lstat(filePath)
        .then((stats) => {
          if (stats.isFile()) {
            const fileName = path.basename(filePath, path.extname(filePath));
            const fileExtension = path.extname(filePath);
            const fileSize = stats.size;

            console.log('Имя файла:', fileName);
            console.log('Расширение файла:', fileExtension);
            console.log('Размер файла (в байтах):', fileSize);
          }
        });
    });
  })
  .catch((error) => {
    console.error('Ошибка чтения папки:', error);
  });