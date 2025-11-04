import React, { useState } from "react";

const TicketForm = () => {
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "" });
  const [downloadUrl, setDownloadUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.firstName || !form.lastName || !form.email) {
      alert("Пожалуйста, заполните все поля!");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/generateTicket", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Ошибка генерации билета");

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
    } catch (err) {
      alert("Не удалось сгенерировать билет: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 480, margin: "50px auto", textAlign: "center", fontFamily: "Arial, sans-serif" }}>
      {!downloadUrl ? (
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <input type="text" name="firstName" placeholder="Имя" value={form.firstName} onChange={handleChange} required />
          <input type="text" name="lastName" placeholder="Фамилия" value={form.lastName} onChange={handleChange} required />
          <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
          <button type="submit" disabled={loading} style={{ padding: 10, background: "#007BFF", color: "#fff", border: "none", borderRadius: 6 }}>
            {loading ? "Генерируем..." : "Получить билет"}
          </button>
        </form>
      ) : (
        <div>
          <h2>Спасибо! Ваш билет готов:</h2>
          <a href={downloadUrl} download="Билет_Эскалада.pdf" style={{ padding: 10, background: "#007BFF", color: "#fff", borderRadius: 6, textDecoration: "none" }}>
            Скачать билет
          </a>
        </div>
      )}
      <div style={{ marginTop: 18, fontSize: 13, color: "#555" }}>
        Продолжая, вы соглашаетесь с <a href="/PrivacyPolicy.html" target="_blank">Политикой конфиденциальности</a> и <a href="/PublicOffer.html" target="_blank">Публичной офертой</a>.
      </div>
    </div>
  );
};

export default TicketForm;
