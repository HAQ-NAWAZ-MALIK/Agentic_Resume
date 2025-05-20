import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../../context/AuthContext';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      confirm_password: '',
      github_url: '',
      linkedin_url: '',
    },
    validationSchema: Yup.object({
      first_name: Yup.string()
        .required('First name is required'),
      last_name: Yup.string()
        .required('Last name is required'),
      email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
      password: Yup.string()
        .min(8, 'Password must be at least 8 characters')
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
          'Password must contain at least one uppercase letter, one lowercase letter, and one number'
        )
        .required('Password is required'),
      confirm_password: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .required('Confirm password is required'),
      github_url: Yup.string()
        .url('Invalid URL format')
        .nullable(),
      linkedin_url: Yup.string()
        .url('Invalid URL format')
        .nullable(),
    }),
    onSubmit: async (values) => {
      try {
        setIsLoading(true);
        setError(null);
        
        const userData = {
          first_name: values.first_name,
          last_name: values.last_name,
          email: values.email,
          password: values.password,
          github_url: values.github_url || null,
          linkedin_url: values.linkedin_url || null,
        };
        
        await register(userData);
        navigate('/dashboard');
      } catch (err) {
        setError(err.response?.data?.message || 'Registration failed. Please try again.');
      } finally {
        setIsLoading(false);
      }
    },
  });

  return (
    <div>
      <h3 className="text-lg font-medium text-gray-900 mb-6">Create a new account</h3>
      
      {error && (
        <div className="mb-4 bg-red-50 p-4 rounded-md">
          <div className="text-sm text-red-700">{error}</div>
        </div>
      )}
      
      <form className="space-y-6" onSubmit={formik.handleSubmit}>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="first_name" className="form-label">
              First Name
            </label>
            <input
              id="first_name"
              name="first_name"
              type="text"
              autoComplete="given-name"
              className={`form-input ${
                formik.touched.first_name && formik.errors.first_name ? 'border-red-500' : ''
              }`}
              {...formik.getFieldProps('first_name')}
            />
            {formik.touched.first_name && formik.errors.first_name ? (
              <div className="form-error">{formik.errors.first_name}</div>
            ) : null}
          </div>

          <div>
            <label htmlFor="last_name" className="form-label">
              Last Name
            </label>
            <input
              id="last_name"
              name="last_name"
              type="text"
              autoComplete="family-name"
              className={`form-input ${
                formik.touched.last_name && formik.errors.last_name ? 'border-red-500' : ''
              }`}
              {...formik.getFieldProps('last_name')}
            />
            {formik.touched.last_name && formik.errors.last_name ? (
              <div className="form-error">{formik.errors.last_name}</div>
            ) : null}
          </div>
        </div>

        <div>
          <label htmlFor="email" className="form-label">
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            className={`form-input ${
              formik.touched.email && formik.errors.email ? 'border-red-500' : ''
            }`}
            {...formik.getFieldProps('email')}
          />
          {formik.touched.email && formik.errors.email ? (
            <div className="form-error">{formik.errors.email}</div>
          ) : null}
        </div>

        <div>
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            className={`form-input ${
              formik.touched.password && formik.errors.password ? 'border-red-500' : ''
            }`}
            {...formik.getFieldProps('password')}
          />
          {formik.touched.password && formik.errors.password ? (
            <div className="form-error">{formik.errors.password}</div>
          ) : null}
        </div>

        <div>
          <label htmlFor="confirm_password" className="form-label">
            Confirm Password
          </label>
          <input
            id="confirm_password"
            name="confirm_password"
            type="password"
            autoComplete="new-password"
            className={`form-input ${
              formik.touched.confirm_password && formik.errors.confirm_password ? 'border-red-500' : ''
            }`}
            {...formik.getFieldProps('confirm_password')}
          />
          {formik.touched.confirm_password && formik.errors.confirm_password ? (
            <div className="form-error">{formik.errors.confirm_password}</div>
          ) : null}
        </div>

        <div>
          <label htmlFor="github_url" className="form-label">
            GitHub URL (optional)
          </label>
          <input
            id="github_url"
            name="github_url"
            type="text"
            autoComplete="url"
            className={`form-input ${
              formik.touched.github_url && formik.errors.github_url ? 'border-red-500' : ''
            }`}
            {...formik.getFieldProps('github_url')}
          />
          {formik.touched.github_url && formik.errors.github_url ? (
            <div className="form-error">{formik.errors.github_url}</div>
          ) : null}
        </div>

        <div>
          <label htmlFor="linkedin_url" className="form-label">
            LinkedIn URL (optional)
          </label>
          <input
            id="linkedin_url"
            name="linkedin_url"
            type="text"
            autoComplete="url"
            className={`form-input ${
              formik.touched.linkedin_url && formik.errors.linkedin_url ? 'border-red-500' : ''
            }`}
            {...formik.getFieldProps('linkedin_url')}
          />
          {formik.touched.linkedin_url && formik.errors.linkedin_url ? (
            <div className="form-error">{formik.errors.linkedin_url}</div>
          ) : null}
        </div>

        <div>
          <button
            type="submit"
            className="btn btn-primary w-full flex justify-center"
            disabled={isLoading}
          >
            {isLoading ? (
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : 'Sign up'}
          </button>
        </div>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;