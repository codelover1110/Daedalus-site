import React from 'react';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import Image from '../../elements/Image';
import imageLogo from '../../../assets/images/logo.png'
// const imageLogo = require("../../../assets/images/logo.png")
const Logo = ({
  className,
  ...props
}) => {


  const classes = classNames(
    'brand',
    className
  );

  return (
    <div
      {...props}
      className={classes}
    >
      <Link to="/Home" className="flex items-center">

        <Image
          src={imageLogo}
          alt="Daedalus"
          width={50}
        // height={80}
        />
        <span className="text-lg font-bold text-white" >Daedalus</span>
      </Link>
    </div>
  );
}

export default Logo;
