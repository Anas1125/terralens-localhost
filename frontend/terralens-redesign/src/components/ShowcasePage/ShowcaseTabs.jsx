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
    <div
      className="
        w-full
        max-w-5xl
        mx-auto
        rounded-full
        border
        border-slate-200
        bg-white
        p-2
        grid
        grid-cols-3
        gap-2
        shadow-[0_20px_80px_-20px_rgba(14,165,233,0.15)]
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
              rounded-full
              py-3
              font-semibold
              transition-all
              cursor-pointer
              duration-300
              ${
                isActive
                  ? "bg-sky-500 text-white shadow-[0_0_30px_rgba(56,189,248,.3)]"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
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
  );
}