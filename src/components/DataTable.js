import React, { useEffect, useState, useReducer } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import { ExportToCsv } from "export-to-csv";

const options = {
  fieldSeparator: ";",
  filename: "Δεδομένα Κειμένων",
  quoteStrings: '"',
  decimalSeparator: ".",
  showLabels: true,
  showTitle: false,
  title: "Δεδομένα Κειμένων Μαθητών",
  useTextFile: false,
  useBom: true,
  useKeysAsHeaders: false,
  headers: [
    "Μαθητής",
    "Τμήμα",
    "Αριθμός λέξεων",
    "Ορθογραφικά λάθη",
    "Γραμματικά λάθη",
    "Λάθη στίξης",
    "Βαθμός",
  ],
};

const columns = [
  { id: "stu_name", label: "Μαθητής", minWidth: 170 },
  { id: "stu_class", label: "Τμήμα", minWidth: 100 },
  { id: "num_words", label: "Αριθμός λέξεων", minWidth: 100 },
  {
    id: "num_spelling",
    label: "Αριθμός Ορθογραφικών λαθών",
    minWidth: 170,
    align: "right",
  },
  {
    id: "num_grammar",
    label: "Αριθμός Γραμματικών λαθών",
    minWidth: 170,
    align: "right",
  },
  {
    id: "num_punctuation",
    label: "Αριθμός λαθών στίξης",
    minWidth: 170,
    align: "right",
  },
  {
    id: "grade",
    label: "Βαθμός",
    minWidth: 170,
    align: "right",
  },
];

function createData(
  stu_name,
  stu_class,
  num_words,
  num_spelling,
  num_grammar,
  num_punctuation,
  grade
) {
  return {
    stu_name,
    stu_class,
    num_words,
    num_spelling,
    num_grammar,
    num_punctuation,
    grade,
  };
}

const useStyles = makeStyles({
  root: {
    width: "100%",
  },
  container: {
    maxHeight: 440,
  },
});

export default function DataTable({
  role,
  mistakes,
  wordsOrth,
  countOrth,
  countGram,
  countSti,
  change,
  posted,
}) {
  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [rows, setRows] = useState([]);
  const [allEssays, setAllEssays] = useState([]);
  const [changeState, setChange] = useState([]);
  //const [rows, setRows] = useReducer([0, 0, 0, 0, 0, 0]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  /*
  async function getEssayData() {
    let temp_data = [];
    let user_id = localStorage.getItem("uniqid");

    const response = await fetch(
      `http://127.0.0.1:5000/essays/all/role/${role}/id/${user_id}`
    );

    const essay_data = await response.json();
    essay_data.map((essay) => {
      temp_data.push(
        createData(
          essay.essay,
          essay.num_words,
          essay.num_spelling,
          essay.num_grammar,
          essay.num_punctuation,
          essay.grade
        )
      );
    });
    //fill data for export
    //fillExportData(essay_data);
    setAllEssays(essay_data);
    setRows(temp_data);
  }*/

  const getEssayData = () => {
    let temp_data = [];
    let user_id = localStorage.getItem("uniqid");
    fetch(`http://127.0.0.1:5000/essays/all/role/${role}/id/${user_id}`)
      .then((res) => res.json())
      .then((essays) => {
        let essay_data = JSON.parse(JSON.stringify(essays));
        console.log("DES TA ESSAY DAATA----------", essay_data);
        essay_data.map((essay) => {
          temp_data.push(
            createData(
              essay.stu_name,
              essay.stu_class,
              essay.num_words,
              essay.num_spelling,
              essay.num_grammar,
              essay.num_punctuation,
              essay.grade
            )
          );
        });
        //fill data for export
        //fillExportData(essay_data);
        setAllEssays(essay_data);
        setRows(temp_data);
        console.log(rows);
      });
  };

  const fillExportData = (essays) => {
    var data = [];
    essays.map((essay) => {
      data.push({
        stu_name: essay.stu_name,
        stu_class: essay.stu_class,
        num_words: essay.num_words,
        num_spelling: essay.num_spelling,
        num_grammar: essay.num_grammar,
        num_punctuation: essay.num_punctuation,
        grade: essay.grade,
      });
    });
    return data;
  };

  const exportData = () => {
    const csvExporter = new ExportToCsv(options);
    let forexport = fillExportData(allEssays);

    csvExporter.generateCsv(forexport);
  };

  useEffect(() => {
    //API CALL TO GET THE DATA
    getEssayData();
    //setChange(new Date());
  }, [posted]);

  //Updates table but results in an infinite loop with infinite requests to the server
  /*useEffect(() => {
    getEssayData();
  }, [rows]);*/

  useEffect(() => {
    //API CALL TO GET THE DATA
    getEssayData();
  }, [mistakes]);

  return (
    <div id="table-box">
      <div id="export-box">
        <p>Εξαγωγή δεδομένων σε αρχείο .csv:</p>
        <button id="export-btn" onClick={exportData}>
          Εξαγωγή
        </button>
      </div>
      <Paper className={classes.root} id="datatableid">
        <TableContainer className={classes.container}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => {
                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={row.code}
                    >
                      {columns.map((column) => {
                        const value = row[column.id];
                        return (
                          <TableCell key={column.id} align={column.align}>
                            {column.format && typeof value === "number"
                              ? column.format(value)
                              : value}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  );
}
