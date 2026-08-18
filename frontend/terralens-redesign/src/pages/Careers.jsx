import { useEffect } from "react";

import CareerHero from "../components/CareersPage/CareerHero";
import WhyJoin from "../components/CareersPage/WhyJoin";
import LifeAtTerralens from "../components/CareersPage/LifeAtTerralens";
import CurrentOpenings from "../components/CareersPage/CurrentOpenings";
import FAQ from "../components/CareersPage/FAQ";

export default function Careers() {
  useEffect(() => {
    document.title = "Careers | TerraLens Pvt Ltd";

    const description =
      "Explore career opportunities at TerraLens Pvt Ltd and discover our work culture, current openings, and opportunities to grow.";

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
      <CareerHero />

      <WhyJoin />

      <LifeAtTerralens />

      <CurrentOpenings />

      <FAQ />
    </div>
  );
}