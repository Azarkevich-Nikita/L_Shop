import { useState } from "react";
import Button from './Button';
import '../style/buttons-pair.scss';

interface ButtonsPairProps {
  label: string;
  firstImg: string;
  secondImg: string;
  variant?: string;
  size?: string;
}

function ButtonsPair({ label, firstImg, secondImg, variant = "primary", size = "l" }: ButtonsPairProps) {
  const [isActive, setIsActive] = useState<boolean>(false);

  const toggleActive = () => {
    setIsActive(!isActive);
  };

  return (
    <div className="btns-pair">
      <Button
        variant="primary"
        size="l"
      >
        {label}
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