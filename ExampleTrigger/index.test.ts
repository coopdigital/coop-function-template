import exampleTrigger from './index';
import Context from '../testing/defaultContext';

describe('Example Trigger Tests', () => {
  it('Success', async () => {
    const testContext = new Context();
    const testName = {
      params: {
        name: 'Barry',
      },
    };

    await exampleTrigger(testContext, testName);

    expect(testContext.res.body).toBe(
      'Hello, Barry. This HTTP triggered function executed successfully.'
    );
  });
});
