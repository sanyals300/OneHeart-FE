import { BrowserRouter, Route, Routes } from "react-router-dom";
import Body from "./src/components/Body";
import Navbar from "./src/components/Navbar";
import Login from "./src/Login";
import Profile from "./src/components/Profile";
import { Provider } from "react-redux";
import appStore from "./src/utils/appStore";
import Feed from "./src/components/Feed";
import Connections from "./src/components/Connections";
import Requests from "./src/components/Requests";
import Chat from "./src/components/Chat";

function App() {
  return (
    <div className="min-h-screen">
      <Provider store={appStore}>
        <BrowserRouter basename="/">
          <Routes>
            {/* Public route that does NOT have the Navbar */}
            <Route path="/login" element={<Login />} />

            {/* Protected routes that ALL use the Body layout (with Navbar) */}
            <Route element={<Body />}>
              <Route path="/" element={<Feed />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/connections" element={<Connections />} />
              <Route path="/messages/:targetUserId" element={<Chat />} />
              <Route path="/requests" element={<Requests />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </Provider>
    </div>
  );
}

export default App;
