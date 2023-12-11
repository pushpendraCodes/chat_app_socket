import Register from "./component/auth/Register";
import { LoginPage } from "./pages/LoginPage";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import RegisterPage from "./pages/RegisterPage";
import { Chat } from "./component/chat/Chat";
import SetAvatar from "./pages/SetAvtar";
import Login from "./component/auth/Login";

function App() {
  const router = createBrowserRouter([
    {
      path: "/login",
      element: <Login/>,
    },
    {
      path: "/register",
      element: <RegisterPage />,
    },
    {
      path: "/",
      element: <Chat />,
    },
    {
      path: "/setAvatar",
      element: <SetAvatar />,
    },
  ]);

  return (

      <RouterProvider router={router} />

  );
}

export default App;
