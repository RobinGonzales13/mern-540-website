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
import Login from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminRoute from "./components/ui/AdminRoute";
import Achievements from "./pages/Achievements";
import POLLOgin from "./pages/POLLogin";
import POLDashboard from "./pages/POLDashboard";
import History from "./pages/History";

function App() {
  return (
    <Box minH="100vh" w="100%" overflowX="hidden" position="absolute">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/history" element={<History />} />
        <Route path="/541st-Mission-Vision" element={<MissionVision541 />} />
        <Route path="/542nd-Mission-Vision" element={<MissionVision542 />} />
        <Route path="/543rd-Mission-Vision" element={<MissionVision543 />} />
        <Route path="/544th-Mission-Vision" element={<MissionVision544 />} />
        <Route path="/545th-Mission-Vision" element={<MissionVision545 />} />
        <Route path="/546th-Mission-Vision" element={<MissionVision546 />} />
        <Route path="/547th-Mission-Vision" element={<MissionVision547 />} />
        <Route path="/548th-Mission-Vision" element={<MissionVision548 />} />
        <Route path="/549th-Mission-Vision" element={<MissionVision549 />} />
        <Route path="/achievements" element={<Achievements />} />
        <Route path="/Admin-Login" element={<Login />} />
        <Route path="/pol-home" element={<POLLOgin />} />
        <Route path="/POLDashboard" element={<POLDashboard />} />
        <Route element={<AdminRoute />}>
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
        </Route>
      </Routes>
    </Box>
  );
}

export default App;
