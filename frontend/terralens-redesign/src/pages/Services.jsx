import { useEffect, useState } from "react";

import ServicesHero from "../components/ServicesPage/ServicesHero";
import ServiceTabs from "../components/ServicesPage/ServiceTabs";
import FeaturedService from "../components/ServicesPage/FeaturedService";
import Technologies from "../components/ServicesPage/Technologies";
import ServicesCTA from "../components/ServicesPage/ServicesCTA";
import ServicesCarousel from "../components/ServicesPage/ServicesCarousel";

import { getServices } from "../api/services";

export default function Services() {
  const [activeTab, setActiveTab] = useState("survey");
  const [services, setServices] = useState([]);

  useEffect(() => {
    // =====================================================
    // SEO
    // =====================================================

    document.title =
      "GIS & IT Services | TerraLens Pvt Ltd";

    const description =
      "Explore GIS, geospatial, mapping, surveying, and IT services provided by TerraLens Pvt Ltd.";

    let meta = document.querySelector(
      'meta[name="description"]'
    );

    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "description";
      document.head.appendChild(meta);
    }

    meta.setAttribute("content", description);

    // =====================================================
    // LOAD SERVICES
    // =====================================================

    const loadServices = async () => {
      try {
        const data = await getServices();

        setServices(
          data.filter((service) => service.is_active)
        );
      } catch (error) {
        console.error(
          "Failed to load services:",
          error
        );
      }
    };

    loadServices();

    return () => {
      document.title =
        "TerraLens Pvt Ltd | GIS & IT Solutions";
    };
  }, []);

  return (
    <div>
      {/* Services Hero */}

      <ServicesHero />

      {/* Service Tabs */}

      <div
        id="services-list"
        style={{
          marginTop: "50px",
        }}
      >
        <ServiceTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      </div>

      {/* Featured Service */}

      <FeaturedService
        activeTab={activeTab}
        services={services}
      />

      {/* Services Carousel */}

      <ServicesCarousel
        activeTab={activeTab}
        services={services}
      />

      {/* Technologies */}

      <Technologies
        activeTab={activeTab}
      />

      {/* CTA */}

      <ServicesCTA
        activeTab={activeTab}
      />
    </div>
  );
}