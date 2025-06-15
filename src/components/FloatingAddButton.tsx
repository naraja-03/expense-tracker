import { useState, useRef, useEffect } from "react";

interface Props {
  onClick: () => void;
  position: { x: number; y: number };
  setPosition: (pos: { x: number; y: number }) => void;
  onDragStart: () => void;
  onDragEnd: () => void;
  resetting?: boolean;
}

export default function FloatingAddButton({
  onClick,
  position,
  setPosition,
  onDragStart,
  onDragEnd,
  resetting = false,
}: Props) {
  const [dragging, setDragging] = useState(false);
  const offset = useRef({ x: 0, y: 0 });

  const onMouseDown = (e: React.MouseEvent) => {
    setDragging(true);
    onDragStart();
    offset.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
    window.addEventListener("mousemove", onMouseMove as any);
    window.addEventListener("mouseup", onMouseUp as any);
  };
  const onMouseMove = (e: MouseEvent) => {
    setPosition({
      x: e.clientX - offset.current.x,
      y: e.clientY - offset.current.y,
    });
  };
  const onMouseUp = () => {
    setDragging(false);
    onDragEnd();
    window.removeEventListener("mousemove", onMouseMove as any);
    window.removeEventListener("mouseup", onMouseUp as any);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    setDragging(true);
    onDragStart();
    const touch = e.touches[0];
    offset.current = {
      x: touch.clientX - position.x,
      y: touch.clientY - position.y,
    };
    window.addEventListener("touchmove", onTouchMove as any, { passive: false });
    window.addEventListener("touchend", onTouchEnd as any);
  };
  const onTouchMove = (e: TouchEvent) => {
    const touch = e.touches[0];
    setPosition({
      x: touch.clientX - offset.current.x,
      y: touch.clientY - offset.current.y,
    });
  };
  const onTouchEnd = () => {
    setDragging(false);
    onDragEnd();
    window.removeEventListener("touchmove", onTouchMove as any);
    window.removeEventListener("touchend", onTouchEnd as any);
  };

  useEffect(() => {
    if (dragging) {
      document.body.style.userSelect = "none";
    } else {
      document.body.style.userSelect = "";
    }
    return () => {
      document.body.style.userSelect = "";
    };
  }, [dragging]);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!dragging) onClick();
  };

  return (
    <button
      style={{
        position: "fixed",
        left: position.x,
        top: position.y,
        zIndex: 50,
        transition: dragging
          ? "none"
          : resetting
            ? "left 0.4s cubic-bezier(.54,1.42,.49,1), top 0.4s cubic-bezier(.54,1.42,.49,1), box-shadow 0.2s"
            : "box-shadow 0.2s",
        boxShadow: dragging
          ? "0 8px 24px 0 rgba(80,120,255,0.18)"
          : "0 4px 20px 0 rgba(80,120,255,0.10)",
        touchAction: "none",
        width: 64,
        height: 64,
        minWidth: 64,
        minHeight: 64,
      }}
      className="bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg p-4 cursor-grab active:cursor-grabbing transition-all duration-200"
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
      onClick={handleClick}
      aria-label="Add expense"
      tabIndex={0}
    >
      {/* Rupee symbol SVG */}
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
        <path
          d="M6 5h12M6 9h12M9 9c6 0 6 9 0 9h3M9 13h6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}