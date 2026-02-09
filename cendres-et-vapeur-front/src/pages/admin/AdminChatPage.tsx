import TelegraphChat from "../../components/admin/TelegraphChat";

export default function AdminChatPage() {
  return (
    <section className="adminPage">
      <h1 className="adminPageTitle">Messagerie</h1>
      <p className="adminPageSubtitle">Chat Admin ↔ Utilisateurs </p>

      <TelegraphChat />
    </section>
  );
}
