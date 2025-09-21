import { FC } from "react";

export const AnimatedBackground: FC = () => (
  <div className="fixed inset-0 z-0">
    <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900"></div>
    <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500/10 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
    <div className="absolute top-40 right-20 w-72 h-72 bg-blue-500/10 rounded-full mix-blend-multiply filter blur-3xl animate-pulse [animation-delay:2s]"></div>
    <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-indigo-500/10 rounded-full mix-blend-multiply filter blur-3xl animate-pulse [animation-delay:4s]"></div>
  </div>
);