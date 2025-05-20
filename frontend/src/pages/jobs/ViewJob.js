import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  PencilIcon, 
  TrashIcon, 
  DocumentTextIcon,
  CalendarIcon,
  ClockIcon,
  LinkIcon,
  BuildingOfficeIcon,
  BriefcaseIcon
} from '@heroicons/react/24/outline';
import { getJob, deleteJob } from '../../services/jobs';
import { format } from 'date-fns';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const statusColors = {
  saved: 'bg-blue-100 text-blue-800',
  applied: 'bg-yellow-100 text-yellow-800',
  interviewing: 'bg-purple-100 text-purple-800',
  offered: 'bg-green-100 text-green-800',
  accepted: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
  declined: 'bg-gray-100 text-gray-800',
};

const ViewJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [job, setJob] = useState(null);
  const [tailoredResume, setTailoredResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await getJob(id);
        setJob(response.job_application);
        
        if (response.tailored_resume) {
          setTailoredResume(response.tailored_resume);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load job application');
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await deleteJob(id);
      navigate('/dashboard/jobs');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete job application');
      setShowDeleteModal(false);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-6 px-4 sm:px-6 lg:px-8">
        <div className="bg-red-50 p-4 rounded-md">
          <div className="text-sm text-red-700">{error}</div>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="py-6 px-4 sm:px-6 lg:px-8">
        <div className="bg-yellow-50 p-4 rounded-md">
          <div className="text-sm text-yellow-700">Job application not found.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{job.job_title}</h1>
          <p className="mt-1 text-sm text-gray-500">
            at {job.company_name}
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-2">
          <Link
            to={`/dashboard/jobs/${id}/edit`}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <PencilIcon className="-ml-1 mr-2 h-5 w-5 text-gray-500" />
            Edit
          </Link>
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-red-300 shadow-sm text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50"
            onClick={() => setShowDeleteModal(true)}
          >
            <TrashIcon className="-ml-1 mr-2 h-5 w-5 text-red-500" />
            Delete
          </button>
        </div>
      </div>

      {/* Status Card */}
      <div className="mb-6 bg-white rounded-lg shadow-sm p-4 border border-gray-200">
        <div className="flex items-center">
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              statusColors[job.status] || 'bg-gray-100 text-gray-800'
            }`}
          >
            {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
          </span>
          
          {job.applied_date && (
            <div className="ml-4 flex items-center text-sm text-gray-500">
              <CalendarIcon className="mr-1.5 h-5 w-5 text-gray-400" />
              Applied on {new Date(job.applied_date).toLocaleDateString()}
            </div>
          )}
          
          <div className="ml-auto">
            <Link
              to={`/dashboard/jobs/${id}/tailor`}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
            >
              <DocumentTextIcon className="-ml-1 mr-2 h-5 w-5" />
              {tailoredResume ? 'View Tailored Resume' : 'Tailor Resume'}
            </Link>
          </div>
        </div>
      </div>

      {/* Job Details */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="card shadow-sm">
          <div className="card-header">
            <h2 className="text-lg font-medium text-gray-900">Job Details</h2>
          </div>
          <div className="card-body">
            <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <BriefcaseIcon className="mr-1.5 h-5 w-5 text-gray-400" />
                  Job Title
                </dt>
                <dd className="mt-1 text-sm text-gray-900">{job.job_title}</dd>
              </div>
              
              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <BuildingOfficeIcon className="mr-1.5 h-5 w-5 text-gray-400" />
                  Company
                </dt>
                <dd className="mt-1 text-sm text-gray-900">{job.company_name}</dd>
              </div>
              
              {job.job_posting_url && (
                <div className="sm:col-span-2">
                  <dt className="text-sm font-medium text-gray-500 flex items-center">
                    <LinkIcon className="mr-1.5 h-5 w-5 text-gray-400" />
                    Job Posting URL
                  </dt>
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
              
              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <ClockIcon className="mr-1.5 h-5 w-5 text-gray-400" />
                  Created / Updated
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  Created: {new Date(job.created_at).toLocaleDateString()}
                  <br />
                  Updated: {new Date(job.updated_at).toLocaleDateString()}
                </dd>
              </div>
              
              {job.notes && (
                <div className="sm:col-span-2">
                  <dt className="text-sm font-medium text-gray-500">Notes</dt>
                  <dd className="mt-1 text-sm text-gray-900 prose prose-sm max-w-none">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{job.notes}</ReactMarkdown>
                  </dd>
                </div>
              )}
            </dl>
          </div>
        </div>

        {/* Job Description */}
        <div className="card shadow-sm">
          <div className="card-header">
            <h2 className="text-lg font-medium text-gray-900">Job Description</h2>
          </div>
          <div className="card-body">
            {job.job_description ? (
              <div className="prose prose-sm max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{job.job_description}</ReactMarkdown>
              </div>
            ) : (
              <p className="text-sm text-gray-500 italic">No job description added.</p>
            )}
          </div>
        </div>
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <TrashIcon className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Delete Job Application</h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to delete this job application? This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleDelete}
                  disabled={deleting}
                >
                  {deleting ? 'Deleting...' : 'Delete'}
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowDeleteModal(false)}
                  disabled={deleting}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewJob;