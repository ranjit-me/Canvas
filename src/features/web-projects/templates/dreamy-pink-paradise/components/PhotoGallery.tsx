import { motion } from 'framer-motion';
import { ImageWithFallback } from './figma/ImageWithFallback';

const photos = [
    {
        url: 'https://images.unsplash.com/photo-1514846528774-8de9d4a07023?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb21hbnRpYyUyMGNvdXBsZSUyMGxvdmV8ZW58MXx8fHwxNzY1NzYyNDk3fDA&ixlib=rb-4.1.0&q=80&w=1080',
        alt: 'Romantic moment',
    },
    {
        url: 'https://images.unsplash.com/photo-1658851866325-49fb8b7fbcb2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb21hbnRpYyUyMHN1bnNldCUyMGNvdXBsZXxlbnwxfHx8fDE3NjU3MDEwMjB8MA&ixlib=rb-4.1.0&q=80&w=1080',
        alt: 'Beautiful sunset together',
    },
    {
        url: 'https://images.unsplash.com/photo-1673266968729-48a2c829105f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYXBweSUyMGNvdXBsZSUyMHNtaWxpbmd8ZW58MXx8fHwxNzY1ODA0ODM5fDA&ixlib=rb-4.1.0&q=80&w=1080',
        alt: 'Happy moments',
    },
    {
        url: 'https://images.unsplash.com/photo-1696613755401-dac200797436?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaW5rJTIwcm9zZXMlMjBmbG93ZXJzfGVufDF8fHx8MTc2NTgwNDgzOHww&ixlib=rb-4.1.0&q=80&w=1080',
        alt: 'Flowers for you',
    },
    {
        url: 'https://images.unsplash.com/photo-1694503522904-50163a3e7141?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsb3ZlJTIwaGVhcnQlMjBib2tlaHxlbnwxfHx8fDE3NjU2OTA5Nzd8MA&ixlib=rb-4.1.0&q=80&w=1080',
        alt: 'Love and light',
    },
    {
        url: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiaXJ0aGRheSUyMGNlbGVicmF0aW9ufGVufDF8fHx8MTc2NTc3Mzk0M3ww&ixlib=rb-4.1.0&q=80&w=1080',
        alt: 'Celebration',
    },
];

export function PhotoGallery() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {photos.map((photo, index) => (
                <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8, y: 50 }}
                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{
                        delay: index * 0.15,
                        duration: 0.6,
                        type: "spring"
                    }}
                    whileHover={{ scale: 1.05, rotate: Math.random() * 4 - 2 }}
                    className="relative group"
                >
                    <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                        {/* Glowing heart frame */}
                        <div className="absolute inset-0 bg-gradient-to-br from-pink-400 via-rose-400 to-red-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl -z-10" />

                        {/* Photo frame with heart border */}
                        <div className="relative p-2 bg-gradient-to-br from-pink-300 via-rose-300 to-purple-300 rounded-2xl">
                            <div className="relative overflow-hidden rounded-xl aspect-square">
                                <ImageWithFallback
                                    src={photo.url}
                                    alt={photo.alt}
                                    className="w-full h-full object-cover"
                                />

                                {/* Overlay gradient on hover */}
                                <div className="absolute inset-0 bg-gradient-to-t from-pink-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </div>
                        </div>

                        {/* Heart decorations in corners */}
                        <div className="absolute top-4 right-4 text-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            💖
                        </div>
                        <div className="absolute bottom-4 left-4 text-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            💕
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    );
}
