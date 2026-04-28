import { useState, useRef, useEffect, useId } from "react";
import "../Styles/App.css"

const PRICE_RANGES = [
  { label: "Any Price",        min: null, max: null  },
  { label: "Under ₦1,000,000",     min: 0,    max: 1000000  },
  { label: "₦1,000,000 – ₦2,000,000", min: 1000000, max: 20000000 },
  { label: "₦2,000,000 – ₦5,000,000",min: 20000000,max: 50000000 },
  { label: "₦5,000,000 – ₦1,000,000",min:5000000, max:1000000},
  { label: "₦1,000,000 – ₦5,000,000",min:1000000,max:5000000},
  { label: "Over ₦5,000,000",    min: 5000000, max: null },
];

type PriceRange = { label: string; min: number | null; max: number | null };

type RangeDropDownProps = {
  label?: string;
  value: PriceRange;
  onChange: (range: PriceRange) => void;
  ranges?: PriceRange[];
};

const TagIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"
      stroke="currentColor" strokeWidth="1.8"
      strokeLinecap="round" strokeLinejoin="round"
    />
    <circle cx="7" cy="7" r="1.5" fill="    `" />
  </svg>
);

const ChevronIcon = ({ open }: { open: boolean }) => (
  <svg
    width="16" height="16" viewBox="0 0 16 16" fill="none"
    style={{ transition: "transform 0.2s ease", transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
  >
    <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5"
      strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
    <path d="M2.5 7l3.5 3.5 5.5-6" stroke="#6366f1" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);


const RangeDropDown = ({              
  label = "Price Range",
  value,
  onChange,
  ranges = PRICE_RANGES,
}: RangeDropDownProps) => {

  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const id = useId();

  const selected =
    ranges.find((r) => r.min === (value?.min ?? null) && r.max === (value?.max ?? null))
    ?? ranges[0];

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSelect = (range: PriceRange) => {
    onChange(range);
    setOpen(false);
  };

  return (                          
    <div className="input_group" ref={ref}>
      <label htmlFor={id}>{label}</label>
      <div className="input_wrapper">  

        <button
          id={id}
          type="button"
          className={`price_trigger ${open ? "price_trigger--open" : ""}`}
          aria-haspopup="listbox"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          <span className="price_trigger__left">
            <TagIcon />
            <span className={selected.min === null ? "price_placeholder" : ""}>
              {selected.label}
            </span>
          </span>
          <ChevronIcon open={open} />
        </button>

        {open && (                    
          <ul role="listbox" className="price_dropdown">
            {ranges.map((range, i) => {
              const isSelected = range.label === selected.label;
              return (
                <li
                  key={i}
                  role="option"
                  aria-selected={isSelected}
                  tabIndex={0}
                  className={`price_option ${isSelected ? "price_option--selected" : ""}`}
                  onClick={() => handleSelect(range)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handleSelect(range); }
                    if (e.key === "Escape") setOpen(false);
                  }}
                >
                  {range.label}
                  {isSelected && <CheckIcon />}
                </li>
              );
            })}
          </ul>
        )}

      </div>
    </div>
  );
};

export default RangeDropDown;