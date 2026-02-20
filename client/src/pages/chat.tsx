import { MobileLayout } from "@/components/mobile-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Send, Phone, Loader2, MessageSquare } from "lucide-react";
import { Link, useParams } from "wouter";
import { useState, useRef, useEffect } from "react";
import { useApiQuery, useApiMutation } from "@/lib/use-api";
import { useQueryClient } from "@tanstack/react-query";
import { useUser } from "@/lib/user-context";

export default function Chat() {
  const { taskId } = useParams();
  const { user } = useUser();
  const queryClient = useQueryClient();
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // If no taskId, show conversations list
  const { data: conversations, isLoading: loadingConversations } = useApiQuery<any[]>(
    ["messages"],
    "/messages",
    { enabled: !taskId }
  );

  // If taskId, show message thread with 5s polling
  const { data: messages = [], isLoading: loadingMessages } = useApiQuery<any[]>(
    ["messages", taskId],
    `/messages/${taskId}`,
    { enabled: !!taskId, refetchInterval: 5000 }
  );

  const sendMutation = useApiMutation<any, string>(
    () => `/messages/${taskId}/send`,
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["messages", taskId] });
      }
    }
  );

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = () => {
    const msg = newMessage.trim();
    if (!msg || sendMutation.isPending) return;
    sendMutation.mutate(msg);
    setNewMessage("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // ── Conversation List ────────────────────────────────────────────────────────
  if (!taskId) {
    return (
      <MobileLayout userType={user.role}>
        <div className="flex flex-col h-full bg-gray-50">
          <div className="bg-white p-4 sticky top-0 z-10 border-b shadow-sm">
            <h1 className="font-bold text-xl">Messages</h1>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {loadingConversations ? (
              <div className="flex justify-center p-8">
                <Loader2 className="animate-spin text-primary" />
              </div>
            ) : conversations?.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 opacity-50">
                <MessageSquare size={48} className="text-gray-300 mb-4" />
                <p className="font-bold text-gray-500">No messages yet</p>
                <p className="text-sm text-gray-400 text-center mt-1">
                  Messages will appear here once a bid is accepted.
                </p>
              </div>
            ) : (
              conversations?.map((conv: any) => (
                <Link key={conv.taskId} href={`/messages/${conv.taskId}`}>
                  <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex gap-3 items-center cursor-pointer active:scale-[0.98] transition-transform">
                    <div className="relative">
                      <img
                        src={conv.otherUser?.avatarUrl ?? `https://ui-avatars.com/api/?name=User&background=7c3aed&color=fff`}
                        alt={conv.otherUser?.name}
                        className="h-12 w-12 rounded-full object-cover"
                      />
                      {conv.unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                          {conv.unreadCount}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <h3 className="font-bold text-gray-900 truncate">
                          {conv.otherUser?.name ?? "Unknown"}
                        </h3>
                        <span className="text-[10px] text-gray-400 shrink-0 ml-2">
                          {conv.lastMessageAt ? new Date(conv.lastMessageAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : ""}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 truncate">{conv.taskTitle}</p>
                      <p className="text-sm text-gray-600 truncate mt-0.5">{conv.lastMessage}</p>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </MobileLayout>
    );
  }

  // ── Message Thread ───────────────────────────────────────────────────────────
  const firstMsg = messages[0];

  return (
    <MobileLayout hideNav>
      <div className="flex flex-col h-full bg-gray-50">
        {/* Header */}
        <div className="bg-white p-4 sticky top-0 z-10 border-b shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => window.history.back()}
              className="p-2 hover:bg-gray-100 rounded-full -ml-2"
            >
              <ArrowLeft size={20} />
            </button>
            {firstMsg && (
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gray-200 overflow-hidden relative">
                  <img
                    src={firstMsg.isOwn
                      ? `https://ui-avatars.com/api/?name=Other&background=7c3aed&color=fff`
                      : firstMsg.senderAvatar}
                    alt="User"
                  />
                  <div className="absolute bottom-0 right-0 h-2.5 w-2.5 bg-green-500 rounded-full border-2 border-white" />
                </div>
                <div>
                  <h1 className="font-bold text-sm text-gray-900">Task #{taskId}</h1>
                  <p className="text-xs text-gray-400">Tap to view task</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {loadingMessages ? (
            <div className="flex justify-center p-8">
              <Loader2 className="animate-spin text-primary" />
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center text-gray-400 py-12">
              <MessageSquare size={32} className="mx-auto mb-2 opacity-30" />
              <p className="text-sm">No messages yet. Say hello!</p>
            </div>
          ) : (
            <>
              <div className="text-center text-xs text-gray-400 my-2">
                {new Date(messages[0]?.createdAt).toLocaleDateString()}
              </div>
              {messages.map((msg: any) => (
                <div key={msg.id} className={`flex ${msg.isOwn ? "justify-end" : "justify-start"}`}>
                  {!msg.isOwn && (
                    <img
                      src={msg.senderAvatar}
                      alt={msg.senderName}
                      className="h-7 w-7 rounded-full mr-2 self-end"
                    />
                  )}
                  <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${msg.isOwn
                      ? "bg-primary text-primary-foreground rounded-br-none"
                      : "bg-white border border-gray-100 text-gray-800 rounded-bl-none shadow-sm"
                    }`}>
                    <p className="text-sm leading-relaxed">{msg.message}</p>
                    <p className={`text-[10px] mt-1 text-right ${msg.isOwn ? "text-primary-foreground/70" : "text-gray-400"}`}>
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      {msg.isOwn && msg.readAt && " ✓✓"}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t sticky bottom-0">
          <div className="flex gap-2 items-center bg-gray-50 p-1.5 rounded-full border border-gray-200">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 h-10 px-2"
            />
            <Button
              onClick={handleSend}
              size="icon"
              disabled={!newMessage.trim() || sendMutation.isPending}
              className={`rounded-full h-10 w-10 shrink-0 transition-all ${newMessage.trim() ? "bg-primary hover:bg-primary/90 shadow-md" : "bg-gray-300 hover:bg-gray-300"
                }`}
            >
              {sendMutation.isPending
                ? <Loader2 size={16} className="animate-spin" />
                : <Send size={18} className="ml-0.5" />}
            </Button>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
}
