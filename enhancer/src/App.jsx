import React, { useState, useEffect } from 'react';
import Home from "./components/Home";
import DarkModeToggle from "./components/DarkModeToggle";

const App = () => {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem('darkMode') === 'true' || 
    window.matchMedia('(prefers-color-scheme: dark)').matches
  );

  useEffect(() => {
    // Set dark mode class on the file (Andhera)
    if (darkMode) {
      document.documentElement.classList.add('dark-mode');
    } else {
      document.documentElement.classList.remove('dark-mode');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode);
  };

  return (
    <div className={`flex flex-col items-center justify-center min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100'} py-8 px-4 transition-colors duration-300`}>
      <DarkModeToggle darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      <div className="text-center mb-8">
        <h1 className={`text-5xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'} mb-2`}>AI Image Enhancer {" "}</h1>
        <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
          Upload your Image and Let AI enhance it in second!
        </p>
      </div>
      <Home darkMode={darkMode} />
      <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Powered By AI</div>
    </div>
  );
};

export default App;