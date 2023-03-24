import { useState, useEffect, useRef } from "react";

type SelectOption = {
  value: string;
  label: string;
};

type MultiSelectProps = {
  multiple: true;
  value?: SelectOption[];
  onChange: (value: SelectOption[] | undefined) => void;
};

type SingleSelectProps = {
  multiple?: false;
  value?: SelectOption;
  onChange: (value: SelectOption | undefined) => void;
};

type SelectProps = {
  options: SelectOption[];
} & (MultiSelectProps | SingleSelectProps);

const Select = ({ multiple, value, onChange, options }: SelectProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(0);

  useEffect(() => {
    if (isOpen) setHighlighted(0);
  }, [isOpen]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target != containerRef.current) return;
      switch (e.code) {
        case "Enter":
        case "Space":
          setIsOpen((pre) => !pre);
          if (isOpen) {
            multiple
              ? onChange([...(value || []), options[highlighted]])
              : onChange(options[highlighted]);
            setIsOpen(false);
          }
          break;
        case "ArrowUp":
          setHighlighted((pre) => (pre === 0 ? options.length - 1 : pre - 1));
          break;
        case "ArrowDown":
          if (!isOpen) setIsOpen(true);
          setHighlighted((pre) => (pre === options.length - 1 ? 0 : pre + 1));
          break;
        case "Escape":
          setIsOpen(false);
          break;
      }
    };
    containerRef.current?.addEventListener("keydown", handler);
    return () => containerRef.current?.removeEventListener("keydown", handler);
  }, [isOpen, highlighted, options]);

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      className="relative focus:border-[hsl(200,100%,50%)] w-[20em] min-h-[1.5em] border-[0.05em] border-[#777] flex items-center gap-[0.5em] p-[0.5em] rounded-[0.25em] outline-none"
      onClick={() => setIsOpen(!isOpen)}
      onBlur={() => setIsOpen(false)}
    >
      <span className="grow flex gap-2 flex-wrap">
        {multiple
          ? value?.map((v) => (
              <button
                key={v.value}
                onClick={(e) => {
                  e.stopPropagation();
                  onChange(value?.filter((o) => o.value !== v.value));
                }}
                className="border-[.05em] border-[#777] rounded-[.25em] flex items-center gap-2 px-[.25em] py-[.1em] focus:cursor-pointer hover:bg-[hsl(0,100%,90%)] focus:bg-[hsl(0,100%,90%)] hover:border-[hsl(0,100%,50%)]"
              >
                {v.label}
                <span className="hover:text-[hsl(0,100%,50%)] text-[1.25em] text-[#777]">
                  &times;
                </span>
              </button>
            ))
          : value?.label}
      </span>
      <button
        className="text-[#777] cursor-pointer p-0 text-[1.25em] hover:text-[#333] focus:text-[#333]"
        onClick={(e) => {
          e.stopPropagation();
          multiple ? onChange([]) : onChange(undefined);
        }}
      >
        &times;
      </button>
      <div className="bg-[#777] self-stretch w-[.05em]"></div>
      <div className="translate-y-1/4 border-[.25em] border-transparent border-t-[#777]"></div>
      <ul
        className={`options bg-white z-10 m-0 p-0 w-full absolute left-0 list-none m-h-[15em] overflow-y-auto border-[.05em] border-[#777] rounded-[.25em]
      ${isOpen ? "block" : "hidden"}`}
      >
        {options.map((option, index) => (
          <li
            key={option.value}
            className={`py-[.25em] px-[.5em] hover:cursor-pointer ${
              index === highlighted ? "bg-[#777]" : ""
            }`}
            onClick={(e) => {
              e.stopPropagation();
              multiple
                ? onChange([...(value || []), option])
                : onChange(option);
              setIsOpen(false);
            }}
            onMouseEnter={() => setHighlighted(options.indexOf(option))}
          >
            {option.label}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Select;
