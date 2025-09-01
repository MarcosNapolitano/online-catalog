'use server'
import { type IUser } from '@/app/_data/types';
import { type Response } from '@/app/_data/types'
import { User } from '@/app/_data/data';
import { compare } from 'bcrypt'
import databaseConnects from './db_connect';
import { createSession } from './auth';

const getUser = databaseConnects(async (userName: string): Promise<IUser | null> => {
  
  try{ return await User.findOne({ name: userName }, {}) }

  catch (err){
    console.error("Couldn't find user");
    return null;
  };
});

export async function login(formData: FormData): Promise<Response> {
  try {
    const name = formData.get('user') as string;
    const password = formData.get('pass') as string;
    const user = await getUser(name);

    if (!user) {
      return { success: false, message: 'Usuario o contraseña no válida', error: "Check ServerLog" };

    }

    if (!await compare(password, user.password)) {
      return { success: false, message: 'Usuario o contraseña no válida', error: "Check ServerLog" };
    }

    // Create session
    await createSession(name);

    return { success: true, message: 'Signed in successfully', error: "" };

  } catch (error) {
    console.error('Login error:\n\n', error)
    return { success: false, message: 'Error al logearse.', error: (error as string).toString() };
  };
}
