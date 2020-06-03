import React, { useState, ChangeEvent, useCallback } from "react";
import ReactLoaderSpinner from "react-loader-spinner";

import { IProject } from "reduxFiles/projects/types";
import { Modal } from "components/index";

interface IProps {
  projects: IProject[];
  onAddProject: (key: string) => void;
  onClose: () => void;
}

const ProjectAddPopup = ({ projects, onClose, onAddProject }: IProps) => {
  const [filterText, setFilterText] = useState("");
  const [projectIsAdding, setProjectIsAdding] = useState("");

  const filteredProjects = projects
    ? projects.filter(
        ({ name, key }) =>
          name.toLowerCase().includes(filterText) ||
          key.toLowerCase().includes(filterText)
      )
    : [];

  const onClickAddProject = useCallback((key: string) => {
    setProjectIsAdding(key);
    onAddProject(key);
  }, []);

  return (
    <Modal visible onClose={onClose}>
      <form className="edit-page__edit-form-popup">
        <span className="edit-page__edit-form-popup-title">Add project</span>

        <div className="edit-page__input-block_popup">
          <input
            className="edit-page__input edit-page__input_popup"
            type="text"
            id="projectsFilter"
            name="projectsFilter"
            placeholder="Filter"
            defaultValue={filterText}
            onInput={(e: ChangeEvent<HTMLInputElement>) =>
              setFilterText(e.target.value.trim().toLowerCase())
            }
          />
        </div>
        <div className="project-list-container">
          <div className="project-list">
            {projects && (
              <table>
                <tbody className="userlist__body">
                  {filteredProjects.map(({ name, key }) => (
                    <tr className="userlist__row" key={key}>
                      <td className="userlist__cell userlist__cell_first userlist__cell_bold">
                        <span>{name}</span>
                      </td>
                      <td className="userlist__cell">
                        <span>{key}</span>
                      </td>
                      <td className="userlist__cell">
                        {projectIsAdding !== key ? (
                          <i
                            onClick={() => onClickAddProject(key)}
                            className="material-icons unselectable clickable userlist__cell_add-icon"
                          >
                            add
                          </i>
                        ) : (
                          <ReactLoaderSpinner
                            className="loader"
                            type="TailSpin"
                            color="#27263b"
                            height={30}
                            width={30}
                          />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default ProjectAddPopup;
