import { MobileLayout } from "@/components/mobile-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Send, Image as ImageIcon, Phone, MoreVertical } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useState, useRef, useEffect } from "react";

export default function Chat() {
  const [, setLocation] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  const role = searchParams.get('role') || "customer"; // customer or errander
  
  const [messages, setMessages] = useState([
    { id: 1, text: "Hi, I'm on my way to pick up the package.", sender: "errander", time: "10:30 AM" },
    { id: 2, text: "Great, thanks! Please check the fragility label.", sender: "customer", time: "10:32 AM" },
    { id: 3, text: "Noted. I'll handle it with care.", sender: "errander", time: "10:33 AM" },
  ]);
  
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = () => {
    if (newMessage.trim()) {
      setMessages([...messages, {
        id: Date.now(),
        text: newMessage,
        sender: role,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
      setNewMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const otherUser = role === "customer" ? { name: "David M.", role: "Errander" } : { name: "Alex Kemboi", role: "Customer" };
  const backLink = role === "customer" ? "/customer/errand/123" : "/errander/errand/123";

  return (
    <MobileLayout hideNav>
      <div className="flex flex-col h-full bg-gray-50">
        {/* Header */}
        <div className="bg-white p-4 sticky top-0 z-10 border-b shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href={backLink}>
              <button className="p-2 hover:bg-gray-100 rounded-full -ml-2">
                <ArrowLeft size={20} />
              </button>
            </Link>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gray-200 overflow-hidden relative">
                <img src={`https://ui-avatars.com/api/?name=${otherUser.name.replace(' ', '+')}&background=random`} alt={otherUser.name} />
                <div className="absolute bottom-0 right-0 h-2.5 w-2.5 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <div>
                <h1 className="font-bold text-sm text-gray-900">{otherUser.name}</h1>
                <p className="text-xs text-gray-500">{otherUser.role}</p>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button size="icon" variant="ghost" className="rounded-full text-gray-500">
              <Phone size={20} />
            </Button>
            <Button size="icon" variant="ghost" className="rounded-full text-gray-500">
              <MoreVertical size={20} />
            </Button>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          <div className="text-center text-xs text-gray-400 my-4">Today, 10:30 AM</div>
          
          {messages.map((msg) => {
            const isMe = msg.sender === role;
            return (
              <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                  isMe 
                    ? 'bg-blue-600 text-white rounded-br-none' 
                    : 'bg-white border border-gray-100 text-gray-800 rounded-bl-none shadow-sm'
                }`}>
                  <p className="text-sm">{msg.text}</p>
                  <p className={`text-[10px] mt-1 text-right ${isMe ? 'text-blue-100' : 'text-gray-400'}`}>
                    {msg.time}
                  </p>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t sticky bottom-0">
          <div className="flex gap-2 items-center bg-gray-50 p-1.5 rounded-full border border-gray-200">
            <Button size="icon" variant="ghost" className="rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-200/50 h-10 w-10 shrink-0">
              <ImageIcon size={20} />
            </Button>
            <Input 
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Type a message..." 
              className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 h-10 px-2"
            />
            <Button 
              onClick={handleSend}
              size="icon" 
              className={`rounded-full h-10 w-10 shrink-0 transition-all ${
                newMessage.trim() ? 'bg-blue-600 hover:bg-blue-700 shadow-md' : 'bg-gray-300 hover:bg-gray-300'
              }`}
              disabled={!newMessage.trim()}
            >
              <Send size={18} className="ml-0.5" />
            </Button>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
}
