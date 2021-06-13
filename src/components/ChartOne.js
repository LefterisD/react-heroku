import React, { useEffect, useState } from "react";
import {
  BarChart,
  PieChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Pie,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#5daae9d7", "#ffbb28be", "#D85531"];

const Charts = ({
  countGram,
  countOrth,
  countSti,
  wordsOrth,
  wordsGram,
  mistakes,
  user,
  role,
  change,
}) => {
  const [dataBarOrth, setDataBarOrth] = useState([]);
  const [dataBarGram, setDataBarGram] = useState([]);
  const [dataPie, setDataPie] = useState([]);
  //let dataBarOrth = [];

  /*const dataPie = [
    {
      name: "Ορθογραφικά Λάθη",
      pv: countOrth,
    },
    {
      name: "Λάθη Γραμματικης",
      pv: countGram,
    },
    {
      name: "Λάθη Στίξης",
      pv: countSti,
    },
  ];*/

  const findWordsBarChar = (mistakes) => {
    let temp_dataBarOrth = [];
    let temp_dataBarGram = [];
    if (mistakes.length != 0) {
      //taksinomisi
      wordsOrth.sort(function (a, b) {
        return b.count - a.count;
      });
    }

    if (mistakes.length != 0) {
      let counter = 0;
      wordsGram.map((word) => {
        if (counter < 5) {
          counter++;
          let newBarElement = {
            name: word.word,
            count: word.count,
            amt: 2210,
          };
          temp_dataBarGram.push(newBarElement);
        }
      });
      setDataBarGram(temp_dataBarGram);
    }
    if (mistakes.length != 0) {
      let counter = 0;
      wordsOrth.map((word) => {
        if (counter < 5) {
          counter++;
          let newBarElement = {
            name: word.word,
            count: word.count,
            amt: 2210,
          };
          temp_dataBarOrth.push(newBarElement);
        }
      });
      setDataBarOrth(temp_dataBarOrth);
    }
  };

  const findPieData = (mistakes) => {
    let pieData2 = [];
    if (mistakes.length != 0) {
      pieData2 = [];
      pieData2.push(
        {
          name: "Ορθογραφικά Λάθη",
          count: countOrth,
        },
        {
          name: "Λάθη Γραμματικης",
          count: countGram,
        },
        {
          name: "Λάθη Στίξης",
          count: countSti,
        }
      );
      setDataPie(pieData2);
      //return pieData2;
    } else {
      pieData2 = [
        {
          name: "Λάθη Γραμματικης",
          count: 0,
        },
        {
          name: "Ορθογραφικά Λάθη",
          count: 0,
        },
        {
          name: "Λάθη Στίξης",
          count: 0,
        },
      ];
      setDataPie(pieData2);
      //return pieData2;
    }
  };
  console.log("CHANGE----", change);
  useEffect(() => {
    findPieData(mistakes);
    findWordsBarChar(mistakes);
  }, [wordsOrth, wordsGram]);

  return (
    <div className="section">
      <h3 className="chart-title">
        <span id="chart-span">6 </span> πιο συχνά ορθογραφικά λάθη
      </h3>
      <ResponsiveContainer width="100%" height={300} className="bar">
        <BarChart
          className="barchart"
          width={500}
          height={300}
          data={dataBarOrth}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" fill="#5daae9d7" />
        </BarChart>
      </ResponsiveContainer>
      <h3 className="chart-title">Συνολικά λάθη κάθε κατηγορίας</h3>
      <ResponsiveContainer width="100%" height={300} className="donut">
        <PieChart width={500} height={300}>
          <Tooltip />
          <Legend verticalAlign="bottom" align="center" iconType="circle" />
          <Pie
            className="piechart"
            data={dataPie}
            nameKey="name"
            dataKey="count"
            innerRadius="40%"
            outerRadius="80%"
            startAngle={90}
            endAngle={-270}
            fill="#243665"
          >
            {dataPie.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <h3 className="chart-title">
        <span id="chart-span">6 </span> πιο συχνά γραμματικά λάθη
      </h3>
      <ResponsiveContainer width="100%" height={300} className="bar">
        <BarChart
          className="barchart"
          width={500}
          height={300}
          data={dataBarGram}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" fill="#ffbb28be" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Charts;
