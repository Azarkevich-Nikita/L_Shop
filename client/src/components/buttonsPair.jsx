import { useState } from "react";
import Button from './Button';
import '../style/buttons-pair.scss';

function ButtonsPair({label, firstImg, secondImg, variant="primary", size="l"}) {
  const [isActive, setIsActive] = useState(false);

  const toggleActive = () => {
    setIsActive(!isActive);
  }

  return(
    <div className="btns-pair">
      <Button 
        variant="primary" 
        size="l"
      >
        {label}
        <img src={firstImg} />
      </Button>

      <Button 
        variant={isActive ? "secondary" : "stroke"} 
        size="l"
        onClick={toggleActive}
      > 
        <img src={secondImg}/> 
      </Button>
    </div>
  ); 
}

export default ButtonsPair;
