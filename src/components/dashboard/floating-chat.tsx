"use client"

import * as React from "react"
import { MessageSquare, X, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PublicChatView } from "./public-chat-view"
import { AnimatePresence, motion } from "framer-motion"
import { cn } from "@/lib/utils"

export function FloatingChat() {
  const [isOpen, setIsOpen] = React.useState(false)
  const [isMinimized, setIsMinimized] = React.useState(false)
  const [isClient, setIsClient] = React.useState(false)

  React.useEffect(() => {
    setIsClient(true)
  }, [])

  const handleToggle = () => {
    if (isMinimized) {
      setIsMinimized(false)
      setIsOpen(true)
    } else {
      setIsOpen(!isOpen)
    }
  }

  const handleMinimize = () => {
    setIsOpen(false)
    setIsMinimized(true)
  }
  
  const handleClose = () => {
    setIsOpen(false)
    setIsMinimized(false)
  }

  if (!isClient) return null

  return (
    <>
      <AnimatePresence>
        {isOpen && !isMinimized && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed bottom-24 right-4 z-50 w-[calc(100vw-2rem)] max-w-sm h-[70vh] max-h-[600px] flex flex-col"
          >
            <div className="flex justify-between items-center bg-card/80 backdrop-blur-lg p-2 rounded-t-lg border-b border-border">
                <h3 className="font-semibold ml-2 text-foreground">Public Chat</h3>
                <div>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleMinimize}>
                        <Minus className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleClose}>
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            </div>
            <div className="flex-1 overflow-hidden rounded-b-lg">
                <PublicChatView isFloating />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {!isOpen && (
        <motion.div
          drag
          dragConstraints={{ left: 8, right: window.innerWidth - 64, top: 8, bottom: window.innerHeight - 64 }}
          dragMomentum={false}
          className="fixed bottom-4 right-4 z-50 cursor-grab active:cursor-grabbing"
          initial={{ bottom: 16, right: 16 }}
        >
          <Button
            onClick={handleToggle}
            className="rounded-full h-14 w-14 shadow-lg"
          >
            <MessageSquare className="h-6 w-6" />
            <span className="sr-only">Open Chat</span>
          </Button>
        </motion.div>
      )}
    </>
  )
}
