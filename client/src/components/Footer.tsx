function Footer() {
  // new Date().getFullYear(): yil otomatik guncellensin.
  // Elle "2026" yazsaydin siteyi her yil basi duzeltmen gerekirdi.
  const year = new Date().getFullYear();

  return (
    <footer className="mt-24 border-t border-slate-200 dark:border-slate-800">
      <div className="mx-auto flex max-w-3xl flex-col gap-4 px-6 py-10 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between dark:text-slate-400">
        <p>© {year} Abdüssamed Cengiz</p>

        <div className="flex items-center gap-5">
          <a
            href="https://github.com/abdussamedcengiz"
            target="_blank"
            rel="noreferrer"
            className="transition hover:text-slate-900 dark:hover:text-slate-100"
          >
            GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/abdussamed-cengiz-788951236/"
            target="_blank"
            rel="noreferrer"
            className="transition hover:text-slate-900 dark:hover:text-slate-100"
          >
            LinkedIn
          </a>
          <a
            href="mailto:cengizabdussamed17@gmail.com"
            className="transition hover:text-slate-900 dark:hover:text-slate-100"
          >
            E-posta
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
