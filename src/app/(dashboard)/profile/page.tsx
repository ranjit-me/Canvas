import { protectServer } from "@/features/auth/utils";
import { ProfileForm } from "./profile-form";

export default async function ProfilePage() {
    await protectServer();

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 p-6">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        Profile Settings
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Manage your account information and preferences
                    </p>
                </div>

                {/* Profile Form Card */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <ProfileForm />
                </div>
            </div>
        </div>
    );
}
