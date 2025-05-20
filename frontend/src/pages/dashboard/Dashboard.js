import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PlusIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { getJobStats } from '../../services/jobs';
import { getResumes } from '../../services/resumes';

const Dashboard = () => {
  const [stats, setStats] = useState({
    status_counts: {},
    total_count: 0,
    recent_count: 0,
  });
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch job stats
        const jobStatsResponse = await getJobStats();
        setStats(jobStatsResponse);
        
        // Fetch recent resumes (limited to 5)
        const resumesResponse = await getResumes();
        setResumes(resumesResponse.resumes.slice(0, 5));
        
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load dashboard data');
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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

  // Prepare status data for display
  const statusData = [
    { name: 'Saved', count: stats.status_counts.saved || 0, color: 'bg-blue-100 text-blue-800' },
    { name: 'Applied', count: stats.status_counts.applied || 0, color: 'bg-yellow-100 text-yellow-800' },
    { name: 'Interviewing', count: stats.status_counts.interviewing || 0, color: 'bg-purple-100 text-purple-800' },
    { name: 'Offered', count: stats.status_counts.offered || 0, color: 'bg-green-100 text-green-800' },
    { name: 'Accepted', count: stats.status_counts.accepted || 0, color: 'bg-green-100 text-green-800' },
    { name: 'Rejected', count: stats.status_counts.rejected || 0, color: 'bg-red-100 text-red-800' },
    { name: 'Declined', count: stats.status_counts.declined || 0, color: 'bg-gray-100 text-gray-800' },
  ];

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Welcome to AgenticResume. Manage your resumes and job applications.
        </p>
      </div>

      {/* Quick Action Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-8">
        <div className="card shadow-sm">
          <div className="p-5">
            <h3 className="text-lg font-medium text-gray-900">Create Resume</h3>
            <p className="mt-1 text-sm text-gray-500">
              Add a new resume to your profile
            </p>
            <div className="mt-4">
              <Link
                to="/dashboard/resumes/create"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
              >
                <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
                New Resume
              </Link>
            </div>
          </div>
        </div>

        <div className="card shadow-sm">
          <div className="p-5">
            <h3 className="text-lg font-medium text-gray-900">Add Job Application</h3>
            <p className="mt-1 text-sm text-gray-500">
              Track a new job opportunity
            </p>
            <div className="mt-4">
              <Link
                to="/dashboard/jobs/create"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
              >
                <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
                New Job
              </Link>
            </div>
          </div>
        </div>

        <div className="card shadow-sm">
          <div className="p-5">
            <h3 className="text-lg font-medium text-gray-900">Tailor Resume</h3>
            <p className="mt-1 text-sm text-gray-500">
              Use AI to customize your resume
            </p>
            <div className="mt-4">
              <Link
                to="/dashboard/jobs"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
              >
                <ArrowRightIcon className="-ml-1 mr-2 h-5 w-5" />
                Go to Jobs
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Job Application Stats */}
      <div className="mb-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Job Applications</h2>
        
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          <div className="card shadow-sm p-4">
            <div className="text-2xl font-bold text-gray-900">{stats.total_count}</div>
            <div className="text-sm text-gray-500">Total Applications</div>
          </div>
          
          <div className="card shadow-sm p-4">
            <div className="text-2xl font-bold text-gray-900">{stats.recent_count}</div>
            <div className="text-sm text-gray-500">Last 30 Days</div>
          </div>
          
          {statusData.filter(item => item.count > 0).map((status) => (
            <div key={status.name} className="card shadow-sm p-4">
              <div className="flex items-center">
                <div className="text-2xl font-bold text-gray-900">{status.count}</div>
                <div className={`ml-2 px-2 py-1 text-xs rounded-full ${status.color}`}>
                  {status.name}
                </div>
              </div>
              <div className="text-sm text-gray-500">{status.name} Jobs</div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 text-right">
          <Link
            to="/dashboard/jobs"
            className="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-500"
          >
            View all applications
            <ArrowRightIcon className="ml-1 h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Recent Resumes */}
      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Resumes</h2>
        
        {resumes.length === 0 ? (
          <div className="card shadow-sm p-6 text-center">
            <p className="text-gray-500">You haven't created any resumes yet.</p>
            <div className="mt-4">
              <Link
                to="/dashboard/resumes/create"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
              >
                <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
                Create Resume
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {resumes.map((resume) => (
              <div key={resume.id} className="card shadow-sm">
                <div className="p-5">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-medium text-gray-900">
                      {resume.title}
                    </h3>
                    {resume.is_default && (
                      <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-gray-500">
                    Last updated: {new Date(resume.updated_at).toLocaleDateString()}
                  </p>
                  <div className="mt-4 flex space-x-2">
                    <Link
                      to={`/dashboard/resumes/${resume.id}`}
                      className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      View
                    </Link>
                    <Link
                      to={`/dashboard/resumes/${resume.id}/edit`}
                      className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      Edit
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {resumes.length > 0 && (
          <div className="mt-4 text-right">
            <Link
              to="/dashboard/resumes"
              className="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-500"
            >
              View all resumes
              <ArrowRightIcon className="ml-1 h-4 w-4" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;