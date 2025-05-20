import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  HomeIcon, 
  DocumentTextIcon, 
  BriefcaseIcon, 
  UserIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';

const DashboardLayout = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
    { name: 'Resumes', href: '/dashboard/resumes', icon: DocumentTextIcon },
    { name: 'Job Applications', href: '/dashboard/jobs', icon: BriefcaseIcon },
    { name: 'Profile', href: '/dashboard/profile', icon: UserIcon },
  ];

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile menu (off-canvas) */}
      <div className={`fixed inset-0 z-40 lg:hidden ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-gray-600 bg-opacity-75"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
        
        {/* Mobile menu */}
        <div className="fixed inset-y-0 left-0 w-64 flex flex-col bg-white">
          <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
            <Link to="/dashboard" className="text-xl font-bold text-primary-600">
              AgenticResume
            </Link>
            <button
              className="rounded-md text-gray-500 hover:text-gray-600"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto pt-5 pb-4">
            <nav className="mt-5 px-2 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`${
                    isActive(item.href)
                      ? 'bg-primary-50 text-primary-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  } group flex items-center rounded-md px-2 py-2 text-base font-medium`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <item.icon
                    className={`${
                      isActive(item.href) ? 'text-primary-500' : 'text-gray-400 group-hover:text-gray-500'
                    } mr-4 h-6 w-6 flex-shrink-0`}
                  />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
          
          <div className="border-t border-gray-200 p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center">
                  <span className="text-xl font-medium">
                    {currentUser?.first_name?.[0] || ''}
                    {currentUser?.last_name?.[0] || ''}
                  </span>
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">
                  {currentUser?.full_name || 'User'}
                </p>
                <button
                  onClick={handleLogout}
                  className="text-xs font-medium text-gray-500 hover:text-gray-700 flex items-center"
                >
                  <span>Sign out</span>
                  <ArrowRightOnRectangleIcon className="ml-1 h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex-1 flex flex-col min-h-0 bg-white border-r border-gray-200">
          <div className="flex items-center h-16 flex-shrink-0 px-4 border-b border-gray-200">
            <Link to="/dashboard" className="text-xl font-bold text-primary-600">
              AgenticResume
            </Link>
          </div>
          
          <div className="flex-1 flex flex-col overflow-y-auto pt-5 pb-4">
            <nav className="mt-5 flex-1 px-2 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`${
                    isActive(item.href)
                      ? 'bg-primary-50 text-primary-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  } group flex items-center rounded-md px-2 py-2 text-sm font-medium`}
                >
                  <item.icon
                    className={`${
                      isActive(item.href) ? 'text-primary-500' : 'text-gray-400 group-hover:text-gray-500'
                    } mr-3 h-5 w-5 flex-shrink-0`}
                  />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
          
          <div className="border-t border-gray-200 p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center">
                  <span className="text-xl font-medium">
                    {currentUser?.first_name?.[0] || ''}
                    {currentUser?.last_name?.[0] || ''}
                  </span>
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">
                  {currentUser?.full_name || 'User'}
                </p>
                <button
                  onClick={handleLogout}
                  className="text-xs font-medium text-gray-500 hover:text-gray-700 flex items-center"
                >
                  <span>Sign out</span>
                  <ArrowRightOnRectangleIcon className="ml-1 h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64 flex flex-col flex-1">
        {/* Mobile header */}
        <div className="sticky top-0 z-10 bg-white lg:hidden">
          <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
            <button
              className="px-2 text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 lg:hidden"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Bars3Icon className="h-6 w-6" />
            </button>
            <Link to="/dashboard" className="text-xl font-bold text-primary-600">
              AgenticResume
            </Link>
            <div className="h-10 w-10 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center">
              <span className="text-xl font-medium">
                {currentUser?.first_name?.[0] || ''}
                {currentUser?.last_name?.[0] || ''}
              </span>
            </div>
          </div>
        </div>

        {/* Main area */}
        <main className="flex-1 pb-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;