'use strict';

const FileError = require('./error');

process.env.SUPPRESS_NO_CONFIG_WARNING = 'y';

const Storage = require('@google-cloud/storage').Storage;
const config = require('config');

const GCS_URI_REGEXP = /^gs:\/\/([a-z0-9_.\-]+)\/(.+)$/;


class File {

  static create(filename, projectId = null) {
    const googleCloudConfig = Object.assign({}, config.get('GoogleCloud'));
    let overrideDefaultProjectId = false;

    if (projectId && projectId !== googleCloudConfig.projectId) {
      googleCloudConfig.projectId = projectId;
      overrideDefaultProjectId = true;
    }
    const storage = new Storage(googleCloudConfig);
    const { bucket, file } = this._parseAsResource(filename);

    if (overrideDefaultProjectId && !bucket) {
      throw new FileError('You should use fully qualified file path, when overriding default projectId.');
    }

    return (bucket && file) ?
      storage.bucket(bucket).file(file) :
      storage.bucket(config.get('GoogleCloud.bucket')).file(filename);
  }


  static _parseAsResource(filename) {
    const match = GCS_URI_REGEXP.exec(filename);

    return match ? { bucket: match[1], file: match[2] } : {};
  }

}

module.exports = File;
