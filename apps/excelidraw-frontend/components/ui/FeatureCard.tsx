"use client";

import { FC } from "react";
import type { Feature } from "@/utils/interfaces";

export const FeatureCard: FC<Feature> = ({ icon: Icon, title, desc }) => (
  <div className="group relative p-8 bg-[#141418] border border-white/5 rounded-3xl shadow-lg hover:shadow-2xl hover:shadow-violet-900/20 transition-all duration-500 hover:border-white/10 overflow-hidden">
    {/* Subtle glow background on hover */}
    <div className="absolute inset-0 bg-gradient-to-br from-violet-600/5 to-indigo-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    
    <div className="relative z-10">
      <div className="mb-6 inline-flex">
        <div className="relative">
          {/* Icon glow */}
          <div className="absolute inset-0 bg-violet-500 blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-500" />
          <div className="relative flex items-center justify-center w-14 h-14 rounded-2xl bg-white/5 border border-white/10 group-hover:bg-white/10 group-hover:border-white/20 transition-all duration-500">
            <Icon className="h-6 w-6 text-violet-400 group-hover:text-violet-300 transition-colors duration-500" />
          </div>
        </div>
      </div>
      
      <h3 className="text-xl font-bold text-white mb-3 tracking-tight group-hover:text-white/90 transition-colors duration-500">
        {title}
      </h3>
      
      <p className="text-white/40 leading-relaxed text-sm group-hover:text-white/60 transition-colors duration-500">
        {desc}
      </p>
      
      <div className="mt-8 flex items-center text-violet-400 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
        <span>Learn more</span>
        <svg className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </div>
  </div>
);