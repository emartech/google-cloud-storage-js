'use strict';

const { Writable } = require('stream');
const from2 = require('from2');
const from2array = require('from2-array');
const StreamToFile = require('./');

describe('StreamToFile', function() {

  describe('.create', function() {
    it('should return a StreamToFile instance', function() {
      expect(StreamToFile.create()).to.be.an.instanceOf(StreamToFile);
    });
  });


  describe('#saveStream', function() {
    let file;
    let results;
    let writeStream;

    const createWriteStream = (error) => {
      return new Writable({
        write(chunk, enc, cb) {
          results.push(chunk.toString());
          cb(error);
        }
      });
    };


    beforeEach(function() {
      results = [];
      writeStream = createWriteStream();

      file = { createWriteStream: this.sandbox.stub().returns(writeStream) };
    });


    it('should create a properly configured write stream for the file', function*() {
      StreamToFile.create(file).saveStream(from2array.obj([]));

      expect(file.createWriteStream).to.calledWithExactly({ gzip: true });
    });


    it('should transform the objects into newline delimited JSONs', function*() {
      yield StreamToFile.create(file).saveStream(from2array.obj([
        { int_field: 1, float_field: 0.79 },
        { int_field: 2, float_field: 0.54 }
      ]));

      expect(results).to.eql([
        '{"int_field":1,"float_field":0.79}\n',
        '{"int_field":2,"float_field":0.54}\n'
      ]);
    });


    it('should return be resolved without error', function*() {
      let error;

      try {
        yield StreamToFile.create(file).saveStream(from2array.obj(['item']));
      } catch (e) {
        error = e;
      }

      expect(error).to.eql(undefined);
    });


    it('should propagate error from writeStream', function*() {
      file.createWriteStream.returns(createWriteStream(new Error('error in writeStream')));

      try {
        yield StreamToFile.create(file).saveStream(from2array.obj(['item']));
      } catch (e) {
        expect(e.message).to.eql('error in writeStream');
        return;
      }

      throw new Error('should propagate error');
    });


    it('should propagate error from transformStream (JSON.stringify fails (is it even possible?))', function*() {
      this.sandbox.stub(JSON, 'stringify').throws(Error('error in transformStream'));

      try {
        yield StreamToFile.create(file).saveStream(from2array.obj(['item']));
      } catch (e) {
        expect(e.message).to.eql('error in transformStream');
        return;
      }

      throw new Error('should propagate error');
    });


    it('should propagate error from (input) readStream', function*() {
      try {
        yield StreamToFile.create(file).saveStream(from2((size, next) => next(new Error('error in readStream'))));
      } catch (e) {
        expect(e.message).to.eql('error in readStream');
        return;
      }

      throw new Error('should propagate error');
    });

  });

});
