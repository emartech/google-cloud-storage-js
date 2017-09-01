'use strict';

const { Transform } = require('stream');

class StreamToFile {

  static create(file) {
    return new StreamToFile(file);
  }


  constructor(file) {
    this._file = file;
  }


  saveStream(readStream) {
    return new Promise((resolve, reject) => {
      readStream.on('error', reject)
        .pipe(this._transformStream).on('error', reject)
        .pipe(this._writeStream).on('error', reject).on('finish', resolve);
    });
  }


  get _writeStream() {
    return this._file.createWriteStream({ gzip: true });
  }


  get _transformStream() {
    return new Transform({
      objectMode: true,
      transform(chunk, enc, next) {
        let error;

        try {
          this.push(JSON.stringify(chunk) + '\n');
        } catch (e) {
          error = e;
        }
        next(error);
      }
    });
  }

}

module.exports = StreamToFile;
