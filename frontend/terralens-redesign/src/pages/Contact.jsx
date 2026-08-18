import { useEffect } from "react";

import ContactHero from "../components/ContactPage/ContactHero";
import ContactSection from "../components/ContactPage/ContactSection";
import OfficeLocation from "../components/ContactPage/OfficeLocation";
import ContactFAQ from "../components/ContactPage/ContactFAQ";

export default function Contact() {
  useEffect(() => {
    document.title = "Contact TerraLens Pvt Ltd";

    const description =
      "Contact TerraLens Pvt Ltd for GIS, geospatial, mapping, and IT solutions. Get in touch with our team.";

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
      <ContactHero />

      <ContactSection />

      <OfficeLocation />

      <ContactFAQ />
    </div>
  );
}