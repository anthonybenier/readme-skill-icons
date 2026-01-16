import { NextRequest, NextResponse } from 'next/server';
import * as simpleIcons from 'simple-icons';

// Type definition for a Simple Icon
interface SimpleIcon {
  title: string;
  slug: string;
  hex: string;
  path: string;
}

// Create a map for quick lookup: slug -> Icon
// Filter out non-icon exports if any (though simple-icons usually just exports icons)
const slugToIcon = new Map<string, SimpleIcon>();

Object.values(simpleIcons as Record<string, SimpleIcon>).forEach((icon) => {
  if (icon && icon.slug) {
    slugToIcon.set(icon.slug, icon);
  }
});

export function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const iconsParam = searchParams.get('i') || '';

  if (!iconsParam) {
    return new NextResponse('Missing "i" parameter', { status: 400 });
  }

  const requestedSlugs = iconsParam.split(',');
  const icons: SimpleIcon[] = [];

  for (const slug of requestedSlugs) {
    const trimmedSlug = slug.trim().toLowerCase();
    const icon = slugToIcon.get(trimmedSlug);
    if (icon) {
      icons.push(icon);
    }
  }

  if (icons.length === 0) {
    return new NextResponse('No valid icons found', { status: 404 });
  }

  // Parameters
  const theme = searchParams.get('t') === 'light' ? 'light' : 'dark';
  const perLine = parseInt(searchParams.get('perline') || '15', 10); // Default 15 to allow reasonably long lines
  const size = parseInt(searchParams.get('size') || '48', 10);

  // Validation constraints
  const safePerLine = Math.max(1, Math.min(perLine, 50));
  const safeSize = Math.max(16, Math.min(size, 128));

  // SVG Generation Constants
  const iconPadding = safeSize * 0.25; // Proportional padding
  const gap = safeSize * 0.2; // Proportional gap

  // Calculate Dimensions
  const numIcons = icons.length;
  const numRows = Math.ceil(numIcons / safePerLine);

  // Width is based on the max items in a row (could be less than perLine if total < perLine)
  const actualPerLine = Math.min(numIcons, safePerLine);
  const width = actualPerLine * safeSize + (actualPerLine - 1) * gap;
  const height = numRows * safeSize + (numRows - 1) * gap;

  const svgContent = icons.map((icon, index) => {
    const col = index % safePerLine;
    const row = Math.floor(index / safePerLine);

    const x = col * (safeSize + gap);
    const y = row * (safeSize + gap);

    // Theme Logic
    // Dark: Hex Background, White Icon
    // Light: White Background, Hex Icon
    const rectFill = theme === 'light' ? 'white' : `#${icon.hex}`;
    const pathFill = theme === 'light' ? `#${icon.hex}` : 'white';

    return `
      <g transform="translate(${x}, ${y})">
        <rect width="${safeSize}" height="${safeSize}" rx="${safeSize * 0.2}" fill="${rectFill}" />
        <path d="${icon.path}" fill="${pathFill}" transform="translate(${iconPadding}, ${iconPadding}) scale(${(safeSize - iconPadding * 2) / 24})" />
      </g>
    `;
  }).join('');

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      ${svgContent}
    </svg>
  `;

  return new NextResponse(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=86400, mutable',
    },
  });
}
