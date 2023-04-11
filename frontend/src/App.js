import AppNavBar from './components/navbar';
import {
  createBrowserRouter,
  Outlet,
  RouterProvider,
} from "react-router-dom";

import AuthLogin from './pages/auth/login';
import AuthRegister from './pages/auth/register';
import './App.css';
import DashboardProjects from './pages/dashboard/projects';
import DashboardNavbar from './components/dashbord/dashboard-navbar';
import DashboardProjectAddEdit from './pages/dashboard/project-add-edit';

const Layout = () => {
  return <>
    <AppNavBar />
    <Outlet />
  </>
}

const DashboardLayout = () => {
  return <>
    <DashboardNavbar />
    <Outlet />
  </>
}

const router = createBrowserRouter([{
  element: <Layout />,
  children: [
    {
      path: "/",
      element: <div>Hello world!</div>,
    },
    {
      path: "/auth/login",
      element: <AuthLogin />,
    },
    {
      path: "/auth/register",
      element: <AuthRegister />,
    },
    {
      path: "/dashboard",
      element: <DashboardLayout />,
      children: [
        {
          path: '/dashboard',
          element: <DashboardProjects />
        },
        {
          path: '/dashboard/project/modify',
          element: <DashboardProjectAddEdit />
        }
      ]
    }
  ]
}]);

function App() {
  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
