import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
console.log('Cloudinary Config:', {
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY ? 'present' : 'missing',
    api_secret: process.env.CLOUDINARY_API_SECRET ? 'present' : 'missing',
});

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
    // Ensure config is set
    cloudinary.config({
        cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    try {
        if (Buffer.isBuffer(file)) {
            return new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    {
                        folder: options?.folder || 'giftora',
                        public_id: options?.public_id,
                        transformation: options?.transformation,
                        resource_type: 'auto',
                    },
                    (error, result) => {
                        if (error) return reject(error);
                        if (!result) return reject(new Error('Upload failed with no result'));
                        resolve({
                            url: result.secure_url,
                            publicId: result.public_id,
                        });
                    }
                );
                uploadStream.end(file);
            });
        }

        const uploadResult = await cloudinary.uploader.upload(file as string, {
            folder: options?.folder || 'giftora',
            public_id: options?.public_id,
            transformation: options?.transformation,
            resource_type: 'auto',
        });

        return {
            url: uploadResult.secure_url,
            publicId: uploadResult.public_id,
        };
    } catch (error: any) {
        console.error('Cloudinary upload error full:', error);
        const errorMessage = error.message || (error.error && error.error.message) || 'Unknown Cloudinary error';
        throw new Error(`Cloudinary upload error: ${errorMessage}`);
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
