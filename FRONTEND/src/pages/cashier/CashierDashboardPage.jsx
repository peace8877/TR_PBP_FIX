import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SidebarCashier from "../../components/cashier/SidebarCashier";
import HeaderCashier from "../../components/cashier/HeaderCashier";
import CategoryList from "../../components/cashier/CategoryList";
import ProductGrid from "../../components/cashier/ProductGrid";
import Cart from "../../components/cashier/Cart";
import ReceiptModal from "../../components/cashier/ReceiptModal";
import PaymentModal from "../../components/cashier/PaymentModal";

const CashierDashboardPage = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("cat-all");
  const [cartItems, setCartItems] = useState([]);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [receiptOpen, setReceiptOpen] = useState(false);
  const [lastInvoice, setLastInvoice] = useState("INV-0000");
  const [lastTotal, setLastTotal] = useState(0);
  
  // State untuk menyimpan data yang akan ditampilkan di struk
  const [receiptData, setReceiptData] = useState({ paid: 0, change: 0, items: [] });

  useEffect(() => {
    const authData = localStorage.getItem("auth");
    const auth = authData ? JSON.parse(authData) : null;
    if (!auth || (auth.role !== "cashier" && auth.role !== "Kasir")) {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) { navigate("/login"); return; }
      try {
        const headers = { "Authorization": `Bearer ${token}`, "Accept": "application/json", "Content-Type": "application/json" };
        const [catRes, prodRes] = await Promise.all([
          fetch("http://127.0.0.1:8000/api/categories", { headers }),
          fetch("http://127.0.0.1:8000/api/products", { headers })
        ]);
        const catJson = await catRes.json();
        const prodJson = await prodRes.json();
        const API_BASE = "http://127.0.0.1:8000";
        setCategories(Array.isArray(catJson?.data) ? catJson.data : []);
        // Map API response: add `image` field with full storage URL for ProductCard
        const mappedProducts = (Array.isArray(prodJson?.data) ? prodJson.data : []).map((p) => ({
          ...p,
          image: p.image_url ? `${API_BASE}/storage/${p.image_url}` : "https://placehold.co/200x200?text=No+Image",
        }));
        setProducts(mappedProducts);
      } catch (error) { console.error("Gagal mengambil data:", error); }
    };
    fetchData();
  }, [navigate]);

  const filteredProducts = Array.isArray(products) 
    ? products.filter((p) => selectedCategory === "cat-all" ? true : String(p.category_id) === String(selectedCategory)) 
    : [];

  const totals = cartItems.reduce((acc, it) => {
      acc.subtotal += it.price * it.qty;
      acc.ppn = acc.subtotal * 0.1;
      acc.total = acc.subtotal + acc.ppn - acc.discount;
      return acc;
    }, { subtotal: 0, ppn: 0, discount: 0, total: 0 });

  const onAddProduct = (product) => {
    setCartItems((prev) => {
      const idx = prev.findIndex((x) => x.productId === product.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], qty: copy[idx].qty + 1 };
        return copy;
      }
      return [...prev, { productId: product.id, name: product.name, price: Number(product.price), qty: 1 }];
    });
  };

  const onIncrease = (item) => setCartItems((prev) => prev.map((it) => (it.productId === item.productId ? { ...it, qty: it.qty + 1 } : it)));
  const onDecrease = (item) => setCartItems((prev) => prev.map((it) => (it.productId === item.productId ? { ...it, qty: it.qty - 1 } : it)).filter((it) => it.qty > 0));
  const onRemove = (item) => setCartItems((prev) => prev.filter((it) => it.productId !== item.productId));
  
  const onPay = () => {
    setLastInvoice(`INV-${Math.floor(Math.random() * 9000) + 1000}`);
    setLastTotal(totals.total);
    setPaymentOpen(true);
  };

  // Fungsi ini dipanggil dari PaymentModal saat sukses
  const onConfirmPayment = (paid, change) => {
    setReceiptData({ paid, change, items: [...cartItems] });
    setPaymentOpen(false);
    setReceiptOpen(true);
    setCartItems([]);
  };

  return (
    <div className="min-h-screen bg-mokkaCream">
      <div className="max-w-[1400px] mx-auto px-4 py-6">
        <div className="flex gap-5">
          <SidebarCashier onLogout={async () => {
              await fetch("http://127.0.0.1:8000/api/logout", {
                method: "POST",
                headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
              });
              localStorage.clear();
              navigate("/login");
            }} />
          <div className="flex-1 flex flex-col gap-4">
            <HeaderCashier />
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              <div className="lg:col-span-3">
                <CategoryList categories={categories} activeId={selectedCategory} onSelect={(c) => setSelectedCategory(c.id)} />
              </div>
              <div className="lg:col-span-6">
                <ProductGrid products={filteredProducts} onAdd={onAddProduct} />
              </div>
              <div className="lg:col-span-3">
                <Cart items={cartItems} onIncrease={onIncrease} onDecrease={onDecrease} onRemove={onRemove} totals={totals} onPay={onPay} onClear={() => setCartItems([])} />
              </div>
            </div>
            <PaymentModal 
              open={paymentOpen} 
              onClose={() => setPaymentOpen(false)} 
              invoice={lastInvoice} 
              total={totals.total} 
              cartItems={cartItems} 
              onConfirm={onConfirmPayment} 
            />
            <ReceiptModal 
              open={receiptOpen} 
              onClose={() => setReceiptOpen(false)} 
              invoice={lastInvoice} 
              total={lastTotal}
              cartItems={receiptData.items}
              paid={receiptData.paid}
              change={receiptData.change}
              onPrint={() => window.print()}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CashierDashboardPage;