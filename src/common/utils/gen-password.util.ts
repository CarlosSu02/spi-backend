export function generatePassword(length: number = 16): string {
  const char =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_-+=';

  let password = '';

  for (let i = 0; i < length; i++) {
    const ind = Math.floor(Math.random() * char.length);
    password += char[ind];
  }

  return password;
}
