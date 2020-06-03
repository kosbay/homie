import React from "react";
import { Link } from "react-router-dom";

import { Card } from "components/index";
import { IBudget } from "reduxFiles/budgets/types";

import "./ProjectCard.scss";

interface IProps {
  budget: IBudget;
}

const ProjectCard = ({ budget }: IProps) => {
  const { name, remainingBudget, _id } = budget;

  return (
    <Card className="customer-card" theme="dark">
      <Link className="customer-card-container" to={`/budgets/${_id}`}>
        <div>
          <h2 className="title">{name}</h2>
          <div className="remain-block">
            <span className="label">Resterend budget</span>
            <span className="value">{(+remainingBudget).toFixed(0)}</span>
          </div>
        </div>
        <img src="/assets/right-arrow.png" alt="project details" />
      </Link>
    </Card>
  );
};

export default ProjectCard;
