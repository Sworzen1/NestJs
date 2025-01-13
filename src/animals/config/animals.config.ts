import { registerAs } from '@nestjs/config';

export default registerAs('animals', () => ({ foo: 'bar' }));
