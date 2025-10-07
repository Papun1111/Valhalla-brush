import { FC } from "react";
import type{ Feature } from "@/utils/interfaces";

export const FeatureCard: FC<Feature> = ({ icon: Icon, title, desc, color, hoverColor }) => (
  <div className="group p-8 bg-white border border-stone-200 rounded-2xl shadow-sm hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 hover:border-stone-300">
    <div className="mb-6">
      <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${color} ${hoverColor} transition-all duration-300 transform group-hover:scale-105`}>
        <Icon className="h-6 w-6 text-white transition-transform duration-300" />
      </div>
    </div>
    
    <h3 className="text-xl font-light text-stone-900 mb-3 transition-colors duration-300">
      {title}
    </h3>
    
    <p className="text-stone-600 leading-relaxed text-sm transition-colors duration-300 group-hover:text-stone-700">
      {desc}
    </p>
    
    <div className="mt-6 pt-6 border-t border-stone-100 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
      <div className="flex items-center text-stone-700 text-sm font-medium">
        <span>Learn more</span>
        <svg className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </div>
  </div>
);