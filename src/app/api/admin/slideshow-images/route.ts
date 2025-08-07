import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const SLIDESHOW_DATA_FILE = path.join(process.cwd(), 'data', 'slideshow-images.json');

interface SlideshowImage {
  id: string;
  url: string;
  title?: string;
  description?: string;
}

interface SlideshowData {
  images: SlideshowImage[];
}

// Default slideshow images (current ones from the welcome page)
const DEFAULT_IMAGES: SlideshowImage[] = [
  {
    id: 'img-1',
    url: 'https://cdn.builder.io/api/v1/image/assets%2F0c47262c92b84a109dd6e67be1a5c00d%2F05e9f1234f914ffda9f9d733faad0708?format=webp&width=800',
    title: 'AI Trading Technology',
    description: 'Advanced AI-powered trading infrastructure'
  },
  {
    id: 'img-2',
    url: 'https://cdn.builder.io/api/v1/image/assets%2F0c47262c92b84a109dd6e67be1a5c00d%2F5324f6073a2d4094b1457cf686d328f2?format=webp&width=800',
    title: 'Crypto Market Analysis',
    description: 'Real-time market analysis and predictions'
  },
  {
    id: 'img-3',
    url: 'https://cdn.builder.io/api/v1/image/assets%2F0c47262c92b84a109dd6e67be1a5c00d%2F6c22b44704904e0ba0d6191447bdec8c?format=webp&width=800',
    title: 'AstralCore Platform',
    description: 'Quantum-powered trading platform'
  },
  {
    id: 'img-4',
    url: 'https://cdn.builder.io/api/v1/image/assets%2F0c47262c92b84a109dd6e67be1a5c00d%2F6d1a4dd2283f40d89c6b850cc9514c8a?format=webp&width=800',
    title: 'Financial Technology',
    description: 'Next-generation fintech solutions'
  },
  {
    id: 'img-5',
    url: 'https://cdn.builder.io/api/v1/image/assets%2F0c47262c92b84a109dd6e67be1a5c00d%2Fb025425b16784222b8e47d36daa2c246?format=webp&width=800',
    title: 'Digital Trading',
    description: 'Automated digital asset trading'
  },
  {
    id: 'img-6',
    url: 'https://cdn.builder.io/api/v1/image/assets%2F0c47262c92b84a109dd6e67be1a5c00d%2F5baea7d83ca640a9ac243f913e0205a9?format=webp&width=800',
    title: 'Neural Networks',
    description: 'Advanced neural network trading algorithms'
  },
  {
    id: 'img-7',
    url: 'https://cdn.builder.io/api/v1/image/assets%2F0c47262c92b84a109dd6e67be1a5c00d%2F597d9d3ba26a40f89b1800382daefc3d?format=webp&width=800',
    title: 'Quantum Computing',
    description: 'Quantum-enhanced market predictions'
  },
  {
    id: 'img-8',
    url: 'https://cdn.builder.io/api/v1/image/assets%2F0c47262c92b84a109dd6e67be1a5c00d%2F4fa3424979bd411bb5c1a9084ab40993?format=webp&width=800',
    title: 'Market Intelligence',
    description: 'AI-driven market intelligence platform'
  },
  {
    id: 'img-9',
    url: 'https://cdn.builder.io/api/v1/image/assets%2F0c47262c92b84a109dd6e67be1a5c00d%2Fd8e551f7fe5b42e5a8dd3bd330b0488e?format=webp&width=800',
    title: 'Trading Automation',
    description: 'Fully automated trading solutions'
  },
  {
    id: 'img-10',
    url: 'https://cdn.builder.io/api/v1/image/assets%2F0c47262c92b84a109dd6e67be1a5c00d%2F765b62449914476a881e909ed19a9aaa?format=webp&width=800',
    title: 'Financial Innovation',
    description: 'Revolutionary financial technology'
  }
];

async function ensureDataFile() {
  try {
    await fs.access(SLIDESHOW_DATA_FILE);
  } catch {
    // File doesn't exist, create it with default data
    const dataDir = path.dirname(SLIDESHOW_DATA_FILE);
    await fs.mkdir(dataDir, { recursive: true });
    await fs.writeFile(SLIDESHOW_DATA_FILE, JSON.stringify({ images: DEFAULT_IMAGES }, null, 2));
  }
}

async function readSlideshowData(): Promise<SlideshowData> {
  await ensureDataFile();
  try {
    const data = await fs.readFile(SLIDESHOW_DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch {
    return { images: DEFAULT_IMAGES };
  }
}

async function writeSlideshowData(data: SlideshowData): Promise<void> {
  await ensureDataFile();
  await fs.writeFile(SLIDESHOW_DATA_FILE, JSON.stringify(data, null, 2));
}

export async function GET() {
  try {
    const data = await readSlideshowData();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to load slideshow images' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { images } = body;

    if (!Array.isArray(images)) {
      return NextResponse.json(
        { error: 'Images must be an array' },
        { status: 400 }
      );
    }

    // Validate each image
    for (const image of images) {
      if (!image.id || !image.url) {
        return NextResponse.json(
          { error: 'Each image must have an id and url' },
          { status: 400 }
        );
      }
    }

    const data: SlideshowData = { images };
    await writeSlideshowData(data);

    return NextResponse.json({ success: true, images });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to update slideshow images' },
      { status: 500 }
    );
  }
}
