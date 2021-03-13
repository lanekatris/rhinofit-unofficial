import request from 'request';

export function formatCookies(cookies: string[]): string {
  return cookies.join('; ');
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface Credentials {
  cookies: string[]
}

export class AuthenticationService {
  public readonly LOGIN_URL = 'https://my.rhinofit.ca/';

  public async login(input: LoginRequest): Promise<Credentials> {
    const {email,password} = input;

  const formData = {
    email,
    password,
    rememberme: "on"
  }

    return new Promise((resolve, reject) => {
      request.post(
        { url: this.LOGIN_URL, formData },
        (err, httpResponse) => {
          console.log('login response', httpResponse.body);
          if (err) {
            return reject(err);
          }
          const cookies = httpResponse.headers['set-cookie'];
          if (!cookies) {
            return reject('Login failed');
          }
          return resolve({cookies});
        }
      );
    });
  }
}
