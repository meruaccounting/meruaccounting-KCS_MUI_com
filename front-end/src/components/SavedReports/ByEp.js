// "use strict";

import { reportsContext } from "../../contexts/ReportsContext";

import * as React from "react";
import PropTypes from "prop-types";
import {
  Box,
  Card,
  Tooltip,
  CardContent,
  CardActionArea,
  CardMedia,
} from "@mui/material";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import Preview from "../UserPage/Preview";
import timeC from "src/_helpers/timeConverter";
import { timeCC } from "src/_helpers/timeConverter";
import ImageIcon from "@mui/icons-material/Image";
import { CurrentUserContext } from "src/contexts/CurrentUserContext";

function Row(props) {
  const { row, options } = props;
  const [open, setOpen] = React.useState(false);
  const { commonData } = React.useContext(CurrentUserContext);

  return (
    <React.Fragment>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell>
          {options.includeSS === true && (
            <ImageIcon
              aria-label="expand row"
              size="small"
              onClick={() => setOpen(!open)}
            >
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </ImageIcon>
          )}
        </TableCell>
        <TableCell component="th" scope="row">
          {row.Employee}
        </TableCell>
        <TableCell align="left">{row.Project}</TableCell>
        <TableCell align="left">{row.Duration}</TableCell>
        {options.includePR === true && (
          <TableCell align="left">{row.Money}</TableCell>
        )}
        {options.includeAL === true && (
          <TableCell align="left">{row.Activity}</TableCell>
        )}
      </TableRow>
      {options.includeSS === true && (
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              {row.Ss.length !== 0 ? (
                <Box sx={{ display: "flex", flexWrap: "wrap" }}>
                  {row.Ss.map((ss) => (
                    <Card sx={{ width: 260, maxWidth: 260, m: 1.8 }}>
                      <Tooltip
                        title={`${ss?.title}`}
                        placement="top"
                        followCursor
                      >
                        <CardContent
                          sx={{
                            pb: 0,
                            mb: 0,
                            mt: -2,
                            ml: -1.5,
                            background: "#A5B9D9",
                            maxHeight: "50px",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                          }}
                        >
                          {/* use ref to checkbox, perform onClick */}
                          <span>
                            <Box
                              sx={{
                                width: "75%",
                                display: "inline-block",
                                maxWidth: "90%",
                                typography: "caption",
                                fontWeight: "bold",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                              }}
                            >
                              {ss?.title}
                            </Box>
                          </span>
                        </CardContent>
                      </Tooltip>

                      <Tooltip
                        title={`${timeC(
                          ss?.activityAt,
                          commonData.commonData.user?.accountInfo?.timeZone
                        )}, ${Math.ceil(ss?.performanceData)}%`}
                        placement="top"
                        followCursor
                      >
                        <CardActionArea>
                          <CardMedia
                            component="img"
                            height="140"
                            image={`${ss?.image}`}
                            alt="green iguana"
                          />
                        </CardActionArea>
                      </Tooltip>

                      <CardContent
                        sx={{
                          pt: 0,
                          mb: -3,
                          ml: -1.5,
                          background: "#A5B9D9",
                        }}
                      >
                        <Typography
                          color="text.primary"
                          gutterBottom
                          variant="subtitle2"
                        >
                          {`${Math.ceil(
                            ss?.performanceData
                          )}%, Taken at ${timeC(
                            ss?.activityAt,
                            commonData.commonData.user?.accountInfo?.timeZone
                          )}`}
                        </Typography>
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              ) : (
                <Typography
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    // wordWrap: "initial",
                    width: "100%",
                  }}
                >
                  {" "}
                  No screenshots available
                </Typography>
              )}
            </Collapse>
          </TableCell>
        </TableRow>
      )}
    </React.Fragment>
  );
}

Row.propTypes = {
  row: PropTypes.shape({
    name: PropTypes.string,
    Duration: PropTypes.string.isRequired,
    Money: PropTypes.string.isRequired,
    Activity: PropTypes.number.isRequired,
  }).isRequired,
};

export default function ByEp(props) {
  const { options } = props;
  const [rowData, setRowData] = React.useState([]);
  const { savedReports } = React.useContext(reportsContext);
  React.useEffect(() => {
    // setRowData(savedReports.reports[0]?.byEP);

    let arr = [];
    savedReports.reports[0]?.byEP?.map((emp) => {
      emp.projects.map((pro) => {
        arr.push({
          Name: pro.project,
          Employee: `${emp._id.firstName} ${emp._id.lastName}`,
          Project: `${pro.project}`,
          Duration: (pro.totalHours / 3600).toFixed(2),
          Money: ((pro?.totalHours / 3600) * emp?.payRate).toFixed(2),
          Activity: (pro.avgPerformanceData / 1).toFixed(2),
          Ss: pro?.screenshots,
        });
      });
    });
    setRowData(arr);
  }, [savedReports]);
  const [expanded, setExpanded] = React.useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };
  return (
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Name</TableCell>
            <TableCell align="left">Project</TableCell>
            <TableCell align="left">Duration</TableCell>
            {options.includePR === true && (
              <TableCell align="left">Money</TableCell>
            )}
            {options.includeAL === true && (
              <TableCell align="left">Activity</TableCell>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {rowData.map((row) => (
            <Row options={options} key={row.name} row={row} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
