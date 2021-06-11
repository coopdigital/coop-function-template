export const Container = {
  get: jest.fn().mockImplementation((diClass) => {
    return new diClass();
  }),
};

export const Token = jest.fn();

export const Service = jest.fn();
