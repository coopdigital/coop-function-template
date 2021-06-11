import getExampleTrigger from './index';
import Context from '../testing/defaultContext';
// @ts-ignore
import { mockGet } from '../Shared/Services/ExampleService';
jest.mock('../Shared/Services/ExampleService.ts');
jest.mock('typedi');

describe('Get Example Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Success', async () => {
    // Arrange
    const testContext = new Context();
    const testData = {
      params: {
        id: 'd8db7f54-7758-4a5a-bfd1-82e205c80a59',
      },
    };

    // Act
    await getExampleTrigger(testContext, testData);

    // Assert
    expect(testContext.res.status).toBe(200);
    expect(testContext.res.body).toMatchSnapshot();
  });

  it('400 - Invalid Id', async () => {
    // Arrange
    const testContext = new Context();
    const testData = {
      params: {
        id: 'TestId',
      },
    };

    // Act
    await getExampleTrigger(testContext, testData);

    // Assert
    expect(testContext.res.status).toBe(400);
  });

  it('404 - Invalid Id', async () => {
    // Arrange
    (mockGet as jest.Mock).mockImplementation(() => {
      return null;
    });

    const testContext = new Context();
    const testData = {
      params: {
        id: 'd8db7f54-7758-4a5a-bfd1-82e205c80a59',
      },
    };

    // Act
    await getExampleTrigger(testContext, testData);

    // Assert
    expect(testContext.res.status).toBe(404);
  });

  it('500 - Exception', async () => {
    // Arrange
    (mockGet as jest.Mock).mockImplementation(() => {
      throw new Error('TEST ERROR');
    });

    const testContext = new Context();
    const testData = {
      params: {
        id: 'd8db7f54-7758-4a5a-bfd1-82e205c80a59',
      },
    };

    // Act
    await getExampleTrigger(testContext, testData);

    // Assert
    expect(testContext.res.status).toBe(500);
  });
});
