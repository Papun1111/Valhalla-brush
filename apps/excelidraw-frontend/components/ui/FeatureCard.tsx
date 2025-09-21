import { FC } from "react";
import type{ Feature } from "@/utils/interfaces";




export const FeatureCard: FC<Feature> = ({ icon: Icon, title, desc, color, hoverColor }) => (
 
  <div className="group p-8 bg-gray-900/50 border border-gray-800 rounded-3xl shadow-2xl hover:shadow-purple-500/10 transform hover:-translate-y-3 hover:scale-105 transition-all duration-500 backdrop-blur-sm hover:border-purple-500/30 animate-fade-in-up">
    <div className="flex items-center gap-4 mb-6">
      <div className={`p-4 rounded-2xl bg-gradient-to-br ${color} ${hoverColor} transition-all duration-500 transform group-hover:scale-110 group-hover:rotate-3`}>
        <Icon className="h-7 w-7 text-white group-hover:scale-110 transition-transform duration-300" />
      </div>
      <h3 className="text-2xl font-bold text-white group-hover:text-purple-300 transition-colors duration-300">
        {title}
      </h3>
    </div>
    <div className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
      {desc}
    </div>
    <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
      <div className="h-1 w-0 group-hover:w-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full transition-all duration-500"></div>
    </div>
  </div>
);

