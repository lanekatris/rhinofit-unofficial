import request from 'request';

export interface Credentials {
  email: string;
  password: string;
  rememberme: string; // TODO: Make this a type since I have no idea this string
}

export function formatCookies(cookies: string[]): string {
  return cookies.join('; ');
}

export interface LoginRequest {
  email: string;
  password: string;
}

export class AuthenticationService {
  public readonly LOGIN_URL = 'https://my.rhinofit.ca/';

  public async login(input: LoginRequest): Promise<string[]> {
    let credentials: Credentials;
    credentials = input as Credentials;

    return new Promise((resolve, reject) => {
      request.post(
        { url: this.LOGIN_URL, formData: credentials },
        (err, httpResponse) => {
          console.log('login response', httpResponse.body);
          if (err) {
            return reject(err);
          }
          const cookies = httpResponse.headers['set-cookie'];
          if (!cookies) {
            return reject('Login failed');
          }
          return resolve(cookies);
        }
      );
    });
  }
}
