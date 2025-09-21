import { FC } from "react";
import { IconType } from "react-icons";
import { FiClock, FiShield, FiZap } from "react-icons/fi";
interface WhyChooseItem {
  icon: IconType;
  title: string;
  desc: string;
}
const WHY_CHOOSE_DATA: WhyChooseItem[] = [
  { icon: FiZap, title: "Lightning Fast", desc: "Optimized for performance with 60fps drawing and instant collaboration" },
  { icon: FiShield, title: "Secure & Private", desc: "End-to-end encryption keeps your creative work safe and confidential" },
  { icon: FiClock, title: "Version History", desc: "Never lose your progress with automatic saves and complete version control" }
];

export const AdditionalInfoSection: FC = () => (
  <section className="relative z-10 py-24 bg-gray-900/30">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="animate-fade-in-left">
          <h3 className="text-4xl font-bold text-white mb-6 hover:text-purple-300 transition-colors duration-500">
            Why Choose ValhallaBrush?
          </h3>
          <div className="space-y-6">
            {WHY_CHOOSE_DATA.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="flex items-start gap-4 group hover:bg-gray-800/30 p-4 rounded-xl transition-all duration-300">
                  <div className="p-3 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl group-hover:scale-110 transition-transform duration-300">
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-white group-hover:text-purple-300 transition-colors duration-300">{item.title}</h4>
                    <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="animate-fade-in-right">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-3xl blur-xl opacity-30 animate-pulse"></div>
            <div className="relative bg-gray-900 border border-gray-700 rounded-3xl p-8 hover:border-purple-500/50 transition-all duration-500">
              <h4 className="text-2xl font-bold text-white mb-4">Trusted by Teams Worldwide</h4>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="p-4 bg-gray-800 rounded-xl hover:bg-gray-700 transition-colors duration-300">
                  <div className="text-2xl font-bold text-purple-400">150+</div>
                  <div className="text-gray-400">Countries</div>
                </div>
                <div className="p-4 bg-gray-800 rounded-xl hover:bg-gray-700 transition-colors duration-300">
                  <div className="text-2xl font-bold text-blue-400">24/7</div>
                  <div className="text-gray-400">Support</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);