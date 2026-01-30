import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axiosClient from '../utils/axiosClient';
import { NavLink } from 'react-router';

const problemSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  tags: z.enum(['array', 'linkedList', 'graph', 'dp']),
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
      language: z.string(),
      initialCode: z.string().min(1, 'Initial code is required')
    })
  ),
  referenceSolution: z.array(
    z.object({
      language: z.string(),
      completeCode: z.string().min(1, 'Complete code is required')
    })
  )
});

function AdminUpdate() {
  const [problems, setProblems] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(problemSchema),
    defaultValues: {
      title: '',
      description: '',
      difficulty: 'easy',
      tags: 'array',
      visibleTestCases: [{ input: '', output: '', explanation: '' }],
      hiddenTestCases: [{ input: '', output: '' }],
      startCode: [
        { language: 'C++', initialCode: '' },
        { language: 'Java', initialCode: '' },
        { language: 'JavaScript', initialCode: '' }
      ],
      referenceSolution: [
        { language: 'C++', completeCode: '' },
        { language: 'Java', completeCode: '' },
        { language: 'JavaScript', completeCode: '' }
      ]
    }
  });

  const {
    fields: visibleFields,
    append: appendVisible,
    remove: removeVisible
  } = useFieldArray({ control, name: 'visibleTestCases' });

  const {
    fields: hiddenFields,
    append: appendHidden,
    remove: removeHidden
  } = useFieldArray({ control, name: 'hiddenTestCases' });

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const { data } = await axiosClient.get('/problem/getAllProblem');
        setProblems(data);
      } catch (err) {
        setError('Failed to fetch problems');
      }
    };
    fetchProblems();
  }, []);

  useEffect(() => {
    if (!selectedId) return;
    const fetchFull = async () => {
      setLoading(true);
      try {
        const { data } = await axiosClient.get(`/problem/getFullForAdmin/${selectedId}`);
        reset({
          title: data.title,
          description: data.description,
          difficulty: data.difficulty,
          tags: data.tags,
          visibleTestCases: data.visibleTestCases?.length
            ? data.visibleTestCases
            : [{ input: '', output: '', explanation: '' }],
          hiddenTestCases: data.hiddenTestCases?.length
            ? data.hiddenTestCases
            : [{ input: '', output: '' }],
          startCode: data.startCode?.length
            ? data.startCode
            : [
                { language: 'C++', initialCode: '' },
                { language: 'Java', initialCode: '' },
                { language: 'JavaScript', initialCode: '' }
              ],
          referenceSolution: data.referenceSolution?.length
            ? data.referenceSolution
            : [
                { language: 'C++', completeCode: '' },
                { language: 'Java', completeCode: '' },
                { language: 'JavaScript', completeCode: '' }
              ]
        });
        setError(null);
      } catch (err) {
        setError('Failed to load problem');
      } finally {
        setLoading(false);
      }
    };
    fetchFull();
  }, [selectedId, reset]);

  const onSubmit = async (data) => {
    if (!selectedId) return;
    try {
      await axiosClient.put(`/problem/update/${selectedId}`, data);
      alert('Problem updated successfully!');
    } catch (err) {
      setError(err.response?.data || err.message || 'Update failed');
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Update Problem (2.1.9.2)</h1>
        <NavLink to="/admin" className="btn btn-ghost">Back to Admin</NavLink>
      </div>

      <div className="form-control mb-6">
        <label className="label">
          <span className="label-text">Select problem to update</span>
        </label>
        <select
          className="select select-bordered w-full max-w-md"
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
        >
          <option value="">-- Choose problem --</option>
          {problems.map((p) => (
            <option key={p._id} value={p._id}>
              {p.title} ({p.difficulty})
            </option>
          ))}
        </select>
      </div>

      {error && (
        <div className="alert alert-error mb-4">
          <span>{error}</span>
        </div>
      )}

      {loading && (
        <div className="flex justify-center py-8">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      )}

      {selectedId && !loading && (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="card bg-base-100 shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
            <div className="space-y-4">
              <div className="form-control">
                <label className="label"><span className="label-text">Title</span></label>
                <input {...register('title')} className={`input input-bordered ${errors.title && 'input-error'}`} />
                {errors.title && <span className="text-error">{errors.title.message}</span>}
              </div>
              <div className="form-control">
                <label className="label"><span className="label-text">Description</span></label>
                <textarea {...register('description')} className={`textarea textarea-bordered h-32 ${errors.description && 'textarea-error'}`} />
                {errors.description && <span className="text-error">{errors.description.message}</span>}
              </div>
              <div className="flex gap-4">
                <div className="form-control w-1/2">
                  <label className="label"><span className="label-text">Difficulty</span></label>
                  <select {...register('difficulty')} className="select select-bordered">
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
                <div className="form-control w-1/2">
                  <label className="label"><span className="label-text">Tag</span></label>
                  <select {...register('tags')} className="select select-bordered">
                    <option value="array">Array</option>
                    <option value="linkedList">Linked List</option>
                    <option value="graph">Graph</option>
                    <option value="dp">DP</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Visible Test Cases</h2>
            <div className="space-y-4">
              <button type="button" onClick={() => appendVisible({ input: '', output: '', explanation: '' })} className="btn btn-sm btn-primary">Add</button>
              {visibleFields.map((field, index) => (
                <div key={field.id} className="border p-4 rounded-lg space-y-2">
                  <div className="flex justify-end">
                    <button type="button" onClick={() => removeVisible(index)} className="btn btn-xs btn-error">Remove</button>
                  </div>
                  <input {...register(`visibleTestCases.${index}.input`)} placeholder="Input" className="input input-bordered w-full" />
                  <input {...register(`visibleTestCases.${index}.output`)} placeholder="Output" className="input input-bordered w-full" />
                  <textarea {...register(`visibleTestCases.${index}.explanation`)} placeholder="Explanation" className="textarea textarea-bordered w-full" />
                </div>
              ))}
            </div>
          </div>

          <div className="card bg-base-100 shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Hidden Test Cases</h2>
            <div className="space-y-4">
              <button type="button" onClick={() => appendHidden({ input: '', output: '' })} className="btn btn-sm btn-primary">Add</button>
              {hiddenFields.map((field, index) => (
                <div key={field.id} className="border p-4 rounded-lg space-y-2">
                  <div className="flex justify-end">
                    <button type="button" onClick={() => removeHidden(index)} className="btn btn-xs btn-error">Remove</button>
                  </div>
                  <input {...register(`hiddenTestCases.${index}.input`)} placeholder="Input" className="input input-bordered w-full" />
                  <input {...register(`hiddenTestCases.${index}.output`)} placeholder="Output" className="input input-bordered w-full" />
                </div>
              ))}
            </div>
          </div>

          <div className="card bg-base-100 shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Code Templates & Reference Solutions</h2>
            <div className="space-y-6">
              {[0, 1, 2].map((index) => (
                <div key={index} className="space-y-2">
                  <h3 className="font-medium">{index === 0 ? 'C++' : index === 1 ? 'Java' : 'JavaScript'}</h3>
                  <div className="form-control">
                    <label className="label"><span className="label-text">Initial Code</span></label>
                    <textarea {...register(`startCode.${index}.initialCode`)} className="textarea textarea-bordered font-mono w-full" rows={4} />
                  </div>
                  <div className="form-control">
                    <label className="label"><span className="label-text">Reference Solution</span></label>
                    <textarea {...register(`referenceSolution.${index}.completeCode`)} className="textarea textarea-bordered font-mono w-full" rows={6} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button type="submit" className="btn btn-primary w-full">Update Problem</button>
        </form>
      )}
    </div>
  );
}

export default AdminUpdate;
