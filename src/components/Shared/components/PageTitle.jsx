import { useEffect } from "react";
import { useLocation, matchPath } from "react-router-dom";

const PageTitle = () => {
  const location = useLocation();

  useEffect(() => {
    // Definimos los títulos para cada ruta
    const routeTitles = [
      { path: "/", title: "Inicio | Rivendel" },
      
			{ path: "/tipos-documentos", title: "Tipos de Documentos" },
			{ path: "/tipos-documentos/new", title: "Nuevo tipos de documento" },
			{ path: "/tipos-documentos/edit/:id", title: "Edición de tipos de documento" },

			{ path: "/resoluciones", title: "Resoluciones" },
			{ path: "/resoluciones/new", title: "Nueva resolución" },
			{ path: "/resoluciones/edit/:id", title: "Edición de resolución" },
      
			{ path: "/patrocinantes", title: "Patrocinantes" },
			{ path: "/patrocinantes/new", title: "Nuevo patrocinante" },
			{ path: "/patrocinantes/edit/:id", title: "Edición de patrocinante" },
			
			{ path: "/partes", title: "Partes" },
			{ path: "/partes/new", title: "Nueva parte" },
			{ path: "/partes/edit/:id", title: "Edición de partes" },


      { path: "/reclamos", title: "Reclamos" },
      { path: "/reclamos/new", title: "Nuevo reclamo" },
      { path: "/reclamos/edit/:id", title: "Edición de reclamo" },
    ];

    const currentRoute = routeTitles.find(route => 
      matchPath({ path: route.path, exact: true }, location.pathname)
    );

    document.title = (currentRoute ? (currentRoute.title + " | ") : "") + "Conciliaciones";
  }, [location]);

  return null;
};

export default PageTitle;