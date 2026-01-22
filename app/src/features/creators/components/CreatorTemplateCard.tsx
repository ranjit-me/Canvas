import { motion } from "framer-motion";
import { Eye, Edit3, Star, DollarSign, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface Template {
    id: string;
    name: string;
    thumbnail?: string | null;
    status?: string | null;
    price?: number | null;
    isFree?: boolean | null;
    averageRating?: number;
    totalReviews?: number;
    sales?: number;
    earnings?: number;
    type: "html" | "web";
    slug?: string | null;
}

interface CreatorTemplateCardProps {
    template: Template;
    index: number;
}

export const CreatorTemplateCard = ({ template, index }: CreatorTemplateCardProps) => {
    const statusColors: Record<string, string> = {
        draft: "bg-gray-100 text-gray-600",
        pending: "bg-yellow-100 text-yellow-700",
        approved: "bg-green-100 text-green-700",
        rejected: "bg-red-100 text-red-700",
    };

    const StatusIcon = {
        draft: Clock,
        pending: AlertCircle,
        approved: CheckCircle,
        rejected: XCircle,
    }[template.status || "draft"] || Clock;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            className="group bg-white rounded-3xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300"
        >
            {/* Preview Section */}
            <div className="relative aspect-[4/3] bg-gray-50 overflow-hidden">
                {template.thumbnail ? (
                    <Image
                        src={template.thumbnail}
                        alt={template.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300 bg-gray-50">
                        <Eye className="w-12 h-12" />
                    </div>
                )}

                {/* Overlay with Actions */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                    <Link
                        href={`/creator/preview/${template.id}`}
                        className="p-3 bg-white rounded-full hover:scale-110 transition-transform text-gray-900"
                        title="Preview"
                    >
                        <Eye className="w-5 h-5" />
                    </Link>
                    <Link
                        href={`/creator/html/${template.id}`}
                        className="p-3 bg-white rounded-full hover:scale-110 transition-transform text-blue-600"
                        title="Edit"
                    >
                        <Edit3 className="w-5 h-5" />
                    </Link>
                </div>

                {/* Status Badge */}
                <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${statusColors[template.status || "draft"] || statusColors.draft}`}>
                    <StatusIcon className="w-3.5 h-3.5" />
                    {template.status || "Draft"}
                </div>

                {/* Price Badge */}
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-gray-900 shadow-sm">
                    {template.isFree ? "Free" : `₹${(template.price || 0) / 100}`}
                </div>
            </div>

            {/* Details Section */}
            <div className="p-6">
                <h3 className="font-bold text-gray-900 text-lg mb-1 truncate" title={template.name}>
                    {template.name}
                </h3>

                <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1 text-yellow-500 font-medium">
                        <Star className="w-4 h-4 fill-current" />
                        <span>{template.averageRating?.toFixed(1) || "0.0"}</span>
                        <span className="text-gray-400 font-normal">({template.totalReviews || 0})</span>
                    </div>
                    {/* Only show sales if not free, but maybe meaningful for free too? Usually sales implies earnings */}
                    <div className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        <span>₹{(template.earnings || 0).toLocaleString()}</span>
                    </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                    <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                        {template.type === "html" ? "HTML / CSS" : "React Component"}
                    </span>
                    <span className="text-xs font-medium text-gray-400">
                        {template.sales || 0} sales
                    </span>
                </div>
            </div>
        </motion.div>
    );
};
