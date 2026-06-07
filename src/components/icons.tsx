import type { SVGProps, ComponentProps } from 'react';

export function LungsIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M10 16c-2 0-4-1-4-4 0-4 2-6 4-6s4 2 4 6c0 3-2 4-4 4Z" />
      <path d="M14 16c2 0 4-1 4-4 0-4-2-6-4-6s-4 2-4 6c0 3 2 4 4 4Z" />
      <path d="M12 8V4" />
      <path d="m12 18 2 4" />
      <path d="m12 18-2 4" />
      <path d="M10 10h.01" />
      <path d="M14 10h.01" />
    </svg>
  );
}

export function WhatsAppIcon({ className, style, ...props }: ComponentProps<'img'>) {
  return (
    <img
      src="/images/iconewhatsapp.png"
      alt="WhatsApp"
      className={className}
      style={{
        filter: 'brightness(0) invert(1)',
        objectFit: 'contain',
        display: 'inline-block',
        verticalAlign: 'middle',
        ...style,
      }}
      {...props}
    />
  );
}
