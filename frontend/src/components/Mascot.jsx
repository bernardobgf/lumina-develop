export default function Mascot({ large = false, waving = false }) {
  return (
    <div
      className={`mascot ${large ? "mascot--large" : ""} ${waving ? "mascot--wave" : ""}`}
      aria-label="Mascote da Lumina, uma estrelinha feliz"
      role="img"
    >
      <svg viewBox="0 0 120 112" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          className="mascot-shadow"
          d="M25 93c14 9 56 9 70 0"
          stroke="#a8cbb8"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <path
          className="mascot-body"
          d="M60 7c5 0 8 6 11 13l7 14 15 2c15 2 18 12 7 22l-11 10 3 16c3 15-6 21-19 14L60 90 46 98c-13 7-22 1-19-14l3-16-11-10c-11-10-8-20 7-22l15-2 7-14C52 13 55 7 60 7Z"
          fill="url(#starGradient)"
          stroke="#477a5c"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <defs>
          <linearGradient
            id="starGradient"
            x1="26"
            y1="10"
            x2="95"
            y2="100"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#fff" />
            <stop offset=".55" stopColor="#e1f0e5" />
            <stop offset="1" stopColor="#b8d8c0" />
          </linearGradient>
        </defs>
        <ellipse cx="47" cy="53" rx="3.5" ry="5" fill="#244b34" />
        <ellipse cx="72" cy="53" rx="3.5" ry="5" fill="#244b34" />
        <path
          d="M52 65c4 5 12 5 16 0"
          stroke="#244b34"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <ellipse cx="37" cy="63" rx="6" ry="3" fill="#f3a6c8" opacity=".8" />
        <ellipse cx="83" cy="63" rx="6" ry="3" fill="#f3a6c8" opacity=".8" />
        <path
          d="m22 25 3 5 5 2-5 2-3 5-2-5-5-2 5-2 2-5Zm75 9 2 4 4 2-4 2-2 4-2-4-4-2 4-2 2-4Z"
          fill="#f1c96d"
        />
      </svg>
    </div>
  );
}
