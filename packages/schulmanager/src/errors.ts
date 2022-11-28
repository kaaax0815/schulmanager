/* eslint-disable @typescript-eslint/no-explicit-any */

export class InvalidStatusCode extends Error {
  constructor(received: number) {
    super(`An error occurred on the server\nReceived: ${received}\nExpected: 200`);
    this.name = 'InvalidStatusCode';
  }
}

export class MissingNewToken extends Error {
  constructor(received: unknown) {
    super(`The Server didn't send a new token!\nReceived: ${received}\nExpected: not undefined`);
    this.name = 'MissingNewToken';
  }
}

export class InvalidResponse extends Error {
  constructor(received: any) {
    super(`The Server send an invalid response!\nReceived: ${received}\nExpected: not null`);
    this.name = 'InvalidResponse';
  }
}

export class NotAuthenticated extends Error {
  constructor(received: any) {
    super(`You are not authenticated!\nReceived: ${received}\nExpected: true`);
    this.name = 'NotAuthenticated';
  }
}
