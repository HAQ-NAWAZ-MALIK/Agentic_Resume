import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import MarkdownEditor from '../../components/ui/MarkdownEditor';
import { getResume, updateResume } from '../../services/resumes';

const EditResume = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [initialLoadDone, setInitialLoadDone] = useState(false);

  const formik = useFormik({
    initialValues: {
      title: '',
      content: '',
      is_default: false,
    },
    validationSchema: Yup.object({
      title: Yup.string().required('Title is required'),
      content: Yup.string().required('Resume content is required'),
    }),
    onSubmit: async (values) => {
      try {
        setIsLoading(true);
        setError(null);
        
        await updateResume(id, values);
        navigate('/dashboard/resumes');
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to update resume. Please try again.');
      } finally {
        setIsLoading(false);
      }
    },
    enableReinitialize: true,
  });

  useEffect(() => {
    const fetchResume = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await getResume(id);
        
        formik.setValues({
          title: response.resume.title || '',
          content: response.resume.content || '',
          is_default: response.resume.is_default || false,
        });
        
        setInitialLoadDone(true);
      } catch (err) {
        setError(err.response?.data?.message || `Failed to load resume with ID ${id}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResume();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (!initialLoadDone && isLoading) {
    return (
      <div className="py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Edit Resume</h1>
        <p className="mt-1 text-sm text-gray-500">
          Update your resume in Markdown format.
        </p>
      </div>
      
      {error && (
        <div className="mb-4 bg-red-50 p-4 rounded-md">
          <div className="text-sm text-red-700">{error}</div>
        </div>
      )}
      
      <form onSubmit={formik.handleSubmit} className="space-y-6">
        <div className="card shadow-sm">
          <div className="card-body">
            <div className="mb-6">
              <label htmlFor="title" className="form-label">
                Resume Title
              </label>
              <input
                id="title"
                name="title"
                type="text"
                className={`form-input ${
                  formik.touched.title && formik.errors.title ? 'border-red-500' : ''
                }`}
                {...formik.getFieldProps('title')}
              />
              {formik.touched.title && formik.errors.title ? (
                <div className="form-error">{formik.errors.title}</div>
              ) : null}
            </div>
            
            <div>
              <MarkdownEditor
                value={formik.values.content}
                onChange={(value) => formik.setFieldValue('content', value)}
                height="600px"
              />
              {formik.touched.content && formik.errors.content ? (
                <div className="form-error mt-2">{formik.errors.content}</div>
              ) : null}
            </div>
            
            <div className="mt-6">
              <div className="flex items-center">
                <input
                  id="is_default"
                  name="is_default"
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  checked={formik.values.is_default}
                  onChange={formik.handleChange}
                />
                <label htmlFor="is_default" className="ml-2 block text-sm text-gray-900">
                  Set as default resume
                </label>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                The default resume will be selected automatically when applying for jobs.
              </p>
            </div>
          </div>
          
          <div className="card-footer">
            <div className="flex items-center justify-end space-x-3">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate('/dashboard/resumes')}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isLoading || !formik.isValid}
              >
                {isLoading ? (
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditResume;