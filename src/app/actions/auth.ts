'use server';

import { prisma } from '@/lib/db';
import { hashPassword, verifyPassword, createSession, deleteSession } from '@/lib/auth';

export async function loginUser(prevState: any, formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { error: 'Please enter all fields.' };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return { error: 'Invalid email or password.' };
    }

    const passwordMatch = await verifyPassword(password, user.password);
    if (!passwordMatch) {
      return { error: 'Invalid email or password.' };
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        lastActive: new Date(),
        streakCount: user.streakCount === 0 ? 1 : user.streakCount,
      },
    });

    await createSession(user.id, user.role);
    return { success: true, role: user.role };
  } catch (error: any) {
    return { error: error.message || 'Something went wrong.' };
  }
}

export async function registerUser(prevState: any, formData: FormData) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const role = formData.get('role') as string || 'CITIZEN';

  if (!name || !email || !password) {
    return { error: 'Please enter all fields.' };
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { error: 'Email already registered.' };
    }

    const hashed = await hashPassword(password);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashed,
        role,
        streakCount: 1,
        lastActive: new Date(),
      },
    });

    await createSession(user.id, user.role);
    return { success: true, role: user.role };
  } catch (error: any) {
    return { error: error.message || 'Something went wrong.' };
  }
}

export async function logoutUser() {
  await deleteSession();
}
export async function getStreakCountServer(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { streakCount: true }
    });
    return user?.streakCount ?? 0;
  } catch {
    return 0;
  }
}
