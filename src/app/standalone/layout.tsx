import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Standalone Layout',
  description: 'Standalone layout without external dependencies',
};

export default function StandaloneLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
}