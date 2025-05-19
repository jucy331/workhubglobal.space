"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, XCircle, Loader2, AlertCircle, Search, ExternalLink } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/contexts/auth-context"
import { collection, query, where, getDocs, doc, updateDoc, serverTimestamp, orderBy } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import Link from "next/link"
import Image from "next/image"

// Admin-only route
export default function AdminPage() {
  const { user, userProfile } = useAuth()
  const [pendingActivations, setPendingActivations] = useState<any[]>([])
  const [recentActivations, setRecentActivations] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("pending")
  const [processingUser, setProcessingUser] = useState<string | null>(null)

  // Check if user is admin
  const isAdmin = userProfile?.email === "admin@workhub.com" // Replace with your admin check logic

  useEffect(() => {
    const fetchActivations = async () => {
      if (!user || !isAdmin) return

      setIsLoading(true)
      setError(null)

      try {
        // Fetch pending activations
        const pendingQuery = query(
          collection(db, "users"),
          where("activationPending", "==", true),
          where("isActivated", "==", false),
          orderBy("paymentSubmittedAt", "desc"),
        )

        const pendingSnapshot = await getDocs(pendingQuery)
        const pendingUsers: any[] = []

        pendingSnapshot.forEach((doc) => {
          pendingUsers.push({
            id: doc.id,
            ...doc.data(),
          })
        })

        setPendingActivations(pendingUsers)

        // Fetch recent activations
        const recentQuery = query(
          collection(db, "users"),
          where("isActivated", "==", true),
          orderBy("activatedAt", "desc"),
        )

        const recentSnapshot = await getDocs(recentQuery)
        const recentUsers: any[] = []

        recentSnapshot.forEach((doc) => {
          recentUsers.push({
            id: doc.id,
            ...doc.data(),
          })
        })

        setRecentActivations(recentUsers.slice(0, 10)) // Get only the 10 most recent
      } catch (err) {
        console.error("Error fetching activations:", err)
        setError("Failed to load activation requests")
      } finally {
        setIsLoading(false)
      }
    }

    fetchActivations()
  }, [user, isAdmin])

  const handleApprove = async (userId: string) => {
    if (!user || !isAdmin) return

    setProcessingUser(userId)

    try {
      const userRef = doc(db, "users", userId)
      await updateDoc(userRef, {
        isActivated: true,
        activationPending: false,
        activatedAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })

      // Update local state
      setPendingActivations((prev) => prev.filter((user) => user.id !== userId))

      // Fetch the updated user and add to recent activations
      const userDoc = await getDocs(query(collection(db, "users"), where("__name__", "==", userId)))
      if (!userDoc.empty) {
        const userData = {
          id: userDoc.docs[0].id,
          ...userDoc.docs[0].data(),
        }
        setRecentActivations((prev) => [userData, ...prev].slice(0, 10))
      }
    } catch (err) {
      console.error("Error approving activation:", err)
      setError("Failed to approve activation")
    } finally {
      setProcessingUser(null)
    }
  }

  const handleReject = async (userId: string) => {
    if (!user || !isAdmin) return

    setProcessingUser(userId)

    try {
      const userRef = doc(db, "users", userId)
      await updateDoc(userRef, {
        activationPending: false,
        activationRejected: true,
        rejectedAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })

      // Update local state
      setPendingActivations((prev) => prev.filter((user) => user.id !== userId))
    } catch (err) {
      console.error("Error rejecting activation:", err)
      setError("Failed to reject activation")
    } finally {
      setProcessingUser(null)
    }
  }

  // Filter users based on search query
  const filteredPending = searchQuery
    ? pendingActivations.filter(
        (user) =>
          user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : pendingActivations

  const filteredRecent = searchQuery
    ? recentActivations.filter(
        (user) =>
          user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : recentActivations

  if (!isAdmin) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Access Denied</CardTitle>
              <CardDescription>You don't have permission to access this page</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500 mb-4">
                This page is restricted to administrators only. If you believe this is an error, please contact support.
              </p>
              <Button asChild>
                <Link href="/dashboard">Go to Dashboard</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Manage user activations and system settings</p>
      </div>

      <div className="mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <Input
            placeholder="Search users..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={() => window.location.reload()}>
            Refresh
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 md:w-[400px]">
          <TabsTrigger value="pending">
            Pending Activations
            {pendingActivations.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {pendingActivations.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="recent">Recent Activations</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Pending Account Activations</CardTitle>
              <CardDescription>Review and approve payment screenshots</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : filteredPending.length === 0 ? (
                <div className="text-center py-12 border border-dashed rounded-lg">
                  <CheckCircle2 className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium mb-2">No pending activations</h3>
                  <p className="text-gray-500 max-w-md mx-auto">
                    All activation requests have been processed. Check back later for new requests.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {filteredPending.map((user) => (
                    <div key={user.id} className="border rounded-lg overflow-hidden">
                      <div className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">{user.fullName}</h3>
                            <p className="text-sm text-gray-500">{user.email}</p>
                            <p className="text-xs text-gray-400">
                              Submitted: {user.paymentSubmittedAt?.toDate().toLocaleString() || "Unknown"}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleReject(user.id)}
                              disabled={processingUser === user.id}
                            >
                              {processingUser === user.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <XCircle className="h-4 w-4 mr-1 text-red-500" />
                              )}
                              Reject
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleApprove(user.id)}
                              disabled={processingUser === user.id}
                            >
                              {processingUser === user.id ? (
                                <Loader2 className="h-4 w-4 animate-spin mr-1" />
                              ) : (
                                <CheckCircle2 className="h-4 w-4 mr-1" />
                              )}
                              Approve
                            </Button>
                          </div>
                        </div>
                      </div>

                      {user.paymentScreenshotURL && (
                        <div className="border-t">
                          <div className="relative h-60 w-full">
                            <Image
                              src={user.paymentScreenshotURL || "/placeholder.svg"}
                              alt="Payment screenshot"
                              fill
                              className="object-contain"
                            />
                          </div>
                          <div className="p-2 bg-gray-50 text-center">
                            <a
                              href={user.paymentScreenshotURL}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-primary flex items-center justify-center"
                            >
                              View Full Image
                              <ExternalLink className="h-3 w-3 ml-1" />
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recent" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activations</CardTitle>
              <CardDescription>Users who have been recently activated</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : filteredRecent.length === 0 ? (
                <div className="text-center py-12 border border-dashed rounded-lg">
                  <AlertCircle className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium mb-2">No recent activations</h3>
                  <p className="text-gray-500 max-w-md mx-auto">No users have been activated recently.</p>
                </div>
              ) : (
                <div className="divide-y">
                  {filteredRecent.map((user) => (
                    <div key={user.id} className="py-4 first:pt-0 last:pb-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{user.fullName}</h3>
                          <p className="text-sm text-gray-500">{user.email}</p>
                          <p className="text-xs text-gray-400">
                            Activated: {user.activatedAt?.toDate().toLocaleString() || "Unknown"}
                          </p>
                        </div>
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          Activated
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
