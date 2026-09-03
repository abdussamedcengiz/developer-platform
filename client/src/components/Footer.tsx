import { Link } from "react-router-dom";
import { GitHubIcon, LinkedInIcon, MailIcon } from "./Icons";

const socials = [
  {
    href: "https://github.com/abdussamedcengiz",
    label: "GitHub",
    Icon: GitHubIcon,
  },
  {
    href: "https://www.linkedin.com/in/abdussamed-cengiz-788951236/",
    label: "LinkedIn",
    Icon: LinkedInIcon,
  },
  {
    href: "mailto:cengizabdussamed17@gmail.com",
    label: "E-posta",
    Icon: MailIcon,
  },
];

const pages = [
  { to: "/blog", label: "Blog" },
  { to: "/projects", label: "Projeler" },
  { to: "/about", label: "Hakkımda" },
];

function Footer() {
  // new Date().getFullYear(): yil otomatik guncellensin.
  // Elle "2026" yazsaydin siteyi her yil basi duzeltmen gerekirdi.
  const year = new Date().getFullYear();

  return (
    <footer className="mt-24 border-t border-slate-200 dark:border-slate-800">
      <div className="mx-auto max-w-5xl px-5 py-12 sm:px-6">
        <div className="flex flex-col gap-10 sm:flex-row sm:justify-between">
          {/* --- SOL: kimlik --- */}
          <div className="max-w-xs">
            <p className="font-semibold tracking-tight">Abdüssamed Cengiz</p>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Yazılım mühendisi. Web ve mobil uygulamalar geliştiriyorum.
              İzmir'de yaşıyorum.
            </p>

            <div className="mt-5 flex items-center gap-2">
              {socials.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  // mailto: baglantisini yeni sekmede acmak anlamsiz;
                  // sadece dis baglantilara target veriyoruz.
                  {...(href.startsWith("http")
                    ? { target: "_blank", rel: "noreferrer" }
                    : {})}
                  aria-label={label}
                  title={label}
                  className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
                >
                  <Icon className="h-[18px] w-[18px]" />
                </a>
              ))}
            </div>
          </div>

          {/* --- SAG: site haritasi --- */}
          <nav aria-label="Alt menü" className="text-sm">
            <p className="text-xs font-semibold tracking-wider text-slate-400 uppercase dark:text-slate-500">
              Site
            </p>
            <ul className="mt-3 space-y-2">
              {pages.map((page) => (
                <li key={page.to}>
                  <Link
                    to={page.to}
                    className="text-slate-600 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
                  >
                    {page.label}
                  </Link>
                </li>
              ))}
              <li>
                <a
                  href="/cv.pdf"
                  target="_blank"
                  rel="noreferrer"
                  className="text-slate-600 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
                >
                  CV (PDF)
                </a>
              </li>
            </ul>
          </nav>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-slate-200 pt-6 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800 dark:text-slate-400">
          <p>© {year} Abdüssamed Cengiz</p>

          {/* Bu satir bir suslemeden fazlasi: siteyi gezen ise alimciya
              yigini tek bakista soyluyor. */}
          <p className="font-mono text-xs">
            React · TypeScript · Node.js · PostgreSQL
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
