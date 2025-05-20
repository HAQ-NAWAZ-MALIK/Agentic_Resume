import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  PencilIcon, 
  DocumentDuplicateIcon, 
  DownloadIcon, 
  ArrowDownTrayIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getResume, getResumeHtml } from '../../services/resumes';

const ViewResume = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [resume, setResume] = useState(null);
  const [htmlContent, setHtmlContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('preview'); // 'preview', 'raw', 'html'

  useEffect(() => {
    const fetchResume = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const resumeResponse = await getResume(id);
        setResume(resumeResponse.resume);
        
        const htmlResponse = await getResumeHtml(id);
        setHtmlContent(htmlResponse.html);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load resume');
      } finally {
        setLoading(false);
      }
    };

    fetchResume();
  }, [id]);

  const downloadMarkdown = () => {
    if (!resume) return;
    
    const blob = new Blob([resume.content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${resume.title}.md`;
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const downloadHtml = () => {
    if (!htmlContent) return;
    
    const fullHtml = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${resume.title}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 20px;
            max-width: 800px;
            margin: 0 auto;
          }
          h1, h2, h3, h4, h5, h6 {
            margin-top: 1.5em;
            margin-bottom: 0.5em;
          }
          h1 { font-size: 2em; }
          h2 { font-size: 1.5em; }
          h3 { font-size: 1.3em; }
          h4 { font-size: 1.1em; }
          p { margin-bottom: 1em; }
          ul, ol { padding-left: 2em; margin-bottom: 1em; }
          a { color: #4338ca; text-decoration: none; }
          a:hover { text-decoration: underline; }
          code {
            background-color: #f1f1f1;
            padding: 0.2em 0.4em;
            border-radius: 3px;
            font-family: monospace;
          }
          pre {
            background-color: #f1f1f1;
            padding: 1em;
            border-radius: 5px;
            overflow-x: auto;
          }
        </style>
      </head>
      <body>
        ${htmlContent}
      </body>
      </html>
    `;
    
    const blob = new Blob([fullHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${resume.title}.html`;
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    URL.revokeObjectURL(url);
    document.body.removeChild(a);
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

  if (!resume) {
    return (
      <div className="py-6 px-4 sm:px-6 lg:px-8">
        <div className="bg-yellow-50 p-4 rounded-md">
          <div className="text-sm text-yellow-700">Resume not found.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-gray-900">{resume.title}</h1>
            {resume.is_default && (
              <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Default
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-gray-500 flex items-center">
            <CalendarIcon className="mr-1.5 h-4 w-4 text-gray-400" />
            Last updated: {new Date(resume.updated_at).toLocaleDateString()}
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex flex-wrap gap-2">
          <Link
            to={`/dashboard/resumes/${id}/edit`}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <PencilIcon className="-ml-1 mr-2 h-5 w-5 text-gray-500" />
            Edit
          </Link>
          <button
            onClick={downloadMarkdown}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <ArrowDownTrayIcon className="-ml-1 mr-2 h-5 w-5 text-gray-500" />
            Download .md
          </button>
          <button
            onClick={downloadHtml}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <ArrowDownTrayIcon className="-ml-1 mr-2 h-5 w-5 text-gray-500" />
            Download .html
          </button>
        </div>
      </div>

      {/* View Mode Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setViewMode('preview')}
              className={`${
                viewMode === 'preview'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm`}
            >
              Preview
            </button>
            <button
              onClick={() => setViewMode('raw')}
              className={`${
                viewMode === 'raw'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm`}
            >
              Markdown
            </button>
            <button
              onClick={() => setViewMode('html')}
              className={`${
                viewMode === 'html'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm`}
            >
              HTML
            </button>
          </nav>
        </div>
      </div>

      {/* Resume Content */}
      <div className="card shadow-sm">
        <div className="card-body">
          {viewMode === 'preview' && (
            <div className="prose prose-primary max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {resume.content}
              </ReactMarkdown>
            </div>
          )}
          
          {viewMode === 'raw' && (
            <div>
              <pre className="bg-gray-50 p-4 rounded-md overflow-auto text-sm font-mono">
                {resume.content}
              </pre>
            </div>
          )}
          
          {viewMode === 'html' && (
            <div>
              <pre className="bg-gray-50 p-4 rounded-md overflow-auto text-sm font-mono">
                {htmlContent}
              </pre>
            </div>
          )}
        </div>
      </div>

      {/* Return to Resumes button */}
      <div className="mt-6">
        <Link
          to="/dashboard/resumes"
          className="text-sm font-medium text-primary-600 hover:text-primary-500"
        >
          ← Back to Resumes
        </Link>
      </div>
    </div>
  );
};

export default ViewResume;