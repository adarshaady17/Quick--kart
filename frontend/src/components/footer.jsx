import React from "react";
import { NavLink } from "react-router-dom";
import { assets, footerLinks } from "../assets/assets";

const Footer = () => {
  return (
    <div className="px-4 sm:px-6 md:px-16 lg:px-24 xl:px-32 mt-16 sm:mt-24">
      <hr />
      <div className="flex flex-col md:flex-row items-start justify-between gap-8 sm:gap-10 py-8 sm:py-10 border-b border-gray-500/30 text-gray-500">
        <div className="w-full md:w-auto">
          <div className="flex items-center gap-3 sm:gap-8">
            <NavLink to="/">
              <img
                className="h-8 sm:h-9"
                src={assets.logo}
                alt="Quick-Kart Logo"
              />
            </NavLink>
          </div>
          <p className="max-w-[500px] mt-4 sm:mt-6 text-sm sm:text-base">
            We deliver fresh groceries and snacks straight to your door. Trusted
            by thousands, we aim to make your shopping experience simple and
            affordable.
          </p>
        </div>
        <div className="hidden sm:grid sm:grid-cols-3 gap-6 w-full md:w-[55%]">
          {footerLinks.map((section, index) => (
            <div key={index}>
              <h3 className="font-semibold text-sm sm:text-base text-gray-900 mb-2 sm:mb-4">
                {section.title}
              </h3>
              <ul className="text-sm space-y-1">
                {section.links.map((link, i) => (
                  <li key={i}>
                    <a
                      href={link.url}
                      className="hover:underline transition break-words"
                    >
                      {link.text}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="py-4 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} Quick-Kart. All rights reserved.
      </div>
    </div>
  );
};

export default Footer;
