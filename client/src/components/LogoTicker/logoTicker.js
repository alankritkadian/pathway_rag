import React from 'react';
import { motion } from 'framer-motion';
import acmeLogo from '../../assests/images/acme.png';

const images = [
  { src: acmeLogo, alt: 'Acme Logo' },
  { src: acmeLogo, alt: 'Acme Logo' },
  { src: acmeLogo, alt: 'Acme Logo' },
  { src: acmeLogo, alt: 'Acme Logo' },
  { src: acmeLogo, alt: 'Acme Logo' },
];

export const LogoTicker = () => {
  return (
    <div className="bg-white text-black py-[72px] sm:py-24 mx-auto">
      <div className="container">
      <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0 text-center text-gray-600">
      Technologies
      </h2>
        <div className="flex overflow-hidden mt-9 relative">
          {/* Gradient overlay */}
          <div className="absolute inset-y-0 left-0 w-5 bg-gradient-to-r from-gray-500 to-transparent z-10"></div>
          <div className="absolute inset-y-0 right-0 w-5 bg-gradient-to-l from-gray-500 to-transparent z-10"></div>

          {/* Scrolling animation */}
          <motion.div
            transition={{ duration: 20, ease: 'linear', repeat: Infinity }}
            initial={{ translateX: 0 }}
            animate={{ translateX: '-50%' }}
            className="flex gap-16 sm:flex-none pr-16"
          >
            {images.map(({ src, alt }) => (
              <img
                src={src}
                alt={alt}
                key={`${alt}-1`}
                className="flex-none h-8 w-auto"
              />
            ))}
            {images.map(({ src, alt }) => (
              <img
                src={src}
                alt={alt}
                key={`${alt}-2`}
                className="flex-none h-8 w-auto"
              />
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};
