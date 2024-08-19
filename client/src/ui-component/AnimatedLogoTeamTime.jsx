import React, { useCallback } from "react";
import { motion } from "framer-motion";

function AnimatedLogoTeamTime({ size = 6, outlined = false }) {
  let width, height;

  switch (size) {
    case 1:
      width = 450;
      height = 462;
      break;
    case 2:
      width = 337.5;
      height = 346.5;
      break;
    case 3:
      width = 225;
      height = 231;
      break;
    case 4:
      width = 112.5;
      height = 115.5;
      break;
    case 5:
      width = 56.25;
      height = 57.75;
      break;
    case 6:
      width = 37.5;
      height = 38.5;
      break;
    default:
      width = 37.5;
      height = 38.5;
  }

  const getRandomDuration = useCallback(() => {
    return 0.5 + Math.random() * 1.5; // יוצר מספר רנדומלי בין 0.5 ל-2 שניות
  }, []);

  const createVariant = useCallback(
    (startColor, endColor) => {
      return {
        hidden: { pathLength: 0, fill: startColor },
        visible: {
          pathLength: 1,
          fill: endColor,
          transition: {
            pathLength: {
              duration: getRandomDuration(),
              ease: "easeInOut",
              repeat: Infinity,
              repeatType: "reverse",
              repeatDelay: getRandomDuration(),
            },
            fill: {
              duration: 1,
              ease: "easeInOut",
              repeat: Infinity,
              repeatType: "reverse",
              repeatDelay: 1,
            },
          },
        },
      };
    },
    [getRandomDuration]
  );

  const variantPath1 = createVariant("#CCE5FF", "#CCFFFF");
  const variantPath2 = createVariant("#CCFFFF", "#CDCCFF");
  const variantCircle = createVariant("#CDCCFF", "#CCE5FF");

  const containerVariants = {
    hidden: { scale: 0.8 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 1.5,
        ease: "easeInOut",
        repeat: Infinity,
        repeatType: "reverse",
      },
    },
  };

  return (
    <motion.svg
      width={width}
      height={height}
      viewBox="0 0 455 462"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.path
        d="M296 151.5H163V455C276.6 393.4 299 271.333 296 218V151.5Z"
        stroke="black"
        strokeWidth="10"
        variants={variantPath1}
        initial="hidden"
        animate="visible"
      />
      <motion.path
        d="M283 4.5H5.5L5 151.5H162.5C157.7 39.9 240.833 7 283 4.5Z"
        stroke="black"
        strokeWidth="10"
        variants={variantPath2}
        initial="hidden"
        animate="visible"
      />
      <motion.circle
        cx="374.5"
        cy="77.5"
        r="71.5"
        stroke="black"
        strokeWidth="10"
        variants={variantCircle}
        initial="hidden"
        animate="visible"
      />
    </motion.svg>
  );
}

export default AnimatedLogoTeamTime;
