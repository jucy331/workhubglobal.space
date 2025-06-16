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
  activatedAt?: string
  createdAt: any
  updatedAt: any
  applications?: string[]
  role?: "user" | "admin" | "employer"
  lastLoginAt?: string
  totalEarnings?: number
  availableBalance?: number
  referralCount?: number
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

class FirebaseAdminService {
  private static instance: FirebaseAdminService

  static getInstance(): FirebaseAdminService {
    if (!FirebaseAdminService.instance) {
      FirebaseAdminService.instance = new FirebaseAdminService()
    }
    return FirebaseAdminService.instance
  }

  // User Management
  async getAllUsers(): Promise<FirebaseUser[]> {
    if (!db) return []

    try {
      const usersRef = collection(db, "users")
      const q = query(usersRef, orderBy("createdAt", "desc"))
      const snapshot = await getDocs(q)

      return snapshot.docs.map((doc) => ({
        uid: doc.id,
        ...doc.data(),
      })) as FirebaseUser[]
    } catch (error) {
      console.error("Error fetching users:", error)
      return []
    }
  }

  subscribeToUsers(callback: (users: FirebaseUser[]) => void): () => void {
    if (!db) {
      callback([])
      return () => {}
    }

    const usersRef = collection(db, "users")
    const q = query(usersRef, orderBy("createdAt", "desc"))

    return onSnapshot(
      q,
      (snapshot) => {
        const users = snapshot.docs.map((doc) => ({
          uid: doc.id,
          ...doc.data(),
        })) as FirebaseUser[]
        callback(users)
      },
      (error) => {
        console.error("Error subscribing to users:", error)
        callback([])
      },
    )
  }

  async updateUser(uid: string, data: Partial<FirebaseUser>): Promise<boolean> {
    if (!db) return false

    try {
      const userRef = doc(db, "users", uid)
      await updateDoc(userRef, {
        ...data,
        updatedAt: serverTimestamp(),
      })
      return true
    } catch (error) {
      console.error("Error updating user:", error)
      return false
    }
  }

  async activateUser(uid: string): Promise<boolean> {
    return this.updateUser(uid, {
      isActivated: true,
      activationPending: false,
      activatedAt: new Date().toISOString(),
    })
  }

  async suspendUser(uid: string): Promise<boolean> {
    return this.updateUser(uid, {
      isActivated: false,
      role: "user", // Remove any elevated privileges
    })
  }

  // Support Ticket System
  async createSupportTicket(
    userId: string,
    userName: string,
    userEmail: string,
    subject: string,
  ): Promise<string | null> {
    if (!db) return null

    try {
      const ticketData: Omit<SupportTicket, "id"> = {
        userId,
        userName,
        userEmail,
        subject,
        status: "open",
        priority: "medium",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        lastMessageAt: serverTimestamp(),
        messageCount: 0,
      }

      const docRef = await addDoc(collection(db, "support_tickets"), ticketData)
      return docRef.id
    } catch (error) {
      console.error("Error creating support ticket:", error)
      return null
    }
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
      const messageData: Omit<ChatMessage, "id"> = {
        userId: userId || "",
        userName: userName || "",
        userEmail: userEmail || "",
        message,
        timestamp: serverTimestamp(),
        isFromAdmin,
        adminId,
        adminName,
        status: "sent",
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

      return true
    } catch (error) {
      console.error("Error sending message:", error)
      return false
    }
  }

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
        const tickets = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as SupportTicket[]
        callback(tickets)
      },
      (error) => {
        console.error("Error subscribing to tickets:", error)
        callback([])
      },
    )
  }

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
        const messages = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as ChatMessage[]
        callback(messages)
      },
      (error) => {
        console.error("Error subscribing to messages:", error)
        callback([])
      },
    )
  }

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

  async updateTicketStatus(ticketId: string, status: SupportTicket["status"]): Promise<boolean> {
    if (!db) return false

    try {
      const ticketRef = doc(db, "support_tickets", ticketId)
      await updateDoc(ticketRef, {
        status,
        updatedAt: serverTimestamp(),
      })
      return true
    } catch (error) {
      console.error("Error updating ticket status:", error)
      return false
    }
  }

  // Analytics
  async getUserStats(): Promise<{
    totalUsers: number
    activeUsers: number
    pendingActivations: number
    newUsersToday: number
    newUsersThisWeek: number
  }> {
    if (!db)
      return {
        totalUsers: 0,
        activeUsers: 0,
        pendingActivations: 0,
        newUsersToday: 0,
        newUsersThisWeek: 0,
      }

    try {
      const users = await this.getAllUsers()
      const now = new Date()
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)

      return {
        totalUsers: users.length,
        activeUsers: users.filter((u) => u.isActivated).length,
        pendingActivations: users.filter((u) => !u.isActivated && u.activationPending).length,
        newUsersToday: users.filter((u) => {
          const createdAt = u.createdAt?.toDate ? u.createdAt.toDate() : new Date(u.createdAt)
          return createdAt >= today
        }).length,
        newUsersThisWeek: users.filter((u) => {
          const createdAt = u.createdAt?.toDate ? u.createdAt.toDate() : new Date(u.createdAt)
          return createdAt >= weekAgo
        }).length,
      }
    } catch (error) {
      console.error("Error getting user stats:", error)
      return {
        totalUsers: 0,
        activeUsers: 0,
        pendingActivations: 0,
        newUsersToday: 0,
        newUsersThisWeek: 0,
      }
    }
  }
}

export const firebaseAdminService = FirebaseAdminService.getInstance()
