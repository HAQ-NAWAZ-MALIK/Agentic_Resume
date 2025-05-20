import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { createJob } from '../../services/jobs';
import { getResumes } from '../../services/resumes';
import { useEffect } from 'react';

const CreateJob = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [resumes, setResumes] = useState([]);

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const response = await getResumes();
        setResumes(response.resumes);
        
        // Preselect default resume if available
        const defaultResume = response.resumes.find(r => r.is_default);
        if (defaultResume) {
          formik.setFieldValue('resume_id', defaultResume.id);
        }
      } catch (err) {
        console.error('Error fetching resumes:', err);
      }
    };
    
    fetchResumes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formik = useFormik({
    initialValues: {
      company_name: '',
      job_title: '',
      job_description: '',
      job_posting_url: '',
      status: 'saved',
      notes: '',
      resume_id: '',
    },
    validationSchema: Yup.object({
      company_name: Yup.string().required('Company name is required'),
      job_title: Yup.string().required('Job title is required'),
      job_posting_url: Yup.string().url('Invalid URL format').nullable(),
      status: Yup.string().required('Status is required'),
    }),
    onSubmit: async (values) => {
      try {
        setIsLoading(true);
        setError(null);
        
        const jobData = {
          ...values,
          resume_id: values.resume_id || null,
        };
        
        await createJob(jobData);
        navigate('/dashboard/jobs');
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to create job application. Please try again.');
      } finally {
        setIsLoading(false);
      }
    },
  });

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Add Job Application</h1>
        <p className="mt-1 text-sm text-gray-500">
          Track a new job opportunity you're interested in.
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
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label htmlFor="job_title" className="form-label">
                  Job Title
                </label>
                <input
                  id="job_title"
                  name="job_title"
                  type="text"
                  className={`form-input ${
                    formik.touched.job_title && formik.errors.job_title ? 'border-red-500' : ''
                  }`}
                  placeholder="e.g., Software Engineer"
                  {...formik.getFieldProps('job_title')}
                />
                {formik.touched.job_title && formik.errors.job_title ? (
                  <div className="form-error">{formik.errors.job_title}</div>
                ) : null}
              </div>
              
              <div className="sm:col-span-2">
                <label htmlFor="company_name" className="form-label">
                  Company Name
                </label>
                <input
                  id="company_name"
                  name="company_name"
                  type="text"
                  className={`form-input ${
                    formik.touched.company_name && formik.errors.company_name ? 'border-red-500' : ''
                  }`}
                  placeholder="e.g., Google"
                  {...formik.getFieldProps('company_name')}
                />
                {formik.touched.company_name && formik.errors.company_name ? (
                  <div className="form-error">{formik.errors.company_name}</div>
                ) : null}
              </div>
              
              <div className="sm:col-span-2">
                <label htmlFor="job_posting_url" className="form-label">
                  Job Posting URL
                </label>
                <input
                  id="job_posting_url"
                  name="job_posting_url"
                  type="text"
                  className={`form-input ${
                    formik.touched.job_posting_url && formik.errors.job_posting_url ? 'border-red-500' : ''
                  }`}
                  placeholder="e.g., https://company.com/careers/job123"
                  {...formik.getFieldProps('job_posting_url')}
                />
                {formik.touched.job_posting_url && formik.errors.job_posting_url ? (
                  <div className="form-error">{formik.errors.job_posting_url}</div>
                ) : null}
                <p className="mt-1 text-xs text-gray-500">
                  A direct link to the job posting will help our AI tailor your resume better.
                </p>
              </div>
              
              <div>
                <label htmlFor="status" className="form-label">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  className={`form-input ${
                    formik.touched.status && formik.errors.status ? 'border-red-500' : ''
                  }`}
                  {...formik.getFieldProps('status')}
                >
                  <option value="saved">Saved</option>
                  <option value="applied">Applied</option>
                  <option value="interviewing">Interviewing</option>
                  <option value="offered">Offered</option>
                  <option value="accepted">Accepted</option>
                  <option value="rejected">Rejected</option>
                  <option value="declined">Declined</option>
                </select>
                {formik.touched.status && formik.errors.status ? (
                  <div className="form-error">{formik.errors.status}</div>
                ) : null}
              </div>
              
              <div>
                <label htmlFor="resume_id" className="form-label">
                  Associated Resume
                </label>
                <select
                  id="resume_id"
                  name="resume_id"
                  className="form-input"
                  {...formik.getFieldProps('resume_id')}
                >
                  <option value="">Select a resume (optional)</option>
                  {resumes.map((resume) => (
                    <option key={resume.id} value={resume.id}>
                      {resume.title} {resume.is_default ? '(Default)' : ''}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-xs text-gray-500">
                  You can select a resume to associate with this job application.
                </p>
              </div>
              
              <div className="sm:col-span-2">
                <label htmlFor="job_description" className="form-label">
                  Job Description
                </label>
                <textarea
                  id="job_description"
                  name="job_description"
                  rows={6}
                  className="form-input"
                  placeholder="Paste the job description here..."
                  {...formik.getFieldProps('job_description')}
                />
                <p className="mt-1 text-xs text-gray-500">
                  Copy and paste the job description to help our AI tailor your resume better.
                </p>
              </div>
              
              <div className="sm:col-span-2">
                <label htmlFor="notes" className="form-label">
                  Notes
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  rows={4}
                  className="form-input"
                  placeholder="Add any notes about this job opportunity..."
                  {...formik.getFieldProps('notes')}
                />
              </div>
            </div>
          </div>
          
          <div className="card-footer">
            <div className="flex items-center justify-end space-x-3">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate('/dashboard/jobs')}
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
                ) : 'Add Job Application'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateJob;