import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { getJob, tailorResume, getTailoredResume } from '../../services/jobs';
import { getResumes } from '../../services/resumes';
import { useAuth } from '../../context/AuthContext';

const TailorResume = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  const [job, setJob] = useState(null);
  const [resumes, setResumes] = useState([]);
  const [tailoredResume, setTailoredResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tailoringInProgress, setTailoringInProgress] = useState(false);
  const [error, setError] = useState(null);
  const [tabIndex, setTabIndex] = useState(0);

  const formik = useFormik({
    initialValues: {
      resume_id: '',
      personal_writeup: '',
      github_url: currentUser?.github_url || '',
    },
    validationSchema: Yup.object({
      resume_id: Yup.number().required('Please select a resume'),
      github_url: Yup.string().url('Invalid URL format').nullable(),
    }),
    onSubmit: async (values) => {
      try {
        setTailoringInProgress(true);
        setError(null);
        
        const response = await tailorResume(id, values);
        setTailoredResume(response.tailored_resume);
        setTabIndex(1); // Switch to the tailored resume tab
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to tailor resume. Please try again.');
      } finally {
        setTailoringInProgress(false);
      }
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch job data
        const jobResponse = await getJob(id);
        setJob(jobResponse.job_application);
        
        // Check if there's already a tailored resume
        if (jobResponse.tailored_resume) {
          setTailoredResume(jobResponse.tailored_resume);
          setTabIndex(1); // Show tailored resume tab
        } else {
          // If no tailored resume yet, try to get existing resumes
          const resumesResponse = await getResumes();
          setResumes(resumesResponse.resumes);
          
          // Preselect the job's resume or default resume if available
          if (jobResponse.job_application.resume_id) {
            formik.setFieldValue('resume_id', jobResponse.job_application.resume_id);
          } else {
            const defaultResume = resumesResponse.resumes.find(r => r.is_default);
            if (defaultResume) {
              formik.setFieldValue('resume_id', defaultResume.id);
            } else if (resumesResponse.resumes.length > 0) {
              formik.setFieldValue('resume_id', resumesResponse.resumes[0].id);
            }
          }
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading) {
    return (
      <div className="py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="py-6 px-4 sm:px-6 lg:px-8">
        <div className="bg-red-50 p-4 rounded-md">
          <div className="text-sm text-red-700">Job not found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Tailor Resume</h1>
        <p className="mt-1 text-sm text-gray-500">
          Generate a tailored resume for {job.job_title} at {job.company_name} using AI.
        </p>
      </div>
      
      {/* Job details section */}
      <div className="card shadow-sm mb-6">
        <div className="card-header">
          <h2 className="text-lg font-medium text-gray-900">Job Details</h2>
        </div>
        <div className="card-body">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-gray-500">Company</dt>
              <dd className="mt-1 text-sm text-gray-900">{job.company_name}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Position</dt>
              <dd className="mt-1 text-sm text-gray-900">{job.job_title}</dd>
            </div>
            {job.job_posting_url && (
              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-gray-500">Job Posting URL</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  <a
                    href={job.job_posting_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:text-primary-500"
                  >
                    {job.job_posting_url}
                  </a>
                </dd>
              </div>
            )}
          </dl>
        </div>
      </div>
      
      {error && (
        <div className="mb-6 bg-red-50 p-4 rounded-md">
          <div className="text-sm text-red-700">{error}</div>
        </div>
      )}
      
      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setTabIndex(0)}
              className={`${
                tabIndex === 0
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm`}
            >
              Tailoring Form
            </button>
            <button
              onClick={() => setTabIndex(1)}
              disabled={!tailoredResume}
              className={`${
                tabIndex === 1
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm ${
                !tailoredResume ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              Tailored Resume
            </button>
            <button
              onClick={() => setTabIndex(2)}
              disabled={!tailoredResume}
              className={`${
                tabIndex === 2
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm ${
                !tailoredResume ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              Interview Preparation
            </button>
          </nav>
        </div>
      </div>
      
      {/* Tab content */}
      <div>
        {/* Tailoring Form */}
        {tabIndex === 0 && (
          <div className="card shadow-sm">
            <form onSubmit={formik.handleSubmit}>
              <div className="card-body">
                <div className="space-y-6">
                  <div>
                    <label htmlFor="resume_id" className="form-label">
                      Select Resume to Tailor
                    </label>
                    <select
                      id="resume_id"
                      name="resume_id"
                      className={`form-input ${
                        formik.touched.resume_id && formik.errors.resume_id ? 'border-red-500' : ''
                      }`}
                      {...formik.getFieldProps('resume_id')}
                    >
                      <option value="">Select a resume</option>
                      {resumes.map((resume) => (
                        <option key={resume.id} value={resume.id}>
                          {resume.title} {resume.is_default ? '(Default)' : ''}
                        </option>
                      ))}
                    </select>
                    {formik.touched.resume_id && formik.errors.resume_id ? (
                      <div className="form-error">{formik.errors.resume_id}</div>
                    ) : null}
                    {resumes.length === 0 && (
                      <div className="mt-2 text-sm text-yellow-600">
                        You haven't created any resumes yet.{' '}
                        <a
                          href="/dashboard/resumes/create"
                          className="text-primary-600 hover:text-primary-500"
                        >
                          Create a resume
                        </a>{' '}
                        first.
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="github_url" className="form-label">
                      GitHub Profile URL (Optional)
                    </label>
                    <input
                      id="github_url"
                      name="github_url"
                      type="text"
                      className={`form-input ${
                        formik.touched.github_url && formik.errors.github_url ? 'border-red-500' : ''
                      }`}
                      placeholder="https://github.com/yourusername"
                      {...formik.getFieldProps('github_url')}
                    />
                    {formik.touched.github_url && formik.errors.github_url ? (
                      <div className="form-error">{formik.errors.github_url}</div>
                    ) : null}
                    <p className="mt-1 text-xs text-gray-500">
                      Providing your GitHub profile helps the AI better tailor your resume.
                    </p>
                  </div>
                  
                  <div>
                    <label htmlFor="personal_writeup" className="form-label">
                      Additional Information (Optional)
                    </label>
                    <textarea
                      id="personal_writeup"
                      name="personal_writeup"
                      rows={4}
                      className="form-input"
                      placeholder="Add any additional information about yourself, skills, or experience that might be relevant for this position..."
                      {...formik.getFieldProps('personal_writeup')}
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Include any additional context that might help tailor your resume better.
                    </p>
                  </div>
                  
                  <div className="bg-yellow-50 p-4 rounded-md">
                    <h3 className="text-sm font-medium text-yellow-800">Important Note</h3>
                    <div className="mt-2 text-sm text-yellow-700">
                      <p>
                        The AI-powered tailoring process may take up to a minute to complete. 
                        Your resume will be analyzed against the job description to highlight the most relevant skills and experiences.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="card-footer">
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => navigate(`/dashboard/jobs/${id}`)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={tailoringInProgress || !formik.isValid || resumes.length === 0}
                  >
                    {tailoringInProgress ? (
                      <div className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Tailoring Resume...
                      </div>
                    ) : (
                      tailoredResume ? 'Re-Tailor Resume' : 'Tailor Resume'
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}
        
        {/* Tailored Resume Tab */}
        {tabIndex === 1 && tailoredResume && (
          <div className="card shadow-sm">
            <div className="card-header flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900">Tailored Resume</h2>
              <div className="flex space-x-2">
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    // Create a Blob with the resume content
                    const blob = new Blob([tailoredResume.content], { type: 'text/markdown' });
                    const url = URL.createObjectURL(blob);
                    
                    // Create an anchor and trigger a download
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `${job.company_name} - ${job.job_title} - Tailored Resume.md`;
                    document.body.appendChild(a);
                    a.click();
                    
                    // Clean up
                    URL.revokeObjectURL(url);
                    document.body.removeChild(a);
                  }}
                >
                  Download as Markdown
                </button>
              </div>
            </div>
            <div className="card-body">
              <div className="bg-white p-6 rounded-md markdown">
                <div dangerouslySetInnerHTML={{ __html: marked.parse(tailoredResume.content) }} />
              </div>
            </div>
          </div>
        )}
        
        {/* Interview Preparation Tab */}
        {tabIndex === 2 && tailoredResume && (
          <div className="card shadow-sm">
            <div className="card-header flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900">Interview Preparation</h2>
              <div className="flex space-x-2">
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    // Create a Blob with the interview materials content
                    const blob = new Blob([tailoredResume.interview_materials], { type: 'text/markdown' });
                    const url = URL.createObjectURL(blob);
                    
                    // Create an anchor and trigger a download
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `${job.company_name} - ${job.job_title} - Interview Preparation.md`;
                    document.body.appendChild(a);
                    a.click();
                    
                    // Clean up
                    URL.revokeObjectURL(url);
                    document.body.removeChild(a);
                  }}
                >
                  Download as Markdown
                </button>
              </div>
            </div>
            <div className="card-body">
              <div className="bg-white p-6 rounded-md markdown">
                <div dangerouslySetInnerHTML={{ __html: marked.parse(tailoredResume.interview_materials) }} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TailorResume;