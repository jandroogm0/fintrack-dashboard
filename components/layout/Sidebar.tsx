"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ArrowLeftRight,
  Wallet,
  PieChart,
  BarChart3,
  Wallet2,
} from "lucide-react";
import clsx from "clsx";

const NAV_ITEMS = [
  { href: "/", label: "Resumen", icon: LayoutDashboard },
  { href: "/transacciones", label: "Transacciones", icon: ArrowLeftRight },
  { href: "/cartera", label: "Cartera", icon: Wallet },
  { href: "/presupuesto", label: "Presupuesto", icon: PieChart },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex w-[240px] shrink-0 flex-col border-r border-border bg-surface px-4 py-6">
      <div className="flex items-center gap-2 px-2 pb-8">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-white">
          <Wallet2 size={18} />
        </div>
        <span className="text-lg font-semibold tracking-tight">FinTrack</span>
      </div>

      <nav className="flex flex-1 flex-col gap-1">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={clsx(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-primary text-white shadow-sm shadow-primary/30"
                  : "text-muted hover:bg-primary-light hover:text-primary"
              )}
            >
              <Icon size={18} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="rounded-xl bg-primary-light px-3 py-3 text-xs text-muted">
        <p className="font-medium text-foreground">Datos reales de Notion</p>
        <p className="mt-1">Snapshot manual · fase 1 (frontend)</p>
      </div>
    </aside>
  );
}
