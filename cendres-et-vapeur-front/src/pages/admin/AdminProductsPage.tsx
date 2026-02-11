import AdminProducts from "../../components/admin/AdminProduct";

export default function AdminProductsPage() {
  return (
    <section className="adminPage">
      <h1 className="adminPageTitle">Produits</h1>
      <p className="adminPageSubtitle">Gérez le catalogue </p>

      <AdminProducts />
    </section>
  );
}