import React from "react";

interface LoadingStateProps {
  message?: string;
  className?: string;
}

const LoadingState: React.FC<LoadingStateProps> = ({
  message = "Loading...",
  className = "",
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center py-12 ${className}`}
    >
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600" />

      <p className="mt-4 text-sm font-medium text-gray-600">
        {message}
      </p>
    </div>
  );
};

export default LoadingState;