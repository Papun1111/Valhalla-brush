import { FC } from "react";
import type { Feature } from "@/utils/interfaces";
import { FiCloud, FiLayers, FiShare2, FiStar, FiUsers } from "react-icons/fi";
import { FeatureCard } from "./FeatureCard";
const FEATURES_DATA: Feature[] = [
  { icon: FiShare2, title: "Real-time Collaboration", desc: "Work together with your team in real-time. Share your drawings instantly with a simple link and watch as ideas come to life together.", color: "from-purple-500 to-blue-500", hoverColor: "group-hover:from-purple-400 group-hover:to-blue-400" },
  { icon: FiUsers, title: "Multiplayer Editing", desc: "Multiple users can edit the same canvas simultaneously. See who's drawing what in real-time with live cursors and collaborative tools.", color: "from-blue-500 to-cyan-500", hoverColor: "group-hover:from-blue-400 group-hover:to-cyan-400" },
  { icon: FiStar, title: "Smart Drawing", desc: "Intelligent shape recognition and drawing assistance helps you create perfect diagrams. AI-powered suggestions make creating easier.", color: "from-cyan-500 to-teal-500", hoverColor: "group-hover:from-cyan-400 group-hover:to-teal-400" },
  { icon: FiLayers, title: "Layer Management", desc: "Organize your work with unlimited layers. Non-destructive editing with blend modes, opacity controls, and layer effects.", color: "from-green-500 to-yellow-500", hoverColor: "group-hover:from-green-400 group-hover:to-yellow-400" },
  { icon: FiCloud, title: "Cloud Sync", desc: "Your work is automatically saved and synced across all devices. Access your projects anywhere, anytime with seamless cloud integration.", color: "from-yellow-500 to-orange-500", hoverColor: "group-hover:from-yellow-400 group-hover:to-orange-400" },
];
export const FeaturesSection: FC = () => (
  <section className="relative z-10 py-32">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-20 animate-fade-in-up">
        <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6 hover:text-purple-300 transition-colors duration-500">
          Powerful Features
        </h2>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
          Everything you need to create, collaborate, and share your ideas with the world
        </p>
      </div>
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES_DATA.map((feature) => (
          <FeatureCard key={feature.title} {...feature} />
        ))}
      </div>
    </div>
  </section>
);