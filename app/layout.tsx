
import '../styles/globals.css';

export const metadata = {
  title: 'SOHOIMOB',
  description: 'Plataforma de inteligência imobiliária',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
