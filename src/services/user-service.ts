
'use server';

import type { UserProfile } from '@/lib/types';
import fs from 'fs-extra';
import path from 'path';

const usersFilePath = path.join(process.cwd(), 'src', 'lib', 'data', 'users.json');

async function readUsers(): Promise<UserProfile[]> {
    try {
        const usersData = await fs.readFile(usersFilePath, 'utf-8');
        return JSON.parse(usersData);
    } catch (error) {
        console.error('Error reading users file:', error);
        return [];
    }
}

async function writeUsers(users: UserProfile[]): Promise<void> {
    try {
        await fs.writeFile(usersFilePath, JSON.stringify(users, null, 2));
    } catch (error) {
        console.error('Error writing users file:', error);
    }
}

export async function updateUserPriorityPoints(userId: string, newPoints: number): Promise<UserProfile[]> {
    const users = await readUsers();
    const newUsers = users.map(u => {
        if (u.uid === userId) {
            return { ...u, priorityPoints: newPoints };
        }
        return u;
    });
    await writeUsers(newUsers);
    return newUsers;
}

export async function getAllUsers(): Promise<UserProfile[]> {
    return await readUsers();
}
