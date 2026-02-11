import "./adminLayout.css";

export default function AdminFooter() {
  return (
    <footer className="adminFooter">
      <span>© {new Date().getFullYear()} Cendres et Vapeur - Espace Admin</span>
      <span className="adminFooterRight">Mode sécurisé</span>
    </footer>
  );
}