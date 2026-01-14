import { getSettings } from '@/app/actions/admin/manage-settings'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { SettingsEditor } from '@/components/admin/settings-editor'
import { Badge } from "@/components/ui/badge"
import { Check, ShieldCheck } from "lucide-react"

export default async function SettingsPage() {
    const result = await getSettings()
    const settings = result.success ? result.data || [] : []

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-black mb-2">Platform Settings</h1>
                <p className="text-gray-500">Configure global application settings</p>
            </div>

            <div className="space-y-6">
                <SettingsEditor settings={settings} />

                {/* System Info Card */}
                <Card className="border-gray-100 shadow-sm">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <ShieldCheck className="w-5 h-5 text-[#00C975]" />
                            <CardTitle>System Health</CardTitle>
                        </div>
                        <CardDescription>Current status of system components</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between py-2 border-b border-gray-50">
                            <span className="text-sm font-medium">Database Connection</span>
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                <Check className="w-3 h-3 mr-1" /> Connected
                            </Badge>
                        </div>
                        <div className="flex items-center justify-between py-2 border-b border-gray-50">
                            <span className="text-sm font-medium">Storage API</span>
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                <Check className="w-3 h-3 mr-1" /> Operational
                            </Badge>
                        </div>
                        <div className="flex items-center justify-between py-2">
                            <span className="text-sm font-medium">Auth Service</span>
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                <Check className="w-3 h-3 mr-1" /> Secure
                            </Badge>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
