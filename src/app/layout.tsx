import './globals.css';

export const metadata = {
  title: 'Image Tools Website',
  description: 'Unified umbrella app for image tools',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="light">
      <head />
      <body className="min-h-screen bg-base-200">
        {children}
      </body>
    </html>
  );
}