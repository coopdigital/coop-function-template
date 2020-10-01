export const mockQuery = jest.fn(() => {
  return {
    fetchAll: jest.fn(() => {
      return {
        resources: [],
      };
    }),
  };
});

export const mockRead = jest.fn(() => {
  return {
    resource: [],
  };
});

export const mockUpsert = jest.fn();

export const CosmosClient = jest.fn(() => {
  return {
    database: jest.fn(() => {
      return {
        container: jest.fn(() => {
          return {
            item: jest.fn(() => {
              return { read: mockRead };
            }),
            items: {
              query: mockQuery,
              upsert: mockUpsert,
            },
          };
        }),
      };
    }),
  };
});
