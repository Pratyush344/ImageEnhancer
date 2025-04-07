import React from "react";
import Loading from "./loading";

const ImagePreview = (props) => {
  return (
    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
      {/* original image */}
      <div className="bg-white shadow rounded-xl overflow-hidden ">
        <h2 className="text-xl font-semibold text-center bg-gray-800 text-white py-2">
          Original Image
        </h2>

        {props.uploaded ? (
          <img
            src={props.uploaded}
            alt="Original"
            className="w-full h-80 object-contain p-2"
          />
        ) : (
          <div className="flex items-center justify-center h-80 bg-gray-200">
            No Image Selected
          </div>
        )}
      </div>

      {/* enhanced image */}
      <div className="bg-white shadow rounded-xl overflow-hidden">
        <h2 className="text-xl font-semibold text-center bg-gray-800 text-white py-2">
          Enhanced Image
        </h2>

        {props.loading && (
          <div className="flex items-center justify-center h-80">
            <Loading />
          </div>
        )}

        {!props.loading && props.enhanced ? (
          <div className="relative">
            <img
              src={props.enhanced}
              alt="Enhanced"
              className="w-full h-80 object-contain p-2"
            />
            <a
              href={props.enhanced}
              download="enhanced-image"
              target="_blank"
              rel="noopener noreferrer"
              className="absolute bottom-2 right-2 bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition"
            >
              Download
            </a>
          </div>
        ) : (
          !props.loading && (
            <div className="flex items-center justify-center h-80 bg-gray-200">
              No Enhanced Image
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default ImagePreview;
