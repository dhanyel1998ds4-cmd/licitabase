export function CompanySiteIllustration({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 220 190"
      fill="none"
      className={className}
      aria-hidden="true"
      role="presentation"
    >
      {/* back building */}
      <rect x="88" y="26" width="86" height="150" rx="6" fill="#F1F5F9" />
      <rect x="100" y="42" width="16" height="14" rx="2.5" fill="#FFFFFF" />
      <rect x="124" y="42" width="16" height="14" rx="2.5" fill="#FFFFFF" />
      <rect x="148" y="42" width="16" height="14" rx="2.5" fill="#FFFFFF" />
      <rect x="100" y="66" width="16" height="14" rx="2.5" fill="#FFFFFF" />
      <rect x="124" y="66" width="16" height="14" rx="2.5" fill="#FFFFFF" />
      <rect x="148" y="66" width="16" height="14" rx="2.5" fill="#FFFFFF" />
      <rect x="100" y="90" width="16" height="14" rx="2.5" fill="#FFFFFF" />
      <rect x="124" y="90" width="16" height="14" rx="2.5" fill="#FFFFFF" />
      <rect x="148" y="90" width="16" height="14" rx="2.5" fill="#FFFFFF" />
      <rect x="100" y="114" width="16" height="14" rx="2.5" fill="#FFFFFF" />
      <rect x="148" y="114" width="16" height="14" rx="2.5" fill="#FFFFFF" />
      <rect x="100" y="138" width="16" height="14" rx="2.5" fill="#FFFFFF" />
      <rect x="124" y="138" width="16" height="14" rx="2.5" fill="#FFFFFF" />
      <rect x="148" y="138" width="16" height="14" rx="2.5" fill="#FFFFFF" />

      {/* front-left building */}
      <rect x="30" y="104" width="58" height="72" rx="6" fill="#F8FAFC" />
      <rect x="42" y="118" width="14" height="12" rx="2.5" fill="#FFFFFF" />
      <rect x="62" y="118" width="14" height="12" rx="2.5" fill="#FFFFFF" />
      <rect x="42" y="140" width="14" height="12" rx="2.5" fill="#FFFFFF" />
      <rect x="62" y="140" width="14" height="12" rx="2.5" fill="#FFFFFF" />

      {/* ground line */}
      <rect x="18" y="176" width="184" height="4" rx="2" fill="#E2E8F0" />

      {/* magnifier */}
      <circle cx="146" cy="126" r="34" fill="#FFFFFF" fillOpacity="0.55" />
      <circle cx="146" cy="126" r="34" stroke="#0F172A" strokeWidth="5" />
      <path
        d="M171 151l17 17"
        stroke="#0F172A"
        strokeWidth="7"
        strokeLinecap="round"
      />
    </svg>
  );
}
