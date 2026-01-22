"use client";

import React, { useState, useMemo } from "react";
import {
    Search,
    Check,
    ChevronDown,
    Globe,
    MapPin,
    User,
    Phone,
    Mail,
    Zap,
    MessageSquare,
    Gift
} from "lucide-react";
import { toast } from "sonner";
import { Country, State } from 'country-state-city';

import { useLeadCaptureModal } from "../store/use-lead-capture-modal";
import { useGetLead } from "../api/use-get-lead";
import { useUpsertLead } from "../api/use-upsert-lead";

import {
    Dialog,
    DialogTitle,
    DialogHeader,
    DialogContent,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const INTEREST_OPTIONS = [
    { id: "birthday", label: "Birthday Website", icon: Gift },
    { id: "anniversary", label: "Anniversary Website", icon: HeartIcon },
    { id: "wedding", label: "Wedding/Engagement", icon: Zap },
    { id: "valentine", label: "Valentine Week", icon: LoveIcon },
    { id: "special_days", label: "Special Days", icon: CalendarIcon },
    { id: "regional", label: "Regional and Cultural", icon: GlobeIcon },
    { id: "national", label: "National Celebration", icon: FlagIcon },
];

// Placeholder for Lucide icons that might not be directly imported or need aliases
function HeartIcon(props: any) { return <Zap {...props} /> } // Fallback
function LoveIcon(props: any) { return <Zap {...props} /> } // Fallback
function CalendarIcon(props: any) { return <Zap {...props} /> } // Fallback
function GlobeIcon(props: any) { return <Globe {...props} /> } // Aliased
function FlagIcon(props: any) { return <Zap {...props} /> } // Fallback

export function LeadCaptureModal() {
    const { isOpen, onClose } = useLeadCaptureModal();
    const { data: existingLead, isLoading: isLoadingLead } = useGetLead();
    const mutation = useUpsertLead();

    const [formData, setFormData] = React.useState({
        name: "",
        mobile: "",
        whatsapp: "",
        email: "",
        country: "",
        countryCode: "", // Store ISO code for state lookup
        state: "",
        interests: [] as string[],
    });

    React.useEffect(() => {
        if (existingLead) {
            setFormData({
                name: existingLead.name || "",
                mobile: existingLead.mobile || "",
                whatsapp: existingLead.whatsapp || "",
                email: existingLead.email || "",
                country: existingLead.country || "",
                countryCode: existingLead.countryCode || "",
                state: existingLead.state || "",
                interests: existingLead.interests ? JSON.parse(existingLead.interests) : [],
            });
            if (existingLead.whatsapp === existingLead.mobile && existingLead.mobile) {
                setIsWhatsAppSame(true);
            }
        }
    }, [existingLead]);

    const [isWhatsAppSame, setIsWhatsAppSame] = React.useState(false);
    const [countrySearch, setCountrySearch] = React.useState("");
    const [stateSearch, setStateSearch] = React.useState("");
    const [showCountrySelect, setShowCountrySelect] = React.useState(false);
    const [showStateSelect, setShowStateSelect] = React.useState(false);

    // Get all countries from the package
    const allCountries = React.useMemo(() => {
        return Country.getAllCountries().map(country => ({
            name: country.name,
            isoCode: country.isoCode,
            flag: country.flag,
        }));
    }, []);

    // Filter countries based on search
    const filteredCountries = React.useMemo(() =>
        allCountries.filter(c => c.name.toLowerCase().includes(countrySearch.toLowerCase())),
        [countrySearch, allCountries]);

    // Get states for selected country
    const availableStates = React.useMemo(() => {
        if (!formData.countryCode) return [];
        return State.getStatesOfCountry(formData.countryCode).map(state => ({
            name: state.name,
            isoCode: state.isoCode,
        }));
    }, [formData.countryCode]);

    // Filter states based on search
    const filteredStates = React.useMemo(() =>
        availableStates.filter(s => s.name.toLowerCase().includes(stateSearch.toLowerCase())),
        [stateSearch, availableStates]);

    const handleInterestToggle = (id: string) => {
        setFormData(prev => ({
            ...prev,
            interests: prev.interests.includes(id)
                ? prev.interests.filter(item => item !== id)
                : [...prev.interests, id]
        }));
    };

    const handleWhatsAppToggle = () => {
        setIsWhatsAppSame(!isWhatsAppSame);
        if (!isWhatsAppSame) {
            setFormData(prev => ({ ...prev, whatsapp: prev.mobile }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (!formData.name || !formData.mobile || !formData.email || !formData.country) {
            toast.error("Please fill in all required fields.");
            return;
        }

        mutation.mutate({
            ...formData,
            interests: JSON.stringify(formData.interests),
        }, {
            onSuccess: () => {
                onClose();
            }
        });
    };


    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[680px] max-h-[90vh] overflow-hidden flex flex-col p-0 bg-white border-none shadow-2xl rounded-3xl">
                <DialogHeader className="px-8 pt-10 pb-6 bg-gradient-to-r from-pink-500 via-rose-500 to-orange-400 text-white relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxIDEuNzktNCA0LTRzNCAxLjc5IDQgNC0xLjc5IDQtNCA0LTQtMS43OS00LTR6bTAgMTJjMC0yLjIxIDEuNzktNCA0LTRzNCAxLjc5IDQgNC0xLjc5IDQtNCA0LTQtMS43OS00LTR6TTEyIDM0YzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSA0IDQtMS43OSA0LTQgNC00LTEuNzktNC00em0wIDEyYzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSA0IDQtMS43OSA0LTQgNC00LTEuNzktNC00em0xMi0yNGMwLTIuMjEgMS43OS00IDQtNHM0IDEuNzkgNCA0LTEuNzkgNC00IDQtNC0xLjc5LTQtNHptMCAxMmMwLTIuMjEgMS43OS00IDQtNHM0IDEuNzkgNCA0LTEuNzkgNC00IDQtNC0xLjc5LTQtNHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-20"></div>
                    <div className="relative z-10">
                        <DialogTitle className="text-3xl font-black flex items-center gap-3 mb-2">
                            <Zap className="size-9 drop-shadow-lg" />
                            Join ELYX Premium
                        </DialogTitle>
                        <DialogDescription className="text-white/95 text-base font-medium">
                            Get personalized templates and exclusive offers for your special days!
                        </DialogDescription>
                    </div>
                </DialogHeader>

                <ScrollArea className="flex-1 px-8 py-6">
                    <form id="lead-form" onSubmit={handleSubmit} className="space-y-6">
                        {/* Basic Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="space-y-2">
                                <Label className="text-gray-700 font-bold text-sm flex items-center gap-2">
                                    <User className="size-4 text-rose-500" /> Full Name *
                                </Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                                    <Input
                                        placeholder="Test User"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="pl-10 h-12 rounded-xl border-2 border-gray-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-100 transition-all"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-gray-700 font-bold text-sm flex items-center gap-2">
                                    <Mail className="size-4 text-rose-500" /> Gmail ID *
                                </Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                                    <Input
                                        type="email"
                                        placeholder="ranjitbichukale11@gmail.com"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="pl-10 h-12 rounded-xl border-2 border-gray-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-100 transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Mobile & WhatsApp */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="space-y-2">
                                <Label className="text-gray-700 font-bold text-sm flex items-center gap-2">
                                    <Phone className="size-4 text-rose-500" /> Mobile Number *
                                </Label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                                    <Input
                                        placeholder="9876543210"
                                        value={formData.mobile}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            setFormData(prev => ({
                                                ...prev,
                                                mobile: val,
                                                whatsapp: isWhatsAppSame ? val : prev.whatsapp
                                            }));
                                        }}
                                        className="pl-10 h-12 rounded-xl border-2 border-gray-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-100 transition-all"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label className="text-gray-700 font-bold text-sm flex items-center gap-2">
                                        <MessageSquare className="size-4 text-green-500" /> WhatsApp Number
                                    </Label>
                                    <button
                                        type="button"
                                        onClick={handleWhatsAppToggle}
                                        className="text-xs bg-gray-100 px-3 py-1 rounded-full text-gray-600 hover:bg-rose-50 hover:text-rose-600 transition-all font-medium"
                                    >
                                        {isWhatsAppSame ? "✓ Same as Mobile" : "Same as Mobile"}
                                    </button>
                                </div>
                                <div className="relative">
                                    <MessageSquare className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                                    <Input
                                        placeholder="9876543210"
                                        value={formData.whatsapp}
                                        disabled={isWhatsAppSame}
                                        onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                                        className="pl-10 h-12 rounded-xl border-2 border-gray-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-100 disabled:bg-gray-50 disabled:text-gray-500 transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Country & State (Searchable) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {/* Country Selector */}
                            <div className="space-y-2 relative">
                                <Label className="text-gray-700 font-bold text-sm flex items-center gap-2">
                                    <Globe className="size-4 text-rose-500" /> Country *
                                </Label>
                                <div
                                    className="relative cursor-pointer"
                                    onClick={() => setShowCountrySelect(!showCountrySelect)}
                                >
                                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                                    <Input
                                        readOnly
                                        placeholder="India"
                                        value={formData.country}
                                        className="pl-10 pr-10 h-12 rounded-xl border-2 border-gray-200 focus:border-rose-400 cursor-pointer transition-all"
                                    />
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
                                </div>
                                {showCountrySelect && (
                                    <div className="absolute top-full left-0 w-full mt-2 bg-white border-2 border-gray-100 shadow-2xl rounded-2xl z-50 p-3 overflow-hidden animate-in fade-in slide-in-from-top-2">
                                        <div className="relative mb-2">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                                            <Input
                                                autoFocus
                                                placeholder="Search country..."
                                                className="pl-10 h-10 text-sm rounded-xl border-gray-200 bg-gray-50 focus:ring-0 focus:border-rose-300"
                                                value={countrySearch}
                                                onChange={(e) => setCountrySearch(e.target.value)}
                                                onClick={(e) => e.stopPropagation()}
                                            />
                                        </div>
                                        <ScrollArea className="h-40">
                                            {filteredCountries.map(c => (
                                                <div
                                                    key={c.isoCode}
                                                    className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-rose-50 cursor-pointer transition-all group"
                                                    onClick={() => {
                                                        setFormData({
                                                            ...formData,
                                                            country: c.name,
                                                            countryCode: c.isoCode,
                                                            state: ""
                                                        });
                                                        setShowCountrySelect(false);
                                                        setCountrySearch("");
                                                    }}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-lg">{c.flag}</span>
                                                        <span className="text-sm font-semibold text-gray-700 group-hover:text-rose-600">{c.name}</span>
                                                    </div>
                                                    {formData.country === c.name && <Check className="size-4 text-rose-500" />}
                                                </div>
                                            ))}
                                            {filteredCountries.length === 0 && (
                                                <div className="text-center py-6 text-gray-400 text-sm">No countries found</div>
                                            )}
                                        </ScrollArea>
                                    </div>
                                )}
                            </div>

                            {/* State Selector */}
                            <div className="space-y-2 relative">
                                <Label className="text-gray-700 font-bold text-sm flex items-center gap-2">
                                    <MapPin className="size-4 text-rose-500" /> State
                                </Label>
                                <div
                                    className={cn(
                                        "relative cursor-pointer",
                                        !formData.country && "opacity-50 cursor-not-allowed"
                                    )}
                                    onClick={() => formData.country && setShowStateSelect(!showStateSelect)}
                                >
                                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                                    <Input
                                        readOnly
                                        placeholder={formData.country ? "Maharashtra" : "Select Country first"}
                                        value={formData.state}
                                        className="pl-10 pr-10 h-12 rounded-xl border-2 border-gray-200 focus:border-rose-400 cursor-pointer transition-all"
                                    />
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
                                </div>
                                {showStateSelect && (
                                    <div className="absolute top-full left-0 w-full mt-2 bg-white border-2 border-gray-100 shadow-2xl rounded-2xl z-50 p-3 overflow-hidden animate-in fade-in slide-in-from-top-2">
                                        <div className="relative mb-2">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                                            <Input
                                                autoFocus
                                                placeholder="Search state..."
                                                className="pl-10 h-10 text-sm rounded-xl border-gray-200 bg-gray-50 focus:ring-0 focus:border-rose-300"
                                                value={stateSearch}
                                                onChange={(e) => setStateSearch(e.target.value)}
                                                onClick={(e) => e.stopPropagation()}
                                            />
                                        </div>
                                        <ScrollArea className="h-40">
                                            {filteredStates.map(s => (
                                                <div
                                                    key={s.isoCode}
                                                    className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-rose-50 cursor-pointer transition-all group"
                                                    onClick={() => {
                                                        setFormData({ ...formData, state: s.name });
                                                        setShowStateSelect(false);
                                                        setStateSearch("");
                                                    }}
                                                >
                                                    <span className="text-sm font-semibold text-gray-700 group-hover:text-rose-600">{s.name}</span>
                                                    {formData.state === s.name && <Check className="size-4 text-rose-500" />}
                                                </div>
                                            ))}
                                            {filteredStates.length === 0 && (
                                                <div className="text-center py-6 text-gray-400 text-sm">
                                                    {formData.countryCode ? "No states found" : "Select a country first"}
                                                </div>
                                            )}
                                        </ScrollArea>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Interests */}
                        <div className="space-y-4">
                            <Label className="text-gray-800 font-black text-base flex items-center gap-2">
                                <Zap className="size-5 text-rose-500" /> What are you looking for?
                            </Label>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                {INTEREST_OPTIONS.map((option) => (
                                    <button
                                        key={option.id}
                                        type="button"
                                        onClick={() => handleInterestToggle(option.id)}
                                        className={cn(
                                            "flex flex-col items-center gap-2.5 p-4 rounded-2xl border-2 transition-all duration-300 hover:scale-105 active:scale-95",
                                            formData.interests.includes(option.id)
                                                ? "border-rose-500 bg-gradient-to-br from-rose-50 to-pink-50 text-rose-600 shadow-lg shadow-rose-100"
                                                : "border-gray-200 bg-white text-gray-600 hover:border-rose-200 hover:bg-rose-50/30"
                                        )}
                                    >
                                        <option.icon className={cn(
                                            "size-7",
                                            formData.interests.includes(option.id) ? "text-rose-500" : "text-gray-400"
                                        )} />
                                        <span className="text-xs font-bold text-center leading-tight">
                                            {option.label}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </form>
                </ScrollArea>

                <DialogFooter className="px-8 py-6 bg-gradient-to-r from-gray-50 to-rose-50/30 border-t border-gray-100">
                    <Button
                        form="lead-form"
                        type="submit"
                        disabled={mutation.isPending}
                        className="w-full h-14 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-rose-600 hover:from-pink-600 hover:via-rose-600 hover:to-rose-700 text-white text-base font-black shadow-lg shadow-rose-200 hover:shadow-xl hover:shadow-rose-300 transition-all transform hover:-translate-y-0.5 active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {mutation.isPending ? "Submitting..." : "Submit & Explore ELYX"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
