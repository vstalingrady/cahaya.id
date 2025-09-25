const analyzer = require('@next/bundle-analyzer')({
  enabled: true,
});

const nextConfig = require('./next.config.ts');

module.exports = analyzer(nextConfig);