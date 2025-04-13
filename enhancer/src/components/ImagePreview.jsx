import React from "react";
import Loading from "./loading";

const ImagePreview = ({ uploaded, enhanced, loading, darkMode }) => {
  return (
    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
      {/* original image */}
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} shadow rounded-xl overflow-hidden transition-colors duration-300`}>
        <h2 className={`text-xl font-semibold text-center ${darkMode ? 'bg-gray-900' : 'bg-gray-800'} text-white py-2 transition-colors duration-300`}>
          Original Image
        </h2>

        {uploaded ? (
          <img
            src={uploaded}
            alt="Original"
            className="w-full h-80 object-contain p-2"
          />
        ) : (
          <div className={`flex items-center justify-center h-80 ${darkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-200 text-gray-600'} transition-colors duration-300`}>
            No Image Selected
          </div>
        )}
      </div>

      {/* enhanced image */}
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} shadow rounded-xl overflow-hidden transition-colors duration-300`}>
        <h2 className={`text-xl font-semibold text-center ${darkMode ? 'bg-gray-900' : 'bg-gray-800'} text-white py-2 transition-colors duration-300`}>
          Enhanced Image
        </h2>

        {loading && (
          <div className="flex items-center justify-center h-80">
            <Loading darkMode={darkMode} />
          </div>
        )}

        {!loading && enhanced ? (
          <div className="relative">
            <img
              src={enhanced}
              alt="Enhanced"
              className="w-full h-80 object-contain p-2"
            />
            <a
              href={enhanced}
              download="enhanced-image"
              target="_blank"
              rel="noopener noreferrer"
              className={`absolute bottom-2 right-2 ${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white px-3 py-1 rounded-md transition`}
            >
              Download
            </a>
          </div>
        ) : (
          !loading && (
            <div className={`flex items-center justify-center h-80 ${darkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-200 text-gray-600'} transition-colors duration-300`}>
              No Enhanced Image
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default ImagePreview;