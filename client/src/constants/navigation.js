import { AiOutlineHome, AiOutlineCamera } from "react-icons/ai";
import {
  MdOutlineSportsScore,
  MdOutlineLeaderboard,
  MdOutlineVideoLibrary,
} from "react-icons/md";
import { GiTrophy } from "react-icons/gi";
import { FaUsers, FaUser } from "react-icons/fa";
import { IoSearchOutline } from "react-icons/io5";

export const NAV_LINKS = [
  { label: "Home", path: "/", icon: AiOutlineHome },
  { label: "Series", path: "/series", icon: GiTrophy },
  { label: "Teams", path: "/teams", icon: FaUsers },
  { label: "Players", path: "/players", icon: FaUser },
  { label: "Rankings", path: "/rankings", icon: MdOutlineLeaderboard },
  { label: "Photos", path: "/photos", icon: AiOutlineCamera },
  { label: "Videos", path: "/videos", icon: MdOutlineVideoLibrary },
];

export const SIDEBAR_LINKS = [
  {
    label: "Home",
    path: "/",
    icon: AiOutlineHome,
  },
  {
    label: "Live Scores",
    path: "/live",
    icon: MdOutlineSportsScore,
    badge: "LIVE",
  },
  {
    label: "Series",
    path: "/series",
    icon: GiTrophy,
    subLinks: [
      { label: "International", path: "/series/international" },
      { label: "Domestic", path: "/series/domestic" },
      { label: "IPL 2025", path: "/series/ipl" },
    ],
  },
  {
    label: "Teams",
    path: "/teams",
    icon: FaUsers,
  },
  {
    label: "Players",
    path: "/players",
    icon: FaUser,
  },
  {
    label: "Rankings",
    path: "/rankings",
    icon: MdOutlineLeaderboard,
  },
  {
    label: "Photos",
    path: "/photos",
    icon: AiOutlineCamera,
  },
  {
    label: "Videos",
    path: "/videos",
    icon: MdOutlineVideoLibrary,
  },
];

export { IoSearchOutline };
