import React, { useRef, useState, useEffect } from 'react';
import './BottomSheet.css';

const SNAP_PNT = Array.from({ length: 1000 }, (_, i) => (i + 1) * 0.001);
const SPRING_CON = {
  stiffness: 0.2,
  damping: 0.2,
};

function BottomSheet({ children }) {
  const [position, setPosition] = useState(SNAP_PNT[Math.floor(SNAP_PNT.length/2)]);
  const [target, setTarget] = useState(SNAP_PNT[Math.floor(SNAP_PNT.length/2)]);
  const [dragging, setDragging] = useState(false);
  const lastyref = useRef(0);
  const startpos = useRef(0);
  const veloref = useRef(0); // velocity ref

  const handleDragStart = (e) => {
    setDragging(true);
    lastyref.current = e.touches ? e.touches[0].clientY : e.clientY;
    startpos.current = position;
    veloref.current = 0;
  };

  const handleDragMove = (e) => {
    if (!dragging) return;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const deltaY = (clientY - lastyref.current) / window.innerHeight;
    lastyref.current = clientY;
    setPosition(prev => Math.max(0, Math.min(1, prev + deltaY)));
    setTarget(prev => Math.max(0, Math.min(1, prev + deltaY)));
  };

  const handleDragEnd = () => {
    if (!dragging) return;
    setDragging(false);
    const distances = SNAP_PNT.map(p => Math.abs(position - p));
    const idx = distances.indexOf(Math.min(...distances));
    setTarget(SNAP_PNT[idx]);
    veloref.current = 0;
  };

  

  useEffect(() => {
    if (dragging) {
      window.addEventListener('mousemove', handleDragMove);
      window.addEventListener('touchmove', handleDragMove);
      window.addEventListener('mouseup', handleDragEnd);
      window.addEventListener('touchend', handleDragEnd);
    }
    return () => {
      window.removeEventListener('mousemove', handleDragMove);
      window.removeEventListener('touchmove', handleDragMove);
      window.removeEventListener('mouseup', handleDragEnd);
      window.removeEventListener('touchend', handleDragEnd);
    };
  }, [dragging, position]);

  useEffect(() => {
    if (dragging) return;
    let frame;
    function animate() {
      const dist = target - position;
      const acceleration = dist * SPRING_CON.stiffness - veloref.current * SPRING_CON.damping;
      veloref.current += acceleration;
      let next = position + veloref.current;
      if (Math.abs(dist) < 0.001 && Math.abs(veloref.current) < 0.001) {
        setPosition(target);
        veloref.current = 0;
        return;
      }
      setPosition(next);
      frame = requestAnimationFrame(animate);
    }
    animate();
    return () => cancelAnimationFrame(frame);
  }, [target, dragging]);
  

  function snapTo(idx) {
    setTarget(idx);
  }
  const sheetStyle = {
    height: `${(1 - position) * 100}%`,
  };

  return (
    <div className="BottomSheet-portal">
      <div className="BottomSheet" style={sheetStyle}>
        <div
          className="BottomSheet-handle"
          onMouseDown={handleDragStart}
          onTouchStart={handleDragStart}
          tabIndex={0}
        >
          <div className="BottomSheet-handle-bar" />
        </div>
        <div className="BottomSheet-content">
          {children}
        </div>
        <div className="BottomSheet-controls">
          <button className="outline-btn" onClick={() => snapTo(0)}>Open</button>
          <button className="outline-btn" onClick={() => snapTo(0.5)}>Half</button>
          <button className="outline-btn" onClick={() => snapTo(1)}>Close</button>
        </div>
      </div>
    </div>
  );
}
export default BottomSheet;
