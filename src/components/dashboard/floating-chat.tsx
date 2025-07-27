
'use client';

import * as React from 'react';
import { motion, useDragControls } from 'framer-motion';
import { Maximize, MessageSquare, Minimize, X } from 'lucide-react';
import { PublicChatView } from './public-chat-view';
import { cn } from '@/lib/utils';
import { useGesture } from '@use-gesture/react';

export function FloatingChat() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isMaximized, setIsMaximized] = React.useState(false);
  const controls = useDragControls();
  const constraintsRef = React.useRef(null);
  const popupRef = React.useRef<HTMLDivElement>(null);
  const [style, setStyle] = React.useState<React.CSSProperties>({});

  useGesture(
    {
      onDrag: ({ offset: [x, y], event }) => {
        event.preventDefault();
        setStyle({ transform: `translate(${x}px, ${y}px)` });
      },
    },
    {
      target: popupRef,
      drag: {
        from: () => {
          if (popupRef.current) {
            const rect = popupRef.current.getBoundingClientRect();
            const transform = new DOMMatrix(getComputedStyle(popupRef.current).transform);
            return [transform.e, transform.f];
          }
          return [0, 0];
        },
      },
    }
  );

  const toggleOpen = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setIsMaximized(false);
      setStyle({}); // Reset position on open
    }
  };

  const toggleMaximize = () => {
    setIsMaximized(!isMaximized);
    setStyle({}); // Reset position on maximize/minimize
  };

  return (
    <>
      <div ref={constraintsRef} className="fixed inset-0 pointer-events-none z-40" />
      <motion.div
        layout
        className={cn(
          "fixed bottom-10 right-10 z-50",
          isOpen && "pointer-events-none"
        )}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, type: 'spring' }}
      >
        <button
          onClick={toggleOpen}
          className="w-16 h-16 bg-primary rounded-full text-primary-foreground flex items-center justify-center shadow-lg hover:bg-primary/90 transition-all"
        >
          <MessageSquare className="w-8 h-8" />
        </button>
      </motion.div>

      {isOpen && (
        <motion.div
          ref={popupRef}
          style={style}
          className={cn(
            "fixed bottom-10 right-10 z-50 rounded-lg overflow-hidden bg-background/80 backdrop-blur-sm",
            isMaximized ? "w-[calc(100vw-5rem)] h-[calc(100vh-5rem)] top-10 left-10 bottom-auto right-auto" : "w-[400px] h-[600px]"
          )}
          initial={{ opacity: 0, y: 50, scale: 0.5 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.5 }}
          transition={{ type: 'spring', stiffness: 200, damping: 25 }}
        >
            <div className="h-full flex flex-col">
              <div 
                className="h-10 bg-muted flex items-center justify-between px-2 cursor-grab"
                onPointerDown={(e) => controls.start(e)}
              >
                  <span className="font-semibold text-sm">Public Chat</span>
                  <div className="flex items-center">
                    <button onClick={toggleMaximize} className="p-2 hover:bg-black/10 rounded-md">
                      {isMaximized ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
                    </button>
                    <button onClick={toggleOpen} className="p-2 hover:bg-black/10 rounded-md">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
              </div>
              <div className="flex-1">
                <PublicChatView isPopup={true} />
              </div>
            </div>
        </motion.div>
      )}
    </>
  );
}
