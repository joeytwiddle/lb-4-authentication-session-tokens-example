import {AuthenticationStrategy} from '@loopback/authentication';
import {UserProfile, securityId} from '@loopback/security';
//import {inject} from '@loopback/core';
//import {repository} from '@loopback/repository';
import {HttpErrors, Request} from '@loopback/rest';
//import {UserRepository} from '../repositories';

export interface Credentials {
  clientKey: string;
  clientSecret: string;
}

export class BasicAuthenticationStrategy implements AuthenticationStrategy {
  name = 'BasicStrategy';

  constructor() //@repository(UserRepository) public userRepository: UserRepository,
  {}

  async authenticate(request: Request): Promise<UserProfile | undefined> {
    const credentials: Credentials = this.extractCredentials(request);

    // TODO Replace this mock implementation
    if (
      credentials.clientKey === 'testuser' &&
      credentials.clientSecret === 'password123'
    ) {
      return {name: 'testuser', [securityId]: 'abc123'};
    } else {
      throw new HttpErrors.Unauthorized('The credentials are not correct.');
    }

    // You should implement your own checks here
    // 1. Find the user in your database
    // 2. Ensure credentials.clientSecret matches the user's password
    // 3. Return the user if authenticated
    //    Otherwise return an error (cancel the request),
    //    or return undefined (let your controllers handle the missing user)

    // Here is a more complete example you could start from
    /*
    const foundUser = await this.userRepository.findOne({
      where: {username: credentials.clientKey},
      // or alternatively
      where: {email: credentials.clientKey},
    });

    if (!foundUser) {
      throw new HttpErrors.NotFound(
        `User with clientKey ${credentials.clientKey} not found.`,
      );
    }

    // Using the password hasher from https://bit.ly/34q3IJp
    const passwordMatched = await this.passwordHasher.comparePassword(
      credentials.clientSecret,
      foundUser.password,
    );

    if (passwordMatched) {
      // We want to return the user to the controllers
      // But we must include a securityId
      foundUser[securityId] = foundUser.id;
      return foundUser;
    } else {
      throw new HttpErrors.Unauthorized('The credentials are not correct.');
    }
    */
  }

  extractCredentials(request: Request): Credentials {
    if (!request.headers.authorization) {
      throw new HttpErrors.Unauthorized(`Authorization header not found.`);
    }

    // For example: 'Basic ' + base64encoded('username:password')
    //          or: 'Basic ' + base64encoded('email@address.com:secret')
    const authHeaderValue = request.headers.authorization;

    const headerParts = authHeaderValue.split(' ');
    if (headerParts[0] !== 'Basic') {
      throw new HttpErrors.Unauthorized(
        `Authorization header is not of type 'Basic'.`,
      );
    }
    if (headerParts.length !== 2) {
      throw new HttpErrors.Unauthorized(
        `Authorization header should follow 'Basic' with a single base64 encoded string`,
      );
    }

    const encodedAuth = headerParts[1];
    const decodedAuth = new Buffer(encodedAuth, 'base64').toString('utf8');

    const authParts = decodedAuth.split(':');
    if (authParts.length !== 2) {
      throw new HttpErrors.Unauthorized(
        `Authorization header's decoded value should have exactly two parts, separated by a ':'`,
      );
    }

    return {clientKey: authParts[0], clientSecret: authParts[1]};
  }
}
