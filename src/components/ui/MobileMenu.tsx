"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { localePath, type Locale } from "@/i18n/config";
import { AdminButton } from "./AdminButton";
import { LanguageSwitcher } from "./LanguageSwitcher";

interface Props {
  lang: Locale;
  email: string;
  labels: {
    home: string;
    about: string;
    articles: string;
    contact: string;
    newsletter: string;
    login: string;
    language: string;
    menu: string;
    closeMenu: string;
  };
}

// Menú de la barra superior en móvil: un solo botón que despliega todos los enlaces.
// En pantallas a partir de `sm` no se muestra (ahí se ve la barra completa).
export function MobileMenu({ lang, email, labels }: Props) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const item = "block py-3 border-t border-rule text-[0.8125rem] hover:text-accent transition-colors";

  return (
    <div className="sm:hidden">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? labels.closeMenu : labels.menu}
        className="label flex items-center gap-2 border border-ink text-ink px-3 py-2 leading-none hover:bg-ink hover:text-inverse transition-colors"
      >
        <span aria-hidden="true" className="relative block w-4 h-3">
          <span className={`absolute left-0 w-full h-0.5 bg-current transition-all ${open ? "top-1/2 -translate-y-1/2 rotate-45" : "top-0"}`} />
          <span className={`absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-current transition-opacity ${open ? "opacity-0" : ""}`} />
          <span className={`absolute left-0 w-full h-0.5 bg-current transition-all ${open ? "top-1/2 -translate-y-1/2 -rotate-45" : "bottom-0"}`} />
        </span>
        {labels.menu}
      </button>

      {open && (
        <div
          id={panelId}
          className="absolute left-0 right-0 top-full z-40 bg-paper border-b border-ink shadow-md"
          onClick={(e) => {
            // Cualquier enlace o botón del panel lo cierra (navegar, cambiar de idioma, salir).
            if ((e.target as HTMLElement).closest("a, button")) setOpen(false);
          }}
        >
          <nav aria-label={labels.menu} className="max-w-6xl mx-auto px-4 pb-4 label text-ink">
            <Link href={localePath(lang)} className={item}>{labels.home}</Link>
            <Link href={localePath(lang, "/about")} className={item}>{labels.about}</Link>
            <Link href={localePath(lang, "/articles")} className={item}>{labels.articles}</Link>
            <a href={`mailto:${email}`} className={item}>{labels.contact}</a>
            <Link
              href={localePath(lang, "/newsletter")}
              className="block text-center border border-ink px-3 py-3 mt-1 text-[0.8125rem] hover:bg-ink hover:text-inverse transition-colors"
            >
              {labels.newsletter}
            </Link>
            <div className="flex items-center justify-between gap-4 pt-4 mt-4 border-t border-rule">
              <LanguageSwitcher current={lang} label={labels.language} />
              <AdminButton lang={lang} loginLabel={labels.login} />
            </div>
          </nav>
        </div>
      )}
    </div>
  );
}
