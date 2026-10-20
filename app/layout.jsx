import './globals.css';

export const metadata = {
  title: 'Mitgründen statt mitlaufen. | Vouchly by EZHost',
  description: 'Fiktive Product-&-Support-Mitgründerrolle bei Vouchly by EZHost. Ein modernes, humorvolles Recruiting-Konzept.',
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }) {
  return <html lang="de"><body>{children}</body></html>;
}
