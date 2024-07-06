import React from 'react'

const WordDetailSkeleton: React.FC<any> = () => {  
  return (
    <div className="animate-pulse flex-1 space-y-8">
      <div className="h-6 w-1/2 bg-base-content rounded opacity-50"></div>
      <div className="space-y-4 pt-5">
        <div className="h-3 w-3/4 bg-base-content rounded opacity-50"></div>
        <div className="h-3 bg-base-content rounded opacity-50"></div>
        <div className="h-3 bg-base-content rounded opacity-50"></div>
        <div className="h-3 bg-base-content rounded opacity-50"></div>
        <div className="h-3 bg-base-content rounded opacity-50"></div>
        <div className="h-3 bg-base-content rounded opacity-50"></div>
        <div className="h-3 bg-base-content rounded opacity-50"></div>
      </div>

      <div className="space-y-3 pt-5">
        <div className="h-2 bg-base-content opacity-50"></div>
        <div className="h-2 bg-base-content opacity-50"></div>
        <div className="h-2 bg-base-content opacity-50"></div>
        <div className="h-2 bg-base-content opacity-50"></div>
        <div className="h-2 bg-base-content opacity-50"></div>
      </div>
    </div>
  )
}

export default WordDetailSkeleton;