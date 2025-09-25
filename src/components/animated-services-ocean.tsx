'use client';

import { useEffect, useState } from 'react';

const supportedServices = [
  'BCA',
  'MANDIRI',
  'BNI',
  'GOPAY',
  'OVO',
  'BIBIT',
  'PINTU',
  'KREDIVO'
];

const AnimatedServicesOcean = () => {
  const [services, setServices] = useState<string[]>([]);

  useEffect(() => {
    // Create multiple instances of each service for continuous flow
    const allServices = [];
    for (let i = 0; i < 50; i++) {
      allServices.push(...supportedServices);
    }
    setServices(allServices);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Multiple layers for depth */}
      <div className="absolute inset-0 opacity-30">
        <div className="animate-scroll-slow whitespace-nowrap">
          {services.map((service, index) => (
            <span
              key={`layer1-${index}`}
              className="inline-block mx-8 text-lg font-mono text-blue-400/60 animate-pulse"
              style={{
                animationDelay: `${index * 0.1}s`,
                fontSize: `${Math.random() * 0.5 + 0.8}rem`
              }}
            >
              {service}
            </span>
          ))}
        </div>
      </div>

      <div className="absolute inset-0 opacity-40">
        <div className="animate-scroll-medium whitespace-nowrap" style={{ animationDelay: '-2s' }}>
          {services.map((service, index) => (
            <span
              key={`layer2-${index}`}
              className="inline-block mx-6 text-xl font-mono text-cyan-300/50"
              style={{
                animationDelay: `${index * 0.15}s`,
                fontSize: `${Math.random() * 0.8 + 1.2}rem`
              }}
            >
              {service}
            </span>
          ))}
        </div>
      </div>

      <div className="absolute inset-0 opacity-50">
        <div className="animate-scroll-fast whitespace-nowrap" style={{ animationDelay: '-4s' }}>
          {services.map((service, index) => (
            <span
              key={`layer3-${index}`}
              className="inline-block mx-4 text-2xl font-mono text-teal-200/40 font-bold"
              style={{
                animationDelay: `${index * 0.2}s`,
                fontSize: `${Math.random() * 1.0 + 1.5}rem`
              }}
            >
              {service}
            </span>
          ))}
        </div>
      </div>

      {/* Floating bubbles effect */}
      <div className="absolute inset-0">
        {services.slice(0, 20).map((service, index) => (
          <div
            key={`bubble-${index}`}
            className="absolute animate-float text-xs font-mono text-blue-300/20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${Math.random() * 5 + 5}s`
            }}
          >
            {service}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnimatedServicesOcean;