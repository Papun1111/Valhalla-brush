import { FC } from "react";
import { IconType } from "react-icons";
import { FiClock, FiShield, FiZap, FiArrowRight } from "react-icons/fi";

interface WhyChooseItem {
  icon: IconType;
  title: string;
  desc: string;
}

const WHY_CHOOSE_DATA: WhyChooseItem[] = [
  { icon: FiZap, title: "Lightning Fast Sync", desc: "Optimized for performance with 60fps rendering and instant WebSockets." },
  { icon: FiShield, title: "Secure & Private", desc: "Enterprise-grade security keeps your creative work safe and confidential." },
  { icon: FiClock, title: "Persistent Storage", desc: "Never lose your progress with automatic database saves and history." }
];

export const AdditionalInfoSection: FC = () => (
  <section id="about" className="relative py-32 bg-[#08080a] border-t border-white/5 overflow-hidden">
    {/* Grid Background */}
    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] opacity-30" />
    
    <div className="relative container mx-auto px-6 lg:px-12 max-w-7xl">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
        {/* Left Content */}
        <div className="relative z-10">
          <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 rounded-full px-4 py-2 mb-8">
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="uppercase tracking-[0.15em] text-xs font-semibold text-white/60">Why Choose Us</span>
          </div>
          
          <h3 className="text-4xl lg:text-5xl font-bold tracking-tighter text-white leading-tight mb-10">
            Engineered for<br />
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">performance.</span>
          </h3>
          
          <div className="space-y-10">
            {WHY_CHOOSE_DATA.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="flex items-start gap-6 group">
                  <div className="relative flex-shrink-0">
                    <div className="absolute inset-0 bg-cyan-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative w-14 h-14 bg-[#141418] border border-white/10 rounded-2xl flex items-center justify-center group-hover:border-cyan-500/50 transition-colors duration-500 shadow-lg">
                      <Icon className="h-6 w-6 text-white/70 group-hover:text-cyan-400 transition-colors duration-500" />
                    </div>
                  </div>
                  <div className="pt-1">
                    <h4 className="text-xl font-bold text-white mb-2 tracking-tight group-hover:text-cyan-50 transition-colors duration-500">
                      {item.title}
                    </h4>
                    <p className="text-white/40 leading-relaxed text-sm">
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-14">
            <button className="inline-flex items-center gap-3 text-white font-medium hover:gap-5 transition-all duration-300 group">
              <span className="uppercase tracking-widest text-sm text-white/70 group-hover:text-white">Read Documentation</span>
              <FiArrowRight className="w-4 h-4 text-cyan-400" />
            </button>
          </div>
        </div>

        {/* Right Content - Stats Card */}
        <div className="relative lg:h-[600px] flex items-center justify-center perspective-1000">
          <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/10 to-blue-500/5 rounded-[40px] blur-3xl transform -rotate-6" />
          
          <div className="relative w-full max-w-[400px] aspect-[4/5] bg-[#141418] border border-white/10 rounded-[40px] shadow-2xl overflow-hidden transform hover:scale-[1.02] transition-transform duration-700 hover:-rotate-2 group">
            {/* Inner glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 group-hover:bg-cyan-400/30 transition-colors duration-700" />
            
            <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center text-white z-10">
              {/* Stat 1 */}
              <div className="mb-12">
                <div className="text-7xl font-black tracking-tighter bg-gradient-to-br from-white to-white/40 bg-clip-text text-transparent mb-2 blur-[0.5px]">20K+</div>
                <div className="text-sm uppercase tracking-widest font-semibold text-cyan-400">Active Workspaces</div>
              </div>
              
              <div className="w-full h-px bg-white/10 mb-12" />
              
              {/* Other Stats */}
              <div className="grid grid-cols-2 gap-8 w-full">
                <div>
                  <div className="text-3xl font-bold tracking-tight text-white mb-1">99.9%</div>
                  <div className="text-[10px] uppercase tracking-widest text-white/40">Uptime</div>
                </div>
                <div>
                  <div className="text-3xl font-bold tracking-tight text-white mb-1">&lt;50ms</div>
                  <div className="text-[10px] uppercase tracking-widest text-white/40">Latency</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);