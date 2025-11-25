import { FC } from "react";
import type { Feature } from "@/utils/interfaces";
import { FiCloud, FiLayers, FiShare2, FiStar, FiUsers } from "react-icons/fi";
import { FeatureCard } from "./FeatureCard";
import Link from "next/link";

const FEATURES_DATA: Feature[] = [
  { 
    icon: FiShare2, 
    title: "Real-time Collaboration", 
    desc: "Work together with your team in real-time. Share your drawings instantly with a simple link and watch as ideas come to life together.", 
    color: "from-stone-700 to-stone-800", 
    hoverColor: "group-hover:from-stone-600 group-hover:to-stone-700" 
  },
  { 
    icon: FiUsers, 
    title: "Multiplayer Editing", 
    desc: "Multiple users can edit the same canvas simultaneously. See who's drawing what in real-time with live cursors and collaborative tools.", 
    color: "from-stone-600 to-stone-700", 
    hoverColor: "group-hover:from-stone-500 group-hover:to-stone-600" 
  },
  { 
    icon: FiStar, 
    title: "Smart Drawing", 
    desc: "Intelligent shape recognition and drawing assistance helps you create perfect diagrams. AI-powered suggestions make creating easier.", 
    color: "from-stone-800 to-stone-900", 
    hoverColor: "group-hover:from-stone-700 group-hover:to-stone-800" 
  },
  { 
    icon: FiLayers, 
    title: "Layer Management", 
    desc: "Organize your work with unlimited layers. Non-destructive editing with blend modes, opacity controls, and layer effects.", 
    color: "from-stone-700 to-stone-800", 
    hoverColor: "group-hover:from-stone-600 group-hover:to-stone-700" 
  },
  { 
    icon: FiCloud, 
    title: "Cloud Sync", 
    desc: "Your work is automatically saved and synced across all devices. Access your projects anywhere, anytime with seamless cloud integration.", 
    color: "from-stone-600 to-stone-700", 
    hoverColor: "group-hover:from-stone-500 group-hover:to-stone-600" 
  },
];

export const FeaturesSection: FC = () => (
  <section className="relative py-24 bg-white">
    <div className="container mx-auto px-6 lg:px-12 max-w-7xl">
      {/* Section Header */}
      <div className="mb-20">
        <div className="flex items-center gap-3 text-sm text-stone-600 tracking-wide mb-6">
          <div className="w-8 h-px bg-stone-400"></div>
          <span className="uppercase">Features</span>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-12 items-end">
          <div>
            <h2 className="text-5xl lg:text-6xl font-light text-stone-900 leading-tight mb-6">
              We use best<br />
              <span className="font-serif italic">materials</span>!
            </h2>
          </div>
          <div>
            <p className="text-lg text-stone-600 leading-relaxed">
              Working with verified tools and technologies. Everything you need to create, 
              collaborate, and share your ideas with precision and elegance.
            </p>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES_DATA.map((feature) => (
          <FeatureCard key={feature.title} {...feature} />
        ))}
      </div>

      {/* Bottom CTA Section */}
      <div className="mt-20 pt-16 border-t border-stone-200">
        <div className="bg-stone-900 rounded-3xl p-12 lg:p-16 text-white relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full filter blur-3xl"></div>
          
          <div className="relative grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-3xl lg:text-4xl font-light mb-4">
                Ready to start<br />creating?
              </h3>
              <p className="text-stone-300 text-lg">
                Join thousands of teams already using our platform.
              </p>
            </div>
            <div className="flex justify-start lg:justify-end">
              <Link href={"/canvas"}>              
              <button className="h-14 px-12 bg-white text-stone-900 rounded-full font-medium tracking-wide hover:bg-stone-100 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
                Get Started
              </button>
              </Link>

            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);