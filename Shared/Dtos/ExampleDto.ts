export type ExampleDto = {
  Field1: string;
  Field2: number;
};

export const instanceOfExampleDto = (object: any): object is ExampleDto => {
  return (
    object !== null &&
    typeof object === 'object' &&
    'Field1' in object &&
    'Field2' in object
  );
};
