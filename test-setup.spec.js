'use strict';

process.env.SUPPRESS_NO_CONFIG_WARNING = 'y';
const config = require('config');

require('co-mocha');
const sinon = require('sinon');

const chai = require('chai');

chai.use(require('sinon-chai'));
global.expect = chai.expect;
global.sinon = sinon;

before(function() {
  config.util.setModuleDefaults('GoogleCloud', { bucket: 'name', stranger: 'things' });
});

beforeEach(function() {
  this.sandbox = sinon.sandbox.create();
});

afterEach(function() {
  this.sandbox.restore();
});
