import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { getServiceBySlug } from "../api/services";

export default function ServiceDetails() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadService = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getServiceBySlug(slug);

        setService(data);

        // =====================================================
        // SEO
        // =====================================================

        document.title = `${data.name} | TerraLens Pvt Ltd`;

        const description =
          data.description ||
          `Learn about ${data.name} services provided by TerraLens Pvt Ltd.`;

        let meta = document.querySelector(
          'meta[name="description"]'
        );

        if (!meta) {
          meta = document.createElement("meta");
          meta.name = "description";
          document.head.appendChild(meta);
        }

        meta.setAttribute("content", description);
      } catch (err) {
        console.error(err);
        setError("Service not found.");

        document.title = "Service Not Found | TerraLens Pvt Ltd";
      } finally {
        setLoading(false);
      }
    };

    loadService();

    return () => {
      document.title =
        "TerraLens Pvt Ltd | GIS & IT Solutions";
    };
  }, [slug]);

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <section className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-slate-500 text-lg">
          Loading service...
        </p>
      </section>
    );
  }

  // =========================================================
  // ERROR
  // =========================================================

  if (error || !service) {
    return (
      <section className="min-h-screen bg-white flex flex-col items-center justify-center px-6 text-center">
        <p className="text-sky-500 text-sm font-semibold uppercase tracking-[5px]">
          ERROR
        </p>

        <h1 className="mt-4 text-4xl font-bold text-slate-900">
          Service Not Found
        </h1>

        <button
          onClick={() => navigate("/services")}
          className="
            mt-8
            inline-flex
            items-center
            gap-2
            rounded-full
            bg-sky-500
            px-7
            py-3
            font-semibold
            text-white
            transition-all
            duration-300
            hover:bg-sky-400
            hover:-translate-y-1
            hover:shadow-[0_0_30px_rgba(56,189,248,.25)]
          "
        >
          <ArrowLeft size={18} />
          Back to Services
        </button>
      </section>
    );
  }

  // =========================================================
  // IMAGE URL
  // =========================================================

  const imageUrl = service.image
    ? service.image.startsWith("http")
      ? service.image
      : `${import.meta.env.VITE_API_URL}${service.image}`
    : null;

  // =========================================================
  // PAGE
  // =========================================================

  return (
    <section className="bg-white min-h-screen">

      {/* =====================================================
          HERO
      ===================================================== */}

      <div className="relative overflow-hidden bg-slate-50">

        {/* Background Image */}

        {imageUrl && (
          <img
            src={imageUrl}
            alt={service.name}
            className="
              absolute
              inset-0
              h-full
              w-full
              object-cover
              opacity-[0.12]
            "
          />
        )}

        {/* Soft Overlay */}

        <div
          className="
            absolute
            inset-0
            bg-gradient-to-b
            from-white/90
            via-white/85
            to-white
          "
        />

        {/* Blue Glow */}

        <div
          className="
            pointer-events-none
            absolute
            left-[-150px]
            top-[-150px]
            h-[500px]
            w-[500px]
            rounded-full
            bg-sky-400/10
            blur-[130px]
          "
        />

        <div
          className="
            pointer-events-none
            absolute
            right-[-150px]
            bottom-[-150px]
            h-[450px]
            w-[450px]
            rounded-full
            bg-blue-400/10
            blur-[130px]
          "
        />

        {/* Hero Content */}

        <div
          className="
            relative
            mx-auto
            flex
            min-h-[650px]
            max-w-[90rem]
            items-center
            px-6
            py-32
            lg:px-8
          "
        >
          <div className="max-w-5xl">

            {/* Back Button */}

            <button
              onClick={() => navigate("/services")}
              className="
                mb-12
                inline-flex
                items-center
                gap-2
                text-slate-500
                transition-colors
                duration-300
                hover:text-sky-500
              "
            >
              <ArrowLeft size={18} />
              Back to Services
            </button>

            {/* Category */}

            <p
              className="
                text-sm
                font-bold
                uppercase
                tracking-[6px]
                text-sky-500
              "
            >
              {service.category}
            </p>

            {/* Title */}

            <h1
              className="
                mt-6
                max-w-5xl
                text-5xl
                font-extrabold
                leading-[1.08]
                tracking-tight
                text-slate-900
                md:text-6xl
                lg:text-7xl
              "
            >
              {service.name}
            </h1>

            {/* Description */}

            <p
              className="
                mt-8
                max-w-3xl
                text-lg
                leading-8
                text-slate-600
                md:text-xl
              "
            >
              {service.description}
            </p>

            {/* Accent Line */}

            <div className="mt-10 h-1 w-20 rounded-full bg-sky-400" />

          </div>
        </div>
      </div>

      {/* =====================================================
          DETAILS
      ===================================================== */}

      <div
        className="
          mx-auto
          max-w-[90rem]
          px-6
          py-24
          lg:px-8
        "
      >
        <div
          className="
            grid
            gap-16
            lg:grid-cols-2
            lg:items-center
          "
        >

          {/* Text */}

          <div>

            <p
              className="
                text-sm
                font-bold
                uppercase
                tracking-[5px]
                text-sky-500
              "
            >
              Service
            </p>

            <h2
              className="
                mt-5
                text-4xl
                font-bold
                tracking-tight
                text-slate-900
                md:text-5xl
              "
            >
              {service.name}
            </h2>

            <p
              className="
                mt-7
                max-w-xl
                text-lg
                leading-8
                text-slate-600
              "
            >
              {service.description}
            </p>

            {/* Small Accent */}

            <div className="mt-8 flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-sky-500" />
              <div className="h-px w-20 bg-sky-200" />
            </div>

          </div>

          {/* Image */}

          {imageUrl && (
            <div
              className="
                group
                overflow-hidden
                rounded-[2rem]
                border
                border-slate-200
                bg-white
                shadow-[0_20px_60px_rgba(15,23,42,0.08)]
              "
            >
              <img
                src={imageUrl}
                alt={service.name}
                className="
                  h-[400px]
                  w-full
                  object-cover
                  transition-transform
                  duration-700
                  group-hover:scale-105
                "
              />
            </div>
          )}

        </div>

        {/* =====================================================
            CTA
        ===================================================== */}

        <div
          className="
            relative
            mt-24
            overflow-hidden
            rounded-[2rem]
            border
            border-sky-100
            bg-slate-50
            px-8
            py-16
            text-center
            md:px-16
          "
        >

          {/* Background Glow */}

          <div
            className="
              pointer-events-none
              absolute
              left-1/2
              top-1/2
              h-80
              w-80
              -translate-x-1/2
              -translate-y-1/2
              rounded-full
              bg-sky-400/10
              blur-[100px]
            "
          />

          <div className="relative">

            <p
              className="
                text-sm
                font-bold
                uppercase
                tracking-[5px]
                text-sky-500
              "
            >
              Let's Work Together
            </p>

            <h2
              className="
                mt-5
                text-4xl
                font-bold
                tracking-tight
                text-slate-900
                md:text-5xl
              "
            >
              Need {service.name}?
            </h2>

            <p
              className="
                mx-auto
                mt-5
                max-w-2xl
                text-lg
                leading-8
                text-slate-600
              "
            >
              Talk to our team about your project and discover
              how TerraLens can help.
            </p>

            <button
              onClick={() =>
                navigate(`/contact?service=${service.slug}`)
              }
              className="
                mt-8
                inline-flex
                items-center
                gap-3
                rounded-full
                bg-sky-500
                px-8
                py-4
                font-semibold
                text-white
                transition-all
                duration-300
                hover:-translate-y-1
                hover:bg-sky-400
                hover:shadow-[0_0_35px_rgba(56,189,248,.30)]
              "
            >
              Discuss Your Project

              <ArrowRight
                size={18}
                className="transition-transform duration-300"
              />
            </button>

          </div>
        </div>
      </div>
    </section>
  );
}