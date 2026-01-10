import { NextRequest, NextResponse } from 'next/server';
import { uploadToCloudinary } from '@/lib/cloudinary';

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const folder = formData.get('folder') as string || 'giftora/uploads';
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json(
                { error: 'No file provided' },
                { status: 400 }
            );
        }

        // Convert file to buffer
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        console.log('File size:', file.size, 'Buffer size:', buffer.length);

        if (buffer.length === 0) {
            return NextResponse.json(
                { error: 'Empty file provided' },
                { status: 400 }
            );
        }

        // Upload to Cloudinary
        const result = await uploadToCloudinary(buffer, {
            folder: folder,
        });

        return NextResponse.json({
            success: true,
            url: result.url,
            publicId: result.publicId,
        });
    } catch (error: any) {
        console.error('Upload error:', error);
        return NextResponse.json(
            { error: 'Failed to upload file', details: error.message || JSON.stringify(error) },
            { status: 500 }
        );
    }
}
