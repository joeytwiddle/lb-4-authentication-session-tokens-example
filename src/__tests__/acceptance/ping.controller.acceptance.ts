import {Client, expect} from '@loopback/testlab';
import {ExampleApplication} from '../..';
import {setupApplication} from './test-helper';

describe('PingController', () => {
  let app: ExampleApplication;
  let client: Client;

  before('setupApplication', async () => {
    ({app, client} = await setupApplication());
  });

  after(async () => {
    await app.stop();
  });

  it('invokes GET /ping', async () => {
    const res = await client.get('/ping?msg=world').expect(200);
    expect(res.body).to.containEql({greeting: 'Hello from LoopBack'});
  });

  it('can log in with POST /users/login', async () => {
    const plainAuth = 'testuser:password123';
    const encodedAuth = Buffer.from(plainAuth).toString('base64');
    const res = await client
      .post('/users/login')
      .set('Authorization', 'Basic ' + encodedAuth)
      .expect(200);
    expect(res.body).to.containEql({token: 'example_token_999'});
  });
});
