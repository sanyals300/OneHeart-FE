import { BrowserRouter, Route, Routes } from "react-router-dom";
import Body from "./src/components/Body";
import Navbar from "./src/components/Navbar";
import Login from "./src/Login";
import Profile from "./src/components/Profile";
import { Provider } from "react-redux";
import appStore from "./src/utils/appStore";
import Feed from "./src/components/Feed";
import { useEffect } from "react";
import Connections from "./src/components/Connections";
import Requests from "./src/components/Requests";

function App() {
  useEffect(() => {
    // Force set the theme
    document.documentElement.setAttribute("data-theme", "valentine");
    console.log(
      "Theme set to:",
      document.documentElement.getAttribute("data-theme")
    );
  }, []);
  return (
    <div data-theme="valentine" className="min-h-screen">
      <Provider store={appStore}>
        <BrowserRouter basename="/">
          <Routes>
            <Route path="/" element={<Body />}>
              <Route path="/" element={<Feed />} />
              <Route path="/login" element={<Login />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/connections" element={<Connections />} />
              <Route path="/requests" element={<Requests />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </Provider>
    </div>
  );
}

export default App;
