import { ReactNode } from "react";

type IconButtonProps = {
  icon: ReactNode;
  onClick: () => void;
  activated?: boolean;
  children?: ReactNode;
  customStyle?: React.CSSProperties;
};

export function IconButton({
  icon,
  onClick,
  activated = false,
  children,
  customStyle = {},
}: IconButtonProps) {
  return (
    <button
      onClick={onClick}
      style={{
        backgroundColor: activated
          ? "rgba(255, 255, 255, 0.2)"
          : "rgba(50, 50, 50, 0.7)",
        border: "none",
        borderRadius: "4px",
        padding: "8px",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        position: "relative",
        ...customStyle,
      }}
    >
      {icon}
      {children}
    </button>
  );
}
