import { FC } from "react";

export const AnimatedBackground: FC = () => (
  <div className="fixed inset-0 z-[-1] overflow-hidden">
    {/* Base gradient - subtle and sophisticated */}
    <div className="absolute inset-0 bg-gradient-to-br from-stone-50 via-stone-100 to-stone-200"></div>
    
    {/* Elegant floating orbs - muted and refined */}
    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-stone-300/20 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-float-slow"></div>
    <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-stone-400/15 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-float-slower"></div>
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-stone-200/25 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-float-slowest"></div>
    
    {/* Subtle grain texture overlay for premium feel */}
    <div className="absolute inset-0 opacity-[0.015] mix-blend-overlay pointer-events-none"
         style={{
           backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
           backgroundRepeat: 'repeat'
         }}>
    </div>
  </div>
);