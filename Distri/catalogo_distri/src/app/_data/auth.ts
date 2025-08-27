import dotenv from 'dotenv';
import * as jose from 'jose';
import { cookies } from 'next/headers'
import { cache } from 'react'

interface JsonWebToken {
  userName: string
  [key: string]: string | number | boolean | null | undefined
}

dotenv.config();

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET)
const JWT_EXPIRATION = '7d' // 7 days
const REFRESH_THRESHOLD = 24 * 60 * 60 // 24 hours in seconds

const generateToken = async (payload: JsonWebToken): Promise<string> => {
  return await new jose.SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(JWT_EXPIRATION)
    .sign(JWT_SECRET);
};

const verifyToken =  async (token: string): Promise<JsonWebToken | null> => {
  try {
    const { payload } = await jose.jwtVerify(token, JWT_SECRET);
    return payload as JsonWebToken;
  }
  catch (error) {
    console.error('JWT verification failed:\n\n', error);
    return null;
  };
};

export const createSession = async (userName: string): Promise<boolean> => {
  try {
    const token = await generateToken({ userName });

    // Store JWT in a cookie
    const cookieStore = await cookies();
    cookieStore.set({
      name: 'auth_token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
      sameSite: 'lax',
    });

    cookieStore.set({
      name: 'userName',
      value: userName,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
      sameSite: 'lax',
    });

    return true;
  }
  catch (error) {
    console.error('Error creating session:\n\n', error);
    return false;
  };
};

/** Checks if a user token is still valid */ 
export const getSession = cache(async (): Promise<JsonWebToken | null> => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) return null;
    const validToken =  await verifyToken(token);

    return validToken ? { userName: validToken.userName } : null;

  } 
  catch (error) {
    console.error('Error getting session:', error);
    return null;
  };
});
