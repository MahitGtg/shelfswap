import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Header } from "./components/Header";
import { CurrentUserProvider } from "./currentUser";
import { Browse } from "./pages/Browse";
import { ListingDetail } from "./pages/ListingDetail";
import { CreateListing } from "./pages/CreateListing";

export default function App() {
  return (
    <CurrentUserProvider>
      <BrowserRouter>
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Browse />} />
            <Route path="/listings/:id" element={<ListingDetail />} />
            <Route path="/new" element={<CreateListing />} />
          </Routes>
        </main>
      </BrowserRouter>
    </CurrentUserProvider>
  );
}
