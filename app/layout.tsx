
import '../styles/globals.css';

export const metadata = {
  title: 'SOHOIMOB',
  description: 'SOHOIMOB — Dados que vendem!',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
