"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { User, Mail, Phone, Save, Loader2, Camera } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const ProfileForm = () => {
    const { data: session, update } = useSession();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: session?.user?.name || "",
        email: session?.user?.email || "",
        phone: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch("/api/profile", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error("Failed to update profile");
            }

            const data = await response.json();

            // Update the session with new data
            await update({
                ...session,
                user: {
                    ...session?.user,
                    name: formData.name,
                },
            });

            toast.success("Profile updated successfully!");
        } catch (error) {
            toast.error("Failed to update profile");
            console.error("Profile update error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const userName = session?.user?.name || "User";
    const userImage = session?.user?.image;

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            {/* Avatar Section */}
            <div className="flex flex-col items-center gap-4">
                <div className="relative group">
                    <Avatar className="size-32 border-4 border-purple-200">
                        <AvatarImage src={userImage || ""} alt={userName} />
                        <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white text-4xl font-bold">
                            {userName.charAt(0).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <button
                        type="button"
                        className="absolute bottom-0 right-0 p-3 bg-white rounded-full shadow-lg border-2 border-purple-200 hover:bg-purple-50 transition-colors group-hover:scale-110 transform duration-200"
                    >
                        <Camera className="size-5 text-purple-600" />
                    </button>
                </div>
                <p className="text-sm text-gray-500">Click to change profile picture</p>
            </div>

            {/* Personal Information */}
            <div className="space-y-6">
                <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <User className="size-5 text-purple-600" />
                        Personal Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Full Name */}
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-gray-700 font-medium">
                                Full Name *
                            </Label>
                            <Input
                                id="name"
                                name="name"
                                type="text"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                                placeholder="Enter your full name"
                            />
                        </div>

                        {/* Email */}
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-gray-700 font-medium">
                                Email Address *
                            </Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    disabled
                                    className="pl-10 border-gray-300 bg-gray-50 cursor-not-allowed"
                                    placeholder="your.email@example.com"
                                />
                            </div>
                            <p className="text-xs text-gray-500">Email cannot be changed</p>
                        </div>

                        {/* Phone Number */}
                        <div className="space-y-2">
                            <Label htmlFor="phone" className="text-gray-700 font-medium">
                                Phone Number
                            </Label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                                <Input
                                    id="phone"
                                    name="phone"
                                    type="tel"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="pl-10 border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                                    placeholder="+1 (555) 123-4567"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                    className="px-6"
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    disabled={isLoading}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 gap-2"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="size-4 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        <>
                            <Save className="size-4" />
                            Save Changes
                        </>
                    )}
                </Button>
            </div>
        </form>
    );
};
