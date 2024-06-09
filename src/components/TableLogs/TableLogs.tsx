import "./index.css";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { IntegrationData, WorkLog, WorkLogs } from "../../types/WorkLogs";
import { BsFillTrashFill } from "react-icons/bs";
import { IoReloadCircle } from "react-icons/io5";
import { getFormattedDate } from "../../helpers/getFormattedDate";
import { Box, Chip, CircularProgress } from "@mui/material";
import Swal from "sweetalert2";
import { useJira } from "../../contexts/JiraContext";
import { workLogsController } from "../../services/SaveDataLocal/workLogsController";
import { useConfig } from "../../contexts/ConfigContext";

type TableLogsParams = {
  logs: WorkLogs | [];
  deleteWorkLog: any;
  loading?: boolean;
};

export const TableLogs = ({
  logs,
  deleteWorkLog,
  loading,
}: TableLogsParams) => {
  const { registerWorkLogInJira, cloudIdSelected } = useJira();
  const { getWorkLog } = useConfig();

  const getStartDateFormatted = (startDate: string) => {
    const fullDate = getFormattedDate(new Date(startDate));
    return <>{`${fullDate.date} - ${fullDate.hour}`}</>;
  };

  const getInfoIntegration = (data?: IntegrationData) => {
    if (data?.loading === true)
      return <CircularProgress className="loading-integration" />;

    if (!data)
      return <Chip label="Not Registred" size="small" title={"Old version"} />;

    if (data.registered) {
      return (
        <Chip
          label="Registred"
          size="small"
          color="success"
          title={data?.msg ?? ""}
        />
      );
    }

    return (
      <Chip label="Error" size="small" color="error" title={data?.msg ?? ""} />
    );
  };

  const registerWorkLogOnJira = (workLog: WorkLog) => {
    Swal.fire({
      title: "Register on Jira?",
      showCancelButton: true,
      showLoaderOnConfirm: true,
      confirmButtonColor: "#08979c",
      cancelButtonColor: "#ff4d4f",
      confirmButtonText: "Yes",
      allowOutsideClick: () => !Swal.isLoading(),
      preConfirm: async () => {
        try {
          if (cloudIdSelected.current) {
            workLogsController().update(workLog.id, "integration", {
              registered: false,
              loading: true,
            });

            await registerWorkLogInJira({
              description: workLog.description,
              started: workLog.startDate.replaceAll("Z", "+0000"),
              task: workLog.task,
              time: workLog.time,
              cloudId: cloudIdSelected.current,
            });

            workLogsController().update(workLog.id, "integration", {
              registered: true,
              msg: "Successfully registered",
              loading: false,
            });
          }
        } catch (err: any) {
          let msg = err?.response?.data?.message;
          msg = msg ?? err?.response?.data?.errorMessages?.join(" - ");
          msg = msg ?? "Error";

          Swal.fire({
            title: "Error in integration with Jira",
            text: msg,
            icon: "error",
          }).then(() => {
            getWorkLog();
          });

          workLogsController().update(workLog.id, "integration", {
            registered: false,
            msg,
            loading: false,
          });

          return false;
        }
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Successfully registered!",
          icon: "success",
        });

        getWorkLog();
      }
    });
  };

  return (
    <TableContainer sx={{ maxHeight: "350px" }} component={Paper}>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Start Date</TableCell>
            <TableCell>Task</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Time</TableCell>
            <TableCell>Integration</TableCell>
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
                <Box className="cell-integration-box">
                  {getInfoIntegration(row.integration)}
                </Box>
              </TableCell>
              <TableCell>
                <Box className="cell-actions-box">
                  {!row?.integration?.loading && (
                    <BsFillTrashFill
                      className="cell-actions-box--button--clear"
                      title="Delete"
                      onClick={() => deleteWorkLog(row.id)}
                    />
                  )}

                  {row.integration?.registered !== true &&
                    !row?.integration?.loading && (
                      <IoReloadCircle
                        className="cell-actions-box--button--upload"
                        title="Retry integration on Jira"
                        onClick={() => registerWorkLogOnJira(row)}
                      />
                    )}
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
