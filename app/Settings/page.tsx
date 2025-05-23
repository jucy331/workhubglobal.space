"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Settings, Mail } from "lucide-react"

export default function SettingsPage() {
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaving(true)
    setTimeout(() => {
      setSaving(false)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    }, 1000)
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <h1 className="text-4xl font-bold mb-6 flex items-center gap-3">
        <Settings className="h-8 w-8 text-gray-700" />
        Settings
      </h1>
      <div className="bg-white rounded-xl shadow-lg p-8 space-y-6">
        <div>
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={emailNotifications}
              onChange={() => setEmailNotifications(v => !v)}
              className="form-checkbox h-5 w-5 text-blue-600"
            />
            <span className="flex items-center gap-1">
              <Mail className="h-4 w-4 text-blue-500" />
              Enable email notifications
            </span>
          </label>
          <p className="text-xs text-gray-500 ml-8">
            Receive updates about new jobs, application status, and account activity.
          </p>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save Settings"}
        </Button>
        {saved && <div className="text-green-600 text-sm">Settings saved!</div>}
      </div>
    </div>
  )
}
