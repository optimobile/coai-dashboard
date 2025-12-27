import { useState, useRef, useEffect } from 'react';
import { Menu, X, Maximize2, Minimize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CollapsibleSidebarProps {
  children: React.ReactNode;
  title?: string;
}

export function CollapsibleSidebar({ children, title = 'Menu' }: CollapsibleSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [dragStart, setDragStart] = useState(0);
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Handle drag-to-close gesture
  const handleTouchStart = (e: React.TouchEvent) => {
    setDragStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const dragEnd = e.changedTouches[0].clientX;
    const dragDistance = dragStart - dragEnd;

    // If dragged more than 50px to the right, close sidebar
    if (dragDistance > 50) {
      setIsOpen(false);
    }
  };

  // Handle mouse drag-to-close on desktop
  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('[data-no-drag]')) return;
    setDragStart(e.clientX);
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    const dragEnd = e.clientX;
    const dragDistance = dragStart - dragEnd;

    if (dragDistance > 50) {
      setIsOpen(false);
    }
  };

  // Close sidebar when pressing Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  return (
    <>
      {/* Desktop Toggle Button (Top Left) */}
      <Button
        variant="ghost"
        size="icon"
        className="hidden lg:flex fixed top-20 left-4 z-40 bg-emerald-600 text-white hover:bg-emerald-700 rounded-lg w-10 h-10 shadow-lg transition-all duration-300"
        onClick={() => setIsOpen(!isOpen)}
        title={isOpen ? 'Close sidebar' : 'Open sidebar'}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Mobile Toggle Button (Bottom Right) */}
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden fixed bottom-6 right-6 z-40 bg-emerald-600 text-white hover:bg-emerald-700 rounded-full w-14 h-14 shadow-lg"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      {/* Full-Screen Toggle Button */}
      {isOpen && (
        <Button
          variant="ghost"
          size="icon"
          className="hidden lg:flex fixed top-20 left-16 z-40 bg-blue-600 text-white hover:bg-blue-700 rounded-lg w-10 h-10 shadow-lg transition-all duration-300"
          onClick={() => setIsFullScreen(!isFullScreen)}
          title={isFullScreen ? 'Exit full screen' : 'Full screen'}
        >
          {isFullScreen ? (
            <Minimize2 className="h-5 w-5" />
          ) : (
            <Maximize2 className="h-5 w-5" />
          )}
        </Button>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <div
        className={`fixed lg:static transition-all duration-300 ease-in-out z-40 ${
          isFullScreen
            ? 'inset-0 w-full h-full'
            : 'left-0 top-0 bottom-0 w-64 lg:w-64'
        } ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Sidebar */}
        <aside
          ref={sidebarRef}
          className={`h-full bg-white shadow-lg lg:shadow-none overflow-y-auto transition-all duration-300 ${
            isFullScreen ? 'w-full' : 'w-full'
          }`}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
        >
          {/* Header */}
          {title && (
            <div className="sticky top-0 bg-gradient-to-r from-emerald-50 to-emerald-100 border-b border-emerald-200 p-4 lg:hidden flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-emerald-200 rounded-lg transition-colors"
                data-no-drag
              >
                <X className="h-5 w-5 text-gray-600" />
              </button>
            </div>
          )}

          {/* Desktop Header with Drag Indicator */}
          <div className="hidden lg:block sticky top-0 bg-gradient-to-r from-emerald-50 to-emerald-100 border-b border-emerald-200 p-3 text-center">
            <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
              <div className="w-8 h-1 bg-slate-300 rounded-full" />
              <span>Drag to close</span>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 lg:p-4">{children}</div>

          {/* Footer Info */}
          <div className="sticky bottom-0 bg-gradient-to-t from-slate-50 to-transparent border-t border-slate-200 p-3 text-center text-xs text-slate-500">
            <p>Press <kbd className="px-2 py-1 bg-slate-200 rounded text-slate-700 font-mono">ESC</kbd> to close</p>
          </div>
        </aside>
      </div>

      {/* Overlay for full-screen mode */}
      {isFullScreen && isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-30 lg:hidden"
          onClick={() => setIsFullScreen(false)}
        />
      )}

      {/* Close sidebar when clicking on main content (mobile only) */}
      {isOpen && !isFullScreen && (
        <div
          className="fixed inset-0 z-20 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
