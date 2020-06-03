import React from "react";
import moment from "moment";
import classnames from "classnames";
import { animateScroll } from "react-scroll";
import { withRouter, RouteComponentProps } from "react-router-dom";
import _ from "lodash";
import FaExcel from "react-icons/lib/fa/file-excel-o.js";

import {
  addWorklogThumb,
  removeUserWorklogThumb
} from "../../data/providers/api";
import ThumbUp from "./ThumbUp";
import { IUser } from "reduxFiles/users/types";
import { Button } from "components/index";
import { IWorklogs } from "../../models/Worklog";

import "./WorklogsList.scss";

interface IProps extends RouteComponentProps {
  budgetId: string;
  worklogsAreLoading: boolean;
  worklogs: IWorklogs[];
  onScrollToWorklog: (element: any) => void;
  user: IUser;
  getPreviousWorklogs: () => void;
  updateWorklogsOnBudget: (any) => void;
  downloadReportData: () => void;
}

interface IState {
  pickedWorklogId: string;
  worklogsAreLoading: boolean;
}

class WorklogsList extends React.Component<IProps, IState> {
  worklogsElem: HTMLLIElement[] = [];
  bindNavigator: any = navigator;

  constructor(props) {
    super(props);

    this.state = {
      pickedWorklogId: "",
      worklogsAreLoading: false
    };
  }

  componentDidMount() {
    const {
      onScrollToWorklog,
      location: { hash }
    } = this.props;
    const id = hash.slice(1);

    if (!!id && !!this.worklogsElem[id]) {
      this.setState(
        {
          pickedWorklogId: id
        },
        () => {
          onScrollToWorklog(this.worklogsElem[id]);
        }
      );
    }
  }

  scrollTo = element => {
    if (element) {
      animateScroll.scrollTo(this.getOffset(element).top - 150);
    }
  };

  getOffset = (el: HTMLElement) => {
    const rect = el.getBoundingClientRect();

    return {
      left: rect.left + window.scrollX,
      top: rect.top + window.scrollY
    };
  };

  getFormatDate = date => {
    const charIndex = date.lastIndexOf("T");

    if (charIndex === -1) {
      return date.split("-").join(".");
    }
    date = date.substring(0, charIndex);

    return date.split("-").join(".");
  };

  getFormatSpent = timeSpentSeconds => {
    const spentInMins = Math.floor(+timeSpentSeconds / 60);

    if (spentInMins < 60) {
      return `${spentInMins} minutes`;
    }

    const spentInHours = Math.floor(spentInMins / 60);
    const spentInMinutes =
      spentInMins % 60 !== 0 ? `${spentInMins % 60} minutes` : "";

    return `${spentInHours} hours ${spentInMinutes}`;
  };

  toCapitalize = string => {
    return `${string.charAt(0).toUpperCase()}${string.slice(1)}`;
  };

  onClick = ({ date, name, spent, comment, id }) => {
    const href = window.location.href;
    const indexOfHash = href.indexOf("#");
    const location =
      indexOfHash === -1 ? href : href.slice(0, href.indexOf("#"));

    if (this.bindNavigator.share) {
      this.bindNavigator
        .share({
          title: "Second Company PWA!",
          text: `Date: ${date} \nAuthor: ${name}\n Spent: ${spent}\n Comment: ${comment}`,
          url: `${location}#${id}`
        })
        .catch(() => {
          console.error("Web Share doesn't work"); // tslint:disable-line
        });
    }
  };

  handleThumbClick = async (e, worklog) => {
    const {
      user: { _id: userId },
      budgetId,
      updateWorklogsOnBudget
    } = this.props;
    const { id: worklogId, worklogThumbs } = worklog;

    e.preventDefault();

    if (worklogThumbs && worklogThumbs.clicked) {
      const { _id } = worklog.worklogThumbs;
      const params = {
        _id,
        userId
      };
      const worklogThumbs = await removeUserWorklogThumb(params);

      if (worklogThumbs) {
        updateWorklogsOnBudget({
          budgetId,
          worklogId,
          worklogThumbs
        });
      }
    } else {
      const { worklogThumbs: thumbs } = worklog;
      const userIds =
        thumbs && thumbs.users && thumbs.users.length > 0
          ? thumbs.users
          : [userId];

      if (thumbs && thumbs.users && thumbs.users.length > 0) {
        userIds.push(userId);
      }

      const params = {
        _id: thumbs && thumbs._id,
        worklogId,
        userIds
      };
      const worklogThumbs = await addWorklogThumb(params);

      if (worklogThumbs) {
        updateWorklogsOnBudget({
          budgetId,
          worklogId,
          worklogThumbs
        });
      }
    }
  };

  render() {
    const {
      worklogs,
      worklogsAreLoading,
      getPreviousWorklogs,
      downloadReportData
    } = this.props;
    const { pickedWorklogId } = this.state;
    let sortedWorklogs = worklogs
      .filter(el => el !== null)
      .sort((a, b) =>
        a.dateStarted < b.dateStarted
          ? 1
          : a.dateStarted > b.dateStarted
          ? -1
          : 0
      );
    sortedWorklogs = sortedWorklogs.filter((v, i, a) => a.indexOf(v) === i);
    const showButton = worklogsAreLoading || worklogs.length % 20 === 0;
    const styles = {
      cursor: this.bindNavigator.share ? "pointer" : "default"
    };

    return (
      <div className="worklogs-container">
        <div className="title-line">
          <h2 className="block-title">Work logs</h2>
          {downloadReportData && (
            <div className="excel-logo-container" onClick={downloadReportData}>
              Past Month
              <FaExcel className="excel-logo" size={24} />
            </div>
          )}
        </div>
        <ul className="worklogs__list">
          {worklogs.length !== 0 ? (
            sortedWorklogs.map(worklog => {
              const {
                author,
                timeSpentSeconds,
                dateStarted,
                comment,
                id,
                worklogThumbs
              } = worklog;
              const displayDate = moment(dateStarted).format("DD-MM-YYYY");
              const weekDay = moment(displayDate, "DD-MM-YYYY").format("ddd");
              const displayName = this.toCapitalize(author);
              const displaySpent = this.getFormatSpent(timeSpentSeconds);

              const share = {
                date: displayDate,
                name: displayName,
                spent: displaySpent,
                comment,
                id
              };

              return (
                <li
                  className={classnames("worklogs__item", {
                    picked: pickedWorklogId && `${id}` === `${pickedWorklogId}`
                  })}
                  key={id}
                  style={styles}
                  id={`${id}`}
                  ref={ref => (this.worklogsElem[id] = ref as HTMLLIElement)}
                >
                  <div
                    className="worklogs__line"
                    onClick={() => this.onClick(share)}
                  >
                    <div className="worklogs__date-cont">
                      <p className="worklogs__date">{displayDate}</p>
                      <p className="worklogs__date week-day">{weekDay}</p>
                    </div>
                    <div className="worklogs__info-container">
                      <span className="worklogs__spent">
                        {displaySpent}, by {displayName}
                      </span>
                      <span className="worklogs__comment">{comment}</span>
                    </div>
                  </div>
                  <ThumbUp
                    amount={
                      worklogThumbs && worklogThumbs.users
                        ? worklogThumbs.users.length
                        : 0
                    }
                    anim={worklogThumbs && worklogThumbs.clicked}
                    onClick={e => this.handleThumbClick(e, worklog)}
                  />
                </li>
              );
            })
          ) : (
            <div className="worklogs__item worklogs__item_empty">
              Er waren deze maand nog geen werklogboeken
            </div>
          )}
        </ul>
        {showButton && (
          <Button
            className="worklogs__button"
            onClick={getPreviousWorklogs}
            isLoading={worklogsAreLoading}
          >
            Meer laden
          </Button>
        )}
      </div>
    );
  }
}

export default withRouter(WorklogsList);
