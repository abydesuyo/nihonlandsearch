import React from 'react';
import { Home, Map, Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface HeaderProps {
  viewMode: 'grid' | 'map';
  setViewMode: (mode: 'grid' | 'map') => void;
}

const Header: React.FC<HeaderProps> = ({ viewMode, setViewMode }) => {
  const { theme, toggleTheme } = useTheme();

  const getThemeIcon = () => {
    return theme === 'light' ? <Sun size={16} /> : <Moon size={16} />;
  };

  const getThemeLabel = () => {
    return theme === 'light' ? 'Light' : 'Dark';
  };

  return (
    <header className="header">
      <div className="header-content">
        <div className="header-brand">
          <div className="brand-icon">
            <Home size={32} />
          </div>
          <div className="brand-text">
            <h1>Nihon Land Search</h1>
            <p>Advanced Japanese Land Discovery Platform</p>
          </div>
        </div>
        <div className="header-actions">
          <button
            onClick={toggleTheme}
            className="theme-toggle"
            title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} mode`}
          >
            {getThemeIcon()}
            <span>{getThemeLabel()}</span>
          </button>
          <button
            onClick={() => setViewMode(viewMode === 'grid' ? 'map' : 'grid')}
            className="view-toggle"
          >
            <Map size={16} />
            <span>{viewMode === 'grid' ? 'Map View' : 'Grid View'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
