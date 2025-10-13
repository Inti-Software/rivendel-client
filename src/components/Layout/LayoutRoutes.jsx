import { Outlet } from "react-router-dom";
import Layout from "./Layout";

const LayoutRoutes = () => (
	<Layout>
		<Outlet />
	</Layout>
)

export default LayoutRoutes;