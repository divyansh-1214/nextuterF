"use client";

import { useState, useEffect } from "react";
import {
  Mail,
  Briefcase,
  Edit,
  X,
  AlertCircle,
  Code2,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import axios from "axios";

interface UserProfile {
  name?: string;
  email?: string;
  skills?: string;
  bio?: string;
  linkedinUname?: string;
  leetcodeUname?: string;
}

interface LeetCodeStats {
  matchedUser?: {
    username?: string;
    profile?: {
      userAvatar?: string;
      realName?: string;
      ranking?: number;
      reputation?: number;
    };
    submitStats?: {
      acSubmissionNum?: Array<{
        difficulty: string;
        count: number;
      }>;
      totalSubmissionNum?: Array<{
        difficulty: string;
        submissions: number;
      }>;
    };
  };
}

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [leetcodeLoading, setLeetcodeLoading] = useState(false);
  const [leetcodeError, setLeetcodeError] = useState<string | null>(null);
  const [leetcodeData, setLeetcodeData] = useState<LeetCodeStats | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: "",
    email: "",
    skills: "",
    bio: "",
    linkedinUname: "",
    leetcodeUname: "",
  });
  const [editData, setEditData] = useState<UserProfile>(userProfile);

  // Load user data from localStorage on mount
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        setUserProfile(userData);
        setEditData(userData);
      } else {
        setError("No user data found. Please log in first.");
      }
    } catch (err) {
      console.error("Failed to load user data from localStorage:", err);
      setError("Failed to load profile data. Please refresh the page.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch LeetCode data when leetcodeUname is available
  useEffect(() => {
    if (userProfile.leetcodeUname) {
      console.log("call");
      
      fetchLeetCodeData(userProfile.leetcodeUname);
    }
  }, [userProfile.leetcodeUname]);

  const fetchLeetCodeData = async (username: string) => {
    setLeetcodeLoading(true);
    setLeetcodeError(null);
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/leetcode/getUser`,{username});
      const data =response.data
      console.log(data);
      
      if (response.data?.data?.matchedUser) {
        setLeetcodeData(response.data.data);
      } else {
        setLeetcodeError("Could not fetch LeetCode profile");
      }
    } catch (err: any) {
      console.error("Failed to fetch LeetCode data:", err);
      setLeetcodeError("Unable to load LeetCode stats");
    } finally {
      setLeetcodeLoading(false);
    }
  };

  const handleSaveProfile = () => {
    try {
      // Update localStorage with new user data
      localStorage.setItem("user", JSON.stringify(editData));
      setUserProfile(editData);
      setIsEditing(false);
    } catch (err) {
      console.error("Failed to save profile:", err);
      setError("Failed to save profile. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card>
          <CardContent className="py-12">
            <p className="text-center text-muted-foreground">
              Loading profile...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card className="border-destructive/50 bg-destructive/5">
          <CardContent className="py-8">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-destructive" />
              <div>
                <p className="font-medium text-destructive">{error}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Please return to the login page and try again.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isEditing) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card>
          <CardHeader className="flex items-center justify-between flex-row">
            <CardTitle>Edit Profile</CardTitle>
            <button
              onClick={() => setIsEditing(false)}
              className="hover:opacity-70"
            >
              <X className="w-5 h-5" />
            </button>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Full Name</label>
              <Input
                value={editData.name || ""}
                onChange={(e) =>
                  setEditData({ ...editData, name: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input
                type="email"
                value={editData.email || ""}
                onChange={(e) =>
                  setEditData({ ...editData, email: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Bio</label>
              <textarea
                value={editData.bio || ""}
                onChange={(e) =>
                  setEditData({ ...editData, bio: e.target.value })
                }
                rows={3}
                className="w-full p-2 border border-input rounded-md resize-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Skills</label>
              <textarea
                value={editData.skills || ""}
                onChange={(e) =>
                  setEditData({ ...editData, skills: e.target.value })
                }
                rows={2}
                className="w-full p-2 border border-input rounded-md resize-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">LinkedIn Username</label>
              <Input
                value={editData.linkedinUname || ""}
                onChange={(e) =>
                  setEditData({ ...editData, linkedinUname: e.target.value })
                }
                placeholder="your-linkedin-profile"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">LeetCode Username</label>
              <Input
                value={editData.leetcodeUname || ""}
                onChange={(e) =>
                  setEditData({ ...editData, leetcodeUname: e.target.value })
                }
                placeholder="your-leetcode-handle"
              />
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setIsEditing(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button onClick={handleSaveProfile} className="flex-1">
                Save Changes
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold mb-2">My Profile</h1>
          <p className="text-muted-foreground">
            Manage your personal information and preferences
          </p>
        </div>

        {/* Profile Card */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent-foreground flex items-center justify-center text-white text-2xl font-bold">
                  {getInitials(userProfile.name)}
                </div>
                <div>
                  <CardTitle className="text-2xl">
                    {userProfile.name || "User"}
                  </CardTitle>
                  <CardDescription>
                    {userProfile.bio || "No bio provided"}
                  </CardDescription>
                </div>
              </div>
              <Button
                variant="outline"
                className="gap-2 bg-transparent"
                onClick={() => setIsEditing(true)}
              >
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
                <p className="text-sm font-medium text-muted-foreground">
                  Email
                </p>
                <p className="text-foreground">
                  {userProfile.email || "Not provided"}
                </p>
              </div>
            </div>

            {/* Skills */}
            {userProfile.skills && (
              <div className="flex items-start gap-4">
                <Briefcase className="w-5 h-5 text-muted-foreground mt-1" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Skills
                  </p>
                  <p className="text-foreground">{userProfile.skills}</p>
                </div>
              </div>
            )}

            {/* LinkedIn */}
            {userProfile.linkedinUname && (
              <div className="flex items-start gap-4">
                <div className="w-5 h-5 text-muted-foreground mt-1 flex items-center justify-center">
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    LinkedIn
                  </p>
                  <a
                    href={`https://linkedin.com/in/${userProfile.linkedinUname}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    {userProfile.linkedinUname}
                  </a>
                </div>
              </div>
            )}

            {/* LeetCode */}
            {userProfile.leetcodeUname && (
              <div className="flex items-start gap-4">
                <div className="w-5 h-5 text-muted-foreground mt-1">
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M13.483 0a1.374 1.374 0 00-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 00-1.209 2.803A4.979 4.979 0 006.25 15.7v3.075c0 .745.592 1.348 1.323 1.348s1.323-.603 1.323-1.348V15.7c0-.745.593-1.348 1.323-1.348s1.323.603 1.323 1.348v3.075c0 .745.593 1.348 1.323 1.348s1.323-.603 1.323-1.348V15.7a4.969 4.969 0 004.144-5.459l-.584-.622h2.771c1.578 0 2.846 1.269 2.846 2.846 0 1.577-1.268 2.846-2.846 2.846h-.583a1.323 1.323 0 100 2.646h.583c2.212 0 4.001-1.79 4.001-4.002 0-2.213-1.79-4.002-4.002-4.002h-2.772l.584-.621A4.5 4.5 0 0013.48 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    LeetCode
                  </p>
                  <a
                    href={`https://leetcode.com/${userProfile.leetcodeUname}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    {userProfile.leetcodeUname}
                  </a>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* LeetCode Stats Card */}
        {userProfile.leetcodeUname && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Code2 className="w-5 h-5 text-yellow-600" />
                  <CardTitle>LeetCode Statistics</CardTitle>
                </div>
                {leetcodeLoading && (
                  <span className="text-xs text-muted-foreground">
                    Loading...
                  </span>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {leetcodeError && (
                <div className="p-3 bg-destructive/10 text-destructive rounded-md text-sm">
                  {leetcodeError}
                </div>
              )}

              {leetcodeData?.matchedUser && (
                <>
                  {/* Profile Info */}
                  <div className="flex items-start gap-4">
                    {leetcodeData.matchedUser.profile?.userAvatar && (
                      <img
                        src={leetcodeData.matchedUser.profile.userAvatar}
                        alt="LeetCode Avatar"
                        className="w-12 h-12 rounded-full"
                      />
                    )}
                    <div className="flex-1">
                      <p className="font-semibold">
                        {leetcodeData.matchedUser.profile?.realName ||
                          leetcodeData.matchedUser.username}
                      </p>
                      <div className="grid grid-cols-2 gap-4 mt-3 text-sm">
                        {leetcodeData.matchedUser.profile?.ranking && (
                          <div>
                            <p className="text-muted-foreground">Ranking</p>
                            <p className="font-semibold">
                              #
                              {leetcodeData.matchedUser.profile.ranking.toLocaleString()}
                            </p>
                          </div>
                        )}
                        {leetcodeData.matchedUser.profile?.reputation !==
                          undefined && (
                          <div>
                            <p className="text-muted-foreground">Reputation</p>
                            <p className="font-semibold">
                              {leetcodeData.matchedUser.profile.reputation}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Submission Stats */}
                  {leetcodeData.matchedUser.submitStats?.acSubmissionNum && (
                    <div>
                      <p className="font-semibold mb-3 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4" />
                        Problems Solved
                      </p>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {leetcodeData.matchedUser.submitStats.acSubmissionNum.map(
                          (stat: any) => (
                            <div
                              key={stat.difficulty}
                              className="p-3 bg-muted rounded-lg text-center"
                            >
                              <p className="text-xs text-muted-foreground mb-1">
                                {stat.difficulty}
                              </p>
                              <p className="text-lg font-bold text-primary">
                                {stat.count}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {stat.submissions} submissions
                              </p>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}

                  {/* Total Submissions */}
                  {leetcodeData.matchedUser.submitStats?.totalSubmissionNum && (
                    <div>
                      <p className="font-semibold mb-3">Total Submissions</p>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {leetcodeData.matchedUser.submitStats.totalSubmissionNum.map(
                          (stat: any) => (
                            <div
                              key={stat.difficulty}
                              className="p-3 bg-muted rounded-lg text-center"
                            >
                              <p className="text-xs text-muted-foreground mb-1">
                                {stat.difficulty}
                              </p>
                              <p className="text-lg font-bold">
                                {stat.submissions}
                              </p>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
