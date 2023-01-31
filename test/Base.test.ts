import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinon from 'sinon';

chai.use(chaiAsPromised);

export abstract class BaseTest {
  sandbox = sinon.createSandbox();

  public before() {
    //
  }

  public after() {
    sinon.restore();
  }
}
