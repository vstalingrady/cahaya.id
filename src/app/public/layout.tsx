import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Public Layout',
  description: 'Public layout without auth provider',
};

export default function PublicLayout({
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