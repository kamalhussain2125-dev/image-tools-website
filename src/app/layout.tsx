export const metadata = {
  title: 'Image Tools Website',
  description: 'Unified umbrella app for image tools',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head />
      <body>
        {children}
      </body>
    </html>
  );
}