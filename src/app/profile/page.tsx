"use client"

import { useState } from "react"
import { Mail, Briefcase, Edit, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false)
  const [userProfile, setUserProfile] = useState({
    name: "Divyansh Srivastava",
    email: "user@example.com",
    skills: "C++, React, Django, Node.js, PostgreSQL",
    bio: "Full Stack Developer passionate about building scalable applications.",
  })
  const [editData, setEditData] = useState(userProfile)

  const handleSaveProfile = () => {
    setUserProfile(editData)
    setIsEditing(false)
  }

  if (isEditing) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card>
          <CardHeader className="flex items-center justify-between flex-row">
            <CardTitle>Edit Profile</CardTitle>
            <button onClick={() => setIsEditing(false)} className="hover:opacity-70">
              <X className="w-5 h-5" />
            </button>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Full Name</label>
              <Input value={editData.name} onChange={(e) => setEditData({ ...editData, name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input
                type="email"
                value={editData.email}
                onChange={(e) => setEditData({ ...editData, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Bio</label>
              <textarea
                value={editData.bio}
                onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
                rows={3}
                className="w-full p-2 border border-input rounded-md resize-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Skills</label>
              <textarea
                value={editData.skills}
                onChange={(e) => setEditData({ ...editData, skills: e.target.value })}
                rows={2}
                className="w-full p-2 border border-input rounded-md resize-none"
              />
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setIsEditing(false)} className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleSaveProfile} className="flex-1">
                Save Changes
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold mb-2">My Profile</h1>
          <p className="text-muted-foreground">Manage your personal information and preferences</p>
        </div>

        {/* Profile Card */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent-foreground flex items-center justify-center text-white text-2xl font-bold">
                  DS
                </div>
                <div>
                  <CardTitle className="text-2xl">{userProfile.name}</CardTitle>
                  <CardDescription>{userProfile.bio}</CardDescription>
                </div>
              </div>
              <Button variant="outline" className="gap-2 bg-transparent" onClick={() => setIsEditing(true)}>
                <Edit className="w-4 h-4" />
                Edit
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Email */}
            <div className="flex items-start gap-4">
              <Mail className="w-5 h-5 text-muted-foreground mt-1" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Email</p>
                <p className="text-foreground">{userProfile.email}</p>
              </div>
            </div>

            {/* Skills */}
            <div className="flex items-start gap-4">
              <Briefcase className="w-5 h-5 text-muted-foreground mt-1" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Skills</p>
                <p className="text-foreground">{userProfile.skills}</p>
              </div>
            </div>

            {/* Stats */}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
