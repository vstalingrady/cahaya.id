import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'No Auth Layout',
  description: 'Layout without auth provider',
};

export default function NoAuthLayout({
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