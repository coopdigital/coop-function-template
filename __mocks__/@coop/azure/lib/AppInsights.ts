const mock = jest.fn().mockImplementation(() => {
  return {
    trackException: jest.fn(),
    trackEvent: jest.fn(),
    trackDependency: jest.fn(),
  };
});

export default new mock();
