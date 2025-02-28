import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinonChai from 'sinon-chai'
import sinon from 'sinon'
global.chai = chai

global.chai.use(chaiAsPromised);
global.chai.use(sinonChai);
global.expect = global.chai.expect;
global.sinon = sinon;

beforeEach(function () {
	this.sandbox = global.sinon.createSandbox();
	global.spy = this.sandbox.spy.bind(this.sandbox);
	global.stub = this.sandbox.stub.bind(this.sandbox);
});

afterEach(function () {
	delete global.spy;
	delete global.stub;
	this.sandbox.restore();
});

process.env.SNOOPLOGG_MIN_BRIGHTNESS = '100';
