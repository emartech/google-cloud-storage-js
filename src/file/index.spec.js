'use strict';

const GoogleCloud = require('google-cloud');
const File = require('./');


describe('File', function() {
  let bucketStub;
  let storageStub;


  beforeEach(function() {
    bucketStub = { file: this.sandbox.stub().returns('[gcs file]') };
    storageStub = { bucket: this.sandbox.stub().returns(bucketStub) };

    this.sandbox.stub(GoogleCloud, 'storage').returns(storageStub);
  });


  describe('.create', function() {
    let file;

    context('when called with file name (and path)', function() {
      beforeEach(function() {
        file = File.create('path/to/file.ext');
      });

      it('should instantiate a Storage instance with proper config', function() {
        expect(GoogleCloud.storage).to.calledWithExactly({ bucket: 'name', stranger: 'things' });
      });


      it('should instantiate a Storage Bucket instance with proper bucket name', function() {
        expect(storageStub.bucket).to.calledWithExactly('name');
      });


      it('should instantiate a Storage File instance with proper filename name', function() {
        expect(bucketStub.file).to.calledWithExactly('path/to/file.ext');
      });


      it('should return with the instantiated Storage File', function() {
        expect(file).to.eql('[gcs file]');
      });
    });


    context('when called with a fully qualified GCS resoruce name', function() {
      beforeEach(function() {
        file = File.create('gs://bucket-name/object/path/and/name.json.gz');
      });

      it('should instantiate a Storage instance with proper config', function() {
        expect(GoogleCloud.storage).to.calledWithExactly({ bucket: 'name', stranger: 'things' });
      });


      it('should instantiate a Storage Bucket instance with proper bucket name', function() {
        expect(storageStub.bucket).to.calledWithExactly('bucket-name');
      });


      it('should instantiate a Storage File instance with proper filename name', function() {
        expect(bucketStub.file).to.calledWithExactly('object/path/and/name.json.gz');
      });


      it('should return with the instantiated Storage File', function() {
        expect(file).to.eql('[gcs file]');
      });
    });

  });

});
