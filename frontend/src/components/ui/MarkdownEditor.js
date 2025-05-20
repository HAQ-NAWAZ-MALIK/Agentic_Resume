import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const MarkdownEditor = ({ value, onChange, height = '400px', preview = true }) => {
  const [showPreview, setShowPreview] = useState(preview);

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <label className="form-label">Resume Content (Markdown)</label>
        {preview && (
          <div className="flex rounded-md shadow-sm">
            <button
              type="button"
              className={`px-4 py-2 text-sm font-medium rounded-l-md ${
                !showPreview
                  ? 'bg-primary-100 text-primary-700'
                  : 'bg-white text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setShowPreview(false)}
            >
              Edit
            </button>
            <button
              type="button"
              className={`px-4 py-2 text-sm font-medium rounded-r-md ${
                showPreview
                  ? 'bg-primary-100 text-primary-700'
                  : 'bg-white text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setShowPreview(true)}
            >
              Preview
            </button>
          </div>
        )}
      </div>

      <div className="relative border border-gray-300 rounded-md overflow-hidden" style={{ height }}>
        {showPreview ? (
          <div className="h-full p-4 overflow-auto bg-white markdown">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{value || ''}</ReactMarkdown>
          </div>
        ) : (
          <textarea
            className="h-full w-full p-4 border-0 focus:ring-0 resize-none font-mono"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder="# Your Resume

## Contact
Your Name
Email: your.email@example.com
Phone: (123) 456-7890

## Summary
A brief summary of your professional background and key strengths.

## Experience
### Company Name | Position | Date - Date
- Accomplishment 1
- Accomplishment 2

## Education
### University Name | Degree | Date
- Additional details

## Skills
- Skill 1
- Skill 2
"
          />
        )}
      </div>

      <div className="mt-2 text-xs text-gray-500">
        Use Markdown formatting: # Heading, ## Subheading, **bold**, *italic*, - for bullets, etc.
      </div>
    </div>
  );
};

export default MarkdownEditor;