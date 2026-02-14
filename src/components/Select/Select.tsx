import React, { useEffect, useId, useMemo, useRef, useState } from "react";
import styles from "./Select.module.scss";

export type SelectOption<T extends string = string> = {
  value: T;
  label: string;
  disabled?: boolean;
};

type Props<T extends string = string> = {
  label?: string;                 // "Language of communication"
  value: T;
  options: SelectOption<T>[];
  onChange: (next: T) => void;

  placeholder?: string;
  disabled?: boolean;
  className?: string;
};

export default function Select<T extends string = string>({
  label,
  value,
  options,
  onChange,
  placeholder = "Select…",
  disabled,
  className,
}: Props<T>) {
  const uid = useId();
  const buttonId = `select-btn-${uid}`;
  const listboxId = `select-list-${uid}`;

  const rootRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number>(() => {
    const i = options.findIndex((o) => o.value === value);
    return i >= 0 ? i : 0;
  });

  const selected = useMemo(
    () => options.find((o) => o.value === value),
    [options, value]
  );

  // Синхронизируем activeIndex, если value меняется извне
  useEffect(() => {
    const i = options.findIndex((o) => o.value === value);
    if (i >= 0) setActiveIndex(i);
  }, [options, value]);

  // Закрыть по клику вне
  useEffect(() => {
    if (!open) return;

    const onPointerDown = (e: PointerEvent) => {
      const el = rootRef.current;
      if (!el) return;
      if (!el.contains(e.target as Node)) {
        setOpen(false);
        // вернуть фокус на кнопку
        buttonRef.current?.focus();
      }
    };

    window.addEventListener("pointerdown", onPointerDown);
    return () => window.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  // Закрыть по Esc
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
        buttonRef.current?.focus();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const openMenu = () => {
    if (disabled) return;
    setOpen(true);
    // При открытии подсветить выбранный
    const i = options.findIndex((o) => o.value === value);
    setActiveIndex(i >= 0 ? i : 0);
  };

  const closeMenu = () => {
    setOpen(false);
    buttonRef.current?.focus();
  };

  const commit = (idx: number) => {
    const opt = options[idx];
    if (!opt || opt.disabled) return;
    if (opt.value !== value) {
      if (typeof onChange === "function") {
        onChange(opt.value);
      } else {
        console.error("Select: onChange prop is not a function", onChange);
      }
    }
    closeMenu();
  };

  const moveActive = (delta: number) => {
    if (!options.length) return;

    let next = activeIndex;
    for (let step = 0; step < options.length; step++) {
      next = (next + delta + options.length) % options.length;
      if (!options[next].disabled) {
        setActiveIndex(next);
        break;
      }
    }
  };

  const onButtonKeyDown: React.KeyboardEventHandler<HTMLButtonElement> = (e) => {
    if (disabled) return;

    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      if (!open) openMenu();
      else moveActive(e.key === "ArrowDown" ? 1 : -1);
    }

    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (!open) openMenu();
      else commit(activeIndex);
    }
  };

  const onListKeyDown: React.KeyboardEventHandler<HTMLUListElement> = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      moveActive(1);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      moveActive(-1);
    } else if (e.key === "Home") {
      e.preventDefault();
      const first = options.findIndex((o) => !o.disabled);
      if (first >= 0) setActiveIndex(first);
    } else if (e.key === "End") {
      e.preventDefault();
      for (let i = options.length - 1; i >= 0; i--) {
        if (!options[i].disabled) {
          setActiveIndex(i);
          break;
        }
      }
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      commit(activeIndex);
    } else if (e.key === "Tab") {
      // табом обычно закрывают и уходят дальше
      setOpen(false);
    }
  };

  return (
    <div ref={rootRef} className={[styles.select, className].filter(Boolean).join(" ")}>
      {label && (
        <div className={styles.select__label} id={`select-label-${uid}`}>
          {label}
        </div>
      )}

      <button
        ref={buttonRef}
        type="button"
        id={buttonId}
        className={styles.select__button}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        aria-labelledby={label ? `select-label-${uid} ${buttonId}` : buttonId}
        disabled={disabled}
        onClick={() => (open ? setOpen(false) : openMenu())}
        onKeyDown={onButtonKeyDown}
      >
        <span className={styles.select__value}>
          {selected?.label ?? placeholder}
        </span>

        <span className={styles.select__chevron} aria-hidden="true" />
      </button>

      {open && (
        <ul
          className={styles.select__list}
          id={listboxId}
          role="listbox"
          aria-labelledby={label ? `select-label-${uid}` : undefined}
          tabIndex={-1}
          onKeyDown={onListKeyDown}
        >
          {options.map((opt, idx) => {
            const isSelected = opt.value === value;
            const isActive = idx === activeIndex;

            return (
              <li
                key={opt.value}
                role="option"
                aria-selected={isSelected}
                aria-disabled={opt.disabled || undefined}
                className={[
                  styles.select__option,
                  isSelected ? styles["select__option--selected"] : "",
                  isActive ? styles["select__option--active"] : "",
                  opt.disabled ? styles["select__option--disabled"] : "",
                ].filter(Boolean).join(" ")}
                onMouseEnter={() => !opt.disabled && setActiveIndex(idx)}
                onMouseDown={(e) => e.preventDefault()} // чтобы кнопка не теряла фокус раньше времени
                onClick={() => commit(idx)}
              >
                {opt.label}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
