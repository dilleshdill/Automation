import React from 'react'

const Loader = () => {
  return (
    <div className="fixed top-0 left-0 w-full z-50">
      <div className="h-[3px] bg-blue-500 animate-[progress_1.2s_ease-out_infinite]"></div>
    </div>
  )
}


export default Loader
