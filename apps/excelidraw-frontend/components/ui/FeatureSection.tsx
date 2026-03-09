import { FC } from "react";
import type { Feature } from "@/utils/interfaces";
import { FiCloud, FiLayers, FiShare2, FiStar, FiUsers } from "react-icons/fi";
import { FeatureCard } from "./FeatureCard";
import Link from "next/link";
import { Button } from "@repo/ui/button";
import { FiArrowRight } from "react-icons/fi";

const FEATURES_DATA: Feature[] = [
  { 
    icon: FiShare2, 
    title: "Real-time Collaboration", 
    desc: "Work together with your team in real-time. Share your drawings instantly with a simple link and watch as ideas come to life together.", 
    color: "", 
    hoverColor: "" 
  },
  { 
    icon: FiUsers, 
    title: "Multiplayer Editing", 
    desc: "Multiple users can edit the same canvas simultaneously. See who's drawing what in real-time with live cursors and collaborative tools.", 
    color: "", 
    hoverColor: "" 
  },
  { 
    icon: FiStar, 
    title: "Smart Drawing", 
    desc: "Intelligent shape recognition and drawing assistance helps you create perfect diagrams. Advanced tools make creating easier.", 
    color: "", 
    hoverColor: "" 
  },
  { 
    icon: FiLayers, 
    title: "Layer Management", 
    desc: "Organize your work with unlimited layers. Non-destructive editing with blend modes, opacity controls, and layer effects.", 
    color: "", 
    hoverColor: "" 
  },
  { 
    icon: FiCloud, 
    title: "Cloud Sync", 
    desc: "Your work is automatically saved and synced across all devices. Access your projects anywhere, anytime with seamless cloud integration.", 
    color: "", 
    hoverColor: "" 
  },
];

export const FeaturesSection: FC = () => (
  <section id="features" className="relative py-32 bg-[#0a0a0c] border-t border-white/5 overflow-hidden">
    {/* Background elements */}
    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-violet-600/5 rounded-full blur-[100px] pointer-events-none" />
    <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-600/5 rounded-full blur-[120px] pointer-events-none" />
    
    <div className="relative container mx-auto px-6 lg:px-12 max-w-7xl">
      {/* Section Header */}
      <div className="mb-24 max-w-3xl">
        <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 rounded-full px-4 py-2 mb-8">
          <div className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
          <span className="uppercase tracking-[0.15em] text-xs font-semibold text-white/60">Features</span>
        </div>
        
        <h2 className="text-4xl lg:text-6xl font-bold text-white leading-[1.1] tracking-tighter mb-8">
          Built for teams that<br />
          <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">move fast</span>.
        </h2>
        
        <p className="text-xl text-white/40 leading-relaxed font-light">
          Everything you need to create, collaborate, and share your ideas with precision. A complete toolset designed for modern workflows.
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {FEATURES_DATA.map((feature) => (
          <FeatureCard key={feature.title} {...feature} />
        ))}
      </div>

      {/* Bottom CTA Section */}
      <div className="mt-32 relative hidden lg:block">
        <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-[2.5rem] blur-xl opacity-20" />
        <div className="relative bg-[#141418] border border-white/10 rounded-[2.5rem] p-12 lg:p-16 overflow-hidden">
          {/* Decorative shapes inside CTA */}
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gradient-to-br from-violet-500/10 to-transparent rounded-full blur-3xl" />
          
          <div className="relative grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-4xl lg:text-5xl font-bold tracking-tighter text-white mb-6 leading-tight">
                Ready to transform<br />
                how you <span className="text-violet-400">collaborate?</span>
              </h3>
              <p className="text-white/40 text-lg mb-0">
                Join thousands of teams already building the future on our platform.
              </p>
            </div>
            
            <div className="flex justify-start lg:justify-end">
              <Link href={"/signup"}>
                <Button className="h-16 px-12 bg-white text-black hover:bg-white/90 rounded-2xl font-bold tracking-wide shadow-xl shadow-white/10 transition-all duration-300 transform hover:-translate-y-1 flex items-center gap-3">
                  Start creating for free
                  <FiArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);