'use strict';

const API = require('./');
const File = require('./file');
const StreamToFile = require('./stream-to-file');


describe('API', function() {

  describe('#File', function() {

    it('is a File', function() {
      expect(API.File).to.be.eql(File);
    });

  });


  describe('#StreamToFile', function() {

    it('is a StreamToFile', function() {
      expect(API.StreamToFile).to.be.eql(StreamToFile);
    });

  });

});
