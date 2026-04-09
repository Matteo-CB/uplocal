"use client";

import { useState } from "react";

interface FAQAccordionProps {
  items: { question: string; answer: string }[];
}

export function FAQAccordion({ items }: FAQAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  function toggle(index: number) {
    setOpenIndex(openIndex === index ? null : index);
  }

  return (
    <div className="divide-y divide-border border-t border-border">
      {items.map((item, index) => (
        <details
          key={index}
          open={openIndex === index}
          className="group"
          onToggle={(e) => {
            if ((e.target as HTMLDetailsElement).open) {
              setOpenIndex(index);
            } else if (openIndex === index) {
              setOpenIndex(null);
            }
          }}
        >
          <summary className="flex cursor-pointer items-center justify-between py-6 font-display text-xl text-ink transition-colors duration-200 hover:text-accent [&::-webkit-details-marker]:hidden list-none">
            <span className="pe-8">{item.question}</span>
            <span
              className="shrink-0 text-muted transition-transform duration-200 group-open:rotate-45"
              aria-hidden="true"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10 4V16M4 10H16"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="square"
                />
              </svg>
            </span>
          </summary>

          <div className="overflow-hidden">
            <p className="pb-6 font-body text-base leading-relaxed text-muted">
              {item.answer}
            </p>
          </div>
        </details>
      ))}
    </div>
  );
}
