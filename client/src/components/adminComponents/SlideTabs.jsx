import React, { useRef, useState, useEffect } from "react";
import "./styles/SlideTabs.css";

const Tab = ({ label, onClick, setPosition, active }) => {
  const ref = useRef(null);

  useEffect(() => {
    if (active && ref.current) {
      const { offsetLeft, offsetWidth } = ref.current;
      setPosition({ left: offsetLeft, width: offsetWidth });
    }
  }, [active, setPosition]);

  return (
    <li ref={ref} onClick={onClick} className={`tab ${active ? "active" : ""}`}>
      {label}
    </li>
  );
};

const Cursor = ({ position }) => {
  return (
    <li
      className="cursor"
      style={{
        left: `${position.left}px`,
        width: `${position.width}px`,
      }}
    />
  );
};

export const SlideTabs = ({ onTabClick, activeTab }) => {
  const [position, setPosition] = useState({ left: 0, width: 0 });

  return (
    <ul className="slide-tabs">
      <Tab
        label="Previous Week"
        onClick={() => onTabClick("prev")}
        active={activeTab === "prev"}
        setPosition={setPosition}
      />
      <Tab
        label="Current Week"
        onClick={() => onTabClick("current")}
        active={activeTab === "current"}
        setPosition={setPosition}
      />
      <Tab
        label="Next Week"
        onClick={() => onTabClick("next")}
        active={activeTab === "next"}
        setPosition={setPosition}
      />
      <Cursor position={position} />
    </ul>
  );
};
