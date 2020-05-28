/** Builds the response headers for API calls */
export const getResponseHeaders = (): any => {
  let responseHeaders = {
    'content-type': 'application/json',
    'cache-control': 'public,max-age=60',
  };
  return responseHeaders;
};
