import { ReactNode } from "react"
import './Button.css'
type ButtonProps = {
  icon?: ReactNode,
} & React.ButtonHTMLAttributes<HTMLButtonElement>;


const Button = ({
  children,
  ...props
  }: ButtonProps) => {
  return (
    <button className="standart-button">
      <span className="button-span">
        {children}
      </span>
    </button>
  );
};

export default Button
