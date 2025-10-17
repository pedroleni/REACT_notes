export default function Logo() {
  return (
    <div className="Logotipo">
      <svg viewBox="0 0 900 300" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="mainGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop
              offset="0%"
              style={{ stopColor: "#6366f1", stopOpacity: 1 }}
            />
            <stop
              offset="100%"
              style={{ stopColor: "#8b5cf6", stopOpacity: 1 }}
            />
          </linearGradient>

          <linearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop
              offset="0%"
              style={{ stopColor: "#ec4899", stopOpacity: 1 }}
            />
            <stop
              offset="100%"
              style={{ stopColor: "#f43f5e", stopOpacity: 1 }}
            />
          </linearGradient>

          <radialGradient id="glowGrad">
            <stop
              offset="0%"
              style={{ stopColor: "#8b5cf6", stopOpacity: 0.3 }}
            />
            <stop
              offset="100%"
              style={{ stopColor: "#8b5cf6", stopOpacity: 0 }}
            />
          </radialGradient>

          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="softShadow">
            <feGaussianBlur in="SourceAlpha" stdDeviation="2" />
            <feOffset dx="0" dy="2" result="offsetblur" />
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.2" />
            </feComponentTransfer>
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <circle cx="150" cy="150" r="100" fill="url(#glowGrad)" />

        <g transform="translate(80, 80)">
          <path
            d="M 70 30 L 110 50 L 110 90 L 70 110 L 30 90 L 30 50 Z"
            fill="url(#mainGrad)"
            filter="url(#softShadow)"
          />

          <line
            x1="70"
            y1="30"
            x2="70"
            y2="110"
            stroke="white"
            strokeWidth="2"
            opacity="0.6"
          />
          <line
            x1="30"
            y1="50"
            x2="110"
            y2="90"
            stroke="white"
            strokeWidth="2"
            opacity="0.6"
          />
          <line
            x1="30"
            y1="90"
            x2="110"
            y2="50"
            stroke="white"
            strokeWidth="2"
            opacity="0.6"
          />

          <circle
            cx="70"
            cy="70"
            r="15"
            fill="url(#accentGrad)"
            filter="url(#glow)"
          />

          <circle cx="70" cy="30" r="4" fill="white" />
          <circle cx="110" cy="50" r="4" fill="white" />
          <circle cx="110" cy="90" r="4" fill="white" />
          <circle cx="70" cy="110" r="4" fill="white" />
          <circle cx="30" cy="90" r="4" fill="white" />
          <circle cx="30" cy="50" r="4" fill="white" />
        </g>

        <text
          x="240"
          y="170"
          fontFamily="'SF Pro Display', 'Segoe UI', system-ui, sans-serif"
          fontSize="95"
          fontWeight="700"
          fill="#f2f2f2"
          letterSpacing="-3"
        >
          NEXUS
        </text>

        <text
          x="600"
          y="170"
          fontFamily="'SF Pro Display', 'Segoe UI', system-ui, sans-serif"
          fontSize="95"
          fontWeight="300"
          fill="url(#mainGrad)"
          letterSpacing="2"
        >
          PRO
        </text>

        <rect
          x="240"
          y="190"
          width="520"
          height="3"
          fill="url(#accentGrad)"
          opacity="0.6"
          rx="2"
        />

        <text
          x="240"
          y="225"
          fontFamily="'SF Pro Display', 'Segoe UI', system-ui, sans-serif"
          fontSize="20"
          fontWeight="400"
          fill="#64748b"
          letterSpacing="3"
        >
          PROJECT MANAGEMENT
        </text>
      </svg>
    </div>
  );
}
