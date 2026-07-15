# TODO - Kasir (Transaksi/Riwayat + Struk)

## Step 1
- [ ] Buat `CashierTransactionsContext` untuk menyimpan daftar transaksi dan menambah transaksi baru setelah pembayaran.

## Step 2
- [ ] Update `src/pages/cashier/CashierTransactionsPage.jsx` agar membaca transaksi dari context (bukan data statis).

## Step 3
- [ ] Update `src/pages/cashier/CashierDashboardPage.jsx`:
  - [ ] Setelah konfirmasi pembayaran, buat transaksi baru (invoice, items, totals, paymentMethod, paid, change, cashierName, date/time, status).
  - [ ] Tambahkan transaksi baru ke context.
  - [ ] Set `receipt` lengkap dan tampilkan `ReceiptModal`.
  - [ ] Tambahkan handler `onPrint` untuk cetak semua detail.

## Step 4
- [ ] Perbaiki `src/components/cashier/ReceiptModal.jsx` agar benar-benar menerima `receipt` + `onPrint` dan menampilkan data yang lengkap.

## Step 5
- [ ] Bedakan `src/pages/cashier/CashierHistoryPage.jsx` agar tidak sama dengan halaman transaksi.
  - [ ] Implementasi: tampilkan transaksi selain `Selesai` (contoh: `Dibatalkan`) atau filter berbeda.

## Step 6
- [ ] Jalankan aplikasi dan test alur:
  1) Tambah item → bayar → struk muncul
  2) Klik Print → output/cetak benar
  3) Buka menu Transaksi → transaksi baru muncul
  4) Buka menu Riwayat → tidak sama dengan Transaksi

