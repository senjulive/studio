import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const SLIDESHOW_DATA_FILE = path.join(process.cwd(), 'data', 'slideshow-images.json');

// Default slideshow images (fallback)
const DEFAULT_IMAGES = [
  'https://cdn.builder.io/api/v1/image/assets%2F0c47262c92b84a109dd6e67be1a5c00d%2F05e9f1234f914ffda9f9d733faad0708?format=webp&width=800',
  'https://cdn.builder.io/api/v1/image/assets%2F0c47262c92b84a109dd6e67be1a5c00d%2F5324f6073a2d4094b1457cf686d328f2?format=webp&width=800',
  'https://cdn.builder.io/api/v1/image/assets%2F0c47262c92b84a109dd6e67be1a5c00d%2F6c22b44704904e0ba0d6191447bdec8c?format=webp&width=800',
  'https://cdn.builder.io/api/v1/image/assets%2F0c47262c92b84a109dd6e67be1a5c00d%2F6d1a4dd2283f40d89c6b850cc9514c8a?format=webp&width=800',
  'https://cdn.builder.io/api/v1/image/assets%2F0c47262c92b84a109dd6e67be1a5c00d%2Fb025425b16784222b8e47d36daa2c246?format=webp&width=800',
  'https://cdn.builder.io/api/v1/image/assets%2F0c47262c92b84a109dd6e67be1a5c00d%2F5baea7d83ca640a9ac243f913e0205a9?format=webp&width=800',
  'https://cdn.builder.io/api/v1/image/assets%2F0c47262c92b84a109dd6e67be1a5c00d%2F597d9d3ba26a40f89b1800382daefc3d?format=webp&width=800',
  'https://cdn.builder.io/api/v1/image/assets%2F0c47262c92b84a109dd6e67be1a5c00d%2F4fa3424979bd411bb5c1a9084ab40993?format=webp&width=800',
  'https://cdn.builder.io/api/v1/image/assets%2F0c47262c92b84a109dd6e67be1a5c00d%2Fd8e551f7fe5b42e5a8dd3bd330b0488e?format=webp&width=800',
  'https://cdn.builder.io/api/v1/image/assets%2F0c47262c92b84a109dd6e67be1a5c00d%2F765b62449914476a881e909ed19a9aaa?format=webp&width=800'
];

export async function GET() {
  try {
    let images = DEFAULT_IMAGES;
    
    try {
      const data = await fs.readFile(SLIDESHOW_DATA_FILE, 'utf8');
      const parsedData = JSON.parse(data);
      if (parsedData.images && Array.isArray(parsedData.images)) {
        images = parsedData.images.map((img: any) => img.url);
      }
    } catch {
      // File doesn't exist or is invalid, use default images
    }

    return NextResponse.json({ images });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to load slideshow images' },
      { status: 500 }
    );
  }
}
