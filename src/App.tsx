import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Saloon from "./pages/Saloon";
import Cupon from "./pages/Cupon";

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <Layout>
              <Home />
            </Layout>
          }
        />
        <Route path="/saloon" element={<Saloon />} />
        <Route path="/coupon" element={<Cupon />} />
      </Routes>
    </Router>
  );
}

export default App;
