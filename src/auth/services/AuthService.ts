export default class AuthService {
  async registerUser({
    username,
    email,
    password,
    firstName,
    lastName,
  }: {
    username?: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }): Promise<void> {
    // console.log(email);
  }
}
