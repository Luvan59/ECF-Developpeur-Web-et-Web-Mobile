import styles from "./buttonfill.module.css";

type ButtonProps = {
  text: string;
  width?: string;
  height?: string;
  fontsize?: string;
  onClick?: () => void;
};

export default function Buttonfill({
  text,
  width,
  height,
  fontsize,
  onClick,
}: ButtonProps) {
  return (
    <button
      className={styles.Buttonfill}
      style={{ width, height, fontSize: fontsize }}
      onClick={onClick}
    >
      {text}
    </button>
  );
}
