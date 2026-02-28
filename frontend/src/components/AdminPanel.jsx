import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axiosClient from '../utils/axiosClient';
import axios from 'axios';
import { useNavigate } from 'react-router';
import { toast } from 'react-hot-toast';
import AdminProblemAssistant from './AdminProblemAssistant';
import { useEffect, useState } from 'react';
import { TAG_OPTIONS } from '../constants/tagOptions';
import LoadingLottie from './LoadingLottie';

// Zod schema matching the problem schema
const problemSchema = z.object({
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
  ).length(4, 'All three languages required'),
  referenceSolution: z.array(
    z.object({
      language: z.enum(['C++', 'Java', 'JavaScript', 'Python']),
      completeCode: z.string().min(1, 'Complete code is required')
    })
  ).length(4, 'All three languages required')
});

function AdminPanel() {
  const navigate = useNavigate();
  const languages = ['C++', 'Java', 'JavaScript', 'Python'];
  const [videoSource, setVideoSource] = useState('none');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [localVideoFile, setLocalVideoFile] = useState(null);
  const [videoSaving, setVideoSaving] = useState(false);
  const [tagFilter, setTagFilter] = useState('');
  const draftKey = 'admin_problem_draft_create';

  const defaultValues = {
    tags: [],
    constraints: '',
    inputFormat: '',
    outputFormat: '',
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
  };
  const {
    register,
    control,
    handleSubmit,
    setValue,
    getValues,
    watch,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(problemSchema),
    defaultValues
  });

  const {
    fields: visibleFields,
    append: appendVisible,
    remove: removeVisible,
    replace: replaceVisible
  } = useFieldArray({
    control,
    name: 'visibleTestCases'
  });

  const {
    fields: hiddenFields,
    append: appendHidden,
    remove: removeHidden,
    replace: replaceHidden
  } = useFieldArray({
    control,
    name: 'hiddenTestCases'
  });

  const selectedTags = watch('tags') || [];
  const allTagsSelected = TAG_OPTIONS.every((tag) => selectedTags.includes(tag));
  const filteredTags = TAG_OPTIONS.filter((tag) =>
    tag.toLowerCase().includes(tagFilter.trim().toLowerCase())
  );

  useEffect(() => {
    const saved = localStorage.getItem(draftKey);
    if (!saved) return;
    try {
      const parsed = JSON.parse(saved);
      if (parsed?.value) {
        reset({ ...defaultValues, ...parsed.value });
        toast.success('Draft restored');
      }
    } catch {
      // ignore malformed drafts
    }
  }, [reset]);

  useEffect(() => {
    const subscription = watch((value) => {
      localStorage.setItem(draftKey, JSON.stringify({ value, savedAt: Date.now() }));
    });
    return () => subscription.unsubscribe();
  }, [watch, draftKey]);

  const clearDraft = () => {
    localStorage.removeItem(draftKey);
    reset(defaultValues);
    toast.success('Draft cleared');
  };

  const onSubmit = async (data) => {
    console.log('Form data submitted:', data);
    try {
      const response = await axiosClient.post('/problem/create', data);
      const problemId = response.data?.problemId;

      if (problemId) {
        await handleVideoSave(problemId);
      }
      localStorage.removeItem(draftKey);
      toast.success('Problem created successfully');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Failed to create problem');
    }
  };

  const handleVideoSave = async (problemId) => {
    try {
      if (videoSource === 'youtube') {
        if (!youtubeUrl.trim()) {
          return;
        }
        setVideoSaving(true);
        await axiosClient.post('/video/youtube', {
          problemId,
          youtubeUrl: youtubeUrl.trim()
        });
        toast.success('YouTube video saved');
      }

      if (videoSource === 'local') {
        if (!localVideoFile) {
          return;
        }
        setVideoSaving(true);
        const formData = new FormData();
        formData.append('videoFile', localVideoFile);
        const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
        await axios.post(`${baseUrl}/video/local/${problemId}`, formData, {
          withCredentials: true
        });
        toast.success('Local video saved');
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || 'Failed to save video');
    } finally {
      setVideoSaving(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Create New Problem</h1>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            className="btn btn-sm btn-outline"
            onClick={clearDraft}
          >
            Clear Draft
          </button>
        </div>
        <div className="grid lg:grid-cols-[1fr_360px] gap-6 items-start">
          <div className="space-y-6">
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
                className={`input input-bordered  w-full ${errors.title && 'input-error'}`}
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
                className={`textarea textarea-bordered h-32 w-full ${errors.description && 'textarea-error'}`}
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
                  <span className="label-text">Tags</span>
                </label>
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="text"
                    value={tagFilter}
                    onChange={(e) => setTagFilter(e.target.value)}
                    placeholder="Search tags"
                    className="input input-bordered input-sm flex-1"
                  />
                  <button
                    type="button"
                    className="btn btn-xs btn-outline"
                    onClick={() =>
                      setValue('tags', allTagsSelected ? [] : TAG_OPTIONS, {
                        shouldValidate: true,
                        shouldDirty: true
                      })
                    }
                  >
                    {allTagsSelected ? 'Clear' : 'Select All'}
                  </button>
                </div>
                <div className={`grid grid-cols-2 gap-2 border rounded-lg p-3 ${errors.tags ? 'border-error' : 'border-base-300'}`}>
                  {filteredTags.map((tag) => (
                    <label key={tag} className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        value={tag}
                        {...register('tags')}
                        className="checkbox checkbox-primary checkbox-sm"
                      />
                      <span className="capitalize">{tag.replace(/-/g, ' ').replace('linkedList', 'linked list')}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            {errors.tags && (
              <span className="text-error">{errors.tags.message}</span>
            )}

            <div className="form-control">
              <label className="label">
                <span className="label-text">Constraints (optional)</span>
              </label>
              <textarea
                {...register('constraints')}
                className="textarea textarea-bordered h-24"
                placeholder="e.g., 1 <= n <= 1e5"
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Input Format (optional)</span>
              </label>
              <textarea
                {...register('inputFormat')}
                className="textarea textarea-bordered h-24"
                placeholder="Describe the input format"
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Output Format (optional)</span>
              </label>
              <textarea
                {...register('outputFormat')}
                className="textarea textarea-bordered h-24"
                placeholder="Describe the output format"
              />
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
                
                <textarea
                  {...register(`visibleTestCases.${index}.input`)}
                  placeholder="Input"
                  className="textarea textarea-bordered w-full"
                  rows={3}
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
                
                <textarea
                  {...register(`hiddenTestCases.${index}.input`)}
                  placeholder="Input"
                  className="textarea textarea-bordered w-full"
                  rows={3}
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
            {languages.map((lang, index) => (
              <div key={index} className="space-y-2">
                <h3 className="font-medium">
                  {lang}
                </h3>

                <input
                  type="hidden"
                  {...register(`startCode.${index}.language`)}
                  defaultValue={lang}
                />
                <input
                  type="hidden"
                  {...register(`referenceSolution.${index}.language`)}
                  defaultValue={lang}
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

        {/* Video Solution */}
        <div className="card bg-base-100 shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Video Solution</h2>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-3">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="videoSource"
                  value="none"
                  checked={videoSource === 'none'}
                  onChange={() => setVideoSource('none')}
                  className="radio radio-primary"
                />
                <span>No video</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="videoSource"
                  value="youtube"
                  checked={videoSource === 'youtube'}
                  onChange={() => setVideoSource('youtube')}
                  className="radio radio-primary"
                />
                <span>YouTube link</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="videoSource"
                  value="local"
                  checked={videoSource === 'local'}
                  onChange={() => setVideoSource('local')}
                  className="radio radio-primary"
                />
                <span>Local upload</span>
              </label>
            </div>

            {videoSource === 'youtube' && (
              <div className="form-control">
                <label className="label">
                  <span className="label-text">YouTube URL</span>
                </label>
                <input
                  type="url"
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  className="input input-bordered"
                  placeholder="https://www.youtube.com/watch?v=..."
                />
              </div>
            )}

            {videoSource === 'local' && (
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Upload local video</span>
                </label>
                <input
                  type="file"
                  accept="video/*"
                  className="file-input file-input-bordered"
                  onChange={(e) => setLocalVideoFile(e.target.files?.[0] || null)}
                  disabled={videoSaving}
                />
                <span className="text-xs text-base-content/60 mt-1">
                  Max 500MB. Stored locally on the server.
                </span>
              </div>
            )}
          </div>
        </div>

        <button
          type="submit"
          className={`btn btn-primary w-full ${(isSubmitting || videoSaving) ? 'loading' : ''}`}
          disabled={isSubmitting || videoSaving}
        >
          {isSubmitting || videoSaving ? 'Saving...' : 'Create Problem'}
        </button>
          </div>

          <div className="lg:sticky lg:top-6">
            <AdminProblemAssistant
              getValues={getValues}
              setValue={setValue}
              replaceVisible={replaceVisible}
              replaceHidden={replaceHidden}
            />
            {(isSubmitting || videoSaving) && (
              <LoadingLottie label="Saving problem..." size={140} />
            )}
          </div>
        </div>
      </form>
    </div>
  );
}

export default AdminPanel;

