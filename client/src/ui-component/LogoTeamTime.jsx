import React from "react";

function LogoTeamTime({ size = 6, outlined = false }) {
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

  const fillColor = outlined ? "none" : undefined;

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 455 462"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M296 151.5H163V455C276.6 393.4 299 271.333 296 218V151.5Z"
        fill={outlined ? "none" : "#CCFFFF"}
        stroke="black"
        strokeWidth="10"
      />
      <path
        d="M283 4.5H5.5L5 151.5H162.5C157.7 39.9 240.833 7 283 4.5Z"
        fill={outlined ? "none" : "#CDCCFF"}
        stroke="black"
        strokeWidth="10"
      />
      <path
        d="M283 4.5H288.5H294"
        stroke="black"
        strokeWidth="10"
        strokeLinecap="round"
      />
      <circle
        cx="374.5"
        cy="77.5"
        r="71.5"
        fill={outlined ? "none" : "#CCE5FF"}
        stroke="black"
        strokeWidth="10"
      />
    </svg>
  );
}

export default LogoTeamTime;
