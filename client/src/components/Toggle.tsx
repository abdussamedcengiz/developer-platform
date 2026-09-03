// Anahtar (switch) gorunumlu onay kutusu.
//
// Altta hala GERCEK bir <input type="checkbox"> var; sadece
// gorsel olarak gizlendi (sr-only). Kendi div'imizden bir anahtar
// uydursaydik klavye, form gonderimi ve ekran okuyucu davranisini
// elle yeniden yazmamiz gerekirdi -- ve buyuk ihtimalle eksik yazardik.
//
// peer / peer-checked: kardes elemanin durumuna gore stil vermenin
// Tailwind yolu. Input "peer", yanindaki kutu ona bakarak boyaniyor.

type ToggleProps = {
  id: string;
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
  hint?: string;
};

function Toggle({ id, checked, onChange, label, hint }: ToggleProps) {
  return (
    <label
      htmlFor={id}
      className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 p-4 transition hover:border-slate-300 dark:border-slate-800 dark:hover:border-slate-700"
    >
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="peer sr-only"
      />

      {/* Rayin kendisi.
          DIKKAT: topuzun kaymasi RAY uzerinden yaziliyor
          (peer-checked:[&>span]:...), topuzun kendi uzerinden degil.
          Cunku "peer-checked:" CSS'te "~" kardes birlestiricisine
          derlenir; topuz input'un kardesi DEGIL, kardesinin cocugu. */}
      <span
        aria-hidden="true"
        className="relative mt-0.5 h-5 w-9 shrink-0 rounded-full bg-slate-300 transition-colors
          peer-checked:bg-accent-600 peer-checked:[&>span]:translate-x-4
          peer-focus-visible:ring-2 peer-focus-visible:ring-accent-500 peer-focus-visible:ring-offset-2
          dark:bg-slate-700 dark:peer-focus-visible:ring-offset-slate-950"
      >
        {/* Kayan topuz */}
        <span className="absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform duration-200" />
      </span>

      <span>
        <span className="block text-sm font-medium">{label}</span>
        {hint && (
          <span className="mt-0.5 block text-xs text-slate-500 dark:text-slate-400">
            {hint}
          </span>
        )}
      </span>
    </label>
  );
}

export default Toggle;
