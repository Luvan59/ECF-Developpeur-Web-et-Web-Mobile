import styles from "./buttonempty.module.css";

type ButtonProps = {
  text: string;
  width?: string;
  height?: string;
  fontsize?: string;
  onClick?: () => void;
  type?: "button" | "submit";
};

export default function ButtonEmpty({
  text,
  width,
  height,
  fontsize,
  onClick,
  type = "button",
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={styles.ButtonEmpty}
      style={{
        width,
        height,
        fontSize: fontsize,
      }}
    >
      {text}
    </button>
  );
}
