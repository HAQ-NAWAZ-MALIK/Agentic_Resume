import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import MarkdownEditor from '../../components/ui/MarkdownEditor';
import { createResume } from '../../services/resumes';

const CreateResume = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      title: '',
      content: `# Your Name

## Contact
Email: your.email@example.com
Phone: (123) 456-7890
Location: City, State
LinkedIn: linkedin.com/in/yourprofile
GitHub: github.com/yourusername

## Summary
Experienced software engineer with a passion for creating efficient, scalable applications. Skilled in JavaScript, Python, and cloud technologies, with a focus on delivering high-quality user experiences.

## Experience
### Senior Software Engineer | Company Name | Jan 2020 - Present
- Led development of a microservices architecture that improved system reliability by 30%
- Collaborated with cross-functional teams to design and implement new product features
- Mentored junior developers and conducted code reviews to maintain code quality

### Software Engineer | Previous Company | Jun 2017 - Dec 2019
- Developed and maintained RESTful APIs for the company's main product
- Implemented automated testing strategies that reduced bug reports by 25%
- Participated in agile development process with two-week sprint cycles

## Education
### University Name | Bachelor of Science in Computer Science | 2013 - 2017
- GPA: 3.8/4.0
- Relevant coursework: Data Structures, Algorithms, Database Systems, Web Development

## Skills
- Programming: JavaScript (React, Node.js), Python, SQL, HTML/CSS
- Tools: Git, Docker, AWS, Jenkins, Jira
- Soft Skills: Problem-solving, Team collaboration, Communication, Project management

## Projects
### Project Name
- Developed a web application using React and Node.js
- Implemented user authentication and authorization features
- Deployed and maintained on AWS infrastructure

## Certifications
- AWS Certified Developer - Associate
- Certified Scrum Master
`,
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
        
        await createResume(values);
        navigate('/dashboard/resumes');
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to create resume. Please try again.');
      } finally {
        setIsLoading(false);
      }
    },
  });

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Create Resume</h1>
        <p className="mt-1 text-sm text-gray-500">
          Create a new resume in Markdown format.
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
                placeholder="e.g., Software Engineer Resume"
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
                ) : 'Create Resume'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateResume;