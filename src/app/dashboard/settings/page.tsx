"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useSession, signOut } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import { 
  User, 
  Bell, 
  Shield, 
  Palette, 
  LogOut,
  Save,
  Mail,
  Phone
} from "lucide-react"

export default function SettingsPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("profile")
  const [isSaving, setIsSaving] = useState(false)

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Shield },
    { id: "appearance", label: "Appearance", icon: Palette },
  ]

  const handleLogout = async () => {
    await signOut()
    router.push("/sign-in")
  }

  const handleSave = async () => {
    setIsSaving(true)
    // Simulate save
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsSaving(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Settings</h1>
        <p className="text-muted-foreground">Manage your account settings and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <Card className="p-4 h-fit">
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeTab === tab.id 
                    ? "bg-primary/10 text-primary font-medium" 
                    : "hover:bg-secondary text-muted-foreground hover:text-foreground"
                }`}
              >
                <tab.icon className="h-5 w-5" />
                {tab.label}
              </button>
            ))}
            <div className="border-t my-2" />
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors hover:bg-red-50 text-red-600"
            >
              <LogOut className="h-5 w-5" />
              Sign Out
            </button>
          </nav>
        </Card>

        {/* Content */}
        <div className="lg:col-span-3 space-y-6">
          {activeTab === "profile" && (
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-6">Profile Information</h2>
              <div className="space-y-6">
                <div className="flex items-center gap-6">
                  <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-10 w-10 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">{session?.user?.name || "User"}</h3>
                    <p className="text-sm text-muted-foreground">{session?.user?.email}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" defaultValue={session?.user?.name || ""} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input id="email" defaultValue={session?.user?.email || ""} className="pl-10" disabled />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input id="phone" placeholder="+91 98765 43210" className="pl-10" />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleSave} disabled={isSaving}>
                    <Save className="h-4 w-4 mr-2" />
                    {isSaving ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {activeTab === "notifications" && (
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-6">Notification Preferences</h2>
              <div className="space-y-4">
                {[
                  { label: "Email notifications", description: "Receive email updates about your account", defaultChecked: true },
                  { label: "Push notifications", description: "Receive push notifications in browser", defaultChecked: true },
                  { label: "AMC reminders", description: "Get reminded about expiring AMC contracts", defaultChecked: true },
                  { label: "Payment alerts", description: "Get notified about payment due dates", defaultChecked: false },
                  { label: "Complaint updates", description: "Updates when complaints are resolved", defaultChecked: true },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between py-3 border-b last:border-0">
                    <div>
                      <p className="font-medium">{item.label}</p>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                    <input 
                      type="checkbox" 
                      defaultChecked={item.defaultChecked}
                      className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                  </div>
                ))}
              </div>
            </Card>
          )}

          {activeTab === "security" && (
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-6">Security Settings</h2>
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-medium">Change Password</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="current-password">Current Password</Label>
                      <Input id="current-password" type="password" />
                    </div>
                    <div />
                    <div className="space-y-2">
                      <Label htmlFor="new-password">New Password</Label>
                      <Input id="new-password" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm Password</Label>
                      <Input id="confirm-password" type="password" />
                    </div>
                  </div>
                  <Button variant="outline">Update Password</Button>
                </div>

                <div className="border-t pt-6">
                  <h3 className="font-medium text-red-600 mb-2">Danger Zone</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Once you delete your account, there is no going back. Please be certain.
                  </p>
                  <Button variant="destructive">Delete Account</Button>
                </div>
              </div>
            </Card>
          )}

          {activeTab === "appearance" && (
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-6">Appearance</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium mb-4">Theme</h3>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { id: "light", label: "Light", bg: "bg-white" },
                      { id: "dark", label: "Dark", bg: "bg-gray-900" },
                      { id: "system", label: "System", bg: "bg-gradient-to-r from-white to-gray-900" },
                    ].map((theme) => (
                      <button
                        key={theme.id}
                        className="p-4 border rounded-xl hover:border-primary transition-colors text-center"
                      >
                        <div className={`h-16 w-full rounded-lg ${theme.bg} mb-2 border`} />
                        <span className="text-sm font-medium">{theme.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
