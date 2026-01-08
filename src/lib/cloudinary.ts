import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;

// Helper function to upload image from buffer or base64
export async function uploadToCloudinary(
    file: string | Buffer,
    options?: {
        folder?: string;
        public_id?: string;
        transformation?: any;
    }
): Promise<{ url: string; publicId: string }> {
    try {
        const uploadResult = await cloudinary.uploader.upload(file as string, {
            folder: options?.folder || 'giftora',
            public_id: options?.public_id,
            transformation: options?.transformation,
        });

        return {
            url: uploadResult.secure_url,
            publicId: uploadResult.public_id,
        };
    } catch (error) {
        console.error('Cloudinary upload error:', error);
        throw new Error('Failed to upload image to Cloudinary');
    }
}

// Helper function to delete image
export async function deleteFromCloudinary(publicId: string): Promise<void> {
    try {
        await cloudinary.uploader.destroy(publicId);
    } catch (error) {
        console.error('Cloudinary delete error:', error);
        throw new Error('Failed to delete image from Cloudinary');
    }
}
