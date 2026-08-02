import React from 'react';
import { AlertCircle, RotateCcw, Inbox } from 'lucide-react';

interface ErrorStateProps {
  message: string;
  details?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ message, details, onRetry }) => {
  React.useEffect(() => {
    console.error(`[Developer Log] Application encountered error: "${message}"`, details || '');
  }, [message, details]);

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-900/60 border border-rose-500/20 rounded-2xl max-w-xl mx-auto space-y-4 my-6">
      <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl">
        <AlertCircle className="w-8 h-8 text-rose-400" />
      </div>
      <div className="text-center">
        <h3 className="text-lg font-bold text-slate-100">Service Failure</h3>
        <p className="text-sm text-slate-400 mt-1">{message}</p>
        {details && (
          <div className="mt-3 text-left">
            <details className="text-xs text-rose-300 bg-rose-950/20 border border-rose-950/40 rounded-lg p-2.5 max-h-40 overflow-y-auto cursor-pointer">
              <summary className="font-mono select-none outline-none">Developer details</summary>
              <pre className="font-mono mt-1.5 whitespace-pre-wrap">{details}</pre>
            </details>
          </div>
        )}
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-semibold rounded-lg transition duration-150 shadow-md shadow-rose-500/10 cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          Retry Request
        </button>
      )}
    </div>
  );
};

export const LoadingSkeleton: React.FC = () => {
  return (
    <div className="animate-pulse space-y-6 w-full my-6">
      <div className="h-32 bg-slate-900 border border-slate-800/80 rounded-xl p-6 flex flex-col justify-between">
        <div className="h-4 bg-slate-800 rounded w-1/4"></div>
        <div className="space-y-3">
          <div className="h-8 bg-slate-800 rounded w-1/2"></div>
          <div className="h-3 bg-slate-800 rounded w-1/3"></div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="h-48 bg-slate-900 border border-slate-800/80 rounded-xl p-6 space-y-4">
          <div className="h-4 bg-slate-800 rounded w-1/3"></div>
          <div className="h-32 bg-slate-800/40 rounded"></div>
        </div>
        <div className="h-48 bg-slate-900 border border-slate-800/80 rounded-xl p-6 space-y-4">
          <div className="h-4 bg-slate-800 rounded w-1/3"></div>
          <div className="h-32 bg-slate-800/40 rounded"></div>
        </div>
      </div>
    </div>
  );
};

interface EmptyStateProps {
  title: string;
  description: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ title, description }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-900/40 border border-slate-800/80 rounded-2xl max-w-xl mx-auto space-y-4 my-6">
      <div className="p-3 bg-slate-800 border border-slate-700/60 rounded-xl">
        <Inbox className="w-8 h-8 text-slate-400" />
      </div>
      <div className="text-center">
        <h3 className="text-lg font-bold text-slate-200">{title}</h3>
        <p className="text-sm text-slate-400 mt-1">{description}</p>
      </div>
    </div>
  );
};
