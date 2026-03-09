import { FC } from "react";
import { FiDownload, FiGithub, FiTwitter, FiShare2 } from "react-icons/fi";
import Link from "next/link";

const FOOTER_LINKS: Record<string, string[]> = {
  Product: ["Features", "Security", "Enterprise", "Pricing"],
  Resources: ["Documentation", "API Reference", "Blog", "Community"],
  Company: ["About Us", "Careers", "Contact", "Partners"],
};

export const Footer: FC = () => (
  <footer className="relative bg-[#050505] border-t border-white/5 pt-24 pb-12 overflow-hidden">
    {/* Subtle top glow */}
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />
    
    <div className="container mx-auto px-6 lg:px-12 max-w-7xl relative z-10">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-8 mb-20">
        
        {/* Brand & Newsletter */}
        <div className="col-span-1 md:col-span-5 pr-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-violet-500/25">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
            </div>
            <span className="text-white font-bold text-xl tracking-tight">Valhalla<span className="text-violet-400">Brush</span></span>
          </Link>
          
          <p className="text-white/40 text-sm leading-relaxed mb-8 max-w-sm">
            A premium collaborative drawing platform built for modern teams. Draw, think, and build together in real-time.
          </p>
          
          <div className="space-y-3">
            <p className="text-xs uppercase font-semibold tracking-widest text-white/50">Subscribe to updates</p>
            <div className="flex gap-2 max-w-[320px]">
              <input 
                type="email" 
                placeholder="developer@example.com"
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500/50 focus:bg-white/10 transition-all placeholder:text-white/20"
              />
              <button className="bg-white text-black px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-white/10 hover:bg-white/90 transition-all hover:scale-105">
                Join
              </button>
            </div>
          </div>
        </div>
        
        {/* Links Map */}
        <div className="col-span-1 md:col-span-7 grid grid-cols-2 md:grid-cols-4 gap-8">
          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-white font-semibold mb-6 tracking-wide text-sm">{title}</h4>
              <ul className="space-y-4">
                {links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-white/40 hover:text-white transition-colors duration-300 text-sm">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          
          {/* Socials */}
          <div>
            <h4 className="text-white font-semibold mb-6 tracking-wide text-sm">Social</h4>
            <div className="flex flex-col space-y-4">
              <a href="https://github.com" className="text-white/40 hover:text-white transition-colors duration-300 flex items-center gap-3 text-sm group">
                <FiGithub className="w-4 h-4 group-hover:text-violet-400 transition-colors" /> GitHub
              </a>
              <a href="#" className="text-white/40 hover:text-white transition-colors duration-300 flex items-center gap-3 text-sm group">
                <FiTwitter className="w-4 h-4 group-hover:text-cyan-400 transition-colors" /> Twitter
              </a>
              <a href="#" className="text-white/40 hover:text-white transition-colors duration-300 flex items-center gap-3 text-sm group">
                <FiShare2 className="w-4 h-4 group-hover:text-indigo-400 transition-colors" /> LinkedIn
              </a>
              <a href="#" className="text-white/40 hover:text-white transition-colors duration-300 flex items-center gap-3 text-sm group">
                <FiDownload className="w-4 h-4 group-hover:text-amber-400 transition-colors" /> Download App
              </a>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom Bar */}
      <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-white/30 text-xs text-center md:text-left">
          © {new Date().getFullYear()} Valhalla Brush. Crafted by{" "}
          <a href="https://papun-mohapatra.vercel.app/" target="_blank" rel="noreferrer" className="text-white/60 hover:text-white transition-colors border-b border-white/20 pb-0.5">
            Papun
          </a>
        </div>
        
        <div className="flex items-center gap-8 text-xs text-white/30">
          <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-white transition-colors">Security</a>
        </div>
      </div>
    </div>
  </footer>
);