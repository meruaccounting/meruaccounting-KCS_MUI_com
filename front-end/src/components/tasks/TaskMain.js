import React, { useState, useRef, useContext } from "react";
import {
  Autocomplete,
  IconButton,
  Paper,
  Link,
  TextField,
  Typography,
  FormControlLabel,
  Switch,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Box } from "@mui/system";
// import { Link, Link as RouterLink } from "react-router-dom";
import moment from "moment";
import { useSnackbar } from "notistack";
import Confirmation from "../Confirmation";
import EnhancedTable from "./Members";
import { TasksContext } from "src/contexts/tasksContext";
import dayjs from "dayjs";
import { Container } from "react-bootstrap";
import { getFullName } from "src/_helpers/getFullName";
import { addTaskMember } from "src/api/task api/tasks";

const useStyles = makeStyles((theme) => ({
  input: {
    color: "#000",
    width: "50%",
    maxWidth: "fit-content",
    height: "30px",
    fontSize: "30px",
    fontWeight: "bold",
    border: "none",
    background: "#fff",
    transition: "width 0.4s ease-in-out",
    "& :focus": { width: "100%" },
  },
}));
export default function TaskMain(props) {
  const { ...others } = props;
  // to focus edit name of client

  const outerref = useRef();
  const inputRef = useRef();
  const { enqueueSnackbar } = useSnackbar();

  const { taskDetails, dispatchAddTaskMember } = useContext(TasksContext);

  const handleEditClick = (e) => {
    inputRef.current.focus();
  };

  const classes = useStyles();

  const Labelconfig = function () {
    return (
      <>
        {taskDetails.taskDetails.allEmployees.map((employee) => (
          <FormControlLabel
            id={`${employee._id}`}
            sx={{ display: "block", pt: 1, fontWeight: 10 }}
            onChange={() => {
              addTaskMember(dispatchAddTaskMember, {
                _id: taskDetails.taskDetails._id,
                employeeId: employee._id,
              });
            }}
            control={
              <Switch
                defaultChecked={taskDetails.taskDetails.employees.includes(
                  employee._id
                )}
              />
            }
            label={`${getFullName(employee.firstName, employee.lastName)}`}
          />
        ))}
      </>
    );
  };

  return taskDetails.loader ? (
    <Box
      component="div"
      sx={{
        width: "70%",
        flexGrow: "1",
        overflowX: "hidden",
        overflowY: "auto",
        // margin: "10px 10px 10px 10px",
      }}
    >
      <Paper
        component="div"
        elevation={3}
        sx={{
          display: "flex",
          flexGrow: 1,
          justifyContent: "center",
          alignItems: "center",
          // ml: 2,
          overflow: "visible",
          height: "100%",
        }}
      >
        <Box
          component="img"
          src="/svgs/client.svg"
          sx={{ width: 100, height: 70, backgroundColor: "white" }}
        />
        <Typography variant="h5">No Task Selected</Typography>
      </Paper>
    </Box>
  ) : (
    <>
      {/* grid container 40 60 */}
      <Box
        ref={outerref}
        component="div"
        sx={{
          width: "70%",
          flexGrow: "1",
          overflowX: "hidden",
          overflowY: "auto",
          m: 1,
        }}
      >
        <Paper
          component="div"
          elevation={3}
          sx={{
            zIndex: 1,
            overflow: "visible",
            // height: "100%",
            position: "relative",
            display: "grid",
            gridTemplateRows: "30% 70%",
          }}
        >
          <Box sx={{ m: 1 }}>
            <h1 style={{ backgroundColor: "#fff" }}>
              <form onSubmit={() => {}} style={{ display: "inline" }}>
                <input
                  ref={inputRef}
                    // onChange={(e) => setClientName(e.target.value)}
                  type="text"
                  className={classes.input}
                  value={taskDetails.taskDetails.name}
                />
              </form>
              <div
                style={{
                  float: "right",
                }}
              >
                <IconButton>
                  <EditIcon onClick={handleEditClick} />
                </IconButton>
                <IconButton>
                  <DeleteIcon onClick={() => {}} />
                </IconButton>
              </div>
            </h1>
            <Box
              component="div"
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                // mb: 5,
                pb: 2,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  // alignItems: "center",
                }}
              >
                <Typography variant="h5">
                  Created on :
                  {dayjs(taskDetails.taskDetails.createdAt).format("DD/MM/YY")}
                </Typography>
                <Typography
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignContent: "center",
                  }}
                  variant="body1"
                ></Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  // alignItems: "center",
                }}
              >
                <Typography variant="h6">
                  Created By : {taskDetails.taskDetails.createdBy}
                </Typography>
                <Typography variant="body1"></Typography>
              </Box>
            </Box>
          </Box>
          <Box sx={{}}>
            <Box
              component="div"
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start",
                alignItems: "flex-start",
                m: 1,
              }}
            >
              <Box sx={{ pt: 2, width: "100%" }}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "100%",
                  }}
                >
                  <Typography variant="h5">Employees</Typography>
                  <Autocomplete
                    id="combo-box-demo"
                    options={taskDetails.taskDetails.allEmployees}
                    getOptionLabel={(option) =>
                      getFullName(option.firstName, option.lastName)
                    }
                    sx={{ width: 300 }}
                    renderInput={(params) => (
                      <TextField {...params} label="Employee" />
                    )}
                    onChange={() => {}}
                  />
                </Box>
                <Link sx={{ pl: 1, color: "#229A16" }} onClick={() => {}}>
                  Add all
                </Link>
                <Link sx={{ pl: 1, color: "#FF4842" }} onClick={() => {}}>
                  Remove all
                </Link>
                <Container sx={{ display: "block" }}>{Labelconfig()}</Container>
              </Box>
            </Box>
          </Box>
        </Paper>
      </Box>
    </>
  );
}