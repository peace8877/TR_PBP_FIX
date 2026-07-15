import { useState } from "react";
import SidebarCashier from "../../components/cashier/SidebarCashier";
import HeaderCashier from "../../components/cashier/HeaderCashier";
import CategoryList from "../../components/cashier/CategoryList";
import ProductGrid from "../../components/cashier/ProductGrid";
import Cart from "../../components/cashier/Cart";
import ReceiptModal from "../../components/cashier/ReceiptModal";
import PaymentModal from "../../components/cashier/PaymentModal";
import { categories, products } from "./data/cashierData";


const CashierDashboardPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("cat-all");
  const [cartItems, setCartItems] = useState([]);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [receiptOpen, setReceiptOpen] = useState(false);
  const [lastInvoice, setLastInvoice] = useState("INV-0000");
  const [lastTotal, setLastTotal] = useState(0);

  const filteredProducts = products.filter((p) => {
    if (selectedCategory === "cat-all") return true;
    return p.category === selectedCategory;
  });

  const totals = cartItems.reduce(
    (acc, it) => {
      acc.subtotal += it.price * it.qty;
      acc.ppn = acc.subtotal * 0.1;
      acc.total = acc.subtotal + acc.ppn - acc.discount;
      return acc;
    },
    { subtotal: 0, ppn: 0, discount: 0, total: 0 }
  );

  const onAddProduct = (product) => {
    setCartItems((prev) => {
      const idx = prev.findIndex((x) => x.productId === product.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], qty: copy[idx].qty + 1 };
        return copy;
      }
      return [
        ...prev,
        { productId: product.id, name: product.name, price: product.price, qty: 1 },
      ];
    });
  };

  const onIncrease = (item) => {
    setCartItems((prev) =>
      prev.map((it) => (it.productId === item.productId ? { ...it, qty: it.qty + 1 } : it))
    );
  };

  const onDecrease = (item) => {
    setCartItems((prev) =>
      prev
        .map((it) => (it.productId === item.productId ? { ...it, qty: it.qty - 1 } : it))
        .filter((it) => it.qty > 0)
    );
  };

  const onRemove = (item) => {
    setCartItems((prev) => prev.filter((it) => it.productId !== item.productId));
  };

  const onPay = () => {
    const invoice = `INV-${String(Math.floor(Math.random() * 9000) + 1000)}`;
    setLastInvoice(invoice);
    setLastTotal(totals.total);
    setPaymentOpen(true);
  };

  const onClear = () => setCartItems([]);

  const onConfirmPayment = () => {
    setPaymentOpen(false);
    setReceiptOpen(true);

    // Demo: just clear cart after payment
    setCartItems([]);
  };

  return (
    <div className="min-h-screen bg-mokkaCream">
      <div className="max-w-[1400px] mx-auto px-4 py-6">
        <div className="flex gap-5">
          <SidebarCashier onLogout={() => (window.location.href = "/login")} />

          <div className="flex-1 flex flex-col gap-4 min-w-0">
            <HeaderCashier />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 min-w-0">
              <div className="lg:col-span-3 min-w-0">
                <div className="bg-white/70 backdrop-blur rounded-3xl border border-white/60 shadow-soft p-4">
                  <h3 className="text-sm font-extrabold text-gray-900 mb-3">Kategori</h3>
                  <CategoryList
                    categories={categories}
                    activeId={selectedCategory}
                    onSelect={(c) => setSelectedCategory(c.id)}
                  />
                </div>
              </div>

              <div className="lg:col-span-6 min-w-0">
                <div className="bg-white/70 backdrop-blur rounded-3xl border border-white/60 shadow-soft p-4">
                  <h3 className="text-sm font-extrabold text-gray-900 mb-3">Produk</h3>
                  <ProductGrid products={filteredProducts} onAdd={onAddProduct} />
                </div>
              </div>

              <div className="lg:col-span-3 min-w-0">
                <Cart
                  items={cartItems}
                  onIncrease={onIncrease}
                  onDecrease={onDecrease}
                  onRemove={onRemove}
                  totals={{ subtotal: totals.subtotal, ppn: totals.ppn, discount: totals.discount, total: totals.total }}
                  onPay={onPay}
                  onClear={onClear}
                />
              </div>
            </div>

            <PaymentModal
              open={paymentOpen}
              onClose={() => setPaymentOpen(false)}
              invoice={lastInvoice}
              total={lastTotal}
              onConfirm={onConfirmPayment}
            />

            <ReceiptModal open={receiptOpen} onClose={() => setReceiptOpen(false)} invoice={lastInvoice} total={lastTotal} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CashierDashboardPage;

