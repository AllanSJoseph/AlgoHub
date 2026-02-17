import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {problemSchema} from '../schemas/problemSchema';
import axiosClient from '../utils/axiosClient';
import { useParams } from 'react-router';
import { useNavigate } from 'react-router';
import { toast } from 'react-hot-toast';
import { useState, useEffect } from 'react';

function UpdateProblem() {
    const [loading, setLoading] = useState(false);
    let { problemId } = useParams();
    const languages = ['C++', 'Java', 'JavaScript', 'Python'];


    const normalizeProblem = (problem) => ({
      ...problem,
      startCode: languages.map((lang, i) => ({
        language: lang,
        initialCode: problem.startCode?.[i]?.initialCode || ""
      })),
      referenceSolution: languages.map((lang, i) => ({
        language: lang,
        completeCode: problem.referenceSolution?.[i]?.completeCode || ""
      }))
    });


    const navigate = useNavigate();
    const {
        register,
        control,
        handleSubmit,
        reset,
        getValues,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(problemSchema),
        defaultValues: {
        visibleTestCases: [{ input: '', output: '', explanation: '' }],
        hiddenTestCases: [{ input: '', output: '' }],
        startCode: [
            { language: 'C++', initialCode: '' },
            { language: 'Java', initialCode: '' },
            { language: 'JavaScript', initialCode: '' },
            { language: 'Python', initialCode: '' }
        ],
        referenceSolution: [
            { language: 'C++', completeCode: '' },
            { language: 'Java', completeCode: '' },
            { language: 'JavaScript', completeCode: '' },
            { language: 'Python', completeCode: '' }
        ]
        }
    });

    const {
        fields: visibleFields,
        append: appendVisible,
        remove: removeVisible
    } = useFieldArray({
        control,
        name: 'visibleTestCases'
    });

    const {
        fields: hiddenFields,
        append: appendHidden,
        remove: removeHidden
    } = useFieldArray({
        control,
        name: 'hiddenTestCases'
    });

    const onSubmit = async (data) => {
        console.log('Form data submitted:', data);
        try {
        await axiosClient.put(`/problem/update/${problemId}`, data);
        toast.success('Problem updated successfully');
        navigate('/');
        } catch (error) {
        toast.error(error.response?.data?.message || error.message || 'Failed to update problem');
        }
    };

    useEffect(() => {
        const fetchProblemData = async () => {
          if (!problemId){
            console.error("Problem Not Found!");
          }
            try {
              setLoading(true);
              const response = await axiosClient.get(`/problem/problemById/${problemId}`);
              console.log(response.data);
              reset(normalizeProblem(response.data));
            } catch (err) {
              toast.error("Failed to fetch problem!");
            } finally {
              setLoading(false);
            }
        }

        fetchProblemData();
    }, [problemId, reset])

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Update Problem</h1>
      
      <form onSubmit={handleSubmit(
    (data) => {
      console.log("VALID DATA:", data);
      onSubmit(data);
    },
    (errors) => {
      console.log("VALIDATION ERRORS:", errors);
      console.log(getValues());
    }
  )} className="space-y-6">
        {/* Basic Information */}
        <div className="card bg-base-100 shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
          <div className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Title</span>
              </label>
              <input
                {...register('title')}
                className={`input input-bordered ${errors.title && 'input-error'}`}
              />
              {errors.title && (
                <span className="text-error">{errors.title.message}</span>
              )}
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Description</span>
              </label>
              <textarea
                {...register('description')}
                className={`textarea textarea-bordered h-32 ${errors.description && 'textarea-error'}`}
              />
              {errors.description && (
                <span className="text-error">{errors.description.message}</span>
              )}
            </div>

            <div className="flex gap-4">
              <div className="form-control w-1/2">
                <label className="label">
                  <span className="label-text">Difficulty</span>
                </label>
                <select
                  {...register('difficulty')}
                  className={`select select-bordered ${errors.difficulty && 'select-error'}`}
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>

              <div className="form-control w-1/2">
                <label className="label">
                  <span className="label-text">Tag</span>
                </label>
                <select
                  {...register('tags')}
                  className={`select select-bordered ${errors.tags && 'select-error'}`}
                >
                  <option value="array">Array</option>
                  <option value="linkedList">Linked List</option>
                  <option value="graph">Graph</option>
                  <option value="dp">DP</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Test Cases */}
        <div className="card bg-base-100 shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Test Cases</h2>
          
          {/* Visible Test Cases */}
          <div className="space-y-4 mb-6">
            <div className="flex justify-between items-center">
              <h3 className="font-medium">Visible Test Cases</h3>
              <button
                type="button"
                onClick={() => appendVisible({ input: '', output: '', explanation: '' })}
                className="btn btn-sm btn-primary"
              >
                Add Visible Case
              </button>
            </div>
            
            {visibleFields.map((field, index) => (
              <div key={field.id} className="border p-4 rounded-lg space-y-2">
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => removeVisible(index)}
                    className="btn btn-xs btn-error"
                  >
                    Remove
                  </button>
                </div>
                
                <input
                  {...register(`visibleTestCases.${index}.input`)}
                  placeholder="Input"
                  className="input input-bordered w-full"
                />
                
                <input
                  {...register(`visibleTestCases.${index}.output`)}
                  placeholder="Output"
                  className="input input-bordered w-full"
                />
                
                <textarea
                  {...register(`visibleTestCases.${index}.explanation`)}
                  placeholder="Explanation"
                  className="textarea textarea-bordered w-full"
                />
              </div>
            ))}
            {errors.visibleTestCases && (
              <span className="text-error">{errors.visibleTestCases.message}</span>
            )}
          </div>

          {/* Hidden Test Cases */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-medium">Hidden Test Cases</h3>
              <button
                type="button"
                onClick={() => appendHidden({ input: '', output: '' })}
                className="btn btn-sm btn-primary"
              >
                Add Hidden Case
              </button>
            </div>
            
            {hiddenFields.map((field, index) => (
              <div key={field.id} className="border p-4 rounded-lg space-y-2">
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => removeHidden(index)}
                    className="btn btn-xs btn-error"
                  >
                    Remove
                  </button>
                </div>
                
                <input
                  {...register(`hiddenTestCases.${index}.input`)}
                  placeholder="Input"
                  className="input input-bordered w-full"
                />
                
                <input
                  {...register(`hiddenTestCases.${index}.output`)}
                  placeholder="Output"
                  className="input input-bordered w-full"
                />
              </div>
            ))}
            {errors.hiddenTestCases && (
              <span className="text-error">{errors.hiddenTestCases.message}</span>
            )}
          </div>
        </div>

        {/* Code Templates */}
        <div className="card bg-base-100 shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Code Templates</h2>
          
          <div className="space-y-6">
            {[0, 1, 2, 3].map((index) => (
              <div key={index} className="space-y-2">
                <h3 className="font-medium">
                  {index === 0 ? 'C++' : index === 1 ? 'Java' : index === 2 ? 'JavaScript' : "Python"}
                </h3>

                <input
                  type="hidden"
                  {...register(`startCode.${index}.language`)}
                  defaultValue={index === 0 ? 'C++' : index === 1 ? 'Java' : index === 2 ? 'JavaScript' : "Python"}
                />
                <input
                  type="hidden"
                  {...register(`referenceSolution.${index}.language`)}
                  defaultValue={index === 0 ? 'C++' : index === 1 ? 'Java' : index === 2 ? 'JavaScript' : "Python"}
                />
                
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Initial Code</span>
                  </label>
                  <pre className="bg-base-300 p-4 rounded-lg">
                    <textarea
                      {...register(`startCode.${index}.initialCode`)}
                      className="w-full bg-transparent font-mono"
                      rows={6}
                    />
                  </pre>
                </div>
                
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Reference Solution</span>
                  </label>
                  <pre className="bg-base-300 p-4 rounded-lg">
                    <textarea
                      {...register(`referenceSolution.${index}.completeCode`)}
                      className="w-full bg-transparent font-mono"
                      rows={6}
                    />
                  </pre>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button type="submit" className="btn btn-primary w-full" >
          Update Problem
        </button>
      </form>
    </div>
  );
}

export default UpdateProblem;
