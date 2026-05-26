type ButtonProps = {
  text: string;
};

export default function Buttonfill({ text }: ButtonProps) {
  return <button className="Buttonfill">{text}</button>;
}
