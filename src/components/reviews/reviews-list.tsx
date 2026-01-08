"use client";

import { useEffect, useState } from "react";
import { StarRating } from "./star-rating";
import { Loader2, Edit, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Review {
    id: string;
    userId: string;
    rating: number;
    reviewText: string | null;
    userName: string;
    createdAt: string;
}

interface ReviewsListProps {
    templateId: string;
    refreshTrigger?: number;
    currentUserId?: string;
    onEdit?: (review: Review) => void;
    onDelete?: (reviewId: string) => void;
}

export function ReviewsList({ templateId, refreshTrigger = 0, currentUserId, onEdit, onDelete }: ReviewsListProps) {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [averageRating, setAverageRating] = useState(0);
    const [totalReviews, setTotalReviews] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

    useEffect(() => {
        fetchReviews();
    }, [templateId, refreshTrigger]);

    const fetchReviews = async () => {
        setLoading(true);
        setError("");

        try {
            const response = await fetch(`/api/template-reviews/${templateId}?limit=50`);

            if (!response.ok) {
                throw new Error("Failed to fetch reviews");
            }

            const data = await response.json();
            setReviews(data.reviews || []);
            setAverageRating(data.averageRating || 0);
            setTotalReviews(data.totalReviews || 0);
        } catch (err) {
            setError("Failed to load reviews");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-8 text-red-600">
                {error}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Average Rating Summary */}
            {totalReviews > 0 && (
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-4">
                        <div>
                            <div className="text-4xl font-bold text-gray-900">
                                {averageRating.toFixed(1)}
                            </div>
                            <div className="text-sm text-gray-500 mt-1">
                                out of 5
                            </div>
                        </div>
                        <div className="flex-1">
                            <StarRating value={averageRating} readOnly size="lg" />
                            <p className="text-sm text-gray-600 mt-2">
                                Based on {totalReviews} {totalReviews === 1 ? "review" : "reviews"}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Reviews List */}
            <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-900">
                    Customer Reviews
                </h3>

                {reviews.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        No reviews yet. Be the first to review this template!
                    </div>
                ) : (
                    <div className="space-y-4">
                        {reviews.map((review) => (
                            <div
                                key={review.id}
                                className="bg-white p-4 rounded-lg border border-gray-200"
                            >
                                <div className="flex items-start justify-between mb-2">
                                    <div>
                                        <p className="font-medium text-gray-900">
                                            {review.userName}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <StarRating value={review.rating} readOnly size="sm" />
                                        {currentUserId && review.userId === currentUserId && (
                                            <div className="flex gap-1 ml-2">
                                                <button
                                                    onClick={() => onEdit?.(review)}
                                                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                                    title="Edit review"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => setDeleteConfirm(review.id)}
                                                    className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                                                    title="Delete review"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                {review.reviewText && (
                                    <p className="text-gray-700 mt-2">
                                        {review.reviewText}
                                    </p>
                                )}

                                {/* Delete Confirmation */}
                                {deleteConfirm === review.id && (
                                    <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded">
                                        <p className="text-sm text-red-800 mb-2">
                                            Are you sure you want to delete this review?
                                        </p>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => {
                                                    onDelete?.(review.id);
                                                    setDeleteConfirm(null);
                                                }}
                                                className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                                            >
                                                Delete
                                            </button>
                                            <button
                                                onClick={() => setDeleteConfirm(null)}
                                                className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
