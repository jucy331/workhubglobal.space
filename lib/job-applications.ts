import { db } from "@/lib/firebase"
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  arrayUnion,
  serverTimestamp,
  orderBy,
} from "firebase/firestore"

export interface JobApplication {
  id?: string
  userId: string
  jobId: string
  jobTitle: string
  company: string
  coverLetter: string
  resumeUrl?: string
  status: "pending" | "reviewing" | "interview" | "rejected" | "accepted"
  appliedAt: any
  updatedAt: any
}

export async function applyForJob(application: Omit<JobApplication, "id" | "status" | "appliedAt" | "updatedAt">) {
  try {
    // Create the application document
    const applicationData: Omit<JobApplication, "id"> = {
      ...application,
      status: "pending",
      appliedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }

    const docRef = await addDoc(collection(db, "applications"), applicationData)

    // Update the user's applications array
    const userRef = doc(db, "users", application.userId)
    await updateDoc(userRef, {
      applications: arrayUnion(docRef.id),
      updatedAt: serverTimestamp(),
    })

    return {
      success: true,
      applicationId: docRef.id,
    }
  } catch (error) {
    console.error("Error applying for job:", error)
    return {
      success: false,
      error: "Failed to submit application",
    }
  }
}

export async function getUserApplications(userId: string) {
  try {
    const q = query(collection(db, "applications"), where("userId", "==", userId), orderBy("appliedAt", "desc"))

    const querySnapshot = await getDocs(q)
    const applications: JobApplication[] = []

    querySnapshot.forEach((doc) => {
      applications.push({
        id: doc.id,
        ...doc.data(),
      } as JobApplication)
    })

    return {
      success: true,
      applications,
    }
  } catch (error) {
    console.error("Error fetching user applications:", error)
    return {
      success: false,
      error: "Failed to fetch applications",
      applications: [],
    }
  }
}

export async function updateApplicationStatus(applicationId: string, status: JobApplication["status"]) {
  try {
    const applicationRef = doc(db, "applications", applicationId)
    await updateDoc(applicationRef, {
      status,
      updatedAt: serverTimestamp(),
    })

    return {
      success: true,
    }
  } catch (error) {
    console.error("Error updating application status:", error)
    return {
      success: false,
      error: "Failed to update application status",
    }
  }
}
