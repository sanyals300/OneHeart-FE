import { BrowserRouter, Route, Routes } from "react-router-dom";
import Body from "./src/components/Body";
import Navbar from "./src/components/Navbar";
import Login from "./src/Login";
import Profile from "./src/components/Profile";  
import { Provider } from "react-redux";
import appStore from "./src/utils/appStore";
import Feed from "./src/components/Feed";


function App() {
  return (
    <>
    <Provider store={appStore}>
      <BrowserRouter basename="/">
        <Routes>
          <Route path="/" element={<Body />}>
          <Route path="/" element={<Feed />}/> 
          <Route path="/login" element={<Login />}/>
          <Route path="/profile" element={<Profile />}/>
          </Route>
        </Routes>
        

      
      </BrowserRouter>
      </Provider>
    <div data-theme="valentine" className="min-h-screen">
    </div>
    </>
  )
}

export default App;
