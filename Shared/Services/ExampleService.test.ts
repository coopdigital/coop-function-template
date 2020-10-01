import ExampleService from "./ExampleService";
import MockDatabaseRespository from  '../Dal/__mocks__/ExampleRepository';
import { ExampleRepository } from "../Dal/ExampleRepository";

describe('ExampleService Tests',()=>{
    beforeEach(()=>{
        MockDatabaseRespository.getExampleById.mockClear();
        MockDatabaseRespository.updateExampleModel.mockClear();
    })
    it('get - Success', async ()=>{
        const exampleService = new ExampleService(MockDatabaseRespository as unknown as ExampleRepository);
        
        const result = await exampleService.get('TEST ID');

        expect(result).toMatchSnapshot();
    })

    it('get - Not found', async ()=>{
        MockDatabaseRespository.getExampleById.mockImplementation(()=>{ 
            return null;
        })
        const exampleService = new ExampleService(MockDatabaseRespository as unknown as ExampleRepository);
        
        const result = await exampleService.get('TEST ID');

        expect(result).toMatchSnapshot();
    })

    it('update - Success', async () => {
        const testData = {
            Field1:'Test Data',
            Field2:1234
        }    

        const exampleService = new ExampleService(MockDatabaseRespository as unknown as ExampleRepository);

        await exampleService.update('Test ID', testData);

        expect(MockDatabaseRespository.updateExampleModel.mock.calls.length).toBe(1);
        expect(MockDatabaseRespository.updateExampleModel.mock.calls[0][0]).toMatchSnapshot();
    })
})