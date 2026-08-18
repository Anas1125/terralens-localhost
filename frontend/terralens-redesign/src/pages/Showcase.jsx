import { useEffect, useState } from "react";

import ShowcaseHero from "../components/ShowcasePage/ShowcaseHero";
import ShowcaseTabs from "../components/ShowcasePage/ShowcaseTabs";
import Portfolio from "../components/ShowcasePage/Portfolio";
import Gallery from "../components/ShowcasePage/Gallery";
import Blog from "../components/ShowcasePage/Blog";

export default function Showcase() {
  const [activeTab, setActiveTab] = useState("portfolio");

  useEffect(() => {
    document.title =
      "Projects & Showcase | TerraLens Pvt Ltd";

    const description =
      "Explore TerraLens Pvt Ltd projects, portfolio, gallery, and latest insights.";

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
      <ShowcaseHero />

      <ShowcaseTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {activeTab === "portfolio" && <Portfolio />}

      {activeTab === "gallery" && <Gallery />}

      {activeTab === "blog" && <Blog />}
    </div>
  );
}