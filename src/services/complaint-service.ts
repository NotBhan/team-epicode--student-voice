
'use server';

import type { Problem, ProblemStatus } from '@/lib/types';
import fs from 'fs-extra';
import path from 'path';

const problemsFilePath = path.join(process.cwd(), 'src', 'lib', 'data', 'problems.json');

async function readProblems(): Promise<Problem[]> {
    try {
        const problemsData = await fs.readFile(problemsFilePath, 'utf-8');
        return JSON.parse(problemsData);
    } catch (error) {
        console.error('Error reading problems file:', error);
        return [];
    }
}

async function writeProblems(problems: Problem[]): Promise<void> {
    try {
        await fs.writeFile(problemsFilePath, JSON.stringify(problems, null, 2));
    } catch (error) {
        console.error('Error writing problems file:', error);
    }
}

export async function getAllComplaints(): Promise<Problem[]> {
    return await readProblems();
}

export async function getComplaintById(id: string): Promise<Problem | undefined> {
  const problems = await readProblems();
  return problems.find(p => p.id.toLowerCase() === id.toLowerCase());
}

export async function addComplaint(problem: Problem): Promise<Problem[]> {
    const problems = await readProblems();
    const newProblems = [{
      ...problem, 
      priorityPoints: 0,
      statusHistory: [{ status: 'Unsolved', timestamp: new Date().toISOString() }]
    }, ...problems];
    await writeProblems(newProblems);
    return newProblems;
}

export async function updateProblemPoints(problemId: string, newPoints: number): Promise<Problem[]> {
    const problems = await readProblems();
    const newProblems = problems.map(p => 
        p.id === problemId ? { ...p, priorityPoints: newPoints } : p
    );
    await writeProblems(newProblems);
    return newProblems;
}

export async function updateProblemStatus(problemId: string, newStatus: ProblemStatus): Promise<Problem[]> {
    const problems = await readProblems();
    const newProblems = problems.map(p => {
        if (p.id === problemId) {
            const newHistoryEntry = { status: newStatus, timestamp: new Date().toISOString() };
            return { 
                ...p, 
                status: newStatus,
                statusHistory: [...(p.statusHistory || []), newHistoryEntry]
            };
        }
        return p;
    });
    await writeProblems(newProblems);
    return newProblems;
}