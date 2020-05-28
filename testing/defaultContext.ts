const mock = jest.fn().mockImplementation(() => {
  return {
    log: jest.fn(),
    done: jest.fn(),
    bindings: {
      outputSbQueue: {
        push: jest.fn(),
      },
    },
    df: {
      callActivity: jest.fn(),
    },
  };
});

export default mock;
