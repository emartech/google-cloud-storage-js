'use strict';

class FileError extends Error {
  constructor(message) {
    super(message);
    this.name = 'FileError';
  }
}

module.exports = FileError;
