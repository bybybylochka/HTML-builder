const fs = require('fs');
const path = require('path');
const fsPromise = require('fs/promises');

const templatePath = path.join(__dirname, 'template.html');
const outputFilePath = path.join(__dirname, 'project-dist');
const componentsFolderPath = path.join(__dirname, 'components');

const destinationPath = path.join(__dirname, 'project-dist', 'assets');
const sourcePath = path.join(__dirname, 'assets');

fs.readFile(templatePath, 'utf-8', (err, templateData) => {
  if (err) {
    console.error('Ошибка при чтении файла-шаблона:', err);
    return;
  }
  fs.readdir(componentsFolderPath, (err, files) => {
    if (err) {
      console.error('Ошибка при чтении содержимого папки components:', err);
      return;
    }
    files.forEach((file) => {
      const componentFilePath = path.join(componentsFolderPath, file);

      fs.readFile(componentFilePath, 'utf-8', (err, componentData) => {
        if (err) {
          console.error('Ошибка при чтении файла компонента:', err);
          return;
        }

        const componentName = path.basename(file, path.extname(file));
        const regex = new RegExp(`{{${componentName}}}`, 'g');
        templateData = templateData.replace(regex, componentData);

        if (!templateData.includes(`{{${componentName}}}`)) {
          fs.mkdir(path.join(__dirname, 'project-dist'),{ recursive: true }, (err)=>{
            if (err) {
              console.error('Ошибка создания директории:', err);
            }
            fs.writeFile(path.join(__dirname, 'project-dist', 'index.html'), templateData,(err) => {
              console.log(path.join(__dirname, 'project-dist', 'index.html'));
              if (err) {
                console.error('Ошибка при записи файла-результата:', err);
                return;
              }
              console.log('Файл-результат успешно создан:', outputFilePath);
            });
          });
        }
      });
    });
  });
});

copyDir(sourcePath ,destinationPath, (err)=>{
  if(err){
    console.log(err);
  }
});
function copyDir(sourceDir, destinationDir, callback) {
  fs.mkdir(destinationDir, { recursive: true }, err => {
    if (err) {
      callback(err);
      return;
    }
    
    fs.readdir(sourceDir, { withFileTypes: true }, (err, files) => {
      if (err) {
        callback(err);
        return;
      }

      let fileCount = files.length;

      const isDirectory = file => file.isDirectory();
      
      const done = err => {
        if (err) {
          callback(err);
          return;
        }

        fileCount--;

        if (fileCount === 0) {
          callback(null);
        }
      };

      files.forEach(file => {
        const sourcePath = path.join(sourceDir, file.name);
        const targetPath = path.join(destinationDir, file.name);

        if (isDirectory(file)) {
          copyDir(sourcePath, targetPath, done);
        } else {
          fs.copyFile(sourcePath, targetPath, done);
        }
      });
    });
  });
}

const folderPath = path.join(__dirname, 'styles');


fsPromise.readdir(folderPath)
  .then((files) => {
    files.forEach((file) => {
      let filePath=path.join(__dirname, 'styles', file);
      fsPromise.lstat(filePath)
        .then((stats) => {
          if (stats.isFile()) {
            if(path.extname(filePath)==='.css'){
              fs.readFile(path.join(__dirname, 'styles', file), 'utf-8', (err, data) => {
                fs.appendFile(path.join(__dirname, 'project-dist', 'style.css'), data, 'utf-8', (err) => {
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