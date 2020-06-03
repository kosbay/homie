import React from "react";
import Rodal from "rodal";

import "rodal/lib/rodal.css";

interface IProps {
  children: any;
  [x: string]: any;
}

const modalWidth =
  window.screen.availWidth < 769
    ? window.screen.availWidth > 550
      ? 500
      : 320
    : 800;

export default ({ children, ...props }: IProps) => (
  <Rodal width={modalWidth} height={475} visible {...props}>
    {children}
  </Rodal>
);
