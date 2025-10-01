import { useState, useEffect } from "react";
import { motion, useMotionValue } from "framer-motion";

const Carousel3D = () => {
  const [rotation, setRotation] = useState(0);
  const dragX = useMotionValue(0);

  const images = [
    "/assets/1.jpg",
    "/assets/2.jpg",
    "/assets/5.jpg",
    "/assets/7.jpg",
    "/assets/8.jpg",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setRotation((prev) => prev + 360 / images.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [images.length]);

  const radius = 500; // controls depth
  const angleStep = 360 / images.length;

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
        onDrag={(event, info) => {
          setRotation((prev) => prev + info.delta.x * -0.4); 
          // -0.4 = sensitivity factor
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
