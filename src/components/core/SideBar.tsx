import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { MdKeyboardArrowDown, MdKeyboardArrowRight, MdCorporateFare, MdPeople } from 'react-icons/md';
import { FaRegUser, FaBuilding } from 'react-icons/fa';
import { IoHomeOutline, IoClose } from 'react-icons/io5';
import { RiFileListLine } from 'react-icons/ri';
import { BiLogOut } from 'react-icons/bi';
import { IoSettingsOutline } from 'react-icons/io5';
import innerLogo from '../../assets/inner_logo_rev.png';
import { useAuthContext } from '../../contexts/useAuthContext';
import ProfileIcon from '../common/ProfileIcon';

interface SideBarProps {
  onClose?: () => void;
}

const SideBar: React.FC<SideBarProps> = ({ onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthContext();
  const [expandedMenus, setExpandedMenus] = useState<string[]>(['settings']);

  const toggleMenu = (menuId: string) => {
    setExpandedMenus((prev) => (prev.includes(menuId) ? prev.filter((id) => id !== menuId) : [...prev, menuId]));
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/signin', { replace: true });
    } catch (error) {
      console.error('Logout error:', error);
      // Force logout by clearing storage and navigating
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      navigate('/signin', { replace: true });
    }
  };

  const menuItemStyles = {
    // marginLeft: '3.5rem',
    marginTop: '1.5rem'
  };

  const iconStyles = {
    marginRight: '1rem'
  };

  const subMenuStyles = {
    marginLeft: '3.5rem'
    // marginTop: '1rem'
  };

  const subMenuItemStyles = {
    marginLeft: '0.5rem',
    marginTop: '0.75rem'
  };

  const subMenuIconStyles = {
    marginTop: '1rem'
    // marginRight: '1rem'
  };

  const expandIconStyles = {
    marginRight: '1.5rem'
  };

  const isActiveRoute = (path: string) => location.pathname === path;

  return (
    <div className="w-84 lg:w-84 bg-[#0B4728] h-screen flex flex-col text-white relative overflow-hidden">
      {/* Mobile close button */}
      <button onClick={onClose} className="lg:hidden absolute top-4 right-4 p-2 text-white hover:bg-[#0B4728] rounded-full z-10">
        <IoClose size={24} />
      </button>

      <div className="flex justify-center items-center rounded-lg" style={{ marginLeft: '2rem', marginRight: '2rem', marginTop: '0.05rem', padding: '1rem' }}>
        <img src={innerLogo} alt="AdvanzPay" className="h-16 w-auto object-contain" />
      </div>

      {/* <div className="flex justify-center items-center flex-shrink-0 bg-white/95 rounded-lg shadow-md" style={{ marginLeft: '2rem', marginRight: '2rem', marginTop: '0.25rem', padding: '1rem' }}>
        <img src={innerLogo} alt="AdvanzPay" className="h-12 w-auto object-contain" />
      </div> */}

      {/* Navigation */}
      <nav className="flex-1" style={{ marginTop: '4rem', marginLeft: '3rem' }}>
        {/* Dashboard */}
        <div style={menuItemStyles}>
          <Link to="/app/dashboard" className="flex text-white hover:bg-[#0B4728] transition-colors">
            <IoHomeOutline className="text-xl" style={iconStyles} />
            <span className={isActiveRoute('/app/dashboard') ? 'font-bold' : ''}>Dashboard</span>
          </Link>
        </div>

        {/* Employee Management */}
        <div style={menuItemStyles}>
          <button onClick={() => toggleMenu('employeeManagement')} className="w-full flex items-center justify-between text-white hover:bg-[#0B4728] transition-colors">
            <div className="flex items-center">
              <FaBuilding className="text-xl" style={iconStyles} />
              <span className={isActiveRoute('/app/corporates') || isActiveRoute('/app/employee-requests') ? 'font-bold' : ''}>Corporate Management</span>
            </div>
            {expandedMenus.includes('employeeManagement') ? <MdKeyboardArrowDown className="text-xl" style={expandIconStyles} /> : <MdKeyboardArrowRight className="text-xl" style={expandIconStyles} />}
          </button>
          {expandedMenus.includes('employeeManagement') && (
            <div className="bg-[#0B4728]" style={subMenuStyles}>
              <Link to="/app/corporates" className="flex block py-2">
                <MdCorporateFare className="text-xl" style={subMenuIconStyles} />
                <span style={subMenuItemStyles} className={isActiveRoute('/app/corporates') ? 'font-bold' : ''}>
                  Corporates
                </span>
              </Link>
              <Link to="/app/corporate-users" className="flex block py-2">
                <MdPeople className="text-xl" style={subMenuIconStyles} />
                <span style={subMenuItemStyles} className={isActiveRoute('/app/corporate-users') ? 'font-bold' : ''}>
                  Corporate Users
                </span>
              </Link>
            </div>
          )}
        </div>

        {/* Settings */}
        <div style={menuItemStyles}>
          <button onClick={() => toggleMenu('settings')} className="w-full flex items-center justify-between text-white hover:bg-[#0B4728] transition-colors">
            <div className="flex items-center">
              <IoSettingsOutline className={'text-xl'} style={iconStyles} />
              <span className={isActiveRoute('/app/users') || isActiveRoute('/app/user-roles') ? 'font-bold' : ''}>Admin Settings</span>
            </div>
            {expandedMenus.includes('settings') ? <MdKeyboardArrowDown className="text-xl" style={expandIconStyles} /> : <MdKeyboardArrowRight className="text-xl" style={expandIconStyles} />}
          </button>
          {expandedMenus.includes('settings') && (
            <div className="flex flex-col bg-[#0B4728]" style={subMenuStyles}>
              <Link to="/app/users" className="flex block py-2">
                <FaRegUser className="text-xl" style={subMenuIconStyles} />
                <span style={subMenuItemStyles} className={isActiveRoute('/app/users') ? 'font-bold' : ''}>
                  Users
                </span>
              </Link>
              <Link to="/app/user-roles" className="flex block py-2">
                <RiFileListLine className="text-xl" style={subMenuIconStyles} />
                <span style={subMenuItemStyles} className={isActiveRoute('/app/user-roles') ? 'font-bold' : ''}>
                  User Roles
                </span>
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* User Profile */}
      <div className="mt-auto border-t border-[#0D4829] bg-[#4F7B64] flex-shrink-0 rounded-lg" style={{ marginBottom: '2rem', marginLeft: '2rem', marginRight: '2rem' }}>
        <button onClick={() => toggleMenu('profile')} className="w-full flex justify-center hover:bg-[#0D4829] transition-colors gap-5" style={{ marginTop: '1.25rem', paddingBottom: '1.25rem' }}>
          <ProfileIcon name={user?.name || 'User'} size="md" />
          <div className="text-center">
            <div className="font-medium">{user?.name || 'User'}</div>
            <div className="text-sm opacity-75">{user?.role || 'Admin'}</div>
          </div>
          <MdKeyboardArrowDown className="text-xl ml-3" />
        </button>
        {expandedMenus.includes('profile') && (
          <div className="bg-[#4F7B64] border-t border-[#0D4829]">
            <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 py-3 hover:bg-[#0D4829] transition-colors text-white">
              <BiLogOut className="text-xl" />
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SideBar;
