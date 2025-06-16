"use server"

import { initializeApp, getApps, cert } from "firebase-admin/app"
import { getFirestore } from "firebase-admin/firestore"
import { getAuth } from "firebase-admin/auth"

// Initialize Firebase Admin SDK
const firebaseAdminConfig = {
  credential: cert({
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  }),
}

// Initialize app only if it hasn't been initialized
const app = getApps().length === 0 ? initializeApp(firebaseAdminConfig) : getApps()[0]

export const adminDb = getFirestore(app)
export const adminAuth = getAuth(app)

// User management functions
export async function getAllUsersServer() {
  try {
    const usersSnapshot = await adminDb.collection("users").get()
    const users = usersSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
    return users
  } catch (error) {
    console.error("Error fetching users:", error)
    return []
  }
}

export async function updateUserStatusServer(userId: string, isActivated: boolean) {
  try {
    await adminDb.collection("users").doc(userId).update({
      isActivated,
      updatedAt: new Date(),
    })
    return { success: true }
  } catch (error) {
    console.error("Error updating user status:", error)
    return { success: false, error: error.message }
  }
}

export async function getUserStatsServer() {
  try {
    const usersSnapshot = await adminDb.collection("users").get()
    const users = usersSnapshot.docs.map((doc) => doc.data())

    const totalUsers = users.length
    const activeUsers = users.filter((user) => user.isActivated).length
    const pendingUsers = users.filter((user) => !user.isActivated).length

    return {
      totalUsers,
      activeUsers,
      pendingUsers,
    }
  } catch (error) {
    console.error("Error fetching user stats:", error)
    return {
      totalUsers: 0,
      activeUsers: 0,
      pendingUsers: 0,
    }
  }
}

export async function createSupportTicketServer(userId: string, userName: string, userEmail: string, subject: string) {
  try {
    const ticketData = {
      userId,
      userName,
      userEmail,
      subject,
      status: "open",
      priority: "medium",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastMessageAt: new Date(),
      messageCount: 0,
    }

    const docRef = await adminDb.collection("support_tickets").add(ticketData)
    return { success: true, ticketId: docRef.id }
  } catch (error) {
    console.error("Error creating support ticket:", error)
    return { success: false, error: error.message }
  }
}

export async function sendMessageServer(
  ticketId: string,
  message: string,
  isFromAdmin: boolean,
  userId?: string,
  userName?: string,
  userEmail?: string,
  adminId?: string,
  adminName?: string,
) {
  try {
    const messageData = {
      userId: userId || "",
      userName: userName || "",
      userEmail: userEmail || "",
      message,
      timestamp: new Date(),
      isFromAdmin,
      adminId,
      adminName,
      status: "sent",
    }

    // Add message to subcollection
    await adminDb.collection("support_tickets").doc(ticketId).collection("messages").add(messageData)

    // Update ticket
    await adminDb.collection("support_tickets").doc(ticketId).update({
      lastMessageAt: new Date(),
      updatedAt: new Date(),
    })

    return { success: true }
  } catch (error) {
    console.error("Error sending message:", error)
    return { success: false, error: error.message }
  }
}

export async function updateTicketStatusServer(ticketId: string, status: string) {
  try {
    await adminDb.collection("support_tickets").doc(ticketId).update({
      status,
      updatedAt: new Date(),
    })
    return { success: true }
  } catch (error) {
    console.error("Error updating ticket status:", error)
    return { success: false, error: error.message }
  }
}

export async function getUserTicketsServer(userId: string) {
  try {
    const ticketsSnapshot = await adminDb
      .collection("support_tickets")
      .where("userId", "==", userId)
      .orderBy("lastMessageAt", "desc")
      .get()

    const tickets = ticketsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))

    return tickets
  } catch (error) {
    console.error("Error fetching user tickets:", error)
    return []
  }
}
