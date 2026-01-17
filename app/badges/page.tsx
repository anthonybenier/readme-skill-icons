import * as simpleIcons from 'simple-icons';
import BadgeBuilder from '../components/BadgeBuilder';

interface SimpleIcon {
    title: string;
    slug: string;
    hex: string;
    path: string;
}

export default function BadgesPage() {
    // Extract minimal data needed for the client
    const allIcons = Object.values(simpleIcons as Record<string, SimpleIcon>).map((icon) => ({
        title: icon.title,
        slug: icon.slug,
        hex: icon.hex,
        path: icon.path,
    }));

    return (
        <main className="selection:bg-blue-500/30">
            <BadgeBuilder allIcons={allIcons} />
        </main>
    );
}
