import React from "react";
import { Routes, Route } from "react-router-dom";
import useAnalytics from "./hooks/useAnalytics";
import { FilterProvider } from "./context/FilterContext.jsx";
import { CartContextProvider } from "./context/CartContextContext";
import { useSettings } from "./context/SettingsContext";
import AdminLayout from "./layouts/AdminLayout";

// Customer pages
import LandingPage from "./pages/LandingPage.jsx";
import MensLandingPage from './pages/MensLandingPage.jsx';
import WomensLandingPage from './pages/WomensLandingPage.jsx';

import UniversalProductsPage from "./pages/UniversalProductsPage"; // New universal products page
import ProductDetail from "./pages/ProductDetail.jsx";
import Cart from "./pages/Cart.jsx";
import Checkout from "./pages/Checkout.jsx";
import Profile from "./pages/Profile.jsx";
import Profile2 from "./pages/Profile2.jsx";
import ProfileOptions from "./pages/ProfileOptions.jsx";
import PersonalInformation from "./pages/PersonalInformation.jsx";
import Address from "./pages/Address.jsx";
import Cards from "./pages/Cards.jsx";
import Orders from "./pages/Orders.jsx";
import Notifications from "./pages/Notifications.jsx";
import Messages from "./pages/Messages.jsx";
import Settings from "./pages/Settings.jsx";
import FeedSection from "./components/FeedSection.jsx";

// Admin pages
import AdminPanel from "./pages/AdminPanel.jsx";
import AdminAnalyticsPage from "./pages/AdminAnalyticsPage.jsx";
import AdminMessagesPage from "./pages/AdminMessagesPage.jsx";
import AdminOrdersPage from "./pages/AdminOrdersPage.jsx";
import AdminProductsPage from "./pages/AdminProductPage.jsx";
import AdminReportsPage from "./pages/AdminReportsPage.jsx";
import AdminUsersPage from "./pages/AdminUsersPage.jsx";
import AdminAdsPage from "./pages/AdminAdsPage.jsx";
import AdminRegister from "./pages/AdminRegister.jsx";
import AdminApproval from "./pages/AdminApproval.jsx";

// Superadmin pages & components
import SuperadminRegister from "./pages/SuperadminRegister.jsx";
import SuperAdminPanel from "./pages/SuperAdminPanel.jsx";
import SuperadminAdsPage from "./pages/SuperadminAdsPage";
import SuperadminInviteCodes from "./pages/SuperadminInviteCodes";
import SuperadminUsers from "./pages/SuperadminUsers";
import SuperadminOrders from "./pages/SuperadminOrders";
import SuperadminAnalytics from "./pages/SuperadminAnalytics";
import SuperadminAdmins from "./pages/SuperadminAdmins";
import SuperadminProducts from "./pages/SuperadminProducts";
import SuperadminSettings from "./pages/SuperadminSettings";

import { useUser } from "./context/UserContext";

const App = () => {
  // Initialize global analytics tracking (for customer pages)
  useAnalytics();

  const { settings } = useSettings();
  const { user, logout } = useUser();

  const backgroundColor =
    settings.theme === "dark"
      ? "#333"
      : settings.theme === "light"
      ? "#f9f9f9"
      : "#fff";
  const textColor = settings.theme === "dark" ? "#fff" : "#000";
  const fontSize =
    settings.fontSize === "small"
      ? "14px"
      : settings.fontSize === "large"
      ? "26px"
      : "20px";
  const productLayout = settings.productLayout;

  return (
    <div className="app" style={{ backgroundColor, color: textColor, fontSize }}>
      <CartContextProvider>
        <FilterProvider>
          <Routes>
            {/* Customer Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/menslandingpage" element={<MensLandingPage />} />
            <Route path="/womenslandingpage" element={<WomensLandingPage />} />

            {/* Universal Products Page */}
            <Route path="/shop" element={<UniversalProductsPage />} />
            
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile2" element={<Profile2 />} />
            <Route path="/profileoptions" element={<ProfileOptions />} />
            <Route path="/personalinformation" element={<PersonalInformation />} />
            <Route path="/address" element={<Address />} />
            <Route path="/cards" element={<Cards />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/messages/:id" element={<Messages />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/feed/:tab?" element={<FeedSection />} />

            <Route path="/product/:productId" element={<ProductDetail />} />

            {/* Admin Routes wrapped with AdminLayout */}
            <Route
              path="/adminapproval"
              element={
                <AdminLayout>
                  <AdminApproval />
                </AdminLayout>
              }
            />
            <Route
              path="/adminpanel"
              element={
                <AdminLayout>
                  <AdminPanel />
                </AdminLayout>
              }
            />
            <Route
              path="/adminanalyticspage"
              element={
                <AdminLayout>
                  <AdminAnalyticsPage />
                </AdminLayout>
              }
            />
            <Route
              path="/adminmessagespage"
              element={
                <AdminLayout>
                  <AdminMessagesPage />
                </AdminLayout>
              }
            />
            <Route
              path="/adminorderspage"
              element={
                <AdminLayout>
                  <AdminOrdersPage />
                </AdminLayout>
              }
            />
            <Route
              path="/adminproductspage"
              element={
                <AdminLayout>
                  <AdminProductsPage />
                </AdminLayout>
              }
            />
            <Route
              path="/adminreportspage"
              element={
                <AdminLayout>
                  <AdminReportsPage />
                </AdminLayout>
              }
            />
            <Route
              path="/adminuserspage"
              element={
                <AdminLayout>
                  <AdminUsersPage />
                </AdminLayout>
              }
            />
            <Route
              path="/adminadspage"
              element={
                <AdminLayout>
                  <AdminAdsPage />
                </AdminLayout>
              }
            />
            <Route
              path="/adminregister"
              element={
                <AdminLayout>
                  <AdminRegister />
                </AdminLayout>
              }
            />

            {/* Superadmin Routes wrapped with AdminLayout */}
            <Route
              path="/superadminregister"
              element={
                <AdminLayout>
                  <SuperadminRegister />
                </AdminLayout>
              }
            />
            <Route
              path="/superadminpanel/*"
              element={
                <AdminLayout>
                  <SuperAdminPanel />
                </AdminLayout>
              }
            >
              <Route path="ads" element={<SuperadminAdsPage />} />
              <Route path="invite-codes" element={<SuperadminInviteCodes />} />
              <Route path="users" element={<SuperadminUsers />} />
              <Route path="orders" element={<SuperadminOrders />} />
              <Route path="analytics" element={<SuperadminAnalytics />} />
              <Route path="admins" element={<SuperadminAdmins />} />
              <Route path="products" element={<SuperadminProducts />} />
              <Route path="settings" element={<SuperadminSettings />} />
              <Route index element={<SuperadminAdsPage />} />
            </Route>
          </Routes>
        </FilterProvider>
      </CartContextProvider>
    </div>
  );
};

export default App;
