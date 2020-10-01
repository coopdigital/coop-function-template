import { ChildProcess, exec } from 'child_process';
import axios, { AxiosRequestConfig } from 'axios';
import find from 'find-process';

describe('Integration Tests', () => {
  let func: ChildProcess;

  beforeAll(async () => {
    func = exec('npx func start', (error, stdout, stderr) => {
      if (error) {
        console.log(error.stack);
        console.log('Error code: ' + error.code);
        console.log('Signal received: ' + error.signal);
      }
      console.log('Child Process STDOUT: ' + stdout);
      console.log('Child Process STDERR: ' + stderr);
    });

    return sleep(10000);
  });

  afterAll(async () => {
    const processesList = await find('name', 'func.exe');

    if (processesList.length > 0) {
      process.kill(processesList[0].pid);
    }
  });

  it('Example Test - Success', async () => {
    /*const config: AxiosRequestConfig = {
      method: 'GET',
      baseURL: 'http://localhost:7071',
      url: '/api/example/d8db7f54-7758-4a5a-bfd1-82e205c80a59',
    };

    let response = await axios.request(config);

    expect(response.status).toBe(500);*/
  });
});

function sleep(duration) {
  return new Promise(function (resolve, reject) {
    setTimeout(() => {
      resolve(0);
    }, duration);
  });
}
