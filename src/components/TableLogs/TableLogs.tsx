import "./index.css";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { WorkLogs } from "../../types/WorkLogs";
import { BsFillTrashFill } from "react-icons/bs";
import { getFormattedDate } from "../../helpers/getFormattedDate";

type TableLogsParams = {
  logs: WorkLogs | [];
  deleteWorkLog: any;
};

export const TableLogs = ({ logs, deleteWorkLog }: TableLogsParams) => {

  const getStartDateFormatted = (startDate: string) => {
    const fullDate = getFormattedDate(new Date(startDate));
    return <>{`${fullDate.date} - ${fullDate.hour}`}</>;
  }
  
  return (
    <TableContainer sx={{ maxHeight: "350px" }} component={Paper}>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Start Date</TableCell>
            <TableCell>Task</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Time</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {logs?.map((row, index) => (
            <TableRow
              key={`row-${index}`}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                <p
                  className="action-click-clipboard"
                  title="Copy hour to jira"
                  onClick={() => {
                    navigator.clipboard.writeText(row.startDateFormatted);
                  }}
                >
                  {getStartDateFormatted(row.startDate)}
                </p>
              </TableCell>
              <TableCell>
              <p
                  className="action-click-clipboard"
                  title="Copy to jira"
                  onClick={() => {
                    navigator.clipboard.writeText(row.task);
                  }}
                >
                  {row.task}
                </p>
              </TableCell>
              <TableCell>
                <p
                  className="action-click-clipboard"
                  title="Copy to jira"
                  onClick={() => {
                    navigator.clipboard.writeText(row.description);
                  }}
                >
                  {row.description}
                </p>
              </TableCell>
              <TableCell>
              <p
                  className="action-click-clipboard"
                  title="Copy to jira"
                  onClick={() => {
                    navigator.clipboard.writeText(row.time);
                  }}
                >
                  {row.time}
                </p>
              </TableCell>
              <TableCell>
                <BsFillTrashFill
                  className="button--clear"
                  title="Delete"
                  onClick={() => deleteWorkLog(row.id)}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
