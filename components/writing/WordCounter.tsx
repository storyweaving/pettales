

import React from 'react';

interface WordCounterProps {
  currentCount: number;
  triggerCount: number;
  isTriggered: boolean;
  showText?: boolean;
  saveStatus?: 'idle' | 'saving' | 'saved';
}

const WordCounter: React.FC<WordCounterProps> = ({ currentCount, triggerCount, isTriggered, showText = true, saveStatus = 'idle' }) => {
  const progress = Math.min((currentCount / triggerCount) * 100, 100);

  const getProgressColor = () => {
    if (isTriggered || currentCount >= triggerCount) {
      return 'bg-red-500';
    }
    if (currentCount >= triggerCount - 2) { // Words 22 and 23
      return 'bg-yellow-400';
    }
    return 'bg-orange-500'; // Words 0-21
  };
  
  const renderSaveStatus = () => {
    switch (saveStatus) {
        case 'saving':
            return (
                <div className="flex items-center space-x-1">
                    <svg className="animate-spin h-3 w-3 text-gray-500 dark:text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                        Saving...
                    </span>
                </div>
            );
        case 'saved':
            return (
                <span className="px-2 py-0.5 text-xs font-semibold text-green-800 bg-green-100 dark:text-green-200 dark:bg-green-800 rounded-full">
                    Saved
                </span>
            );
        default: // 'idle'
            return <div className="h-[20px]"></div>; // Placeholder to prevent layout shift
    }
  };

  const colorClass = getProgressColor();

  return (
    <div className={showText ? "space-y-2" : ""}>
      {showText && (
          <div className="flex justify-between items-center text-sm">
            <span className="font-medium text-gray-600 dark:text-gray-400">
              Word Count: <span className="font-bold text-orange-800 dark:text-orange-300">{currentCount}</span> / {triggerCount}
            </span>
            {renderSaveStatus()}
          </div>
      )}
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-[8px]">
        <div
          className={`h-[8px] rounded-full transition-all duration-300 ease-out ${colorClass}`}
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};

export default WordCounter;