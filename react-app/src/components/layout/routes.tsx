import React, { Suspense, lazy } from 'react';
import { Redirect } from 'react-router-dom';
//import EditHouse from "../../pages/EditHouse";
import EditProfile from "../../pages/EditProfile";
import Home from "../../pages/Home";
import SignInScreen from "../../pages/Login";
import MyPurchases from "../../pages/MyPurchases";
import NotFound from "../../pages/NotFound";
import Profile from "../../pages/Profile";
import ViewHouse from "../../pages/ViewHouse";
import HowAddHouse from "../footer/HowAddHouse";
import HowBuyHouse from "../footer/HowBuyHouse";
import SidebarContentHome from "../sidebar_content/SidebarContentHome";
import SidebarContentProfile from "../sidebar_content/SidebarContentProfile";

const EditHouse = lazy(() => import('../../pages/EditHouse'))

const routes = [
    {
        path: "/",
        exact: true,
        main: () => <Home />,
        sidebar: () => <SidebarContentHome />
    },
    {
        path: "/viewhouse/:idHouse",
        main: () => <ViewHouse />,
        sidebar: () => null
    },
    {
        path: "/profile/edit",
        main: () => <EditProfile />,
        sidebar: () => null
    },
    {
        path: "/profile/purchases",
        main: () => <MyPurchases />,
        sidebar: () => null
    },
    {
        path: "/profile/edithouse/:idHouse",
        main: () =>
        (<Suspense fallback={<div>Загрузка...</div>}>
            <EditHouse />,
        </Suspense>),
        sidebar: () => null
    },
    {
        path: "/profile/:idUser",
        main: () => <Profile />,
        sidebar: () => <SidebarContentProfile />
    },
    {
        path: "/login",
        main: () => <SignInScreen />,
        sidebar: () => null
    },
    {
        path: "/help/howaddhouse",
        main: () => <HowAddHouse />,
        sidebar: () => null
    },
    {
        path: "/help/howbuyhouse",
        main: () => <HowBuyHouse />,
        sidebar: () => null
    },
    {
        path: "/404",
        main: () => <NotFound />,
        sidebar: () => null
    },
    {
        path: "*",
        main: () => <Redirect to="/404" />,
        sidebar: () => null
    },
];

export default routes

