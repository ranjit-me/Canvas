import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

interface CreatorStatsCardProps {
    label: string;
    value: string | number;
    icon: LucideIcon;
    color: string;
    delay?: number;
}

export const CreatorStatsCard = ({
    label,
    value,
    icon: Icon,
    color,
    delay = 0,
}: CreatorStatsCardProps) => {
    // Map color names to tailwind classes safely
    const colorClasses: Record<string, { bg: string; text: string }> = {
        blue: { bg: "bg-blue-50", text: "text-blue-500" },
        indigo: { bg: "bg-indigo-50", text: "text-indigo-500" },
        purple: { bg: "bg-purple-50", text: "text-purple-500" },
        green: { bg: "bg-green-50", text: "text-green-500" },
        yellow: { bg: "bg-yellow-50", text: "text-yellow-500" },
        red: { bg: "bg-red-50", text: "text-red-500" },
        orange: { bg: "bg-orange-50", text: "text-orange-500" },
    };

    const styles = colorClasses[color] || colorClasses.blue;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay }}
            className="bg-white border border-gray-100 p-8 rounded-[2rem] shadow-sm hover:shadow-md transition-shadow"
        >
            <div className={`w-12 h-12 ${styles.bg} rounded-xl flex items-center justify-center mb-6`}>
                <Icon className={`w-6 h-6 ${styles.text}`} />
            </div>
            <p className="text-sm font-black text-gray-400 uppercase tracking-widest mb-1">
                {label}
            </p>
            <p className="text-3xl font-black text-gray-900">{value}</p>
        </motion.div>
    );
};
