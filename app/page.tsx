import * as simpleIcons from 'simple-icons';
import IconBuilder from './components/IconBuilder';

interface SimpleIcon {
  title: string;
  slug: string;
  hex: string;
  path: string;
}

export default function Home() {
  // Extract minimal data needed for the client
  const allIcons = Object.values(simpleIcons as Record<string, SimpleIcon>).map((icon) => ({
    title: icon.title,
    slug: icon.slug,
    hex: icon.hex,
    path: icon.path,
  }));

  return (
    <main className="min-h-screen py-12 px-4 selection:bg-blue-500/30">
      <IconBuilder allIcons={allIcons} />
    </main>
  );
}
