import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  DocumentTextIcon, 
  PencilIcon, 
  TrashIcon, 
  PlusIcon,
  ArrowPathIcon,
  FunnelIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { getJobs } from '../../services/jobs';

const statusColors = {
  saved: 'bg-blue-100 text-blue-800',
  applied: 'bg-yellow-100 text-yellow-800',
  interviewing: 'bg-purple-100 text-purple-800',
  offered: 'bg-green-100 text-green-800',
  accepted: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
  declined: 'bg-gray-100 text-gray-800',
};

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [companyFilter, setCompanyFilter] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const filters = {
        status: statusFilter,
        company: companyFilter,
        sort_by: 'updated_at',
        sort_dir: 'desc',
      };
      
      const response = await getJobs(filters);
      setJobs(response.job_applications);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load job applications');
      console.error('Error fetching jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter, companyFilter]);

  const clearFilters = () => {
    setStatusFilter('');
    setCompanyFilter('');
  };

  if (loading && jobs.length === 0) {
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
          <h1 className="text-2xl font-bold text-gray-900">Job Applications</h1>
          <p className="mt-1 text-sm text-gray-500">
            Track and manage your job applications
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link
            to="/dashboard/jobs/create"
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
          >
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
            Add Job
          </Link>
        </div>
      </div>

      {error && (
        <div className="mt-6 bg-red-50 p-4 rounded-md">
          <div className="text-sm text-red-700">{error}</div>
        </div>
      )}

      {/* Filter Section */}
      <div className="mt-6 mb-4">
        <button
          type="button"
          className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          onClick={() => setIsFilterOpen(!isFilterOpen)}
        >
          <FunnelIcon className="-ml-0.5 mr-2 h-4 w-4" />
          Filters
          {(statusFilter || companyFilter) && (
            <span className="ml-2 px-2 py-0.5 text-xs font-medium rounded-full bg-primary-100 text-primary-800">
              Active
            </span>
          )}
        </button>
        
        {isFilterOpen && (
          <div className="mt-3 bg-white p-4 rounded-md shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-900">Filter Applications</h3>
              {(statusFilter || companyFilter) && (
                <button
                  type="button"
                  className="text-sm text-primary-600 hover:text-primary-500"
                  onClick={clearFilters}
                >
                  Clear all
                </button>
              )}
            </div>
            
            <div className="grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-6">
              <div>
                <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <select
                  id="status-filter"
                  name="status-filter"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="">All Statuses</option>
                  <option value="saved">Saved</option>
                  <option value="applied">Applied</option>
                  <option value="interviewing">Interviewing</option>
                  <option value="offered">Offered</option>
                  <option value="accepted">Accepted</option>
                  <option value="rejected">Rejected</option>
                  <option value="declined">Declined</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="company-filter" className="block text-sm font-medium text-gray-700">
                  Company
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    type="text"
                    name="company-filter"
                    id="company-filter"
                    className="block w-full pr-10 border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                    placeholder="Filter by company"
                    value={companyFilter}
                    onChange={(e) => setCompanyFilter(e.target.value)}
                  />
                  {companyFilter && (
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setCompanyFilter('')}
                    >
                      <XMarkIcon className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Job Applications List */}
      {jobs.length === 0 ? (
        <div className="mt-6 bg-white p-6 rounded-md shadow-sm text-center">
          <p className="text-gray-500">
            {statusFilter || companyFilter
              ? 'No job applications match your filters.'
              : 'You have not added any job applications yet.'}
          </p>
          {statusFilter || companyFilter ? (
            <button
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200"
              onClick={clearFilters}
            >
              Clear filters
            </button>
          ) : (
            <Link
              to="/dashboard/jobs/create"
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
            >
              <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
              Add Job Application
            </Link>
          )}
        </div>
      ) : (
        <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {jobs.map((job) => (
              <li key={job.id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                          <span className="text-primary-600 font-medium">
                            {job.company_name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <h3 className="text-sm font-medium text-gray-900">
                          <Link to={`/dashboard/jobs/${job.id}`} className="hover:underline">
                            {job.job_title}
                          </Link>
                        </h3>
                        <p className="text-sm text-gray-500">{job.company_name}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          statusColors[job.status] || 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                      </span>
                      {job.has_tailored_resume && (
                        <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Tailored
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex sm:space-x-4">
                      {job.applied_date && (
                        <div className="mt-2 flex items-center text-xs text-gray-500 sm:mt-0">
                          <span>Applied: {new Date(job.applied_date).toLocaleDateString()}</span>
                        </div>
                      )}
                      {job.job_posting_url && (
                        <div className="mt-2 flex items-center text-xs sm:mt-0">
                          <a
                            href={job.job_posting_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary-600 hover:text-primary-500"
                          >
                            View Job Posting
                          </a>
                        </div>
                      )}
                    </div>
                    <div className="mt-2 flex items-center space-x-2 text-sm text-gray-500 sm:mt-0">
                      <Link
                        to={`/dashboard/jobs/${job.id}/tailor`}
                        className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200"
                      >
                        <DocumentTextIcon className="mr-1.5 h-4 w-4" />
                        {job.has_tailored_resume ? 'View Tailored' : 'Tailor Resume'}
                      </Link>
                      <Link
                        to={`/dashboard/jobs/${job.id}/edit`}
                        className="inline-flex items-center px-2 py-1 text-gray-500 hover:text-gray-700"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          
          <div className="px-4 py-3 bg-gray-50 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="text-sm text-gray-500">
              Showing {jobs.length} job application{jobs.length !== 1 ? 's' : ''}
            </div>
            <button
              type="button"
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              onClick={fetchJobs}
            >
              <ArrowPathIcon className="-ml-0.5 mr-2 h-4 w-4" />
              Refresh
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Jobs;