
import '../styles/globals.css';

export const metadata = {
  title: 'SOHOIMOB',
  description: 'SOHOIMOB — Dados que vendem!',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-sohoPurple text-white">{children}</body>
    </html>
  );
}
