import React from "react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  className?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  action,
  className = "",
}) => {
  return (
    <div
      className={`mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between ${className}`}
    >
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          {title}
        </h1>

        {subtitle && (
          <p className="mt-1 text-sm text-slate-500">
            {subtitle}
          </p>
        )}
      </div>

      {action && (
        <div className="flex items-center gap-3">
          {action}
        </div>
      )}
    </div>
  );
};

export default PageHeader;