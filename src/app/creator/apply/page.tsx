"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Country, State } from "country-state-city";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { Upload, Loader2, Check } from "lucide-react";

export default function CreatorApplicationPage() {
    const router = useRouter();
    const { data: session, update } = useSession();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedCountry, setSelectedCountry] = useState("");
    const [availableStates, setAvailableStates] = useState<any[]>([]);
    const [formData, setFormData] = useState({
        fullName: session?.user?.name || "",
        email: session?.user?.email || "",
        mobile: "",
        country: "",
        state: "",
        qualification: "",
        portfolioUrl: "",
        bio: "",
        specialization: "",
    });
    const [resumeFile, setResumeFile] = useState<File | null>(null);
    const [photoFile, setPhotoFile] = useState<File | null>(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    // Get all countries
    const allCountries = Country.getAllCountries();

    // Common qualifications list
    const qualifications = [
        // High School
        "High School Diploma",
        "GED (General Educational Development)",

        // Undergraduate
        "Associate Degree",
        "Bachelor's Degree - Arts",
        "Bachelor's Degree - Science",
        "Bachelor's Degree - Commerce",
        "Bachelor's Degree - Engineering",
        "Bachelor's Degree - Design",
        "Bachelor's Degree - Computer Science",
        "Bachelor's Degree - Other",

        // Postgraduate
        "Master's Degree - Arts",
        "Master's Degree - Science",
        "Master's Degree - Business Administration (MBA)",
        "Master's Degree - Engineering",
        "Master's Degree - Design",
        "Master's Degree - Computer Science",
        "Master's Degree - Other",

        // Doctorate
        "Ph.D. (Doctor of Philosophy)",
        "Professional Doctorate",

        // Professional Certifications
        "Professional Certificate",
        "Diploma Course",
        "Bootcamp Graduate",
        "Self-Taught/Online Courses",
        "Industry Certification",

        // Other
        "Other",
        "Prefer not to say"
    ];

    // Update states when country changes
    useEffect(() => {
        if (selectedCountry) {
            const states = State.getStatesOfCountry(selectedCountry);
            setAvailableStates(states);
            // Reset state selection when country changes
            setFormData(prev => ({ ...prev, state: "" }));
        } else {
            setAvailableStates([]);
        }
    }, [selectedCountry]);

    // Format options for SearchableSelect
    const countryOptions = allCountries.map(country => ({
        value: country.isoCode,
        label: `${country.flag} ${country.name}`
    }));

    const stateOptions = availableStates.map(state => ({
        value: state.name,
        label: state.name
    }));

    const qualificationOptions = qualifications.map(qual => ({
        value: qual,
        label: qual
    }));

    const uploadFile = async (file: File, folder: string) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", folder);

        const response = await fetch("/api/upload", {
            method: "POST",
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.details || errorData.error || `Failed to upload ${file.name}`);
        }

        const data = await response.json();
        return data.url;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!resumeFile || !photoFile) {
            alert("Please upload both resume and profile photo.");
            return;
        }

        setIsSubmitting(true);

        try {
            // 1. Upload Resume
            const resumeUrl = await uploadFile(resumeFile, "giftora/resumes");

            // 2. Upload Photo
            const profilePhotoUrl = await uploadFile(photoFile, "giftora/profiles");

            // 3. Submit Application
            const response = await fetch("/api/creator-applications", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...formData,
                    resumeUrl,
                    profilePhotoUrl,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to submit application");
            }

            // Update session to reflect pending status
            await update();

            // Show success modal
            setShowSuccessModal(true);

            // Redirect to dashboard after 3 seconds
            setTimeout(() => {
                router.push("/dashboard");
            }, 3000);
        } catch (error: any) {
            console.error("Failed to submit application:", error);
            alert(error.message || "Failed to submit application. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Redirect if already approved
    useEffect(() => {
        if (session?.user?.creatorStatus === 'approved') {
            router.push("/creator/html");
        }
    }, [session?.user?.creatorStatus, router]);

    // If already pending, show message instead of form
    if (session?.user?.creatorStatus === 'pending') {
        return (
            <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-2xl mx-auto">
                    <div className="bg-white rounded-2xl shadow-xl p-8">
                        <div className="text-center">
                            {/* Pending Icon */}
                            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-yellow-100 mb-4">
                                <Loader2 className="h-8 w-8 text-yellow-600 animate-spin" />
                            </div>

                            {/* Message */}
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                Application Under Review
                            </h1>
                            <p className="text-lg text-gray-600 mb-6 font-medium">
                                Please wait, your profile is currently under review.
                            </p>

                            {/* Status Info */}
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6 text-left">
                                <h3 className="font-semibold text-yellow-900 mb-3">Application Status: Pending Review</h3>
                                <ul className="space-y-2 text-sm text-yellow-800">
                                    <li className="flex items-start gap-2">
                                        <span className="text-yellow-600 mt-0.5">✓</span>
                                        <span>Your application has been received</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-yellow-600 mt-0.5">⏳</span>
                                        <span>Our team is reviewing your application</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-yellow-600 mt-0.5">📧</span>
                                        <span>You&apos;ll receive an email notification once reviewed</span>
                                    </li>
                                </ul>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-4">
                                <Button
                                    onClick={() => router.push("/dashboard")}
                                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                                >
                                    Go to Dashboard
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (session?.user?.creatorStatus === 'approved') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-600 mb-4" />
                    <p className="text-gray-600">Redirecting to Creator Studio...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                        Become a Creator
                    </h1>
                    <p className="text-lg text-gray-600">
                        Join our platform and start creating amazing templates
                    </p>
                </div>

                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Full Name */}
                        <div>
                            <Label htmlFor="fullName">Full Name *</Label>
                            <Input
                                id="fullName"
                                value={formData.fullName}
                                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                required
                                className="mt-1"
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <Label htmlFor="email">Email *</Label>
                            <Input
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                                className="mt-1"
                                disabled
                            />
                        </div>

                        {/* Mobile Number */}
                        <div>
                            <Label htmlFor="mobile">Mobile Number *</Label>
                            <Input
                                id="mobile"
                                type="tel"
                                value={formData.mobile}
                                onChange={(e) => {
                                    const value = e.target.value.replace(/\D/g, ''); // Only allow digits
                                    if (value.length <= 10) {
                                        setFormData({ ...formData, mobile: value });
                                    }
                                }}
                                required
                                pattern="[0-9]{10}"
                                maxLength={10}
                                className="mt-1"
                                placeholder="Enter 10-digit mobile number"
                            />
                            {formData.mobile && formData.mobile.length !== 10 && (
                                <p className="text-xs text-red-500 mt-1">
                                    Mobile number must be exactly 10 digits
                                </p>
                            )}
                        </div>

                        {/* Country & State */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="country">Country *</Label>
                                <div className="mt-1">
                                    <SearchableSelect
                                        options={countryOptions}
                                        value={selectedCountry}
                                        onChange={(value) => {
                                            setSelectedCountry(value);
                                            const country = allCountries.find(c => c.isoCode === value);
                                            setFormData({ ...formData, country: country?.name || "" });
                                        }}
                                        placeholder="Select Country"
                                        searchPlaceholder="Search countries..."
                                    />
                                </div>
                            </div>
                            <div>
                                <Label htmlFor="state">State *</Label>
                                <div className="mt-1">
                                    <SearchableSelect
                                        options={stateOptions}
                                        value={formData.state}
                                        onChange={(value) => setFormData({ ...formData, state: value })}
                                        placeholder={selectedCountry ? "Select State" : "Select Country First"}
                                        searchPlaceholder="Search states..."
                                        disabled={!selectedCountry || availableStates.length === 0}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Qualification */}
                        <div>
                            <Label htmlFor="qualification">Qualification *</Label>
                            <div className="mt-1">
                                <SearchableSelect
                                    options={qualificationOptions}
                                    value={formData.qualification}
                                    onChange={(value) => setFormData({ ...formData, qualification: value })}
                                    placeholder="Select Qualification"
                                    searchPlaceholder="Search qualifications..."
                                />
                            </div>
                        </div>

                        {/* Resume Upload */}
                        <div>
                            <Label htmlFor="resume">Resume (PDF) *</Label>
                            <div className="mt-1">
                                <input
                                    type="file"
                                    id="resume"
                                    accept=".pdf,application/pdf"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            // Validate file size (5MB = 5 * 1024 * 1024 bytes)
                                            if (file.size > 5 * 1024 * 1024) {
                                                alert("Resume file size must be less than 5MB");
                                                e.target.value = "";
                                                return;
                                            }
                                            // Validate file type
                                            if (file.type !== "application/pdf") {
                                                alert("Please upload a PDF file");
                                                e.target.value = "";
                                                return;
                                            }
                                            setResumeFile(file);
                                        }
                                    }}
                                    className="hidden"
                                    required
                                />
                                <label
                                    htmlFor="resume"
                                    className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors cursor-pointer block"
                                >
                                    {resumeFile ? (
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-center gap-2 text-green-600">
                                                <Check className="h-5 w-5" />
                                                <span className="font-medium">{resumeFile.name}</span>
                                            </div>
                                            <p className="text-xs text-gray-500">
                                                {(resumeFile.size / 1024).toFixed(2)} KB
                                            </p>
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    setResumeFile(null);
                                                    const input = document.getElementById("resume") as HTMLInputElement;
                                                    if (input) input.value = "";
                                                }}
                                                className="text-red-600 hover:text-red-700 text-sm underline"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    ) : (
                                        <>
                                            <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                            <p className="mt-2 text-sm text-gray-600">
                                                Click to upload or drag and drop
                                            </p>
                                            <p className="text-xs text-gray-500">PDF up to 5MB</p>
                                        </>
                                    )}
                                </label>
                            </div>
                        </div>

                        {/* Profile Photo */}
                        <div>
                            <Label htmlFor="photo">Profile Photo *</Label>
                            <div className="mt-1">
                                <input
                                    type="file"
                                    id="photo"
                                    accept="image/jpeg,image/jpg,image/png"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            // Validate file size (2MB = 2 * 1024 * 1024 bytes)
                                            if (file.size > 2 * 1024 * 1024) {
                                                alert("Photo file size must be less than 2MB");
                                                e.target.value = "";
                                                return;
                                            }
                                            // Validate file type
                                            if (!["image/jpeg", "image/jpg", "image/png"].includes(file.type)) {
                                                alert("Please upload a JPG or PNG image");
                                                e.target.value = "";
                                                return;
                                            }
                                            setPhotoFile(file);
                                        }
                                    }}
                                    className="hidden"
                                    required
                                />
                                <label
                                    htmlFor="photo"
                                    className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors cursor-pointer block"
                                >
                                    {photoFile ? (
                                        <div className="space-y-2">
                                            <div className="relative w-32 h-32 mx-auto mb-2">
                                                <img
                                                    src={URL.createObjectURL(photoFile)}
                                                    alt="Preview"
                                                    className="w-full h-full object-cover rounded-lg"
                                                />
                                            </div>
                                            <div className="flex items-center justify-center gap-2 text-green-600">
                                                <Check className="h-5 w-5" />
                                                <span className="font-medium">{photoFile.name}</span>
                                            </div>
                                            <p className="text-xs text-gray-500">
                                                {(photoFile.size / 1024).toFixed(2)} KB
                                            </p>
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    setPhotoFile(null);
                                                    const input = document.getElementById("photo") as HTMLInputElement;
                                                    if (input) input.value = "";
                                                }}
                                                className="text-red-600 hover:text-red-700 text-sm underline"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    ) : (
                                        <>
                                            <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                            <p className="mt-2 text-sm text-gray-600">
                                                Click to upload or drag and drop
                                            </p>
                                            <p className="text-xs text-gray-500">JPG or PNG up to 2MB</p>
                                        </>
                                    )}
                                </label>
                            </div>
                        </div>

                        {/* Portfolio URL */}
                        <div>
                            <Label htmlFor="portfolioUrl">Portfolio/Website URL (Optional)</Label>
                            <Input
                                id="portfolioUrl"
                                type="url"
                                value={formData.portfolioUrl}
                                onChange={(e) => setFormData({ ...formData, portfolioUrl: e.target.value })}
                                className="mt-1"
                                placeholder="https://yourportfolio.com"
                            />
                        </div>

                        {/* Bio */}
                        <div>
                            <Label htmlFor="bio">About You (Optional)</Label>
                            <textarea
                                id="bio"
                                value={formData.bio}
                                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                rows={4}
                                placeholder="Tell us about your experience and what makes you a great creator..."
                            />
                        </div>

                        {/* Specialization */}
                        <div>
                            <Label htmlFor="specialization">Specialization (Optional)</Label>
                            <Input
                                id="specialization"
                                value={formData.specialization}
                                onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                                className="mt-1"
                                placeholder="e.g., Birthday Cards, Wedding Invitations, Corporate Templates"
                            />
                        </div>

                        {/* Submit Button */}
                        <div className="flex gap-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => router.back()}
                                className="flex-1"
                                disabled={isSubmitting}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className="flex-1 bg-blue-600 hover:bg-blue-700"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Submitting...
                                    </>
                                ) : (
                                    "Submit Application"
                                )}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Success Modal */}
            {showSuccessModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full animate-in fade-in zoom-in duration-300">
                        <div className="text-center">
                            {/* Success Icon */}
                            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                                <Check className="h-8 w-8 text-green-600" />
                            </div>

                            {/* Success Message */}
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                Application Submitted!
                            </h2>
                            <p className="text-gray-600 mb-6">
                                Thank you for applying to become a creator. Your application has been submitted successfully and is now under review.
                            </p>

                            {/* Info Box */}
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left">
                                <h3 className="font-semibold text-blue-900 mb-2">What&apos;s Next?</h3>
                                <ul className="space-y-1 text-sm text-blue-800">
                                    <li>• Our team will review your application</li>
                                    <li>• You&apos;ll receive an email notification</li>
                                    <li>• Average review time: 2-3 business days</li>
                                </ul>
                            </div>

                            {/* Redirect Message */}
                            <p className="text-sm text-gray-500">
                                Redirecting to dashboard in 3 seconds...
                            </p>

                            {/* Manual Redirect Button */}
                            <Button
                                onClick={() => router.push("/dashboard")}
                                className="mt-4 w-full bg-blue-600 hover:bg-blue-700"
                            >
                                Go to Dashboard Now
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
