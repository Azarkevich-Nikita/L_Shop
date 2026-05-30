import { useState } from "react";
import Button, { type ButtonSize, type ButtonVariant } from './Button';
import '../style/buttons-pair.scss';

interface ButtonsPairProps {
  firstImg: string;
  secondImg: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  onFirstClick?: (e: React.MouseEvent) => void;
}

function ButtonsPair({ firstImg, secondImg, variant = "primary", size = "l", onFirstClick }: ButtonsPairProps) {
  const [isActive, setIsActive] = useState<boolean>(false);

  const toggleActive = () => {
    setIsActive(!isActive);
  };

  return (
    <div className="btns-pair">
      <Button
        variant={variant}
        size={size}
        onClick={onFirstClick}
        type="button"
      >
        <img src={firstImg} alt="" />
      </Button>
      <Button
        variant={isActive ? "secondary" : "stroke"}
        size={size}
        onClick={toggleActive}
      >
        <img src={secondImg} alt="" />
      </Button>
    </div>
  );
}

export default ButtonsPair;
