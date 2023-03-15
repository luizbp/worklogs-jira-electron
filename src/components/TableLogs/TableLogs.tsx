import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { WorkLogs } from '../../types/WorkLogs';

type TableLogsParams = {
  logs: WorkLogs | []
}

export const TableLogs = ({logs}: TableLogsParams) => {
  return (
    <TableContainer component={Paper}>
    <Table aria-label="simple table">
      <TableHead>
        <TableRow>
          <TableCell>Date</TableCell>
          <TableCell>Task</TableCell>
          <TableCell>Description</TableCell>
          <TableCell>Time</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {logs?.map((row, index) => (
          <TableRow
            key={`row-${index}`}
            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
          >
            <TableCell component="th" scope="row">
              {row.startDate}
            </TableCell>
            <TableCell>{row.task}</TableCell>
            <TableCell>{row.description}</TableCell>
            <TableCell>{row.time}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
  )
}