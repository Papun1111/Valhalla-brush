import { type JSX } from "react";

interface CardProps {
  className?: string;
  title?: string;
  children?: React.ReactNode;
  href?: string;
}

export function Card({
  className = "",
  title,
  children,
  href,
}: CardProps): JSX.Element {
  return (
    <a
      href={`${href}?utm_source=create-turbo&utm_medium=basic&utm_campaign=create-turbo`}
      target="_blank"
      rel="noopener noreferrer"
      className={`group block p-6 bg-gray-700 border border-gray-600 rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-200 ${className}`}
    >
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-white">
          {title}
        </h2>
      
      </div>
      <p className="mt-4 text-gray-300 leading-relaxed">
        {children}
      </p>
    </a>
  );
}