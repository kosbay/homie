import * as Excel from "exceljs";
import moment from "moment";

import { getReportData } from "../data/providers/api";

const downloadFile = (file, name) => {
  if (file && file.size > 0) {
    if (window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveOrOpenBlob(file, name);
    } else {
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(file);
      link.download = name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  } else {
    console.log("error"); // tslint:disable-line
  }
};

export const generateReport = async projectKeys => {
  const lastMonth = moment()
    .subtract(1, "months")
    .format("MMMM_YYYY");
  const issues = await getReportData({ projectKeys });

  const workbook = new Excel.Workbook();
  const worksheet = workbook.addWorksheet("Report");

  worksheet.columns = [
    { header: "Hours", key: "id", width: 10 },
    { header: "Summary", key: "summary", width: 32 },
    { header: "Description", key: "description", width: 48 }
  ];

  issues.map(({ summary, description, timeworked }) => {
    worksheet.addRow({
      id: `${Math.ceil(Number(timeworked) / 3600)} hrs`,
      summary,
      description
    });
  });

  workbook.xlsx.writeBuffer().then(buffer => {
    const blob = new Blob([new Uint8Array(buffer)], {
      type: "application/xlsx"
    });
    downloadFile(blob, `Report_${lastMonth}.xlsx`);
  });
};
