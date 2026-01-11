"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Loader2, Save, ArrowLeft, User, Globe, Link2, Twitter, Linkedin, Github, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import Image from "next/image";

interface ProfileData {
    name: string;
    email: string;
    image: string;
    bio: string;
    portfolioUrl: string;
    socialLinks: {
        twitter?: string;
        linkedin?: string;
        github?: string;
        instagram?: string;
    };
}

export default function EditProfilePage() {
    const router = useRouter();
    const { data: session } = useSession();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [profile, setProfile] = useState<ProfileData>({
        name: "",
        email: "",
        image: "",
        bio: "",
        portfolioUrl: "",
        socialLinks: {}
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await fetch("/api/creator-profile");
                if (response.ok) {
                    const data = await response.json();
                    setProfile(data.profile);
                } else {
                    toast.error("Failed to load profile");
                }
            } catch (error) {
                console.error("Error fetching profile:", error);
                toast.error("Failed to load profile");
            } finally {
                setLoading(false);
            }
        };

        if (session) {
            fetchProfile();
        }
    }, [session]);

    const handleSave = async () => {
        setSaving(true);
        try {
            const response = await fetch("/api/creator-profile", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: profile.name,
                    bio: profile.bio,
                    portfolioUrl: profile.portfolioUrl,
                    socialLinks: profile.socialLinks
                })
            });

            if (response.ok) {
                toast.success("Profile updated successfully!");
                router.push("/creator");
            } else {
                toast.error("Failed to update profile");
            }
        } catch (error) {
            console.error("Error saving profile:", error);
            toast.error("Failed to update profile");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto py-8 px-4">
            <div className="mb-8">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span className="font-medium">Back</span>
                </button>
                <h1 className="text-4xl font-black text-gray-900 mb-2">Edit Profile</h1>
                <p className="text-gray-600">Update your creator profile information</p>
            </div>

            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 space-y-8">
                <div className="flex items-center gap-6 pb-8 border-b border-gray-100">
                    <div className="relative w-24 h-24 rounded-full overflow-hidden ring-4 ring-blue-100">
                        {profile.image ? (
                            <Image
                                src={profile.image}
                                alt={profile.name}
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                                <User className="w-12 h-12 text-white" />
                            </div>
                        )}
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-gray-900">{profile.name || "Creator"}</h3>
                        <p className="text-sm text-gray-500">{profile.email}</p>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="space-y-2">
                        <Label className="text-sm font-bold text-gray-700">Display Name</Label>
                        <Input
                            value={profile.name}
                            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                            className="h-12 border-2 border-gray-200 focus:ring-0 focus:border-blue-500 rounded-xl font-medium"
                            placeholder="Your name"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label className="text-sm font-bold text-gray-700">Bio</Label>
                        <textarea
                            value={profile.bio}
                            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                            rows={4}
                            className="w-full border-2 border-gray-200 rounded-xl p-4 font-medium text-sm focus:outline-none focus:border-blue-500 resize-none"
                            placeholder="Tell us about yourself..."
                        />
                    </div>

                    <div className="space-y-2">
                        <Label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                            <Globe className="w-4 h-4" />
                            Portfolio Website
                        </Label>
                        <Input
                            value={profile.portfolioUrl}
                            onChange={(e) => setProfile({ ...profile, portfolioUrl: e.target.value })}
                            className="h-12 border-2 border-gray-200 focus:ring-0 focus:border-blue-500 rounded-xl font-medium"
                            placeholder="https://yourportfolio.com"
                            type="url"
                        />
                    </div>
                </div>

                <div className="space-y-4 pt-6 border-t border-gray-100">
                    <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
                        <Link2 className="w-5 h-5" />
                        Social Links
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                <Twitter className="w-4 h-4 text-blue-400" />
                                Twitter
                            </Label>
                            <Input
                                value={profile.socialLinks.twitter || ""}
                                onChange={(e) => setProfile({ 
                                    ...profile, 
                                    socialLinks: { ...profile.socialLinks, twitter: e.target.value }
                                })}
                                className="h-12 border-2 border-gray-200 focus:ring-0 focus:border-blue-500 rounded-xl font-medium"
                                placeholder="https://twitter.com/username"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                <Linkedin className="w-4 h-4 text-blue-600" />
                                LinkedIn
                            </Label>
                            <Input
                                value={profile.socialLinks.linkedin || ""}
                                onChange={(e) => setProfile({ 
                                    ...profile, 
                                    socialLinks: { ...profile.socialLinks, linkedin: e.target.value }
                                })}
                                className="h-12 border-2 border-gray-200 focus:ring-0 focus:border-blue-500 rounded-xl font-medium"
                                placeholder="https://linkedin.com/in/username"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                <Github className="w-4 h-4" />
                                GitHub
                            </Label>
                            <Input
                                value={profile.socialLinks.github || ""}
                                onChange={(e) => setProfile({ 
                                    ...profile, 
                                    socialLinks: { ...profile.socialLinks, github: e.target.value }
                                })}
                                className="h-12 border-2 border-gray-200 focus:ring-0 focus:border-blue-500 rounded-xl font-medium"
                                placeholder="https://github.com/username"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                <Instagram className="w-4 h-4 text-pink-500" />
                                Instagram
                            </Label>
                            <Input
                                value={profile.socialLinks.instagram || ""}
                                onChange={(e) => setProfile({ 
                                    ...profile, 
                                    socialLinks: { ...profile.socialLinks, instagram: e.target.value }
                                })}
                                className="h-12 border-2 border-gray-200 focus:ring-0 focus:border-blue-500 rounded-xl font-medium"
                                placeholder="https://instagram.com/username"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex gap-4 pt-6 border-t border-gray-100">
                    <Button
                        onClick={() => router.back()}
                        variant="outline"
                        className="flex-1 h-12 rounded-xl font-bold border-2"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex-1 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold"
                    >
                        {saving ? (
                            <>
                                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save className="w-5 h-5 mr-2" />
                                Save Changes
                            </>
                        )}  
                    </Button>
                </div>
            </div>
        </div>
    );
}
