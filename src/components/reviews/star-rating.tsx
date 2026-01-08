"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
    value: number;
    onChange?: (rating: number) => void;
    readOnly?: boolean;
    size?: "sm" | "md" | "lg";
    showValue?: boolean;
}

export function StarRating({
    value,
    onChange,
    readOnly = false,
    size = "md",
    showValue = false
}: StarRatingProps) {
    const sizeClasses = {
        sm: "w-4 h-4",
        md: "w-5 h-5",
        lg: "w-6 h-6"
    };

    const handleClick = (rating: number) => {
        if (!readOnly && onChange) {
            onChange(rating);
        }
    };

    return (
        <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => {
                const isFilled = star <= value;
                const isHalfFilled = !isFilled && star - 0.5 <= value;

                return (
                    <button
                        key={star}
                        type="button"
                        onClick={() => handleClick(star)}
                        disabled={readOnly}
                        className={cn(
                            "relative transition-transform",
                            !readOnly && "hover:scale-110 cursor-pointer",
                            readOnly && "cursor-default"
                        )}
                    >
                        <Star
                            className={cn(
                                sizeClasses[size],
                                isFilled ? "fill-orange-500 text-orange-500" : "text-gray-300",
                                !readOnly && "transition-colors"
                            )}
                        />
                        {isHalfFilled && (
                            <div className="absolute inset-0 overflow-hidden" style={{ width: "50%" }}>
                                <Star
                                    className={cn(
                                        sizeClasses[size],
                                        "fill-orange-500 text-orange-500"
                                    )}
                                />
                            </div>
                        )}
                    </button>
                );
            })}
            {showValue && (
                <span className="ml-2 text-sm font-medium text-gray-700">
                    {value.toFixed(1)}
                </span>
            )}
        </div>
    );
}
