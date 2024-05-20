import React from 'react';

interface NavBarProps {
  handleLogout: () => void;
}

const NavBar: React.FC<NavBarProps> = ({ handleLogout }) => {
  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white text-lg font-bold">Sec-print</div>
        <div className="space-x-4 flex items-center">
          <a href="#" className="text-gray-300 hover:text-white">Home</a>
          <a href="#" className="text-gray-300 hover:text-white">About</a>
          <a href="#" className="text-gray-300 hover:text-white">Services</a>
          <a href="#" className="text-gray-300 hover:text-white">Contact</a>
          <button 
            onClick={handleLogout} 
            className="text-gray-300 hover:text-white border border-gray-300 px-3 py-1 rounded-md"
          >
            Log Out
          </button>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
