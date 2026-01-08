import React from "react";
import { motion } from "framer-motion";
import { Edit3, Eye, DollarSign, Users, ExternalLink, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminTemplateCardProps {
    template: any;
    onPreview: (template: any) => void;
    onEdit: (template: any) => void;
    onPricing: (template: any) => void;
    onReviews: (template: any) => void;
    onDelete?: (template: any) => void;
    onToggleStatus?: (template: any) => void;
    onToggleFree?: (template: any) => void;
}

export function AdminTemplateCard({
    template,
    onPreview,
    onEdit,
    onPricing,
    onReviews,
    onDelete,
    onToggleStatus,
    onToggleFree
}: AdminTemplateCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5 }}
            transition={{ duration: 0.3 }}
            className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-gray-100 transition-all duration-300"
        >
            {/* Image Section */}
            <div className="aspect-[16/10] relative overflow-hidden bg-gray-100">
                {template.thumbnail ? (
                    <motion.img
                        src={template.thumbnail}
                        alt={template.name}
                        className="w-full h-full object-cover"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.5 }}
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-50 text-gray-300">
                        <ExternalLink className="w-10 h-10" />
                    </div>
                )}

                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Top Right Price Badge */}
                <div className="absolute top-3 right-3">
                    <span className="px-2.5 py-1 bg-white/90 backdrop-blur-sm text-gray-900 text-xs font-bold rounded-full shadow-sm flex items-center gap-0.5">
                        <span className="text-gray-500">₹</span>{template.price || 0}
                    </span>
                </div>

                {/* Top Left HTML Badge */}
                {template.isHtmlTemplate && (
                    <div className="absolute top-3 left-3">
                        <span className="px-2.5 py-1 bg-blue-500/90 backdrop-blur-sm text-white text-xs font-bold rounded-lg shadow-sm">
                            HTML
                        </span>
                    </div>
                )}
            </div>

            {/* Content Section */}
            <div className="p-5">
                <div className="flex items-start justify-between mb-2">
                    <div>
                        <h3 className="font-bold text-blue-600 text-lg mb-1 line-clamp-1 group-hover:text-blue-700 transition-colors">
                            {template.name}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <span className="inline-block w-1.5 h-1.5 rounded-full bg-gray-300" />
                            {template.category || "Uncategorized"}
                        </div>
                    </div>

                    {/* Active/Inactive Toggle */}
                    <div onClick={(e) => e.stopPropagation()}>
                        <ToggleSwitch
                            checked={template.isActive}
                            onChange={() => onToggleStatus?.(template)}
                            label={template.isActive ? "Active" : "Inactive"}
                            activeColor="bg-green-500"
                        />
                    </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                    <div className="text-2xl font-bold text-gray-900">
                        ₹{template.price || 0}
                    </div>

                    {/* Free/Paid Toggle */}
                    <div onClick={(e) => e.stopPropagation()}>
                        <ToggleSwitch
                            checked={!template.isFree}
                            onChange={() => onToggleFree?.(template)}
                            label={template.isFree ? "Free" : "Paid"}
                            activeColor="bg-purple-600"
                            inactiveColor="bg-blue-400"
                        />
                    </div>
                </div>

                {/* Actions Grid */}
                <div className="grid grid-cols-5 gap-2">
                    <ActionButton
                        icon={Eye}
                        label="Preview"
                        onClick={() => onPreview(template)}
                        color="blue"
                    />
                    <ActionButton
                        icon={Edit3}
                        label="Edit"
                        onClick={() => onEdit(template)}
                        color="gray"
                    />
                    <ActionButton
                        icon={DollarSign}
                        label="Price"
                        onClick={() => onPricing(template)}
                        color="green"
                    />
                    <ActionButton
                        icon={Users}
                        label="Review"
                        onClick={() => onReviews(template)}
                        color="purple"
                    />
                    <ActionButton
                        icon={Trash2}
                        label="Delete"
                        onClick={() => onDelete?.(template)}
                        color="red"
                    />
                </div>
            </div>
        </motion.div>
    );
}

function ToggleSwitch({
    checked,
    onChange,
    label,
    activeColor = "bg-green-500",
    inactiveColor = "bg-gray-300"
}: {
    checked: boolean;
    onChange: () => void;
    label?: string;
    activeColor?: string;
    inactiveColor?: string;
}) {
    return (
        <button
            onClick={onChange}
            className="flex items-center gap-2 group cursor-pointer"
        >
            {label && (
                <span className="text-xs font-semibold text-gray-500 group-hover:text-gray-700 transition-colors">
                    {label}
                </span>
            )}
            <div
                className={cn(
                    "w-10 h-5 rounded-full relative transition-colors duration-300",
                    checked ? activeColor : inactiveColor
                )}
            >
                <motion.div
                    className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow-sm"
                    animate={{
                        x: checked ? 20 : 0
                    }}
                    transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 30
                    }}
                />
            </div>
        </button>
    );
}

function ActionButton({
    icon: Icon,
    label,
    onClick,
    color
}: {
    icon: any;
    label: string;
    onClick: () => void;
    color: "blue" | "gray" | "green" | "purple" | "red";
}) {
    const colorStyles = {
        blue: "hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200",
        gray: "hover:bg-gray-100 hover:text-gray-900 hover:border-gray-300",
        green: "hover:bg-green-50 hover:text-green-600 hover:border-green-200",
        purple: "hover:bg-purple-50 hover:text-purple-600 hover:border-purple-200",
        red: "hover:bg-red-50 hover:text-red-600 hover:border-red-200",
    };

    return (
        <button
            onClick={(e) => {
                e.stopPropagation();
                onClick();
            }}
            className={cn(
                "flex flex-col items-center justify-center py-2 rounded-xl border border-transparent transition-all duration-200",
                "text-gray-500 hover:shadow-sm bg-gray-50/50 group/btn",
                colorStyles[color]
            )}
            title={label}
        >
            <Icon className="w-4 h-4 mb-1 transition-transform group-hover/btn:scale-110" />
            <span className="text-[9px] font-semibold opacity-70 group-hover/btn:opacity-100">
                {label}
            </span>
        </button>
    );
}
