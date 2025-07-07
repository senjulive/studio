"use client";

import * as React from "react";

export function ContextMenuBlocker() {
  React.useEffect(() => {
    const handleContextMenu = (event: MouseEvent) => {
      event.preventDefault();
    };

    document.addEventListener("contextmenu", handleContextMenu);

    // Also block some common keyboard shortcuts for developer tools
    const handleKeyDown = (event: KeyboardEvent) => {
        if (
            (event.ctrlKey && event.shiftKey && (event.key === 'I' || event.key === 'J' || event.key === 'C')) || // Ctrl+Shift+I/J/C
            (event.ctrlKey && event.key === 'U') || // Ctrl+U
            event.key === 'F12' // F12
        ) {
            event.preventDefault();
        }
    }

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return null; // This component doesn't render anything
}
