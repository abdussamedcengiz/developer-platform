// BIR FORM KUTUSUNUN ALTINDAKI HATA MESAJI.
//
// id parametresi onemli: kutuda aria-describedby ile bu id'ye
// isaret ediyoruz. Ekran okuyucu kutuya odaklandiginda hatayi
// da okur -- yoksa gormeyen kullanici kirmizi yaziyi hic fark etmez.
function FieldError({
  id,
  messages,
}: {
  id: string;
  messages?: string[];
}) {
  if (!messages || messages.length === 0) {
    return null;
  }

  return (
    <p
      id={id}
      // role="alert": mesaj ekrana gelir gelmez duyurulur.
      role="alert"
      className="mt-1.5 text-sm text-red-600 dark:text-red-400"
    >
      {messages.join(" ")}
    </p>
  );
}

export default FieldError;
