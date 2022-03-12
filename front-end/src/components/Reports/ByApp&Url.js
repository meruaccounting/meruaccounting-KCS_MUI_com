import React from "react";
import { useEffect, useState } from "react";
import { groupBy as rowGrouper, random } from "lodash";
import faker from "faker";
import { reportsContext } from "src/contexts/ReportsContext";

import DataGrid, { SelectColumn } from "react-data-grid";
import { Box, Typography } from "@mui/material";
import { fontSize } from "@mui/system";

const columns = [
  {
    key: "employee",
    name: "Employee",
  },
  {
    key: "application",
    name: "Application",
  },
  {
    key: "activity",
    name: "Activity",
  },
];

function rowKeyGetter(row) {
  return row.id;
}

const options = ["employee"];

export default function ByAppsUrl(props) {
  const { reports } = props;

  const [rows, setRows] = useState([]);
  const [selectedRows, setSelectedRows] = useState(() => new Set());
  const [selectedOptions, setSelectedOptions] = useState([options[0]]);
  const [expandedGroupIds, setExpandedGroupIds] = useState(
    () => new Set(["Employees"])
  );
  React.useEffect(() => {
    let arr = [];
    reports.reports[0]?.byA?.map((emp) => {
      emp.screenshots.map((ss) => {
        const activity = ss.avgPerformanceData;
        arr.push({
          id: emp.userId + random(100),
          employee: `${emp._id.firstName} ${emp._id.lastName}`,
          application: ss.title.split("-").slice(0),
          activity: (activity / 1).toFixed(2), // eslint-disable-next-line no-use-before-define
        });
      });
    });
    setRows(arr);
  }, [reports]);

  function toggleOption(option, enabled) {
    const index = selectedOptions.indexOf(option);
    if (enabled) {
      if (index === -1) {
        setSelectedOptions((options) => [...options, option]);
      }
    } else if (index !== -1) {
      setSelectedOptions((options) => {
        const newOptions = [...options];
        newOptions.splice(index, 1);
        return newOptions;
      });
    }
    setExpandedGroupIds(new Set());
  }

  return (
    <Box sx={{ mt: 3 }}>
      <Typography varinat="h3" sx={{ fontWeight: "700", fontSize: "1.5rem" }}>
        Group by columns:
      </Typography>
      <div>
        {options.map((option) => (
          <label key={option}>
            <input
              style={{ marginLeft: "1rem" }}
              type="checkbox"
              checked={selectedOptions.includes(option)}
              onChange={(event) => toggleOption(option, event.target.checked)}
            />{" "}
            {option}
          </label>
        ))}
      </div>
      <DataGrid
        columns={columns}
        rows={rows}
        rowKeyGetter={rowKeyGetter}
        selectedRows={selectedRows}
        onSelectedRowsChange={setSelectedRows}
        groupBy={selectedOptions}
        rowGrouper={rowGrouper}
        expandedGroupIds={expandedGroupIds}
        onExpandedGroupIdsChange={setExpandedGroupIds}
        defaultColumnOptions={{ resizable: true }}
        // direction={direction}
      />
    </Box>
  );
}
