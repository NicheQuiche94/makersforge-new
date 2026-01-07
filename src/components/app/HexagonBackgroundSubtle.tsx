export function HexagonBackgroundSubtle() {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <svg
          className="absolute w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="hexagons-subtle"
              width="60"
              height="52"
              patternUnits="userSpaceOnUse"
              patternTransform="scale(1.5)"
            >
              <path
                d="M30 0L60 15L60 37L30 52L0 37L0 15L30 0Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
                strokeOpacity="0.08"
                className="text-white"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hexagons-subtle)" />
        </svg>
      </div>
    );
  }