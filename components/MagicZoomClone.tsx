import React, { useState, useRef, useEffect } from 'react';
import { ZoomIn } from 'lucide-react';

interface MagicZoomProps {
  src: string;
  zoomSrc: string;
  alt: string;
  zoomLevel: number;
  glassSize: number;
  className?: string;
}

const MagicZoomClone: React.FC<MagicZoomProps> = ({ 
  src, 
  zoomSrc, 
  alt = "", 
  zoomLevel = 2.5, 
  glassSize = 180 // Slightly smaller default for better mobile fit
}) => {
  const [showMagnifier, setShowMagnifier] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  
  const imgRef = useRef<HTMLDivElement>(null);

  // Detect if the device uses touch (more reliable than screen width)
  useEffect(() => {
    const checkTouch = () => {
      setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
    };
    checkTouch();
  }, []);

  // Vertical distance to float the glass ABOVE the touch point
  // 120px is usually enough to clear a thumb/finger
  const VERTICAL_OFFSET = isTouchDevice ? 120 : 0; 

  const processMovement = (clientX: number, clientY: number) => {
    if (!imgRef.current) return;
    const { left, top, width, height } = imgRef.current.getBoundingClientRect();
    
    const x = clientX - left;
    const y = clientY - top;

    // Boundary check
    if (x < 0 || y < 0 || x > width || y > height) {
      setShowMagnifier(false);
      return;
    }

    setCursorPos({ x, y });
    setShowMagnifier(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => processMovement(e.clientX, e.clientY);
  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      processMovement(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  const activeZoomSrc = zoomSrc || src;

  return (
    <div 
      ref={imgRef}
      className="relative overflow-hidden cursor-crosshair group select-none w-full h-full flex items-center justify-center bg-[#dbdbdc] rounded-lg"
      style={{ touchAction: 'none' }} 
      onMouseEnter={() => !isTouchDevice && setShowMagnifier(true)}
      onMouseLeave={() => setShowMagnifier(false)}
      onMouseMove={handleMouseMove}
      onTouchStart={(e) => {
        setShowMagnifier(true);
        processMovement(e.touches[0].clientX, e.touches[0].clientY);
      }}
      onTouchMove={handleTouchMove}
      onTouchEnd={() => setShowMagnifier(false)}
    >
      <img 
        src={src} 
        alt={alt} 
        className="max-w-full max-h-full w-auto h-auto object-contain pointer-events-none"
      />

      {/* Dynamic Hint */}
      <div className={`absolute bottom-4 right-4 bg-black/60 text-white text-[10px] px-3 py-1 rounded-full pointer-events-none transition-opacity duration-300 flex items-center gap-2 ${showMagnifier ? 'opacity-0' : 'opacity-100'}`}>
         <ZoomIn size={12} /> {isTouchDevice ? "Drag to Zoom" : "Hover to Zoom"}
      </div>

      {showMagnifier && (
        <div 
          className="absolute z-50 bg-white border-2 border-white shadow-2xl rounded-full pointer-events-none overflow-hidden"
          style={{
            width: `${glassSize}px`,
            height: `${glassSize}px`,

            // POSITIONING:
            // We center it horizontally (x - size/2)
            // We lift it vertically (y - size/2 - OFFSET)
            left: `${cursorPos.x - glassSize / 2}px`,
           
            top: `${cursorPos.y - glassSize / 1 - VERTICAL_OFFSET}px`,

            backgroundImage: `url('${activeZoomSrc}')`,
            backgroundRepeat: 'no-repeat',
            
            // ZOOM MATH
            backgroundSize: `${(imgRef.current?.offsetWidth || 0) * zoomLevel}px ${(imgRef.current?.offsetHeight || 0) * zoomLevel}px`,
            
            // FOCUS POINT:
            // This stays mapped to cursorPos so it zooms exactly where the finger is,
            // even though the glass itself is positioned higher up.
            backgroundPositionX: `${-cursorPos.x * zoomLevel + glassSize / 2}px`,
            backgroundPositionY: `${-cursorPos.y * zoomLevel + glassSize / 2}px` 
          }}
        />
      )}
    </div>
  );
};

export default MagicZoomClone;