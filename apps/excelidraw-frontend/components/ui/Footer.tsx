import { FC } from "react";
import { FiDownload, FiGithub, FiShare2 } from "react-icons/fi";

const FOOTER_LINKS: Record<string, string[]> = {
  Product: ["Features", "Pricing", "API", "Integrations"],
  Support: ["Help Center", "Documentation", "Contact", "Status"],
};

export const Footer: FC = () => (
  <footer className="relative bg-stone-50 border-t border-stone-200">
    <div className="container mx-auto px-6 py-16 lg:px-12 max-w-7xl">
      {/* Main footer content */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
        {/* Brand section */}
        <div className="col-span-1 md:col-span-5">
          <h3 className="text-2xl font-light text-stone-900 mb-4 tracking-tight">
            VALHALLA<span className="font-serif italic">BRUSH</span>
          </h3>
          <p className="text-stone-600 max-w-md leading-relaxed text-sm mb-6">
            The ultimate collaborative drawing platform that brings teams
            together through the power of visual creativity and real-time
            collaboration.
          </p>
          
          {/* Newsletter signup */}
          <div className="mt-8">
            <p className="text-xs uppercase tracking-wide text-stone-500 mb-3">
              Stay Updated
            </p>
            <div className="flex gap-2 max-w-sm">
              <input 
                type="email" 
                placeholder="Your email"
                className="flex-1 px-4 py-2 bg-white border border-stone-300 rounded-lg text-sm focus:outline-none focus:border-stone-400 transition-colors duration-200"
              />
              <button className="px-6 py-2 bg-stone-900 text-white rounded-lg text-sm font-medium hover:bg-stone-800 transition-colors duration-200">
                Subscribe
              </button>
            </div>
          </div>
        </div>
        
        {/* Links sections */}
        <div className="col-span-1 md:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-8">
          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-sm font-medium text-stone-900 mb-4 uppercase tracking-wide">
                {title}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-stone-600 hover:text-stone-900 transition-colors duration-200 text-sm"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          
          {/* Social links column */}
          <div>
            <h4 className="text-sm font-medium text-stone-900 mb-4 uppercase tracking-wide">
              Connect
            </h4>
            <div className="flex flex-col space-y-3">
              <a
                href="https://github.com"
                className="text-stone-600 hover:text-stone-900 transition-colors duration-200 flex items-center gap-2 text-sm"
              >
                <FiGithub className="h-4 w-4" />
                <span>GitHub</span>
              </a>
              <a
                href="#"
                className="text-stone-600 hover:text-stone-900 transition-colors duration-200 flex items-center gap-2 text-sm"
              >
                <FiShare2 className="h-4 w-4" />
                <span>Share</span>
              </a>
              <a
                href="#"
                className="text-stone-600 hover:text-stone-900 transition-colors duration-200 flex items-center gap-2 text-sm"
              >
                <FiDownload className="h-4 w-4" />
                <span>Download</span>
              </a>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-stone-200">
        <div className="text-xs text-stone-500 text-center sm:text-left">
          © 2025 ValhallaBrush. All rights reserved. Crafted by{" "}
          <a
            className="text-stone-700 hover:text-stone-900 transition-colors duration-200 underline decoration-stone-300"
            href="https://papun-mohapatra.vercel.app/"
          >
            Papun
          </a>
        </div>
        
        <div className="flex items-center gap-6 text-xs text-stone-500">
          <a href="#" className="hover:text-stone-700 transition-colors duration-200">
            Privacy Policy
          </a>
          <a href="#" className="hover:text-stone-700 transition-colors duration-200">
            Terms of Service
          </a>
          <a href="#" className="hover:text-stone-700 transition-colors duration-200">
            Cookies
          </a>
        </div>
      </div>
    </div>
  </footer>
);