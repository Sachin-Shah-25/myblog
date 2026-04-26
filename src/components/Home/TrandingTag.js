// components/TrendingTags.jsx

import { FaChevronDown } from "react-icons/fa";
import { SiJavascript } from "react-icons/si";
import { SiNodedotjs } from "react-icons/si";

const tags = [
  {
    id: 1,
    name: "JavaScript",
    category: "React",
    icon: <SiJavascript className="text-yellow-500" />,
    bg: "bg-yellow-100",
  },
  {
    id: 2,
    name: "Node.js",
    category: "Node",
    icon: <SiNodedotjs className="text-green-600" />,
    bg: "bg-green-100",
  },
  {
    id: 3,
    name: "CSS",
    category: "AI",
    icon: <SiJavascript className="text-cyan-600" />,
    bg: "bg-cyan-100",
  },
];

export default function TrandingTags() {
  return (
    <div className="w-full max-w-xs bg-white p-5 rounded-xl shadow-sm">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-1">
        Trending Tags <FaChevronDown className="text-sm" />
      </h3>

      <div className="space-y-4">
        {tags.map((tag) => (
          <div
            key={tag.id}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 flex items-center justify-center rounded-lg ${tag.bg}`}
              >
                {tag.icon}
              </div>

              <span className="text-sm font-medium text-gray-800">
                {tag.name}
              </span>
            </div>

            <div className="flex items-center gap-1 text-sm text-orange-500 font-medium cursor-pointer">
              {tag.category}
              <FaChevronDown className="text-xs" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}