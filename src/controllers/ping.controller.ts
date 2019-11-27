import {Request, RestBindings, get, ResponseObject, post} from '@loopback/rest';
import {inject} from '@loopback/context';
import {authenticate, AuthenticationBindings} from '@loopback/authentication';
import {UserProfile} from '@loopback/security';

/**
 * OpenAPI response for ping()
 */
const PING_RESPONSE: ResponseObject = {
  description: 'Ping Response',
  content: {
    'application/json': {
      schema: {
        type: 'object',
        properties: {
          greeting: {type: 'string'},
          date: {type: 'string'},
          url: {type: 'string'},
          headers: {
            type: 'object',
            properties: {
              'Content-Type': {type: 'string'},
            },
            additionalProperties: true,
          },
        },
      },
    },
  },
};

/**
 * A simple controller to bounce back http requests
 */
export class PingController {
  constructor(
    @inject(RestBindings.Http.REQUEST) private req: Request,
    @inject(AuthenticationBindings.CURRENT_USER, {optional: true})
    private user: UserProfile,
  ) {}

  // Map to `GET /ping`
  @get('/ping', {
    responses: {
      '200': PING_RESPONSE,
    },
  })
  ping(): object {
    // Reply with a greeting, the current time, the url, and request headers
    return {
      greeting: 'Hello from LoopBack',
      date: new Date(),
      url: this.req.url,
      headers: Object.assign({}, this.req.headers),
    };
  }

  @authenticate('BasicStrategy')
  @post('/users/login')
  async login(): Promise<{token: string}> {
    // We expect the Basic strategy will have authenticated a user
    if (this.user) {
      // Generate a unique bearer token or this user and store it in the DB
      const token = 'example_token_999';
      return {token};
    } else {
      throw new Error('User was not authenticated');
    }
  }
}
