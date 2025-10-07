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
  <section className="relative py-24 bg-gradient-to-b from-white to-stone-50">
    <div className="container mx-auto px-6 lg:px-12 max-w-7xl">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        {/* Left Content */}
        <div>
          <div className="flex items-center gap-3 text-sm text-stone-600 tracking-wide mb-6">
            <div className="w-8 h-px bg-stone-400"></div>
            <span className="uppercase">Why Choose Us</span>
          </div>
          
          <h3 className="text-4xl lg:text-5xl font-light text-stone-900 mb-12 leading-tight">
            We can combine<br />
            <span className="font-serif italic">nature & home</span><br />
            comfort
          </h3>
          
          <div className="space-y-8">
            {WHY_CHOOSE_DATA.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="flex items-start gap-5 group">
                  <div className="flex-shrink-0 p-3 bg-stone-900 rounded-xl group-hover:bg-stone-800 transition-all duration-300 transform group-hover:scale-105">
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-stone-900 mb-2 group-hover:text-stone-700 transition-colors duration-300">
                      {item.title}
                    </h4>
                    <p className="text-stone-600 leading-relaxed text-sm">
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-12">
            <button className="inline-flex items-center gap-2 text-stone-900 font-medium hover:gap-4 transition-all duration-300 border-b-2 border-stone-900 pb-1">
              <span className="uppercase tracking-wide text-sm">Learn More</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Right Content - Stats Card */}
        <div className="relative">
          {/* Background image placeholder */}
          <div className="relative bg-stone-200 rounded-3xl overflow-hidden aspect-[4/5] shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-stone-300 to-stone-400"></div>
            
            {/* Overlay pattern */}
            <div className="absolute inset-0 opacity-10" 
                 style={{
                   backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                   backgroundSize: '30px 30px'
                 }}>
            </div>

            {/* Floating stats card */}
            <div className="absolute bottom-8 left-8 right-8 bg-white rounded-2xl p-6 shadow-2xl">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex -space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-stone-400 to-stone-600 rounded-full border-2 border-white"></div>
                  <div className="w-10 h-10 bg-gradient-to-br from-stone-500 to-stone-700 rounded-full border-2 border-white"></div>
                </div>
                <div>
                  <div className="text-2xl font-light text-stone-900">12m+</div>
                  <div className="text-xs text-stone-600 tracking-wide">Customers</div>
                </div>
              </div>
              
              <div className="h-px bg-stone-200 my-4"></div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xl font-light text-stone-900">150+</div>
                  <div className="text-xs text-stone-600">Countries</div>
                </div>
                <div>
                  <div className="text-xl font-light text-stone-900">24/7</div>
                  <div className="text-xs text-stone-600">Support</div>
                </div>
              </div>
            </div>
          </div>

          {/* Decorative element */}
          <div className="absolute -z-10 top-8 -right-8 w-32 h-32 bg-stone-300/30 rounded-full filter blur-2xl"></div>
        </div>
      </div>
    </div>
  </section>
);