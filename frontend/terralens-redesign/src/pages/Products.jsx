import { useEffect } from "react";

import ProductsHero from "../components/ProductsPage/ProductsHero";
import ProductGrid from "../components/ProductsPage/ProductsGrid";

export default function Products() {
  useEffect(() => {
    document.title = "Products | TerraLens Pvt Ltd";

    const description =
      "Explore TerraLens Pvt Ltd products and technology solutions designed for GIS, geospatial, mapping, and IT applications.";

    let meta = document.querySelector(
      'meta[name="description"]'
    );

    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "description";
      document.head.appendChild(meta);
    }

    meta.setAttribute("content", description);

    return () => {
      document.title =
        "TerraLens Pvt Ltd | GIS & IT Solutions";
    };
  }, []);

  return (
    <div>
      <ProductsHero />

      <ProductGrid />
    </div>
  );
}