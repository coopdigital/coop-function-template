import postExampleTrigger from './index';
import Context from '../testing/defaultContext';
// @ts-ignore
import { mockUpdate } from '../Shared/Services/ExampleService';
jest.mock('../Shared/Services/ExampleService.ts');
jest.mock('../Shared/Dal/ExampleRepository.ts');

describe('Post Example Tests', () => {
  beforeEach(() => {
    (mockUpdate as jest.Mock).mockClear();
  });

  it('Success', async () => {
    // Arrange
    const testContext = new Context();
    const testData = {
      params: {
        id: 'd8db7f54-7758-4a5a-bfd1-82e205c80a59',
      },
      body: {
        example: {
          Field1: 'Test Data',
          Field2: 1234,
        },
      },
    };

    // Act
    await postExampleTrigger(testContext, testData);

    // Assert
    expect((mockUpdate as jest.Mock).mock.calls.length).toBe(1);
    expect((mockUpdate as jest.Mock).mock.calls[0][0]).toBe(
      'd8db7f54-7758-4a5a-bfd1-82e205c80a59'
    );
    expect((mockUpdate as jest.Mock).mock.calls[0][1]).toMatchSnapshot();

    expect(testContext.res.status).toBe(200);
  });

  it('400 - Invalid ID', async () => {
    // Arrange
    const testContext = new Context();
    const testData = {
      params: {
        id: 'Test Id',
      },
      body: {
        example: {
          Field1: 'Test Data',
          Field2: 1234,
        },
      },
    };

    // Act
    await postExampleTrigger(testContext, testData);

    // Assert
    expect(testContext.res.status).toBe(400);
  });

  it('400 - Invalid Body', async () => {
    // Arrange
    const testContext = new Context();
    const testData = {
      params: {
        id: 'd8db7f54-7758-4a5a-bfd1-82e205c80a59',
      },
      body: {
        example: {
          Field3: 'Test Data',
          Field4: 1234,
        },
      },
    };

    // Act
    await postExampleTrigger(testContext, testData);

    // Assert
    expect(testContext.res.status).toBe(400);
  });

  it('500 - Service Exception', async () => {
    // Arrange
    (mockUpdate as jest.Mock).mockImplementationOnce(() => {
      throw new Error('Test Error');
    });

    const testContext = new Context();
    const testData = {
      params: {
        id: 'd8db7f54-7758-4a5a-bfd1-82e205c80a59',
      },
      body: {
        example: {
          Field1: 'Test Data',
          Field2: 1234,
        },
      },
    };

    // Act
    await postExampleTrigger(testContext, testData);

    // Assert
    expect((mockUpdate as jest.Mock).mock.calls.length).toBe(1);
    expect((mockUpdate as jest.Mock).mock.calls[0][0]).toBe(
      'd8db7f54-7758-4a5a-bfd1-82e205c80a59'
    );
    expect((mockUpdate as jest.Mock).mock.calls[0][1]).toMatchSnapshot();

    expect(testContext.res.status).toBe(500);
  });
});
