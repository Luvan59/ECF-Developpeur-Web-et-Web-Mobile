import styles from "@/components/tag_item_green/tag_item_green.module.css";

type ButtonProps = {
  text: string;
};

export default function TagItemGreen({ text }: ButtonProps) {
  return (
    <div className={styles.ItemGreen}>
      <img
        src="/assets/icons/attatchmentGreen.png"
        alt="Tag {text}"
        className={styles.ItemGreenImage}
      />
      <span>{text}</span>
    </div>
  );
}
