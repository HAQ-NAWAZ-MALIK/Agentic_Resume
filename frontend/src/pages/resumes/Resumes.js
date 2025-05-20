import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  PlusIcon, 
  PencilIcon, 
  DocumentDuplicateIcon, 
  TrashIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { getResumes, deleteResume } from '../../services/resumes';

const Resumes = () => {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [resumeToDelete, setResumeToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchResumes = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getResumes();
      setResumes(response.resumes);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load resumes');
      console.error('Error fetching resumes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  const handleDelete = async () => {
    if (!resumeToDelete) return;
    
    try {
      setDeleting(true);
      await deleteResume(resumeToDelete.id);
      setResumes(prevResumes => prevResumes.filter(resume => resume.id !== resumeToDelete.id));
      setShowDeleteModal(false);
      setResumeToDelete(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete resume');
    } finally {
      setDeleting(false);
    }
  };

  const openDeleteModal = (resume) => {
    setResumeToDelete(resume);
    setShowDeleteModal(true);
  };

  if (loading && resumes.length === 0) {
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
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Resumes</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your resumes and make them job-ready.
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link
            to="/dashboard/resumes/create"
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
          >
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
            New Resume
          </Link>
        </div>
      </div>

      {error && (
        <div className="mt-6 bg-red-50 p-4 rounded-md">
          <div className="text-sm text-red-700">{error}</div>
        </div>
      )}

      {/* Resume List */}
      {resumes.length === 0 ? (
        <div className="mt-6 bg-white p-6 rounded-md shadow-sm text-center">
          <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No resumes</h3>
          <p className="mt-1 text-sm text-gray-500">
            Create your first resume to get started with job applications.
          </p>
          <div className="mt-6">
            <Link
              to="/dashboard/resumes/create"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
            >
              <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
              New Resume
            </Link>
          </div>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {resumes.map((resume) => (
            <div key={resume.id} className="card shadow-sm">
              <div className="p-5">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-medium text-gray-900 truncate max-w-[70%]">
                    {resume.title}
                  </h3>
                  {resume.is_default && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <CheckCircleIcon className="-ml-0.5 mr-1.5 h-4 w-4" />
                      Default
                    </span>
                  )}
                </div>
                
                <p className="mt-2 text-sm text-gray-500">
                  Last updated: {format(new Date(resume.updated_at), 'MMM d, yyyy')}
                </p>
                
                <div className="mt-4 flex flex-wrap gap-2">
                  <Link
                    to={`/dashboard/resumes/${resume.id}`}
                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <DocumentTextIcon className="mr-2 h-4 w-4 text-gray-500" />
                    View
                  </Link>
                  <Link
                    to={`/dashboard/resumes/${resume.id}/edit`}
                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <PencilIcon className="mr-2 h-4 w-4 text-gray-500" />
                    Edit
                  </Link>
                  <button
                    onClick={() => openDeleteModal(resume)}
                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <TrashIcon className="mr-2 h-4 w-4 text-gray-500" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Refresh button */}
      {resumes.length > 0 && (
        <div className="mt-6 flex justify-end">
          <button
            onClick={fetchResumes}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <ArrowPathIcon className="-ml-1 mr-2 h-5 w-5 text-gray-500" />
            Refresh
          </button>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && resumeToDelete && (
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
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Delete Resume</h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to delete "{resumeToDelete.title}"? This action cannot be undone.
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
                  onClick={() => {
                    setShowDeleteModal(false);
                    setResumeToDelete(null);
                  }}
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

export default Resumes;