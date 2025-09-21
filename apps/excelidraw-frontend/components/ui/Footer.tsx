import { FC } from "react";
import { FiDownload, FiGithub, FiShare2 } from "react-icons/fi";

const FOOTER_LINKS: Record<string, string[]> = {
  Product: ["Features", "Pricing", "API", "Integrations"],
  Support: ["Help Center", "Documentation", "Contact", "Status"],
};
export const Footer: FC = () => (
  <footer className="relative z-10 border-t border-gray-800 bg-black/80 backdrop-blur-sm">
    <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
        <div className="col-span-1 md:col-span-2">
          <h3 className="text-2xl font-bold text-white mb-4 hover:text-purple-300 transition-colors duration-300">
            ValhallaBrush
          </h3>
          <p className="text-gray-400 max-w-md leading-relaxed">
            The ultimate collaborative drawing platform that brings teams
            together through the power of visual creativity and real-time
            collaboration.
          </p>
        </div>
        {Object.entries(FOOTER_LINKS).map(([title, links]) => (
          <div key={title}>
            <h4 className="text-lg font-semibold text-white mb-4">{title}</h4>
            <ul className="space-y-2">
              {links.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-purple-400 transition-colors duration-300 hover:translate-x-1 inline-block"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="flex flex-col items-center justify-between gap-6 sm:flex-row pt-8 border-t border-gray-800">
        <div className="text-sm text-gray-500">
          © 2025 ValhallaBrush. All rights reserved. Crafted with ❤️ by{" "}
          <a
            className="decoration-inherit underline"
            href="https://papun-mohapatra.vercel.app/"
          >
            Papun
          </a>{" "}
          for creators worldwide.
        </div>
        <div className="flex space-x-6">
          <a
            href="https://github.com"
            className="text-gray-500 hover:text-white hover:scale-125 transition-all duration-300 transform"
          >
            <FiGithub className="h-6 w-6" />
          </a>
          <a
            href="#"
            className="text-gray-500 hover:text-white hover:scale-125 transition-all duration-300 transform"
          >
            <FiDownload className="h-6 w-6" />
          </a>
          <a
            href="#"
            className="text-gray-500 hover:text-white hover:scale-125 transition-all duration-300 transform"
          >
            <FiShare2 className="h-6 w-6" />
          </a>
        </div>
      </div>
    </div>
  </footer>
);
