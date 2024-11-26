import { createBrowserRouter } from "react-router-dom";

import LoginBoard from "../routes/loginBoard";
import RegisterBoard from "../routes/registerBoard";
import AttendanceCheckBoard from "../routes/AttendanceCheckBoard";
import InvestMainBoard from "../routes/InvestMainBoard";


export const mainRoutes = [
  {
    path: "/",
    element: <InvestMainBoard></InvestMainBoard>,
    index: true,
  },
  {
    path: "/auth/login",
    element: <LoginBoard></LoginBoard>,
    index: true,
  },
  {
    path: "/auth/register",
    element: <RegisterBoard></RegisterBoard>,
    index: true,
  },
  {
    path:"/attendance",
    element: <AttendanceCheckBoard></AttendanceCheckBoard>,
    index: true,
  }
];

const router = createBrowserRouter(mainRoutes);
export default router;
