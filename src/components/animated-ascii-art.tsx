'use client';

import { useEffect, useState, useMemo } from 'react';

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

// Map service names by length
const servicesByLength = {
  3: ['BCA', 'BNI', 'OVO'],
  4: ['GOPAY', 'BIBIT'],
  5: ['PINTU'],
  7: ['MANDIRI', 'KREDIVO']
};

const AnimatedAsciiArt = () => {
  const [originalLines, setOriginalLines] = useState<string[]>([]);
  const [currentLines, setCurrentLines] = useState<string[]>([]);
  const [replacements, setReplacements] = useState<Array<{lineIndex: number, startIndex: number, length: number, currentService: string, delay: number}>>([]);

  useEffect(() => {
    fetch('/indonesia_archipelago_negative.txt')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch ASCII art file');
        }
        return response.text();
      })
      .then(text => {
        const lines = text.split('\n');
        setOriginalLines(lines);
        setCurrentLines(lines);

        // Find all "/" sequences and create replacement schedule
        const foundReplacements: Array<{lineIndex: number, startIndex: number, length: number, currentService: string, delay: number}> = [];

        // Track used services per line to avoid duplicates
        const usedServicesPerLine: { [lineIndex: number]: Set<string> } = {};

        lines.forEach((line, lineIndex) => {
          if (!usedServicesPerLine[lineIndex]) {
            usedServicesPerLine[lineIndex] = new Set();
          }

          let index = 0;
          while (index < line.length) {
            if (line[index] === '/') {
              // Count consecutive slashes
              let slashCount = 0;
              let tempIndex = index;
              while (tempIndex < line.length && line[tempIndex] === '/') {
                slashCount++;
                tempIndex++;
              }

              // Handle long sequences by breaking them into smaller chunks with balanced randomization
              let remainingSlashes = slashCount;
              let currentStart = index;

              while (remainingSlashes > 0) {
                // Get all possible service lengths that fit the remaining slashes
                const possibleLengths = [7, 5, 4, 3].filter(len =>
                  remainingSlashes >= len && servicesByLength[len as keyof typeof servicesByLength]
                );

                if (possibleLengths.length === 0) break;

                // Randomly select from possible lengths (not just the longest)
                const randomLengthIndex = Math.floor(Math.random() * possibleLengths.length);
                const serviceLength = possibleLengths[randomLengthIndex];

                const services = servicesByLength[serviceLength as keyof typeof servicesByLength];

                // Find an available service that hasn't been used in this line yet
                let availableServices = services.filter(service => !usedServicesPerLine[lineIndex].has(service));

                // If all services are used, reset and allow duplicates (fallback)
                if (availableServices.length === 0) {
                  availableServices = services;
                  usedServicesPerLine[lineIndex].clear();
                }

                const randomService = availableServices[Math.floor(Math.random() * availableServices.length)];
                usedServicesPerLine[lineIndex].add(randomService);

                foundReplacements.push({
                  lineIndex,
                  startIndex: currentStart,
                  length: serviceLength,
                  currentService: randomService,
                  delay: Math.random() * 200 + 50 // Random delay between 50-250ms for rapid animation
                });

                currentStart += serviceLength;
                remainingSlashes -= serviceLength;
              }

              index = tempIndex;
            } else {
              index++;
            }
          }
        });

        setReplacements(foundReplacements);
      })
      .catch(error => {
        console.warn('Could not load ASCII art:', error);
        setOriginalLines([]);
        setCurrentLines([]);
      });
  }, []);

  // Function to cycle service names
  const cycleServiceName = (currentService: string, length: number) => {
    const services = servicesByLength[length as keyof typeof servicesByLength];
    if (!services) return currentService;

    const currentIndex = services.indexOf(currentService);
    const nextIndex = (currentIndex + 1) % services.length;
    return services[nextIndex];
  };

  // Function to rebuild a line from original with current replacements
  const rebuildLine = (originalLine: string, lineReplacements: typeof replacements) => {
    let result = originalLine;

    // Sort replacements by startIndex in reverse order to avoid position shifting
    const sortedReplacements = [...lineReplacements].sort((a, b) => b.startIndex - a.startIndex);

    sortedReplacements.forEach(replacement => {
      if (replacement.startIndex + replacement.length <= result.length) {
        const before = result.substring(0, replacement.startIndex);
        const after = result.substring(replacement.startIndex + replacement.length);
        result = before + replacement.currentService + after;
      }
    });

    return result;
  };

  // Animate replacements and cycling with optimized performance
  useEffect(() => {
    if (replacements.length === 0) return;

    const timeouts: NodeJS.Timeout[] = [];
    let cycleInterval: NodeJS.Timeout | null = null;

    // Group replacements by line to batch updates
    const replacementsByLine: { [lineIndex: number]: typeof replacements } = {};
    replacements.forEach(replacement => {
      if (!replacementsByLine[replacement.lineIndex]) {
        replacementsByLine[replacement.lineIndex] = [];
      }
      replacementsByLine[replacement.lineIndex].push(replacement);
    });

    // Initial replacements with batched updates
    Object.values(replacementsByLine).forEach(lineReplacements => {
      // Stagger line updates to reduce simultaneous operations
      const lineDelay = Math.random() * 200; // Reduced from 300ms

      const timeout = setTimeout(() => {
        setCurrentLines(prevLines => {
          const newLines = [...prevLines];
          // Rebuild the line from scratch using the original and replacements
          lineReplacements.forEach(replacement => {
            const originalLine = originalLines[replacement.lineIndex];
            if (originalLine) {
              newLines[replacement.lineIndex] = rebuildLine(originalLine, lineReplacements);
            }
          });
          return newLines;
        });
      }, lineDelay);

      timeouts.push(timeout);
    });

    // Procedural cycling - change 5% of replacements every 50ms for smooth animation
    cycleInterval = setInterval(() => {
      setReplacements(prevReplacements => {
        if (prevReplacements.length === 0) return prevReplacements;

        // Select 40% of replacements to change (minimum 1) - highly visible changes
        const numToChange = Math.max(1, Math.floor(prevReplacements.length * 0.40));
        const indicesToChange = new Set<number>();

        // Randomly select indices to change
        while (indicesToChange.size < numToChange) {
          indicesToChange.add(Math.floor(Math.random() * prevReplacements.length));
        }

        // Create new replacements with only selected ones cycled
        const newReplacements = prevReplacements.map((replacement, index) => {
          if (indicesToChange.has(index)) {
            return {
              ...replacement,
              currentService: cycleServiceName(replacement.currentService, replacement.length)
            };
          }
          return replacement;
        });

        // Rebuild all lines from scratch using the original lines and new replacements
        const newLines = originalLines.map((originalLine, lineIndex) => {
          const lineReplacements = newReplacements.filter(r => r.lineIndex === lineIndex);
          return rebuildLine(originalLine, lineReplacements);
        });

        setCurrentLines(newLines);
        return newReplacements;
      });
    }, 150); // Update every 150ms for better performance

    return () => {
      timeouts.forEach(clearTimeout);
      if (cycleInterval) clearInterval(cycleInterval);
    };
  }, [replacements]);

  // If lines failed to load or are empty, render nothing
  if (currentLines.length === 0) {
    return null;
  }

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      <div
        className="font-mono text-purple-500/50 leading-none select-none flex flex-col items-center justify-center h-full text-sm"
        style={{
          letterSpacing: '0.15em',
          fontSize: '0.8rem',
          opacity: 0.5,
        }}
      >
        {currentLines.map((line, index) => (
          <div key={index} className="whitespace-pre">
            {line}
          </div>
        ))}
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none"></div>

      {/* Contact Information */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center">
        <div className="font-mono text-xs text-purple-400/60 opacity-70">
          <div>+62 81585034712</div>
          <div>hi@caharaya.com</div>
        </div>
      </div>
    </div>
  );
};

export default AnimatedAsciiArt;