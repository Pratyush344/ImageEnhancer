import React from 'react'

const loading = () => {
  return (
    <div className="flex justify-center items-center h-full">
      <div className="animate-spin border-t-transparent border-4 w-10 h-10 scale-200 rounded-full border-red-300"></div>
      
    </div>
  )
}

export default loading;
