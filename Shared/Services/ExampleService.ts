import { Service } from 'typedi';
import ExampleRepository from '../Dal/ExampleRepository';
import { ExampleDto } from '../Dtos/ExampleDto';
import { ExampleModel } from '../Models/ExampleModel';

/** Example Service, abstract business logic from the Function */
@Service()
export default class ExampleService {
  /** Initialises the Service */
  constructor(private exampleRepository: ExampleRepository) {}

  /** Gets a example record by id */
  public async get(id: string): Promise<ExampleDto> {
    let response: ExampleDto = null;

    const exampleData = await this.exampleRepository.getExampleById(id);

    if (exampleData) {
      response = {
        Field1: exampleData.Field1,
        Field2: exampleData.Field2,
      };
    }

    return response;
  }

  /** Updates an example */
  public async update(id: string, example: ExampleDto): Promise<void> {
    const exampleModel: ExampleModel = { id, ...example };

    await this.exampleRepository.updateExampleModel(exampleModel);
  }
}
