import {
  FolderKanban,
  Image,
  Newspaper,
} from "lucide-react";

const tabs = [
  {
    id: "portfolio",
    title: "Portfolio",
    icon: FolderKanban,
  },
  {
    id: "gallery",
    title: "Gallery",
    icon: Image,
  },
  {
    id: "blog",
    title: "Blog",
    icon: Newspaper,
  },
];

export default function ShowcaseTabs({
  activeTab,
  setActiveTab,
}) {
  return (
    <div className="w-full max-w-5xl mx-auto">
      <div
          className="
            w-full
            rounded-[2rem]
            lg:rounded-full
            border
            border-slate-200
            bg-white
            p-2
            grid
            grid-cols-1
            sm:grid-cols-2
            lg:grid-cols-3
            gap-5
          "
        >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex
                items-center
                justify-center
                gap-3
                rounded-[1.5rem]
                lg:rounded-full
                py-4
                lg:py-4
                transition-all
                duration-300
                font-semibold
                text-sm
                md:text-base
                cursor-pointer

                ${
                  isActive
                    ? `
                      bg-sky-500
                      text-white
                      shadow-[0_0_25px_rgba(14,165,233,0.25)]
                    `
                    : `
                      text-slate-500
                      hover:bg-sky-50
                      hover:text-sky-600
                    `
                }
              `}
            >
              <Icon
                size={20}
                className={
                  isActive
                    ? "text-white"
                    : "text-sky-500"
                }
              />

              {tab.title}
            </button>
          );
        })}
      </div>
    </div>
  );
}