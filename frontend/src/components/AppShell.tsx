import { Activity, Archive, Settings2, Sparkles } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import type { ReactNode } from "react";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useLocale } from "../i18n/LocaleProvider";
import { getShellCopy } from "../i18n/shellCopy";
import type { ServiceState } from "../lib/music3Types";

const REPOSITORY_URL = "https://github.com/Sunwood-ai-labs/minimax-music3-studio";

interface AppShellProps {
  children: ReactNode;
  serviceState: ServiceState;
  activeCount: number;
}

function ForgeFooterLink({ label }: { label: string }) {
  return (
    <a className="footer-brand-link" href={REPOSITORY_URL} target="_blank" rel="noreferrer">
      <span className="footer-brand-mark" aria-hidden="true">3</span>
      <span>{label}</span>
    </a>
  );
}

export function AppShell({ children, serviceState, activeCount }: AppShellProps) {
  const location = useLocation();
  const { locale } = useLocale();
  const copy = getShellCopy(locale);
  const [eyebrow, title] = copy.pageMeta(location.pathname);
  const serviceLabel = copy.serviceLabel(serviceState);
  const navigation = [
    { to: "/", ...copy.navigation.create, icon: Sparkles },
    { to: "/library", ...copy.navigation.library, icon: Archive },
    { to: "/system", ...copy.navigation.system, icon: Settings2 },
  ];

  return (
    <div className="app-frame">
      <a className="skip-link" href="#main-content">{copy.skipLink}</a>
      <aside className="sidebar" aria-label={copy.navigationLabel}>
      <div className="brand-lockup">
          <strong>MINIMAX / MUSIC</strong>
          <span>3.0 STUDIO</span>
        </div>

        <nav className="side-nav">
          <p className="nav-caption">{copy.workspace}</p>
          {navigation.map(({ to, label, icon: Icon, hint }) => (
            <NavLink key={to} to={to} end={to === "/"} className={({ isActive }) => `nav-link${isActive ? " is-active" : ""}`} title={hint}>
              <Icon size={18} strokeWidth={1.8} aria-hidden="true" />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <footer className="sidebar-footer">
          <div className={`service-badge ${serviceState}`} aria-label={serviceLabel}>
            <span aria-hidden="true" />
            {serviceLabel}
          </div>
          <p>{copy.localServiceNote}</p>
          <ForgeFooterLink label={copy.sourceApi} />
        </footer>
      </aside>

      <section className="workspace">
        <header className="topbar">
          <div>
            <p className="eyebrow">{eyebrow}</p>
            <h1>{title}</h1>
          </div>
          <div className="topbar-actions">
            <LanguageSwitcher />
            <div className="topbar-status" aria-label={copy.activeJobs(activeCount)}>
              <Activity size={16} aria-hidden="true" />
              <span>{copy.activeJobs(activeCount)}</span>
            </div>
          </div>
        </header>
        <main id="main-content" className="main-content">{children}</main>
        <footer className="mobile-brand-footer">
          <ForgeFooterLink label={copy.sourceApi} />
        </footer>
      </section>
    </div>
  );
}
