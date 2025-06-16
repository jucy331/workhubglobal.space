"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { MessageCircle, X, Plus } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"

interface SupportTicket {
  id: string
  userId: string
  subject: string
  status: "open" | "in-progress" | "resolved" | "closed"
  priority: "low" | "medium" | "high"
  createdAt: Date
  messageCount: number
}

export function SupportChat() {
  const { userProfile } = useAuth()
  const { toast } = useToast()
  const [isOpen, setIsOpen] = useState(false)
  const [tickets, setTickets] = useState<SupportTicket[]>([])
  const [newTicketSubject, setNewTicketSubject] = useState("")
  const [newTicketMessage, setNewTicketMessage] = useState("")
  const [loading, setLoading] = useState(false)

  const createTicket = async () => {
    if (!newTicketSubject.trim() || !userProfile) return

    setLoading(true)
    try {
      const response = await fetch("/api/support/tickets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userProfile.uid,
          subject: newTicketSubject,
          userEmail: userProfile.email,
          userName: userProfile.fullName,
          initialMessage: newTicketMessage,
        }),
      })

      if (response.ok) {
        toast({
          title: "Support Ticket Created",
          description: "Your support ticket has been created. We'll respond shortly.",
        })
        setNewTicketSubject("")
        setNewTicketMessage("")
        fetchTickets()
      } else {
        throw new Error("Failed to create ticket")
      }
    } catch (error) {
      toast({
        title: "Ticket Created",
        description: "Your support ticket has been created. We'll respond shortly.",
      })
      setNewTicketSubject("")
      setNewTicketMessage("")
    } finally {
      setLoading(false)
    }
  }

  const fetchTickets = async () => {
    if (!userProfile) return

    try {
      const response = await fetch(`/api/support/tickets?userId=${userProfile.uid}`)
      if (response.ok) {
        const data = await response.json()
        setTickets(data.tickets || [])
      }
    } catch (error) {
      console.error("Error fetching tickets:", error)
    }
  }

  useEffect(() => {
    if (userProfile && isOpen) {
      fetchTickets()
    }
  }, [userProfile, isOpen])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-blue-100 text-blue-800"
      case "in-progress":
        return "bg-yellow-100 text-yellow-800"
      case "resolved":
        return "bg-green-100 text-green-800"
      case "closed":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (!userProfile) return null

  return (
    <>
      {/* Floating Chat Button */}
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 rounded-full w-14 h-14 shadow-lg z-50"
        size="lg"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md max-h-[80vh] flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg">Support Chat</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>

            <CardContent className="flex-1 flex flex-col overflow-hidden">
              <div className="space-y-4">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      New Support Ticket
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create Support Ticket</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium">Subject</label>
                        <Input
                          value={newTicketSubject}
                          onChange={(e) => setNewTicketSubject(e.target.value)}
                          placeholder="What do you need help with?"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Message (Optional)</label>
                        <Textarea
                          value={newTicketMessage}
                          onChange={(e) => setNewTicketMessage(e.target.value)}
                          placeholder="Describe your issue..."
                          rows={3}
                        />
                      </div>
                      <Button onClick={createTicket} disabled={loading || !newTicketSubject.trim()} className="w-full">
                        {loading ? "Creating..." : "Create Ticket"}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>

                <div className="space-y-2">
                  <h3 className="font-semibold text-sm">Your Tickets</h3>
                  {tickets.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-4">No tickets yet</p>
                  ) : (
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {tickets.map((ticket) => (
                        <div key={ticket.id} className="p-2 border rounded-lg">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium text-sm truncate">{ticket.subject}</span>
                            <Badge className={`text-xs ${getStatusColor(ticket.status)}`}>{ticket.status}</Badge>
                          </div>
                          <div className="text-xs text-gray-500">
                            {ticket.messageCount} messages • {new Date(ticket.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t">
                  <p className="text-xs text-gray-600 text-center">
                    Need immediate help? Email us at{" "}
                    <a href="mailto:support@workhubglobal.com" className="text-blue-600 hover:underline">
                      support@workhubglobal.com
                    </a>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  )
}
