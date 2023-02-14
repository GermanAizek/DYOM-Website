import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "./styles/theme";
import { CssBaseline } from "@mui/material";
import { Navbar } from "./components/navbar/Navbar";
import { Home } from "./components/home/Home";
import { Footer } from "./components/footer/Footer";
import { AddMission } from "./components/projects/missions/addMission/AddMission";
import { ListMissions } from "./components/projects/missions/listMissions/ListMissions";
import { ListMps } from "./components/projects/mps/listMps/ListMps";
import { AddMp } from "./components/projects/mps/addMp/AddMp";
import { FAQ } from "./components/faq/FAQ";
import { Register } from "./components/register/Register";
import { useLocation } from "react-router-dom";
import React from "react";
import { Mission } from "./components/projects/missions/mission/Mission";
import { Reviews } from "./components/projects/missions/mission/reviews/Reviews";
import { Comments } from "./components/projects/missions/mission/reviews/comments/Comments";

function ScrollToTop() {
  const { pathname } = useLocation();

  React.useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }, [pathname]);

  return null;
}

// Site
function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<LayoutsWithNavbar />}>
            <Route index element={<Home />} />
            <Route path="register" element={<Register />} />
            <Route path="missions">
              <Route index element={<ListMissions />} />
              <Route path="add" element={<AddMission />} />
              <Route path=":id">
                <Route index element={<Mission />} />
                <Route path="reviews">
                  <Route index element={<Reviews />} />
                  <Route path=":reviewId" element={<Comments />} />
                </Route>
              </Route>
            </Route>
            <Route path="mps">
              <Route index element={<ListMps />} />
              <Route path="add" element={<AddMp />} />
            </Route>
            <Route path="/faq" element={<FAQ />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

// Pages with navbar
function LayoutsWithNavbar() {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
}

export default App;
