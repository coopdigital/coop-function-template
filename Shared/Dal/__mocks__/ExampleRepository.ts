import { Container } from "@azure/cosmos";

const mock = {
  getExampleById: jest.fn((id) => {
    return {
      id: 'd8db7f54-7758-4a5a-bfd1-82e205c80a59',
      Field1: 'Test Data',
      Field2: 1234,
    };
  }),
  find: jest.fn((field1) => {
    return [
      {
        id: 'd8db7f54-7758-4a5a-bfd1-82e205c80a59',
        Field1: 'Test Data',
        Field2: 1234,
      },
    ];
  }),
  updateExampleModel: jest.fn()
};
export default mock;
