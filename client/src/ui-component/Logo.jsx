const Logo = () => {
  return (
      <svg
        width="200"
        height="32"
        viewBox="0 0 120 32"
        xmlns="http://www.w3.org/2000/svg"
        style={{ enableBackground: "new 0 0 120 32", marginLeft: "-60px" }}
      >
        <style>
          {`
            @import url('https://fonts.googleapis.com/css2?family=Calibri:wght@400;700&display=swap');
            .st0 { fill: #A1D2FA; stroke: #000000; stroke-miterlimit: 10; }
            .st1 { fill: #5F35B1; stroke: #000000; stroke-miterlimit: 10; }
            .st2 { fill: #1E88E5; stroke: #000000; stroke-width: 0.5; stroke-miterlimit: 10; }
            .st3 { fill: none; }
            .st4 { font-family: 'Calibri'; }
            .st5 { font-size: 34px; }
          `}
        </style>
        <g>
          <path
            className="st0"
            d="M26.6,25.6c-1.4,2.3-4.4,3.6-7.5,2.1c-1.8-0.9-3-2.7-4.4-4.1C10.5,18.8,6,14.2,1.9,9.4l0,0
            C1.7,9.2,1.7,9.2,2,8.8C3.3,7.7,7.9,3.5,9.6,2c0.3-0.3,0.5-0.5,0.6-0.6c0.1,0,0.1,0,0.2,0c0.4,0.5,1.3,1.4,2.5,2.7
            c-1.2,1.9-1.3,4.5,0.3,6.8C16.4,14.5,22.8,21.6,26.6,25.6z"
          />
          <path
            className="st1"
            d="M37.3,20.9c-1.2,1.1-5.8,5.3-7.5,6.9c-0.3,0.3-0.5,0.5-0.6,0.6c-0.1,0-0.1,0-0.2,0c-0.4-0.5-1.3-1.4-2.5-2.7
            c1.2-1.9,1.3-4.5-0.3-6.7C23,15.3,16.5,8.2,12.8,4.1c1.4-2.3,4.4-3.6,7.5-2.1c1.8,0.9,3,2.7,4.4,4.1c4.2,4.7,8.7,9.3,12.8,14.1l0,0
            C37.7,20.6,37.7,20.6,37.3,20.9z"
          />
          <path
            className="st2"
            d="M26.6,25.6c-3.7-4-10.2-11.1-13.4-14.7c-1.7-2.3-1.5-4.9-0.3-6.8c3.7,4,10.2,11.2,13.4,14.7
            C27.9,21.1,27.7,23.7,26.6,25.6z"
          />
          <text transform="matrix(1 0 0 1 41 25)" className="st4 st5">
            SHIFTY
          </text>
        </g>
      </svg>
  );
};

export default Logo;
