import { protectServer } from "@/features/auth/utils";
import { SettingsForm } from "./settings-form";

export default async function SettingsPage() {
    await protectServer();

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 p-6">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        Personal Preferences
                    </h1>
                    <p className="text-gray-600 mt-2 font-medium">
                        Customise your experience and default template settings
                    </p>
                </div>

                {/* Settings Form Card */}
                <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] border-2 border-white shadow-[0_20px_50px_rgba(0,0,0,0.05)] p-10">
                    <SettingsForm />
                </div>
            </div>
        </div>
    );
}
