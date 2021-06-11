import { Container, CosmosClient } from '@azure/cosmos';
import { Service } from 'typedi';
import AppInsights from '@coop/azure/lib/AppInsights';
import { ExampleModel } from '../Models/ExampleModel';

/** Example Cosmos DB Repository */
@Service()
export default class ExampleRepository {
  /** The cosmosClient, this connection should be maintained across instances */
  private cosmosClient: CosmosClient;
  /** The **Database** container */
  private container: Container;

  /** Initialises the *Cosmos DB* and gets the **database** and **container** */
  constructor() {
    this.cosmosClient = new CosmosClient({
      endpoint: process.env.cosmos_endpoint,
      key: process.env.cosmos_key,
    });

    this.container = this.cosmosClient
      .database(process.env.cosmos_database)
      .container(process.env.cosmos_container);
  }

  /** Gets an exampleModel by Id */
  async getExampleById(id: string): Promise<ExampleModel> {
    let exampleModel: any = null;

    // Get product by ID, second field is the partition key, in this
    // example Id but generally wouldn't be ID.
    const { resource: data } = await this.container.item(id, id).read();

    if (data) {
      exampleModel = data as ExampleModel;
    }

    return exampleModel;
  }

  /** Finds records by **Field 1** */
  async find(field1: string): Promise<Array<ExampleModel>> {
    // Use the Parameters to protect against SQL Injection attacks
    const querySpec = {
      query: 'SELECT * FROM p WHERE p.Field1 = @field1',
      parameters: [{ name: '@field1', value: field1 }],
    };

    const { resources: data } = await this.container.items
      .query(querySpec)
      .fetchAll();

    return data.map((record) => {
      return record as ExampleModel;
    });
  }

  /** Updates the exampleModel record in the DB */
  async updateExampleModel(exampleModel: ExampleModel): Promise<void> {
    await this.container.items.upsert(exampleModel);
  }
}
