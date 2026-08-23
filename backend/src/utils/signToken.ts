import jwt, { type SignOptions } from 'jsonwebtoken';

export const signToken = (userId: string) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not set in environment variables');
  }

  const token = jwt.sign({ uuid: userId }, process.env.JWT_SECRET, {
    expiresIn: (process.env.JWT_EXPIRES_IN || '24h') as SignOptions['expiresIn'],
  });
  return token;
};
