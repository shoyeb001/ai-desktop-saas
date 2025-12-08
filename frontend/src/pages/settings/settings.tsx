import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { Label } from "@/components/ui/label";

const SettingsSchema = z.object({
    geminiApiKey: z.string().min(10, "API Key is required"),
    firstName: z.string().min(1, "Required"),
    lastName: z.string().min(1, "Required"),
    email: z.string().email("Invalid email"),
    password: z.string().optional(),
});

type SettingsFormValues = z.infer<typeof SettingsSchema>;

export default function SettingsPage() {
    const navigate = useNavigate();
    const [showApiKey, setShowApiKey] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const form = useForm<SettingsFormValues>({
        resolver: zodResolver(SettingsSchema),
        defaultValues: {
            geminiApiKey: "",
            firstName: "",
            lastName: "",
            email: "",
            password: "",
        },
    });

    // Load saved settings
    useEffect(() => {
        async function load() {
            const data = await window.electronAPI.getSettings();
            form.reset(data);
        }
        load();
    }, []);

    const onSubmit = async (values: SettingsFormValues) => {
        await window.electronAPI.updateSettings(values);
        alert("Settings saved successfully!");
    };

    return (
        <div className="p-10 w-full bg-[#0f172a]">
            <h1 className="text-4xl font-bold text-white mb-2">Settings</h1>
            <p className="text-gray-400 mb-10">
                Manage your application preferences and personal information.
            </p>

            <Card className="bg-[#111827] border-none mb-10 text-white">
                <CardHeader>
                    <CardTitle>Application</CardTitle>
                    <CardDescription className="text-gray-400">
                        Configure your application settings.
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-3">
                    <Label>Google Gemini API Key</Label>
                    <div className="relative">
                        <Input
                            type={showApiKey ? "text" : "password"}
                            className="bg-[#1f2937] border-none text-gray-300"
                            {...form.register("geminiApiKey")}
                        />
                        <button
                            type="button"
                            className="absolute right-2 top-2 text-gray-500"
                            onClick={() => setShowApiKey(!showApiKey)}
                        >
                            {showApiKey ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                    {form.formState.errors.geminiApiKey && (
                        <p className="text-red-400 text-sm">
                            {form.formState.errors.geminiApiKey.message}
                        </p>
                    )}
                </CardContent>
            </Card>

            <Card className="bg-[#111827] border-none text-white">
                <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription className="text-gray-400">
                        Update your personal details.
                    </CardDescription>
                </CardHeader>

                <CardContent className="grid grid-cols-2 gap-5">
                    <div>
                        <Label className="mb-2">First Name</Label>
                        <Input
                            className="bg-[#1f2937] border-none text-gray-300"
                            {...form.register("firstName")}
                        />
                        <p className="text-red-400 text-sm">{form.formState.errors.firstName?.message}</p>
                    </div>

                    <div>
                        <Label className="mb-2">Last Name</Label>
                        <Input
                            className="bg-[#1f2937] border-none text-gray-300"
                            {...form.register("lastName")}
                        />
                        <p className="text-red-400 text-sm">{form.formState.errors.lastName?.message}</p>
                    </div>

                    <div className="col-span-2">
                        <Label className="mb-2">Email</Label>
                        <Input
                            className="bg-[#1f2937] border-none text-gray-300"
                            {...form.register("email")}
                        />
                        <p className="text-red-400 text-sm">{form.formState.errors.email?.message}</p>
                    </div>

                    <div className="col-span-2">
                        <Label className="mb-2">Password</Label>
                        <div className="relative">
                            <Input
                                type={showPassword ? "text" : "password"}
                                className="bg-[#1f2937] border-none text-gray-300"
                                {...form.register("password")}
                            />
                            <button
                                type="button"
                                className="absolute right-2 top-2 text-gray-500"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-end mt-8 gap-5">
                <Button variant="outline" className="px-6 py-2" onClick={() => navigate("/")}>
                    Back
                </Button>

                <Button
                    className="bg-blue-600 hover:bg-blue-700 px-6 py-2"
                    onClick={form.handleSubmit(onSubmit)}
                >
                    Save Changes
                </Button>
            </div>
        </div>
    );
}
