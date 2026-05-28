import styles from "@/components/tag_item_red/tag_item_red.module.css";

type ButtonProps = {
  text: string;
};

export default function TagItemRed({ text }: ButtonProps) {
  return (
    <div className={styles.ItemRed}>
      <img
        src="/assets/icons/attatchmentRed.png"
        alt="Tag {text}"
        className={styles.ItemRedImage}
      />
      <span>{text}</span>
    </div>
  );
}
