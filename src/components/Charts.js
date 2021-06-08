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

const COLORS = ["#243665", "#8BD8BD", "#FFBB28"];

const Charts = ({
  countGram,
  countOrth,
  countSti,
  wordsOrth,
  wordsGram,
  mistakes,
  user,
  role,
}) => {
  const [dataBarOrth, setDataBarOrth] = useState([]);
  const [dataBarGram, setDataBarGram] = useState([]);
  const [dataPie, setDataPie] = useState([]);

  const getPieData = () => {
    let temp_dataPie = [];
    //dataPie=[];
    let user_id = localStorage.getItem("uniqid");
    fetch(
      `https://checkitapi.herokuapp.com/mistakes/get_all/role/${role}/id/${user_id}`
    )
      .then((res) => res.json())
      .then((data) => {
        let json_obj = JSON.parse(JSON.stringify(data));
        let orth = {
          name: "Ορθογραφικά Λάθη",
          count: json_obj[0].countS,
        };
        let gram = {
          name: "Γραμματικά Λάθη",
          count: json_obj[1].countG,
        };
        let sti = {
          name: "Λάθη Στίξης",
          count: json_obj[2].countSti,
        };
        temp_dataPie.push(orth);
        temp_dataPie.push(gram);
        temp_dataPie.push(sti);
        setDataPie(temp_dataPie);
      });
  };

  const findWordsBarChar = (mistakes) => {
    if (mistakes.length != 0) {
      //taksinomisi
      wordsGram.sort(function (a, b) {
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
          dataBarGram.push(newBarElement);
        }
      });
    }
  };

  const getGramData = () => {
    let temp_data = [];
    let type = "grammar";
    let curr_user = localStorage.getItem("uniqid");
    fetch(
      `https://checkitapi.herokuapp.com/mistakes_by_user/${curr_user}/role/${role}/type/${type}`
    )
      .then((res) => res.json())
      .then((data) => {
        let json_obj = JSON.parse(JSON.stringify(data));

        json_obj.map((item) => {
          let temp_item = {
            name: item.word,
            count: item.count,
            amt: 2210,
          };
          temp_data.push(temp_item);
        });
        //Sort data
        temp_data.sort(function (a, b) {
          return b.count - a.count;
        });
        //Show the 5 most frequent
        temp_data = temp_data.slice(0, 6);
        setDataBarGram(temp_data);
      });
  };

  const getOrthData = () => {
    let temp_data = [];
    let type = "spelling";
    let curr_user = localStorage.getItem("uniqid");
    fetch(
      `https://checkitapi.herokuapp.com/mistakes_by_user/${curr_user}/role/${role}/type/${type}`
    )
      .then((res) => res.json())
      .then((data) => {
        let json_obj = JSON.parse(JSON.stringify(data));

        json_obj.map((item) => {
          let temp_item = {
            name: item.word,
            count: item.count,
            amt: 2210,
          };
          temp_data.push(temp_item);
        });
        //Sort data
        temp_data.sort(function (a, b) {
          return b.count - a.count;
        });
        //Show the 5 most frequent
        temp_data = temp_data.slice(0, 6);
        setDataBarOrth(temp_data);
      });
  };

  useEffect(() => {
    getOrthData();
    getGramData();
    getPieData();
  }, [wordsOrth, wordsGram, mistakes]);

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
          <Bar dataKey="count" fill="#243665" />
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
          <Bar dataKey="count" fill="#8BD8BD" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Charts;
