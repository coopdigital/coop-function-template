export const mockGet = jest.fn((id) => {
  return {
    Field1: 'Test Data',
    Field2: 1234,
  };
});

export const mockUpdate = jest.fn();

const mock = jest.fn().mockImplementation(() => {
  return { get: mockGet, update: mockUpdate };
});
export default mock;
