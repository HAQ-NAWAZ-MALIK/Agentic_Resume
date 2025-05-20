import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../../context/AuthContext';
import { updateProfile, changePassword } from '../../services/auth';

const Profile = () => {
  const { currentUser, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [profileUpdateSuccess, setProfileUpdateSuccess] = useState(false);
  const [passwordUpdateSuccess, setPasswordUpdateSuccess] = useState(false);
  const [profileError, setProfileError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);
  
  const profileFormik = useFormik({
    initialValues: {
      first_name: currentUser?.first_name || '',
      last_name: currentUser?.last_name || '',
      github_url: currentUser?.github_url || '',
      linkedin_url: currentUser?.linkedin_url || '',
      personal_website: currentUser?.personal_website || '',
    },
    validationSchema: Yup.object({
      first_name: Yup.string().required('First name is required'),
      last_name: Yup.string().required('Last name is required'),
      github_url: Yup.string().url('Invalid URL format').nullable(),
      linkedin_url: Yup.string().url('Invalid URL format').nullable(),
      personal_website: Yup.string().url('Invalid URL format').nullable(),
    }),
    onSubmit: async (values) => {
      try {
        setProfileError(null);
        const response = await updateProfile(values);
        updateUser(response.user);
        setProfileUpdateSuccess(true);
        
        // Clear success message after 3 seconds
        setTimeout(() => setProfileUpdateSuccess(false), 3000);
      } catch (err) {
        setProfileError(err.response?.data?.message || 'Failed to update profile. Please try again.');
      }
    },
    enableReinitialize: true,
  });
  
  const passwordFormik = useFormik({
    initialValues: {
      current_password: '',
      new_password: '',
      confirm_password: '',
    },
    validationSchema: Yup.object({
      current_password: Yup.string().required('Current password is required'),
      new_password: Yup.string()
        .min(8, 'Password must be at least 8 characters')
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
          'Password must contain at least one uppercase letter, one lowercase letter, and one number'
        )
        .required('New password is required'),
      confirm_password: Yup.string()
        .oneOf([Yup.ref('new_password'), null], 'Passwords must match')
        .required('Confirm password is required'),
    }),
    onSubmit: async (values) => {
      try {
        setPasswordError(null);
        await changePassword(values.current_password, values.new_password);
        passwordFormik.resetForm();
        setPasswordUpdateSuccess(true);
        
        // Clear success message after 3 seconds
        setTimeout(() => setPasswordUpdateSuccess(false), 3000);
      } catch (err) {
        setPasswordError(err.response?.data?.message || 'Failed to change password. Please try again.');
      }
    },
  });
  
  // Update form values when currentUser changes
  useEffect(() => {
    if (currentUser) {
      profileFormik.setValues({
        first_name: currentUser.first_name || '',
        last_name: currentUser.last_name || '',
        github_url: currentUser.github_url || '',
        linkedin_url: currentUser.linkedin_url || '',
        personal_website: currentUser.personal_website || '',
      });
    }
  }, [currentUser]);

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your account settings and preferences.
        </p>
      </div>
      
      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('profile')}
              className={`${
                activeTab === 'profile'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm`}
            >
              Profile Information
            </button>
            <button
              onClick={() => setActiveTab('password')}
              className={`${
                activeTab === 'password'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm`}
            >
              Change Password
            </button>
          </nav>
        </div>
      </div>
      
      {/* Profile Information Tab */}
      {activeTab === 'profile' && (
        <div className="card shadow-sm">
          <form onSubmit={profileFormik.handleSubmit}>
            <div className="card-body">
              {profileUpdateSuccess && (
                <div className="mb-4 bg-green-50 p-4 rounded-md">
                  <div className="text-sm text-green-700">Profile updated successfully!</div>
                </div>
              )}
              
              {profileError && (
                <div className="mb-4 bg-red-50 p-4 rounded-md">
                  <div className="text-sm text-red-700">{profileError}</div>
                </div>
              )}
              
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="first_name" className="form-label">
                    First Name
                  </label>
                  <input
                    id="first_name"
                    name="first_name"
                    type="text"
                    className={`form-input ${
                      profileFormik.touched.first_name && profileFormik.errors.first_name ? 'border-red-500' : ''
                    }`}
                    {...profileFormik.getFieldProps('first_name')}
                  />
                  {profileFormik.touched.first_name && profileFormik.errors.first_name ? (
                    <div className="form-error">{profileFormik.errors.first_name}</div>
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
                    className={`form-input ${
                      profileFormik.touched.last_name && profileFormik.errors.last_name ? 'border-red-500' : ''
                    }`}
                    {...profileFormik.getFieldProps('last_name')}
                  />
                  {profileFormik.touched.last_name && profileFormik.errors.last_name ? (
                    <div className="form-error">{profileFormik.errors.last_name}</div>
                  ) : null}
                </div>
                
                <div>
                  <label htmlFor="github_url" className="form-label">
                    GitHub URL (Optional)
                  </label>
                  <input
                    id="github_url"
                    name="github_url"
                    type="text"
                    className={`form-input ${
                      profileFormik.touched.github_url && profileFormik.errors.github_url ? 'border-red-500' : ''
                    }`}
                    placeholder="https://github.com/username"
                    {...profileFormik.getFieldProps('github_url')}
                  />
                  {profileFormik.touched.github_url && profileFormik.errors.github_url ? (
                    <div className="form-error">{profileFormik.errors.github_url}</div>
                  ) : null}
                  <p className="mt-1 text-xs text-gray-500">
                    GitHub URL helps the AI better tailor your resume.
                  </p>
                </div>
                
                <div>
                  <label htmlFor="linkedin_url" className="form-label">
                    LinkedIn URL (Optional)
                  </label>
                  <input
                    id="linkedin_url"
                    name="linkedin_url"
                    type="text"
                    className={`form-input ${
                      profileFormik.touched.linkedin_url && profileFormik.errors.linkedin_url ? 'border-red-500' : ''
                    }`}
                    placeholder="https://linkedin.com/in/username"
                    {...profileFormik.getFieldProps('linkedin_url')}
                  />
                  {profileFormik.touched.linkedin_url && profileFormik.errors.linkedin_url ? (
                    <div className="form-error">{profileFormik.errors.linkedin_url}</div>
                  ) : null}
                </div>
                
                <div className="sm:col-span-2">
                  <label htmlFor="personal_website" className="form-label">
                    Personal Website (Optional)
                  </label>
                  <input
                    id="personal_website"
                    name="personal_website"
                    type="text"
                    className={`form-input ${
                      profileFormik.touched.personal_website && profileFormik.errors.personal_website ? 'border-red-500' : ''
                    }`}
                    placeholder="https://yourwebsite.com"
                    {...profileFormik.getFieldProps('personal_website')}
                  />
                  {profileFormik.touched.personal_website && profileFormik.errors.personal_website ? (
                    <div className="form-error">{profileFormik.errors.personal_website}</div>
                  ) : null}
                </div>
                
                <div className="sm:col-span-2">
                  <div className="flex items-center">
                    <div className="bg-gray-100 text-gray-500 p-2 rounded-md">
                      {currentUser?.email}
                    </div>
                    <span className="ml-2 text-sm text-gray-500">
                      (Email cannot be changed)
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="card-footer">
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={!profileFormik.isValid || !profileFormik.dirty}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
      
      {/* Change Password Tab */}
      {activeTab === 'password' && (
        <div className="card shadow-sm">
          <form onSubmit={passwordFormik.handleSubmit}>
            <div className="card-body">
              {passwordUpdateSuccess && (
                <div className="mb-4 bg-green-50 p-4 rounded-md">
                  <div className="text-sm text-green-700">Password changed successfully!</div>
                </div>
              )}
              
              {passwordError && (
                <div className="mb-4 bg-red-50 p-4 rounded-md">
                  <div className="text-sm text-red-700">{passwordError}</div>
                </div>
              )}
              
              <div className="space-y-6">
                <div>
                  <label htmlFor="current_password" className="form-label">
                    Current Password
                  </label>
                  <input
                    id="current_password"
                    name="current_password"
                    type="password"
                    className={`form-input ${
                      passwordFormik.touched.current_password && passwordFormik.errors.current_password ? 'border-red-500' : ''
                    }`}
                    {...passwordFormik.getFieldProps('current_password')}
                  />
                  {passwordFormik.touched.current_password && passwordFormik.errors.current_password ? (
                    <div className="form-error">{passwordFormik.errors.current_password}</div>
                  ) : null}
                </div>
                
                <div>
                  <label htmlFor="new_password" className="form-label">
                    New Password
                  </label>
                  <input
                    id="new_password"
                    name="new_password"
                    type="password"
                    className={`form-input ${
                      passwordFormik.touched.new_password && passwordFormik.errors.new_password ? 'border-red-500' : ''
                    }`}
                    {...passwordFormik.getFieldProps('new_password')}
                  />
                  {passwordFormik.touched.new_password && passwordFormik.errors.new_password ? (
                    <div className="form-error">{passwordFormik.errors.new_password}</div>
                  ) : null}
                  <p className="mt-1 text-xs text-gray-500">
                    Password must be at least 8 characters and include uppercase, lowercase, and a number.
                  </p>
                </div>
                
                <div>
                  <label htmlFor="confirm_password" className="form-label">
                    Confirm New Password
                  </label>
                  <input
                    id="confirm_password"
                    name="confirm_password"
                    type="password"
                    className={`form-input ${
                      passwordFormik.touched.confirm_password && passwordFormik.errors.confirm_password ? 'border-red-500' : ''
                    }`}
                    {...passwordFormik.getFieldProps('confirm_password')}
                  />
                  {passwordFormik.touched.confirm_password && passwordFormik.errors.confirm_password ? (
                    <div className="form-error">{passwordFormik.errors.confirm_password}</div>
                  ) : null}
                </div>
              </div>
            </div>
            
            <div className="card-footer">
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={!passwordFormik.isValid || !passwordFormik.dirty}
                >
                  Change Password
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Profile;