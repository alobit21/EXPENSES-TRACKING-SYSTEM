import { useState, useEffect, useRef } from "react";
import { motion, animate } from "framer-motion";

const Carousel3D = () => {
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const images = [
    "/assets/1.jpg",
    "/assets/2.jpg",
    "/assets/5.jpg",
    "/assets/7.jpeg",
    "/assets/8.jpeg",
  ];

  const angleStep = 360 / images.length;
  const radius = 500; // controls depth

  // Auto rotation (pauses when dragging)
  useEffect(() => {
    if (!isDragging) {
      intervalRef.current = setInterval(() => {
        setRotation((prev) => prev + angleStep);
      }, 4000);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isDragging, angleStep]);

  return (
    <div
      className="relative w-full h-[550px] flex items-center justify-center"
      style={{ perspective: "1800px" }}
    >
      {/* 3D rotating wrapper */}
      <motion.div
        className="relative w-[600px] h-[400px] cursor-grab active:cursor-grabbing"
        style={{ transformStyle: "preserve-3d" }}
        animate={{ rotateY: rotation }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.05}
        onDragStart={() => {
          setIsDragging(true);
          if (intervalRef.current) clearInterval(intervalRef.current);
        }}
        onDrag={(event, info) => {
          setRotation((prev) => prev + info.delta.x * -0.4);
        }}
        onDragEnd={(event, info) => {
          setIsDragging(false);

          // inertia: keep spinning naturally after release
          animate(rotation, rotation + info.velocity.x * -0.2, {
            type: "inertia",
            min: -Infinity,
            max: Infinity,
            velocity: info.velocity.x * -0.2,
            power: 0.8,
            timeConstant: 300,
            onUpdate: (latest) => setRotation(latest),
          });
        }}
      >
        {images.map((src, index) => {
          const angle = angleStep * index;
          return (
            <div
              key={src}
              className="absolute inset-0 rounded-2xl overflow-hidden shadow-2xl"
              style={{
                transform: `rotateY(${angle}deg) translateZ(${radius}px)`,
              }}
            >
              <img
                src={src}
                alt={`Slide ${index + 1}`}
                className="w-full h-full object-cover rounded-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/10 to-transparent" />
            </div>
          );
        })}
      </motion.div>

      {/* Navigation dots */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setRotation(angleStep * index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              Math.round(rotation / angleStep) % images.length === index
                ? "bg-white scale-125 shadow-lg"
                : "bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel3D;
