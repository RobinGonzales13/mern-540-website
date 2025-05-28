import { Box } from "@chakra-ui/react";
import { Route, Routes } from "react-router-dom";

import HomePage from "./pages/HomePage";
import MissionVision541 from "./pages/m541";
import MissionVision542 from "./pages/m542";
import MissionVision543 from "./pages/m543";
import MissionVision544 from "./pages/m544";
import MissionVision545 from "./pages/m545";
import MissionVision546 from "./pages/m546";
import MissionVision547 from "./pages/m547";
import MissionVision548 from "./pages/m548";
import MissionVision549 from "./pages/m549";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminRoute from "./components/ui/AdminRoute";
import Achievements from "./pages/Achievements";
import POLLogin from "./pages/POLLogin";
import POLDashboard from "./pages/POLDashboard";
import History from "./pages/History";
import Contact from "./pages/Contact";
import POLRoute from "./components/ui/POLRoute";
import AdminResetPassword from "./pages/AdminResetPassword";

function App() {
  return (
    <Box minH="100vh" w="100%" overflowX="hidden" position="absolute">
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/history" element={<History />} />
        <Route path="/achievements" element={<Achievements />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/pol-login" element={<POLLogin />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/admin-reset-password/:token" element={<AdminResetPassword />} />

        {/* Mission Vision Pages */}
        <Route path="/541st-mission-vision" element={<MissionVision541 />} />
        <Route path="/542nd-mission-vision" element={<MissionVision542 />} />
        <Route path="/543rd-mission-vision" element={<MissionVision543 />} />
        <Route path="/544th-mission-vision" element={<MissionVision544 />} />
        <Route path="/545th-mission-vision" element={<MissionVision545 />} />
        <Route path="/546th-mission-vision" element={<MissionVision546 />} />
        <Route path="/547th-mission-vision" element={<MissionVision547 />} />
        <Route path="/548th-mission-vision" element={<MissionVision548 />} />
        <Route path="/549th-mission-vision" element={<MissionVision549 />} />

        {/* Protected Admin Route */}
        <Route element={<AdminRoute />}>
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
        </Route>

        {/* Protected POL Route */}
        <Route element={<POLRoute />}>
          <Route path="/pol-dashboard" element={<POLDashboard />} />
        </Route>
      </Routes>
    </Box>
  );
}

export default App;