import Section from "../ui/Section";
import Container from "../ui/Container";
import SectionTitle from "../ui/SectionTitle";

function CompanyIntro() {
  return (
    <Section className="bg-[#f5f5f7]">
      <Container>

        <SectionTitle
          label="WHO WE ARE"
          title="Engineering Tomorrow's Geospatial Solutions"
          description="TerraLens Innovations delivers precision through GIS, surveying, LiDAR, drone mapping and geospatial intelligence, helping businesses make better decisions with accurate spatial data."
          center
        />

        <div className="mt-20 grid lg:grid-cols-2 gap-20 items-center">

          <img
            src="https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop"
            alt="Engineering"
            className="rounded-[30px] shadow-[0_20px_50px_rgba(15,23,42,0.12)] w-full h-[550px] object-cover"
          />

          <div>

            <h3 className="text-4xl font-bold leading-tight text-slate-900">
              Precision.
              <br />
              Innovation.
              <br />
              Reliability.
            </h3>

            <p className="mt-8 text-lg text-gray-600 leading-8">
             From Land Surveying To Enterprise Gis Solutions, 
             Terra Lens Combines Cutting Edge Technology 
             With Engineering Expertise To Solve Complex 
             Spatial Challenges.
            </p>

            <button
              className="
              mt-10
              rounded-full
              bg-[#0071E3]
              px-8
              py-4
              text-white
              font-medium
              transition-all
              duration-300
              hover:scale-105
              hover:shadow-xl
              cursor-pointer
              "
            >
              Learn More
            </button>

          </div>

        </div>

      </Container>
    </Section>
  );
}

export default CompanyIntro;