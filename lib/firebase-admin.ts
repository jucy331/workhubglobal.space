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
  getDoc,
} from "firebase/firestore"
import { db } from "@/lib/firebase"

export interface FirebaseUser {
  uid: string
  email: string
  fullName: string
  displayName?: string
  photoURL?: string
  phoneNumber?: string
  isActivated: boolean
  activationPending: boolean
  activatedAt?: any
  createdAt: any
  updatedAt?: any
  lastLoginAt?: any
  emailVerified?: boolean
  role?: "user" | "admin" | "employer"
  // Worker specific fields
  totalEarnings?: number
  availableBalance?: number
  totalWithdrawn?: number
  completedJobs?: number
  // Employer specific fields
  postedJobs?: number
  totalSpent?: number
  // Additional fields
  applications?: string[]
  referralCount?: number
  profileComplete?: boolean
  suspended?: boolean
  suspendedAt?: any
  suspensionReason?: string
}

export interface JobPosting {
  id: string
  title: string
  description: string
  category: string
  payAmount: number
  payType: "per-task" | "hourly" | "fixed"
  maxWorkers: number
  currentWorkers: number
  estimatedTime: string
  requirements: string
  instructions: string
  status: "draft" | "active" | "paused" | "completed" | "cancelled"
  employerId: string
  employerName: string
  employerEmail: string
  createdAt: any
  updatedAt: any
  deadline?: any
  featured: boolean
  urgent: boolean
  tags: string[]
  // Payment tracking
  totalBudget: number
  amountPaid: number
  paymentStatus: "pending" | "paid" | "refunded"
  // Data collection
  submissionsRequired: number
  submissionsReceived: number
  dataCollected: any[]
  completionRate: number
}

export interface JobApplication {
  id: string
  jobId: string
  workerId: string
  workerName: string
  workerEmail: string
  employerId: string
  status: "pending" | "accepted" | "rejected" | "completed" | "paid"
  appliedAt: any
  acceptedAt?: any
  completedAt?: any
  paidAt?: any
  submissionData?: any
  feedback?: string
  rating?: number
  earnings: number
}

export interface ChatMessage {
  id: string
  userId: string
  userName: string
  userEmail: string
  userRole: "user" | "admin" | "employer"
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
  userRole: "user" | "admin" | "employer"
  subject: string
  category: "technical" | "payment" | "job-related" | "account" | "general"
  status: "open" | "in-progress" | "resolved" | "closed"
  priority: "low" | "medium" | "high" | "urgent"
  createdAt: any
  updatedAt: any
  assignedTo?: string
  lastMessageAt: any
  messageCount: number
  relatedJobId?: string
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
  totalJobApplications: number
  completedApplications: number
}

class FirebaseAdminService {
  private static instance: FirebaseAdminService

  static getInstance(): FirebaseAdminService {
    if (!FirebaseAdminService.instance) {
      FirebaseAdminService.instance = new FirebaseAdminService()
    }
    return FirebaseAdminService.instance
  }

  // Get EXACT same user data as authentication
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
        // Use EXACT same structure as auth context
        users.push({
          uid: doc.id,
          email: userData.email || "",
          fullName: userData.fullName || userData.displayName || "Unknown User",
          displayName: userData.displayName,
          photoURL: userData.photoURL,
          phoneNumber: userData.phoneNumber,
          emailVerified: userData.emailVerified || false,
          isActivated: userData.isActivated || false,
          activationPending: userData.activationPending || false,
          createdAt: userData.createdAt,
          activatedAt: userData.activatedAt,
          lastLoginAt: userData.lastLoginAt,
          role: userData.role || "user",
          totalEarnings: userData.totalEarnings || 0,
          availableBalance: userData.availableBalance || 0,
          totalWithdrawn: userData.totalWithdrawn || 0,
          completedJobs: userData.completedJobs || 0,
          postedJobs: userData.postedJobs || 0,
          totalSpent: userData.totalSpent || 0,
          applications: userData.applications || [],
          profileComplete: userData.profileComplete || false,
          suspended: userData.suspended || false,
          suspendedAt: userData.suspendedAt,
          suspensionReason: userData.suspensionReason,
          ...userData,
        } as FirebaseUser)
      })

      console.log(`Loaded ${users.length} users from Firebase (exact auth data)`)
      return users
    } catch (error) {
      console.error("Error fetching users from Firebase:", error)
      return []
    }
  }

  // Subscribe to EXACT user data changes
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
            displayName: userData.displayName,
            photoURL: userData.photoURL,
            phoneNumber: userData.phoneNumber,
            emailVerified: userData.emailVerified || false,
            isActivated: userData.isActivated || false,
            activationPending: userData.activationPending || false,
            createdAt: userData.createdAt,
            activatedAt: userData.activatedAt,
            lastLoginAt: userData.lastLoginAt,
            role: userData.role || "user",
            totalEarnings: userData.totalEarnings || 0,
            availableBalance: userData.availableBalance || 0,
            totalWithdrawn: userData.totalWithdrawn || 0,
            completedJobs: userData.completedJobs || 0,
            postedJobs: userData.postedJobs || 0,
            totalSpent: userData.totalSpent || 0,
            applications: userData.applications || [],
            profileComplete: userData.profileComplete || false,
            suspended: userData.suspended || false,
            suspendedAt: userData.suspendedAt,
            suspensionReason: userData.suspensionReason,
            ...userData,
          } as FirebaseUser)
        })

        console.log(`Real-time update: ${users.length} users (exact auth data)`)
        callback(users)
      },
      (error) => {
        console.error("Error subscribing to users:", error)
        callback([])
      },
    )
  }

  // Job Management
  async createJob(jobData: Omit<JobPosting, "id" | "createdAt" | "updatedAt">): Promise<string | null> {
    if (!db) return null

    try {
      const job = {
        ...jobData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        currentWorkers: 0,
        submissionsReceived: 0,
        dataCollected: [],
        completionRate: 0,
        amountPaid: 0,
        paymentStatus: "pending" as const,
      }

      const docRef = await addDoc(collection(db, "jobs"), job)
      console.log(`Created job ${docRef.id} for employer ${jobData.employerId}`)
      return docRef.id
    } catch (error) {
      console.error("Error creating job:", error)
      return null
    }
  }

  subscribeToJobs(callback: (jobs: JobPosting[]) => void): () => void {
    if (!db) {
      callback([])
      return () => {}
    }

    const jobsRef = collection(db, "jobs")
    const q = query(jobsRef, orderBy("createdAt", "desc"))

    return onSnapshot(
      q,
      (snapshot) => {
        const jobs: JobPosting[] = []
        snapshot.forEach((doc) => {
          jobs.push({
            id: doc.id,
            ...doc.data(),
          } as JobPosting)
        })

        console.log(`Real-time jobs update: ${jobs.length} jobs`)
        callback(jobs)
      },
      (error) => {
        console.error("Error subscribing to jobs:", error)
        callback([])
      },
    )
  }

  async getEmployerJobs(employerId: string): Promise<JobPosting[]> {
    if (!db) return []

    try {
      const jobsRef = collection(db, "jobs")
      const q = query(jobsRef, where("employerId", "==", employerId), orderBy("createdAt", "desc"))
      const snapshot = await getDocs(q)

      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as JobPosting[]
    } catch (error) {
      console.error("Error fetching employer jobs:", error)
      return []
    }
  }

  // Job Applications
  async createJobApplication(applicationData: Omit<JobApplication, "id" | "appliedAt">): Promise<string | null> {
    if (!db) return null

    try {
      const application = {
        ...applicationData,
        appliedAt: serverTimestamp(),
        status: "pending" as const,
      }

      const docRef = await addDoc(collection(db, "job_applications"), application)
      console.log(`Created application ${docRef.id} for job ${applicationData.jobId}`)
      return docRef.id
    } catch (error) {
      console.error("Error creating job application:", error)
      return null
    }
  }

  async updateJobApplication(applicationId: string, updates: Partial<JobApplication>): Promise<boolean> {
    if (!db) return false

    try {
      const applicationRef = doc(db, "job_applications", applicationId)
      await updateDoc(applicationRef, {
        ...updates,
        updatedAt: serverTimestamp(),
      })
      return true
    } catch (error) {
      console.error("Error updating job application:", error)
      return false
    }
  }

  async completeJobApplication(applicationId: string, submissionData: any, earnings: number): Promise<boolean> {
    if (!db) return false

    try {
      // Update application
      const applicationRef = doc(db, "job_applications", applicationId)
      await updateDoc(applicationRef, {
        status: "completed",
        completedAt: serverTimestamp(),
        submissionData,
        earnings,
      })

      // Get application to update worker balance
      const applicationDoc = await getDoc(applicationRef)
      if (applicationDoc.exists()) {
        const application = applicationDoc.data() as JobApplication

        // Update worker balance
        const workerRef = doc(db, "users", application.workerId)
        await updateDoc(workerRef, {
          availableBalance: increment(earnings),
          totalEarnings: increment(earnings),
          completedJobs: increment(1),
        })

        // Update job submission count
        const jobRef = doc(db, "jobs", application.jobId)
        await updateDoc(jobRef, {
          submissionsReceived: increment(1),
          dataCollected: [...((await getDoc(jobRef)).data()?.dataCollected || []), submissionData],
        })
      }

      console.log(`Completed application ${applicationId} with earnings $${earnings}`)
      return true
    } catch (error) {
      console.error("Error completing job application:", error)
      return false
    }
  }

  subscribeToJobApplications(callback: (applications: JobApplication[]) => void): () => void {
    if (!db) {
      callback([])
      return () => {}
    }

    const applicationsRef = collection(db, "job_applications")
    const q = query(applicationsRef, orderBy("appliedAt", "desc"))

    return onSnapshot(
      q,
      (snapshot) => {
        const applications: JobApplication[] = []
        snapshot.forEach((doc) => {
          applications.push({
            id: doc.id,
            ...doc.data(),
          } as JobApplication)
        })

        console.log(`Real-time applications update: ${applications.length} applications`)
        callback(applications)
      },
      (error) => {
        console.error("Error subscribing to applications:", error)
        callback([])
      },
    )
  }

  // Enhanced Support System for Admin-Client-Worker Chat
  async createSupportTicket(
    userId: string,
    userName: string,
    userEmail: string,
    userRole: "user" | "employer",
    subject: string,
    category = "general",
    relatedJobId?: string,
  ): Promise<string | null> {
    if (!db) return null

    try {
      const ticketData = {
        userId,
        userName,
        userEmail,
        userRole,
        subject,
        category,
        status: "open" as const,
        priority: "medium" as const,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        lastMessageAt: serverTimestamp(),
        messageCount: 0,
        relatedJobId,
      }

      const docRef = await addDoc(collection(db, "support_tickets"), ticketData)
      console.log(`Created support ticket ${docRef.id} for ${userRole} ${userId}`)
      return docRef.id
    } catch (error) {
      console.error("Error creating support ticket:", error)
      return null
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
    userRole?: "user" | "admin" | "employer",
    adminId?: string,
    adminName?: string,
  ): Promise<boolean> {
    if (!db) return false

    try {
      const messageData = {
        userId: userId || "",
        userName: userName || "",
        userEmail: userEmail || "",
        userRole: userRole || "user",
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

      console.log(`Message sent to ticket ${ticketId} by ${isFromAdmin ? "admin" : userRole}`)
      return true
    } catch (error) {
      console.error("Error sending message:", error)
      return false
    }
  }

  // Data Collection for Completed Jobs
  async getJobSubmissions(jobId: string): Promise<any[]> {
    if (!db) return []

    try {
      const applicationsRef = collection(db, "job_applications")
      const q = query(applicationsRef, where("jobId", "==", jobId), where("status", "==", "completed"))
      const snapshot = await getDocs(q)

      const submissions: any[] = []
      snapshot.forEach((doc) => {
        const application = doc.data() as JobApplication
        if (application.submissionData) {
          submissions.push({
            applicationId: doc.id,
            workerId: application.workerId,
            workerName: application.workerName,
            workerEmail: application.workerEmail,
            submissionData: application.submissionData,
            completedAt: application.completedAt,
            earnings: application.earnings,
          })
        }
      })

      console.log(`Retrieved ${submissions.length} submissions for job ${jobId}`)
      return submissions
    } catch (error) {
      console.error("Error getting job submissions:", error)
      return []
    }
  }

  async getCompletedJobsForAdmin(): Promise<JobPosting[]> {
    if (!db) return []

    try {
      const jobsRef = collection(db, "jobs")
      const q = query(jobsRef, where("status", "==", "completed"), orderBy("updatedAt", "desc"))
      const snapshot = await getDocs(q)

      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as JobPosting[]
    } catch (error) {
      console.error("Error fetching completed jobs:", error)
      return []
    }
  }

  // Platform Statistics
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
        totalJobApplications: 0,
        completedApplications: 0,
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
      const totalWithdrawals = users.reduce((sum, user) => sum + (user.totalWithdrawn || 0), 0)

      // Get real job data
      const jobsRef = collection(db, "jobs")
      const jobsSnapshot = await getDocs(jobsRef)
      const activeJobs = jobsSnapshot.docs.filter((doc) => doc.data().status === "active").length
      const completedJobs = jobsSnapshot.docs.filter((doc) => doc.data().status === "completed").length

      // Get real application data
      const applicationsRef = collection(db, "job_applications")
      const applicationsSnapshot = await getDocs(applicationsRef)
      const totalJobApplications = applicationsSnapshot.size
      const completedApplications = applicationsSnapshot.docs.filter((doc) => doc.data().status === "completed").length

      const stats = {
        totalUsers,
        activeUsers,
        pendingActivations,
        newUsersToday,
        newUsersThisWeek,
        totalRevenue,
        totalWithdrawals,
        activeJobs,
        completedJobs,
        pendingWithdrawals: 0, // Calculate from withdrawals collection
        totalJobApplications,
        completedApplications,
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
        totalJobApplications: 0,
        completedApplications: 0,
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
        suspended: true,
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

  // Legacy method for compatibility
  async getUserStats() {
    return this.getPlatformStats()
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
}

export const firebaseAdminService = FirebaseAdminService.getInstance()
