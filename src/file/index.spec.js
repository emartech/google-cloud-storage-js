'use strict';

const Storage = require('@google-cloud/storage').Storage;
const File = require('./index');
const FileError = require('./error');


describe('File', function() {
  let bucketStub;

  beforeEach(function() {
    bucketStub = { file: this.sandbox.stub().returns('[gcs file]') };

    this.sandbox.stub(Storage.prototype, 'bucket').returns(bucketStub);
  });


  describe('.create', function() {
    let file;

    context('projectId is specified', function() {
      context('when called with file name (and path)', function() {
        beforeEach(function() {
          file = File.create('path/to/file.ext');
        });

        it('should instantiate a Storage Bucket instance with proper bucket name', function() {
          expect(Storage.prototype.bucket).to.calledWithExactly('name');
        });


        it('should instantiate a Storage File instance with proper filename name', function() {
          expect(bucketStub.file).to.calledWithExactly('path/to/file.ext');
        });


        it('should return with the instantiated Storage File', function() {
          expect(file).to.eql('[gcs file]');
        });
      });


      context('when called with a fully qualified GCS resource name', function() {
        beforeEach(function() {
          file = File.create('gs://bucket-name/object/path/and/name.json.gz');
        });

        it('should instantiate a Storage Bucket instance with proper bucket name', function() {
          expect(Storage.prototype.bucket).to.calledWithExactly('bucket-name');
        });


        it('should instantiate a Storage File instance with proper filename name', function() {
          expect(bucketStub.file).to.calledWithExactly('object/path/and/name.json.gz');
        });


        it('should return with the instantiated Storage File', function() {
          expect(file).to.eql('[gcs file]');
        });
      });
    });


    context('projectId is specified', function() {
      context('when called with file name (and path)', function() {
        it('throws exception', function() {
          expect(function() { File.create('path/to/file.ext', 'differentProjectId'); }).to.throw(FileError);
        });
      });
    });

  });

});
