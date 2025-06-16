"use client"

import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  updateDoc,
  doc,
  where,
  getDocs,
  serverTimestamp,
  increment,
} from "firebase/firestore"
import { db } from "@/lib/firebase"

export interface FirebaseUser {
  uid: string
  email: string
  fullName: string
  isActivated: boolean
  activationPending: boolean
  activatedAt?: any
  createdAt: any
  updatedAt?: any
  applications?: string[]
  role?: "user" | "admin" | "employer"
  lastLoginAt?: any
  totalEarnings?: number
  availableBalance?: number
  referralCount?: number
  phoneNumber?: string
  profileComplete?: boolean
}

export interface ChatMessage {
  id: string
  userId: string
  userName: string
  userEmail: string
  message: string
  timestamp: any
  isFromAdmin: boolean
  adminId?: string
  adminName?: string
  status: "sent" | "delivered" | "read"
  attachments?: string[]
}

export interface SupportTicket {
  id: string
  userId: string
  userName: string
  userEmail: string
  subject: string
  status: "open" | "in-progress" | "resolved" | "closed"
  priority: "low" | "medium" | "high" | "urgent"
  createdAt: any
  updatedAt: any
  assignedTo?: string
  lastMessageAt: any
  messageCount: number
}

export interface PlatformStats {
  totalUsers: number
  activeUsers: number
  pendingActivations: number
  newUsersToday: number
  newUsersThisWeek: number
  totalRevenue: number
  totalWithdrawals: number
  activeJobs: number
  completedJobs: number
  pendingWithdrawals: number
}

class FirebaseAdminService {
  private static instance: FirebaseAdminService

  static getInstance(): FirebaseAdminService {
    if (!FirebaseAdminService.instance) {
      FirebaseAdminService.instance = new FirebaseAdminService()
    }
    return FirebaseAdminService.instance
  }

  // Get REAL user data from Firebase
  async getAllUsers(): Promise<FirebaseUser[]> {
    if (!db) {
      console.error("Firebase not initialized")
      return []
    }

    try {
      const usersRef = collection(db, "users")
      const snapshot = await getDocs(usersRef)

      const users: FirebaseUser[] = []
      snapshot.forEach((doc) => {
        const userData = doc.data()
        users.push({
          uid: doc.id,
          email: userData.email || "",
          fullName: userData.fullName || userData.displayName || "Unknown User",
          isActivated: userData.isActivated || false,
          activationPending: userData.activationPending || false,
          createdAt: userData.createdAt,
          activatedAt: userData.activatedAt,
          role: userData.role || "user",
          applications: userData.applications || [],
          totalEarnings: userData.totalEarnings || 0,
          availableBalance: userData.availableBalance || 0,
          phoneNumber: userData.phoneNumber,
          profileComplete: userData.profileComplete || false,
          ...userData,
        } as FirebaseUser)
      })

      console.log(`Loaded ${users.length} users from Firebase`)
      return users
    } catch (error) {
      console.error("Error fetching users from Firebase:", error)
      return []
    }
  }

  // Subscribe to REAL user data changes
  subscribeToUsers(callback: (users: FirebaseUser[]) => void): () => void {
    if (!db) {
      console.error("Firebase not initialized")
      callback([])
      return () => {}
    }

    const usersRef = collection(db, "users")

    return onSnapshot(
      usersRef,
      (snapshot) => {
        const users: FirebaseUser[] = []
        snapshot.forEach((doc) => {
          const userData = doc.data()
          users.push({
            uid: doc.id,
            email: userData.email || "",
            fullName: userData.fullName || userData.displayName || "Unknown User",
            isActivated: userData.isActivated || false,
            activationPending: userData.activationPending || false,
            createdAt: userData.createdAt,
            activatedAt: userData.activatedAt,
            role: userData.role || "user",
            applications: userData.applications || [],
            totalEarnings: userData.totalEarnings || 0,
            availableBalance: userData.availableBalance || 0,
            phoneNumber: userData.phoneNumber,
            profileComplete: userData.profileComplete || false,
            ...userData,
          } as FirebaseUser)
        })

        console.log(`Real-time update: ${users.length} users`)
        callback(users)
      },
      (error) => {
        console.error("Error subscribing to users:", error)
        callback([])
      },
    )
  }

  // Get REAL platform statistics
  async getPlatformStats(): Promise<PlatformStats> {
    if (!db) {
      return {
        totalUsers: 0,
        activeUsers: 0,
        pendingActivations: 0,
        newUsersToday: 0,
        newUsersThisWeek: 0,
        totalRevenue: 0,
        totalWithdrawals: 0,
        activeJobs: 0,
        completedJobs: 0,
        pendingWithdrawals: 0,
      }
    }

    try {
      // Get real user data
      const users = await this.getAllUsers()

      // Calculate real statistics
      const now = new Date()
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)

      const totalUsers = users.length
      const activeUsers = users.filter((u) => u.isActivated).length
      const pendingActivations = users.filter((u) => !u.isActivated && u.activationPending).length

      const newUsersToday = users.filter((u) => {
        if (!u.createdAt) return false
        const createdDate = u.createdAt.toDate ? u.createdAt.toDate() : new Date(u.createdAt)
        return createdDate >= today
      }).length

      const newUsersThisWeek = users.filter((u) => {
        if (!u.createdAt) return false
        const createdDate = u.createdAt.toDate ? u.createdAt.toDate() : new Date(u.createdAt)
        return createdDate >= weekAgo
      }).length

      // Calculate real revenue from activations
      const totalRevenue = activeUsers * 5 // $5 per activation
      const totalWithdrawals = users.reduce((sum, user) => sum + (user.totalEarnings || 0), 0)

      // Get real job data
      const jobsRef = collection(db, "jobs")
      const jobsSnapshot = await getDocs(jobsRef)
      const activeJobs = jobsSnapshot.size

      // Get real withdrawal requests
      const withdrawalsRef = collection(db, "withdrawals")
      const withdrawalsSnapshot = await getDocs(withdrawalsRef)
      const pendingWithdrawals = withdrawalsSnapshot.docs.filter((doc) => doc.data().status === "pending").length

      const stats = {
        totalUsers,
        activeUsers,
        pendingActivations,
        newUsersToday,
        newUsersThisWeek,
        totalRevenue,
        totalWithdrawals,
        activeJobs,
        completedJobs: 0, // Calculate from job completions
        pendingWithdrawals,
      }

      console.log("Real platform stats:", stats)
      return stats
    } catch (error) {
      console.error("Error getting platform stats:", error)
      return {
        totalUsers: 0,
        activeUsers: 0,
        pendingActivations: 0,
        newUsersToday: 0,
        newUsersThisWeek: 0,
        totalRevenue: 0,
        totalWithdrawals: 0,
        activeJobs: 0,
        completedJobs: 0,
        pendingWithdrawals: 0,
      }
    }
  }

  // User management functions
  async updateUser(uid: string, data: Partial<FirebaseUser>): Promise<boolean> {
    if (!db) return false

    try {
      const userRef = doc(db, "users", uid)
      await updateDoc(userRef, {
        ...data,
        updatedAt: serverTimestamp(),
      })
      console.log(`Updated user ${uid}:`, data)
      return true
    } catch (error) {
      console.error("Error updating user:", error)
      return false
    }
  }

  async activateUser(uid: string): Promise<boolean> {
    try {
      const success = await this.updateUser(uid, {
        isActivated: true,
        activationPending: false,
        activatedAt: serverTimestamp(),
      })

      if (success) {
        console.log(`User ${uid} activated successfully`)
      }

      return success
    } catch (error) {
      console.error("Error activating user:", error)
      return false
    }
  }

  async suspendUser(uid: string): Promise<boolean> {
    try {
      const success = await this.updateUser(uid, {
        isActivated: false,
        suspendedAt: serverTimestamp(),
        suspensionReason: "Admin action",
      })

      if (success) {
        console.log(`User ${uid} suspended successfully`)
      }

      return success
    } catch (error) {
      console.error("Error suspending user:", error)
      return false
    }
  }

  // Support ticket system
  async createSupportTicket(
    userId: string,
    userName: string,
    userEmail: string,
    subject: string,
  ): Promise<string | null> {
    if (!db) return null

    try {
      const ticketData = {
        userId,
        userName,
        userEmail,
        subject,
        status: "open" as const,
        priority: "medium" as const,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        lastMessageAt: serverTimestamp(),
        messageCount: 0,
      }

      const docRef = await addDoc(collection(db, "support_tickets"), ticketData)
      console.log(`Created support ticket ${docRef.id} for user ${userId}`)
      return docRef.id
    } catch (error) {
      console.error("Error creating support ticket:", error)
      return null
    }
  }

  // Subscribe to REAL support tickets
  subscribeToTickets(callback: (tickets: SupportTicket[]) => void): () => void {
    if (!db) {
      callback([])
      return () => {}
    }

    const ticketsRef = collection(db, "support_tickets")
    const q = query(ticketsRef, orderBy("lastMessageAt", "desc"))

    return onSnapshot(
      q,
      (snapshot) => {
        const tickets: SupportTicket[] = []
        snapshot.forEach((doc) => {
          tickets.push({
            id: doc.id,
            ...doc.data(),
          } as SupportTicket)
        })

        console.log(`Real-time tickets update: ${tickets.length} tickets`)
        callback(tickets)
      },
      (error) => {
        console.error("Error subscribing to tickets:", error)
        callback([])
      },
    )
  }

  // Subscribe to REAL messages
  subscribeToMessages(ticketId: string, callback: (messages: ChatMessage[]) => void): () => void {
    if (!db) {
      callback([])
      return () => {}
    }

    const messagesRef = collection(db, "support_tickets", ticketId, "messages")
    const q = query(messagesRef, orderBy("timestamp", "asc"))

    return onSnapshot(
      q,
      (snapshot) => {
        const messages: ChatMessage[] = []
        snapshot.forEach((doc) => {
          messages.push({
            id: doc.id,
            ...doc.data(),
          } as ChatMessage)
        })

        console.log(`Real-time messages update for ticket ${ticketId}: ${messages.length} messages`)
        callback(messages)
      },
      (error) => {
        console.error("Error subscribing to messages:", error)
        callback([])
      },
    )
  }

  async sendMessage(
    ticketId: string,
    message: string,
    isFromAdmin: boolean,
    userId?: string,
    userName?: string,
    userEmail?: string,
    adminId?: string,
    adminName?: string,
  ): Promise<boolean> {
    if (!db) return false

    try {
      const messageData = {
        userId: userId || "",
        userName: userName || "",
        userEmail: userEmail || "",
        message,
        timestamp: serverTimestamp(),
        isFromAdmin,
        adminId,
        adminName,
        status: "sent" as const,
      }

      // Add message to subcollection
      await addDoc(collection(db, "support_tickets", ticketId, "messages"), messageData)

      // Update ticket
      const ticketRef = doc(db, "support_tickets", ticketId)
      await updateDoc(ticketRef, {
        lastMessageAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        messageCount: increment(1),
      })

      console.log(`Message sent to ticket ${ticketId} by ${isFromAdmin ? "admin" : "user"}`)
      return true
    } catch (error) {
      console.error("Error sending message:", error)
      return false
    }
  }

  async updateTicketStatus(ticketId: string, status: SupportTicket["status"]): Promise<boolean> {
    if (!db) return false

    try {
      const ticketRef = doc(db, "support_tickets", ticketId)
      await updateDoc(ticketRef, {
        status,
        updatedAt: serverTimestamp(),
      })

      console.log(`Ticket ${ticketId} status updated to ${status}`)
      return true
    } catch (error) {
      console.error("Error updating ticket status:", error)
      return false
    }
  }

  // Get user tickets
  async getUserTickets(userId: string): Promise<SupportTicket[]> {
    if (!db) return []

    try {
      const ticketsRef = collection(db, "support_tickets")
      const q = query(ticketsRef, where("userId", "==", userId), orderBy("lastMessageAt", "desc"))
      const snapshot = await getDocs(q)

      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as SupportTicket[]
    } catch (error) {
      console.error("Error fetching user tickets:", error)
      return []
    }
  }

  // Legacy method for compatibility
  async getUserStats() {
    return this.getPlatformStats()
  }
}

export const firebaseAdminService = FirebaseAdminService.getInstance()
