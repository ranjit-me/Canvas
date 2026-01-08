"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PRICING_COUNTRIES, DEFAULT_PRICING_BY_COUNTRY, formatPrice, type CountryCode } from "@/lib/pricing";
import { DollarSign, Save, RotateCcw, BarChart3, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface PricingModalProps {
    isOpen: boolean;
    onClose: () => void;
    templateId: string;
    templateName: string;
    currentPricing: string | null;
    onSave: (pricing: string) => Promise<void>;
}

export function PricingModal({
    isOpen,
    onClose,
    templateId,
    templateName,
    currentPricing,
    onSave,
}: PricingModalProps) {
    const [pricing, setPricing] = useState<Record<string, number>>(() => {
        if (currentPricing) {
            try {
                return JSON.parse(currentPricing);
            } catch {
                return { ...DEFAULT_PRICING_BY_COUNTRY };
            }
        }
        return { ...DEFAULT_PRICING_BY_COUNTRY };
    });

    const [isSaving, setIsSaving] = useState(false);

    const handlePriceChange = (countryCode: string, value: string) => {
        const numValue = parseFloat(value) || 0;
        setPricing(prev => ({ ...prev, [countryCode]: numValue }));
    };

    const handleReset = () => {
        setPricing({ ...DEFAULT_PRICING_BY_COUNTRY });
        toast.success("Prices reset to defaults");
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await onSave(JSON.stringify(pricing));
            toast.success("Pricing updated successfully!");
            onClose();
        } catch (error) {
            toast.error("Failed to update pricing");
            console.error(error);
        } finally {
            setIsSaving(false);
        }
    };

    const getFlag = (code: string) => {
        const flags: Record<string, string> = {
            IN: "🇮🇳", ES: "🇪🇸", FR: "🇫🇷", SA: "🇸🇦", CN: "🇨🇳",
            PT: "🇵🇹", BD: "🇧🇩", RU: "🇷🇺", PK: "🇵🇰", ID: "🇮🇩",
            DE: "🇩🇪", US: "🇺🇸", GB: "🇬🇧", OTHER: "🌐"
        };
        return flags[code] || "🏳️";
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[900px] max-h-[95vh] overflow-hidden flex flex-col p-0 bg-[#FBFBFE] border-none shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] rounded-[40px]">
                <DialogHeader className="px-10 pt-10 pb-6 bg-white border-b border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-4">
                            <div className="size-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200">
                                <DollarSign className="size-8 text-white" />
                            </div>
                            <div>
                                <DialogTitle className="text-3xl font-black text-slate-900 tracking-tight">
                                    Manage Pricing
                                </DialogTitle>
                                <DialogDescription className="text-slate-500 font-medium text-base mt-1">
                                    Geo-targeted pricing for <span className="text-indigo-600 font-bold">{templateName}</span>
                                </DialogDescription>
                            </div>
                        </div>
                    </div>
                </DialogHeader>

                <div className="flex-1 px-10 py-8 overflow-y-auto max-h-[calc(95vh-280px)]">
                    <div className="space-y-10 pb-4">
                        {/* Price Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {Object.entries(PRICING_COUNTRIES).map(([code, info]) => (
                                <div
                                    key={code}
                                    className="group relative flex items-center gap-5 p-5 rounded-[32px] bg-white border border-slate-100 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-50/50 transition-all duration-300"
                                >
                                    <div className="size-16 min-w-16 rounded-2xl bg-slate-50 flex items-center justify-center text-3xl group-hover:bg-indigo-50 transition-colors duration-300">
                                        {getFlag(code)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <Label className="text-base font-bold text-slate-900 mb-0.5 block truncate">
                                            {info.name}
                                        </Label>
                                        <p className="text-sm font-semibold text-slate-400 capitalize">{info.language} • {info.currency}</p>
                                    </div>
                                    <div className="flex items-center gap-3 bg-slate-50 p-2 rounded-2xl group-hover:bg-indigo-50/50 transition-colors duration-300">
                                        <span className="text-xl font-black text-indigo-600 ml-2">{info.symbol}</span>
                                        <Input
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            value={pricing[code] || 0}
                                            onChange={(e) => handlePriceChange(code, e.target.value)}
                                            className="w-28 h-12 text-right font-black text-lg border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 px-2"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Summary Section */}
                        <div className="p-8 rounded-[40px] bg-indigo-900 text-white shadow-2xl shadow-indigo-200 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" />
                            <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/10 rounded-full translate-y-1/3 -translate-x-1/4 blur-3xl pointer-events-none" />

                            <h3 className="text-lg font-black mb-6 flex items-center gap-3 relative z-10">
                                <div className="p-1.5 bg-white/10 rounded-lg">
                                    <BarChart3 className="size-5" />
                                </div>
                                Pricing Snapshot
                            </h3>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative z-10">
                                {Object.entries(pricing).map(([code, price]) => {
                                    const info = PRICING_COUNTRIES[code as CountryCode];
                                    return (
                                        <div key={code} className="p-4 rounded-3xl bg-white/10 backdrop-blur-sm border border-white/10 hover:bg-white/15 transition-colors cursor-default">
                                            <p className="text-xs font-bold text-indigo-200 mb-1 flex items-center gap-1.5">
                                                <span>{getFlag(code)}</span>
                                                {info.name}
                                            </p>
                                            <p className="text-xl font-black text-white">
                                                {formatPrice(price, code)}
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>

                <DialogFooter className="px-10 py-8 bg-white border-t border-gray-100 flex items-center gap-4">
                    <Button
                        variant="ghost"
                        onClick={handleReset}
                        className="h-14 px-8 rounded-2xl hover:bg-red-50 hover:text-red-600 font-bold transition-all duration-300"
                    >
                        <RotateCcw className="size-5 mr-2" />
                        Reset to Defaults
                    </Button>
                    <div className="flex-1" />
                    <Button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="h-14 px-10 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-lg shadow-xl shadow-indigo-100 transition-all duration-300 active:scale-95 disabled:opacity-50"
                    >
                        {isSaving ? (
                            <Loader2 className="size-6 animate-spin" />
                        ) : (
                            <>
                                <Save className="size-5 mr-2" />
                                Save Configuration
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
