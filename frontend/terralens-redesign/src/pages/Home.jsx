import { useEffect } from "react";

import Hero from "../components/Hero/Hero";
import Statement from "../components/Statement/Statement";
import WhyChoose from "../components/WhyChoose/WhyChoose";
import Statistics from "../components/Statistics/Statistics";
import CTA from "../components/CTA/CTA";
import Technology from "../components/Technology/Technology";
import GlobalOffices from "../components/GlobalOffices/GlobalOffices";

export default function Home() {
  useEffect(() => {
    document.title = "TerraLens Pvt Ltd | GIS & IT Solutions";

    const description =
      "TerraLens Pvt Ltd provides GIS, geospatial, mapping, and IT solutions.";

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
    <>
      <div>
        <Hero />
        <Statement />
        <WhyChoose />
        <Statistics />
        <Technology />
        <GlobalOffices />
        <CTA />
      </div>
    </>
  );
}