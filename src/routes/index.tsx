import ProducerAppUser from "@/pages/producer-page/producer-app-user";
import ProducerLicenses from "@/pages/producer-page/producer-licenses";
import ProducerNotification from "@/pages/producer-page/producer-notification";
import ProducerPublish from "@/pages/producer-page/producer-publish";
import ProducerSale from "@/pages/producer-page/producer-sales";
import ProducerTags from "@/pages/producer-page/producer-tags";
import { lazy } from "react";
import { RouteProps } from "react-router";
//Authentication
const Login = lazy(() => import("@/pages/authentication/Login"));
const Register = lazy(() => import("@/pages/authentication/Register"));
const RecoverPW = lazy(() => import("@/pages/authentication/RecoverPW"));
const Error404 = lazy(() => import("@/pages/authentication/Error404"));
const Error500 = lazy(() => import("@/pages/authentication/Error500"));
const EmailConfirm = lazy(() => import("@/pages/authentication/EmailConfirm"));
const PasswordConfirm = lazy(() => import("@/pages/authentication/PasswordConfirm"));
const ExternalLogin = lazy(()=> import("@/pages/authentication/ExternalLogin"));

// Pages
const HomePage = lazy(() => import("@/pages/pages/Home"));
const Profile = lazy(() => import("@/pages/pages/Profile"));
const Search = lazy(() => import("@/pages/pages/Search"));
const Cart = lazy(() => import("@/pages/pages/Cart"));
const Notification = lazy(()=> import("@/pages/pages/Notification"))

// Transaction
const PaymentResult = lazy(() => import("@/pages/pages/Transaction/PaymentResult"));
const PaymentHistory = lazy(() => import("@/pages/pages/Transaction/History"));

//Applicatoin create page
const MusicDetail = lazy(() => import("@/pages/music-detail"));

// Producer page
const ProducerMusics = lazy(() => import("@/pages/producer-page/producer-music/index"));
export type RoutesProps = {
  path: RouteProps["path"];
  name: string;
  element: RouteProps["element"];
};

const dashboardRoutes: RoutesProps[] = [
  //   {
  //     path: "/",
  //     name: "Home Page",
  //     element: <Navigate to="/dashboards/analytics" />,
  //   },
];

const producerRoute: RoutesProps[] = [
  // {
  //   path: "/user/id/producer-page",
  //   name: "Producer manager page",
  //   element: <ProducerPage />,
  // },
  {
    path: "/producer-page/my-music",
    name: "producer music management",
    element: <ProducerMusics />,
  },
  {
    path: "/producer-page/my-publish",
    name: "producer publish management",
    element: <ProducerPublish />,
  },
  {
    path: "/producer-page/my-sale",
    name: "producer page",
    element: <ProducerSale />,
  },
  {
    path: "/producer-page/my-tag",
    name: "producer tags",
    element: <ProducerTags />,
  },
  {
    path: "/producer-page/my-app-user",
    name: "app user",
    element: <ProducerAppUser />,
  },
  {
    path: "/producer-page/my-license",
    name: "license",
    element: <ProducerLicenses />,
  },
  {
    path: "/producer-page/my-notification",
    name: "notificatoin ",
    element: <ProducerNotification />,
  },
];
const appsRoutes: RoutesProps[] = [
  {
    path: "/",
    name: "Home Page",
    element: <HomePage />,
  },
  {
    path: "/music-detail/detail/:trackId",
    name: "Music Detail Page",
    element: <MusicDetail />,
  },
  {
    path: "/notification",
    name: "Notification",
    element: <Notification />,
  },
  {
    path: "/payment/history",
    name: "Purchases",
    element: <PaymentHistory />,
  },
  {
    path: "/cart",
    name: "Cart",
    element: <Cart />,
  },
  {
    path: "/checkout/payment/success",
    name: "Payment Success",
    element: <PaymentResult isSuccess={true} />,
  },
  {
    path: "/checkout/payment/failed",
    name: "Payment Failed",
    element: <PaymentResult isSuccess={false} />,
  },
  {
    path: "/profile",
    name: "Profile",
    element: <Profile />
  },
  {
    path: "/profile/:userId",
    name: "Profile",
    element: <Profile />,
  },
  {
    path: "/beats/:keyword",
    name: "Search",
    element: <Search />,
  },
  {
    path: "/beats",
    name: "Search",
    element: <Search />,
  },
];

const authRoutes: RoutesProps[] = [
  {
    path: "/auth/login",
    name: "Login",
    element: <Login />,
  },
  {
    path: "/auth/register",
    name: "Register",
    element: <Register />,
  },
  {
    path: "/auth/recover-pw",
    name: "Recover Password",
    element: <RecoverPW />,
  },
  {
    path: "/auth/auth-404",
    name: "404 Error",
    element: <Error404 />,
  },
  {
    path: "/auth/auth-500",
    name: "500 Error",
    element: <Error500 />,
  },
  {
    path: "/auth/confirm-email",
    name: "Email Confirm",
    element: <EmailConfirm />,
  },
  {
    path: "/auth/confirm-password",
    name: "Password Confirm",
    element: <PasswordConfirm />,
  },
  {
    path: "/auth/external-login/:jwtToken",
    name: "External Login Confirm",
    element: <ExternalLogin />,
  }
];

const allCustomerRoutes = [...appsRoutes];

const allAdminRoutes = [...dashboardRoutes];

const allBlankRoutes = [...authRoutes];

const allProducerRoutes = [...producerRoute];
export { allAdminRoutes, allBlankRoutes, allCustomerRoutes, allProducerRoutes };
