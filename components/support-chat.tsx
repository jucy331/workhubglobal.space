"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Send, MessageCircle, X } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

interface Message {
  id: string
  text: string
  sender: "user" | "admin"
  timestamp: Date
  senderName: string
}

interface SupportTicket {
  id: string
  userId: string
  subject: string
  status: "open" | "in-progress" | "resolved" | "closed"
  priority: "low" | "medium" | "high"
  createdAt: Date
  updatedAt: Date
  messages: Message[]
}

export function SupportChat() {
  const { userProfile } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [tickets, setTickets] = useState<SupportTicket[]>([])
  const [activeTicket, setActiveTicket] = useState<SupportTicket | null>(null)
  const [newMessage, setNewMessage] = useState("")
  const [newTicketSubject, setNewTicketSubject] = useState("")
  const [isCreatingTicket, setIsCreatingTicket] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [activeTicket?.messages])

  useEffect(() => {
    if (userProfile && isOpen) {
      fetchTickets()
    }
  }, [userProfile, isOpen])

  const fetchTickets = async () => {
    try {
      const response = await fetch(`/api/support/tickets?userId=${userProfile?.uid}`)
      if (response.ok) {
        const data = await response.json()
        setTickets(data.tickets || [])
      }
    } catch (error) {
      console.error("Error fetching tickets:", error)
    }
  }

  const createTicket = async () => {
    if (!newTicketSubject.trim() || !userProfile) return

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
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setTickets((prev) => [data.ticket, ...prev])
        setActiveTicket(data.ticket)
        setNewTicketSubject("")
        setIsCreatingTicket(false)
      }
    } catch (error) {
      console.error("Error creating ticket:", error)
    }
  }

  const sendMessage = async () => {
    if (!newMessage.trim() || !activeTicket || !userProfile) return

    const message: Message = {
      id: Date.now().toString(),
      text: newMessage,
      sender: "user",
      timestamp: new Date(),
      senderName: userProfile.fullName,
    }

    try {
      const response = await fetch("/api/support/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ticketId: activeTicket.id,
          message,
        }),
      })

      if (response.ok) {
        setActiveTicket((prev) =>
          prev
            ? {
                ...prev,
                messages: [...prev.messages, message],
              }
            : null,
        )
        setNewMessage("")
      }
    } catch (error) {
      console.error("Error sending message:", error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-green-500"
      case "in-progress":
        return "bg-yellow-500"
      case "resolved":
        return "bg-blue-500"
      case "closed":
        return "bg-gray-500"
      default:
        return "bg-gray-500"
    }
  }

  if (!userProfile) return null

  return (
    <>
      {/* Chat Toggle Button */}
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 rounded-full w-14 h-14 shadow-lg z-50"
        size="lg"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-20 right-4 w-96 h-[500px] shadow-xl z-50 flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg">Support Chat</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>

          <CardContent className="flex-1 flex flex-col p-0">
            {!activeTicket ? (
              <div className="flex-1 p-4">
                {isCreatingTicket ? (
                  <div className="space-y-4">
                    <h3 className="font-semibold">Create New Ticket</h3>
                    <Input
                      placeholder="Subject"
                      value={newTicketSubject}
                      onChange={(e) => setNewTicketSubject(e.target.value)}
                    />
                    <div className="flex gap-2">
                      <Button onClick={createTicket} size="sm">
                        Create
                      </Button>
                      <Button variant="outline" onClick={() => setIsCreatingTicket(false)} size="sm">
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Button onClick={() => setIsCreatingTicket(true)} className="w-full">
                      New Support Ticket
                    </Button>

                    <div className="space-y-2">
                      <h3 className="font-semibold">Your Tickets</h3>
                      {tickets.length === 0 ? (
                        <p className="text-sm text-gray-500">No tickets yet</p>
                      ) : (
                        tickets.map((ticket) => (
                          <div
                            key={ticket.id}
                            className="p-2 border rounded cursor-pointer hover:bg-gray-50"
                            onClick={() => setActiveTicket(ticket)}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-sm">{ticket.subject}</span>
                              <Badge className={getStatusColor(ticket.status)}>{ticket.status}</Badge>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                {/* Ticket Header */}
                <div className="p-4 border-b">
                  <div className="flex items-center justify-between">
                    <Button variant="ghost" size="sm" onClick={() => setActiveTicket(null)}>
                      ← Back
                    </Button>
                    <Badge className={getStatusColor(activeTicket.status)}>{activeTicket.status}</Badge>
                  </div>
                  <h3 className="font-semibold mt-2">{activeTicket.subject}</h3>
                </div>

                {/* Messages */}
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {activeTicket.messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[80%] p-3 rounded-lg ${
                            message.sender === "user" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-900"
                          }`}
                        >
                          <p className="text-sm">{message.text}</p>
                          <p className="text-xs opacity-70 mt-1">
                            {message.senderName} • {message.timestamp.toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>

                {/* Message Input */}
                <div className="p-4 border-t">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Type your message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                    />
                    <Button onClick={sendMessage} size="sm">
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}
    </>
  )
}
