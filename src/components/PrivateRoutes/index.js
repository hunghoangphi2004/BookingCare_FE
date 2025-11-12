import { Navigate, Outlet } from "react-router-dom";
import Cookies from "js-cookie";

function PrivateRoutes() {
    const token = Cookies.get("profileUser");

    return (
        <>
            {token?(<Outlet/>):(<Navigate to="/login"/>)}
        </>
    )
}

export default PrivateRoutes;