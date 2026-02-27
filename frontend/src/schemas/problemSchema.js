import {z} from 'zod';
import { TAG_OPTIONS } from '../constants/tagOptions';

export const problemSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  tags: z.array(z.enum(TAG_OPTIONS)).min(1, 'At least one tag is required'),
  constraints: z.string().optional(),
  inputFormat: z.string().optional(),
  outputFormat: z.string().optional(),
  visibleTestCases: z.array(
    z.object({
      input: z.string().min(1, 'Input is required'),
      output: z.string().min(1, 'Output is required'),
      explanation: z.string().min(1, 'Explanation is required')
    })
  ).min(1, 'At least one visible test case required'),
  hiddenTestCases: z.array(
    z.object({
      input: z.string().min(1, 'Input is required'),
      output: z.string().min(1, 'Output is required')
    })
  ).min(1, 'At least one hidden test case required'),
  startCode: z.array(
    z.object({
      language: z.enum(['C++', 'Java', 'JavaScript', 'Python']),
      initialCode: z.string().min(1, 'Initial code is required')
    })
  ).length(4, 'All four languages required'),
  referenceSolution: z.array(
    z.object({
      language: z.enum(['C++', 'Java', 'JavaScript', 'Python']),
      completeCode: z.string().min(1, 'Complete code is required')
    })
  ).length(4, 'All four languages required')
});
