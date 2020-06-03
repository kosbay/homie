import React, { useState, useEffect } from "react";

import { IProject } from "reduxFiles/projects/types";
import ProjectAddPopup from "./ProjectAddPopup";

import "./Userlist.scss";

interface IProps {
  isAdmin: boolean;
  projectsToBeAdded: IProject[];
  budgetProjects: IProject[];
  onAddProject: (key: string) => void;
  onRemoveProject: (key: string) => void;
}

const ProjectList = (props: IProps) => {
  const {
    isAdmin,
    projectsToBeAdded,
    budgetProjects,
    onAddProject,
    onRemoveProject
  } = props;
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setIsModalOpen(false);
  }, [projectsToBeAdded]);

  return (
    <div className="userlist__container">
      <h2 className="block-title">Projects</h2>
      <table className="userlist-table">
        <thead className="userlist__header">
          <tr className="userlist__row">
            <td className="userlist__cell userlist__cell_head userlist__cell_first">
              Name
            </td>
            <td className="userlist__cell userlist__cell_head">Key</td>
            <td className="userlist__cell userlist__cell_head" />
          </tr>
        </thead>
        <tbody className="userlist__body">
          {budgetProjects &&
            budgetProjects.map(({ name, key }) => {
              return (
                <tr className="userlist__row" key={key}>
                  <td className="userlist__cell userlist__cell-80 userlist__cell_first userlist__cell_bold">
                    <span>{name}</span>
                  </td>
                  <td className="userlist__cell">
                    <span>{key}</span>
                  </td>
                  {isAdmin && (
                    <td className="userlist__cell">
                      <i
                        onClick={() => onRemoveProject(key)}
                        className="material-icons unselectable clickable"
                      >
                        delete_forever
                      </i>
                    </td>
                  )}
                </tr>
              );
            })}
        </tbody>
        {isAdmin && (
          <tfoot className="userlist__footer">
            <tr
              className="userlist__footer-container"
              onClick={() => setIsModalOpen(true)}
            >
              <td className="userlist__footer-td">
                <i className="material-icons">add</i>
                <span className="userlist__footer-text">Add Project</span>
              </td>
            </tr>
          </tfoot>
        )}
      </table>
      {isAdmin && isModalOpen && (
        <ProjectAddPopup
          projects={projectsToBeAdded}
          onAddProject={onAddProject}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default ProjectList;
