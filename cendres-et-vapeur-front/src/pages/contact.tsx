import { useState } from "react";
import "../styles/Contact.css";

export default function Contact() {
  const [form, setForm] = useState({
    nom: "",
    prenom: "",
    objet: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(form);
    alert("Message envoyé !");
  };

  return (
    <div className="contact-page">
      <h1 className="contact-title">Contactez-nous</h1>

      <form className="contact-form" onSubmit={handleSubmit}>
        <div className="contact-grid">
          
          <div className="contact-left">
            <label>Nom :</label>
            <input
              type="text"
              name="nom"
              value={form.nom}
              onChange={handleChange}
              placeholder="Ecrire votre nom "
            />

            <label>Prénom :</label>
            <input
              type="text"
              name="prenom"
              value={form.prenom}
              onChange={handleChange}
              placeholder="Ecrire votre prénom"
            />

            <label>Objet :</label>
            <input
              type="text"
              name="objet"
              value={form.objet}
              onChange={handleChange}
              placeholder="Ecrire votre objet"
            />
          </div>

          <div className="contact-right">
            <label>Votre message :</label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="Ecrire votre message"
            />
          </div>

        </div>
          <div className="contact-actions">
            <button className="contact-btn" type="submit">
              J’envoie le message →
            </button>
          </div>



      </form>
    </div>
  );
}
