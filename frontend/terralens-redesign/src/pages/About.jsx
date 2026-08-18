import { useEffect } from "react";

import AboutHero from "../components/About/AboutHero";
import WhoWeAre from "../components/About/WhoWeAre";
import VisionMission from "../components/About/VisionMission";
import CoreValues from "../components/About/CoreValues";
import Clients from "../components/About/Clients";
import MouPartners from "../components/About/MouPartners";
import AboutCTA from "../components/About/AboutCTA";

export default function About() {
  useEffect(() => {
    document.title = "About TerraLens Pvt Ltd";

    const description =
      "Learn about TerraLens Pvt Ltd, our vision, mission, core values, clients, and global partnerships.";

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
      <AboutHero />
      <WhoWeAre />
      <VisionMission />
      <CoreValues />
      <Clients />
      <MouPartners />
      <AboutCTA />
    </div>
  );
}