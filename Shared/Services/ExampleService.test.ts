import ExampleService from './ExampleService';
import ExampleRepository from '../Dal/ExampleRepository';
jest.mock('../Dal/ExampleRepository');

describe('ExampleService Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('get - Success', async () => {
    const mockDatabaseRepository = new ExampleRepository();

    const exampleService = new ExampleService(mockDatabaseRepository);

    const result = await exampleService.get('TEST ID');

    expect(result).toMatchSnapshot();
  });

  it('get - Not found', async () => {
    const mockDatabaseRepository = new ExampleRepository();
    (mockDatabaseRepository.getExampleById as jest.Mock).mockImplementation(
      () => {
        return null;
      }
    );
    const exampleService = new ExampleService(mockDatabaseRepository);

    const result = await exampleService.get('TEST ID');

    expect(result).toMatchSnapshot();
  });

  it('update - Success', async () => {
    const testData = {
      Field1: 'Test Data',
      Field2: 1234,
    };

    const mockDatabaseRepository = new ExampleRepository();

    const exampleService = new ExampleService(mockDatabaseRepository);

    await exampleService.update('Test ID', testData);

    expect(
      (mockDatabaseRepository.updateExampleModel as jest.Mock).mock.calls.length
    ).toBe(1);
    expect(
      (mockDatabaseRepository.updateExampleModel as jest.Mock).mock.calls[0][0]
    ).toMatchSnapshot();
  });
});
