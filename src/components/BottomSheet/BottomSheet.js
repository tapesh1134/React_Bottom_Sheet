import React, { useRef, useState, useEffect } from 'react';
import './BottomSheet.css';

const SNAP_POINTS = [0, 0.5, 1];

const SPRING_CONFIG = {
  stiffness: 0.25,
  damping: 0.5    
};

function BottomSheet({ children }) {
  const [position, setPosition] = useState(SNAP_POINTS[2]);
  const [target, setTarget] = useState(SNAP_POINTS[2]);
  const [isDragging, setIsDragging] = useState(false);
  const offsetRef = useRef(0);    
  const startYRef = useRef(0);  
  const lastPositionRef = useRef(position);
  const velocityRef = useRef(0);

  function onDragStart(e) {
    setIsDragging(true);
    startYRef.current = e.touches ? e.touches[0].clientY : e.clientY;
    lastPositionRef.current = position;
  }

  function onDragMove(e) {
    if (!isDragging) return;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const delta = (clientY - startYRef.current) / window.innerHeight;
    let next = lastPositionRef.current + delta;
    next = Math.max(SNAP_POINTS[0], Math.min(SNAP_POINTS[2], next));
    setPosition(next);
    setTarget(next);
  }

  function onDragEnd() {
    setIsDragging(false);
    // Find closest snap point
    const distances = SNAP_POINTS.map(p => Math.abs(position - p));
    const idx = distances.indexOf(Math.min(...distances));
    setTarget(SNAP_POINTS[idx]);
  }

  useEffect(() => {
    function handleMove(e) { onDragMove(e); }
    function handleEnd() { onDragEnd(); }
    if (isDragging) {
      window.addEventListener('mousemove', handleMove);
      window.addEventListener('touchmove', handleMove);
      window.addEventListener('mouseup', handleEnd);
      window.addEventListener('touchend', handleEnd);
    }
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchend', handleEnd);
    };
  }, [isDragging, position]);

  useEffect(() => {
    if (isDragging) return;
    let stop = false;

    function animate() {
      const distance = target - position;
      const acceleration = distance * SPRING_CONFIG.stiffness - velocityRef.current * SPRING_CONFIG.damping;
      velocityRef.current += acceleration;
      let next = position + velocityRef.current;
      if (Math.abs(target - next) < 0.001 && Math.abs(velocityRef.current) < 0.001) {
        next = target;
        velocityRef.current = 0;
        setPosition(next);
        return;
      }
      setPosition(next);
      if (!stop) requestAnimationFrame(animate);
    }

    animate();
    return () => { stop = true; };
  }, [target, isDragging]);

  // Snap with buttons
  const snapTo = idx => {
    setTarget(SNAP_POINTS[idx]);
  };

  const sheetStyle = {
    top: `${position * 100}vh`
  };

  return (
    <div className="BottomSheet-portal">
      <div
        className="BottomSheet"
        style={sheetStyle}
        role="dialog"
        aria-modal="true"
      >
        <div
          className="BottomSheet-handle"
          onMouseDown={onDragStart}
          onTouchStart={onDragStart}
          aria-label="Drag to resize"
          tabIndex={0}
        >
          <div className="BottomSheet-handle-bar" />
        </div>
        <div className="BottomSheet-content">
          {children}
        </div>
        <div className="BottomSheet-controls">
          <button onClick={() => snapTo(0)}>Open</button>
          <button onClick={() => snapTo(1)}>Half</button>
          <button onClick={() => snapTo(2)}>Close</button>
        </div>
      </div>
    </div>
  );
}
export default BottomSheet;
