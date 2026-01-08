"use client";

import React, { useState } from 'react';
import { Calendar, X, Check } from 'lucide-react';

interface DatePickerProps {
    value: string; // ISO date string
    onChange: (date: string) => void;
    onClose: () => void;
    title?: string;
}

export function DatePicker({ value, onChange, onClose, title = "Select Date & Time" }: DatePickerProps) {
    const currentDate = new Date(value);
    const [localDate, setLocalDate] = useState(
        currentDate.toISOString().slice(0, 16) // Format for datetime-local input
    );

    const handleApply = () => {
        onChange(new Date(localDate).toISOString());
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-fade-in">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-pink-500" />
                        {title}
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Select Date & Time
                        </label>
                        <input
                            type="datetime-local"
                            value={localDate}
                            onChange={(e) => setLocalDate(e.target.value)}
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-pink-500 focus:outline-none text-gray-700"
                        />
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={handleApply}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg hover:from-pink-600 hover:to-purple-600 transition-all shadow-lg hover:shadow-xl"
                        >
                            <Check className="w-5 h-5" />
                            Apply
                        </button>
                        <button
                            onClick={onClose}
                            className="px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
