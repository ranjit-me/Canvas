"use client";

import { useState } from "react";
import { StarRating } from "./star-rating";
import { Loader2 } from "lucide-react";

interface ReviewFormProps {
    templateId: string;
    onSuccess?: () => void;
    onCancel?: () => void;
    existingReview?: {
        id: string;
        rating: number;
        reviewText: string | null;
    } | null;
}

export function ReviewForm({ templateId, onSuccess, onCancel, existingReview }: ReviewFormProps) {
    const [rating, setRating] = useState(existingReview?.rating || 0);
    const [reviewText, setReviewText] = useState(existingReview?.reviewText || "");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    const isEditing = !!existingReview;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (rating === 0) {
            setError("Please select a rating");
            return;
        }

        setSubmitting(true);
        setError("");

        try {
            const url = isEditing
                ? `/api/template-reviews/${existingReview.id}`
                : "/api/template-reviews";

            const method = isEditing ? "PUT" : "POST";

            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    templateId: isEditing ? undefined : templateId, // templateId not needed for update
                    rating,
                    reviewText: reviewText.trim() || undefined,
                }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || "Failed to submit review");
            }

            // Reset form if creating, but keep values if editing (until closed)
            if (!isEditing) {
                setRating(0);
                setReviewText("");
            }

            if (onSuccess) {
                onSuccess();
            }
        } catch (err: any) {
            setError(err.message || "Failed to submit review. Please try again.");
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">
                    {isEditing ? "Edit Your Review" : "Write a Review"}
                </h3>
                {isEditing && onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        className="text-sm text-gray-500 hover:text-gray-700"
                    >
                        Cancel
                    </button>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Rating *
                </label>
                <StarRating value={rating} onChange={setRating} size="lg" />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Review (Optional)
                </label>
                <textarea
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    rows={4}
                    placeholder="Share your experience with this template..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none"
                    maxLength={500}
                />
                <p className="text-xs text-gray-500 mt-1">
                    {reviewText.length}/500 characters
                </p>
            </div>

            {error && (
                <div className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded">
                    {error}
                </div>
            )}

            <button
                type="submit"
                disabled={submitting || rating === 0}
                className="w-full px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
                {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                {submitting ? (isEditing ? "Update Review" : "Submitting...") : (isEditing ? "Update Review" : "Submit Review")}
            </button>
        </form>
    );
}
