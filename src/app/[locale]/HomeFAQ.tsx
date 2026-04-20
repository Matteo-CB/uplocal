"use client";

import { useState } from "react";

interface FAQItem {
  question: string;
  answer: string;
}

interface HomeFAQProps {
  items: FAQItem[];
}

export function HomeFAQ({ items }: HomeFAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  function toggle(index: number) {
    setOpenIndex(openIndex === index ? null : index);
  }

  return (
    <div className="divide-y divide-border">
      {items.map((item, index) => (
        <div key={index} className="py-6">
          <button
            type="button"
            className="w-full flex items-start justify-between gap-4 text-start cursor-pointer"
            onClick={() => toggle(index)}
            aria-expanded={openIndex === index}
          >
            <span className="font-display text-lg text-ink">
              {item.question}
            </span>
            <svg
              className={`w-5 h-5 mt-1 shrink-0 text-muted transition-transform duration-200 ${
                openIndex === index ? "rotate-45" : ""
              }`}
              viewBox="0 0 20 20"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M10 4V16M4 10H16"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="square"
              />
            </svg>
          </button>
          {openIndex === index && (
            <p className="mt-4 text-muted font-body max-w-xl">
              {item.answer}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
