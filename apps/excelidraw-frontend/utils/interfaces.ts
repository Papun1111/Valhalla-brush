import { IconType } from "react-icons";

export interface Feature {
  icon: IconType;
  title: string;
  desc: string;
  color: string;
  hoverColor: string;
}

export interface HeroSectionProps {
  isLoggedIn: boolean;
  handleLogout: () => void;
}