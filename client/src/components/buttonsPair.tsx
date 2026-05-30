import { useState } from "react";
import Button from './Button';
import '../style/buttons-pair.scss';

interface ButtonsPairProps {
  firstImg: string;
  secondImg: string;
  variant?: string;
  size?: string;
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
        variant="primary"
        size="l"
        onClick={onFirstClick}
        type="button"
      >
        <img src={firstImg} alt="" />
      </Button>
      <Button
        variant={isActive ? "secondary" : "stroke"}
        size="l"
        onClick={toggleActive}
      >
        <img src={secondImg} alt="" />
      </Button>
    </div>
  );
}

export default ButtonsPair;