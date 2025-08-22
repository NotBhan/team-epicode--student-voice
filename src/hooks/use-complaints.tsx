
'use client';

import { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';
import type { Problem, ProblemStatus } from '@/lib/types';
import {
  addComplaint as addComplaintAction,
  getAllComplaints,
  updateProblemPoints as updateProblemPointsAction,
  updateProblemStatus as updateProblemStatusAction,
} from '@/services/complaint-service';

interface ComplaintContextType {
  problems: Problem[];
  addComplaint: (problem: Omit<Problem, 'priorityPoints' | 'statusHistory' | 'createdAt'>) => Promise<void>;
  updateProblemPoints: (problemId: string, newPoints: number) => Promise<void>;
  updateProblemStatus: (problemId: string, newStatus: ProblemStatus) => Promise<void>;
  loading: boolean;
}

const ComplaintContext = createContext<ComplaintContextType | undefined>(undefined);

export const ComplaintProvider = ({ children }: { children: ReactNode }) => {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComplaints = async () => {
      setLoading(true);
      const initialProblems = await getAllComplaints();
       setProblems(initialProblems.map(p => ({
        ...p,
        status: p.status as ProblemStatus,
        verification: p.status === 'Pending Verification' ? { verifiers: 10, confirms: 0, reopens: 0 } : undefined
      })));
      setLoading(false);
    };
    fetchComplaints();
  }, []);

  const addComplaint = useCallback(async (problem: Omit<Problem, 'priorityPoints' | 'statusHistory' | 'createdAt'>) => {
    const newProblem: Problem = {
      ...problem,
      priorityPoints: 0,
      createdAt: new Date().toISOString(),
      statusHistory: [{ status: 'Unsolved', timestamp: new Date().toISOString() }],
    };
    const newProblems = await addComplaintAction(newProblem);
    setProblems(newProblems);
  }, []);

  const updateProblemPoints = useCallback(async (problemId: string, newPoints: number) => {
    const newProblems = await updateProblemPointsAction(problemId, newPoints);
    setProblems(newProblems);
  }, []);

  const updateProblemStatus = useCallback(async (problemId: string, newStatus: ProblemStatus) => {
    const newProblems = await updateProblemStatusAction(problemId, newStatus);
    setProblems(newProblems);
  }, []);

  const value = { problems, addComplaint, updateProblemPoints, updateProblemStatus, loading };

  return (
    <ComplaintContext.Provider value={value}>
      {children}
    </ComplaintContext.Provider>
  );
};

export const useComplaints = () => {
  const context = useContext(ComplaintContext);
  if (context === undefined) {
    throw new Error('useComplaints must be used within a ComplaintProvider');
  }
  return context;
};
