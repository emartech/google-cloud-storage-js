'use strict';

process.env.SUPPRESS_NO_CONFIG_WARNING = 'y';

const GoogleCloud = require('google-cloud');
const config = require('config');

const GCS_URI_REGEXP = /^gs:\/\/([a-z0-9_.\-]+)\/(.+)$/;


class File {

  static create(filename) {
    const storage = GoogleCloud.storage(config.get('GoogleCloud'));
    const { bucket, file } = this._parseAsResource(filename);

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
