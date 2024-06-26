import { useEffect, useState } from "react"
import "./App.css"
import Papa from "papaparse"

function App() {
  const [text, setText] = useState()
  const [approvedResult, setApprovedResult] = useState()
  const [graduate, setGraduate] = useState()
  const [result, setResult] = useState()
  const [score, setScore] = useState()
  const [scoreStyle, setScoreStyle] = useState()

  const groupBy = (x, f) =>
    x.reduce((a, b, i) => ((a[f(b, i, x)] ||= []).push(b), a), {})

  const loadFile = function () {
    fetch("./loan_approval_dataset.csv")
      .then((response) => response.text())
      .then((responseText) => {
        setText("Data loaded")

        var config = { header: true }
        var resp = Papa.parse(responseText, config)
        const data = resp.data

        var status = groupBy(data, (a) => a.loan_status)
        setApprovedResult(
          `Approved: ${status.Approved.length}, Rejected: ${status.Rejected.length}`
        )

        var ed = groupBy(data, (a) => a.education)
        console.log(ed)

        var edApp = groupBy(ed.Graduate, (a) => a.loan_status)
        console.log(edApp)
        let test = `Graduate: Approved: ${edApp.Approved.length}, Rejected: ${edApp.Rejected.length}`
        // setGraduate(test)

        var edNot = groupBy(ed["Not Graduate"], (a) => a.loan_status)
        console.log(edNot)
        test += `\nNot Graduate: Approved: ${edNot.Approved.length}, Rejected: ${edNot.Rejected.length}`
        setGraduate(test)
      })
      .then((response) => analyzeData(response))
  }

  useEffect(loadFile, [])

  const analyzeData = () => {}

  const analyze = () => {
    var rand = Math.random() * 100
    var r = rand.toFixed(0)
    let scoreColor

    let res = ""
    if (r > 50) {
      res = "You will most likely get the loan."
      scoreColor = "green"
      // "\nYour credit score is in top 7% of applicants who where trusted with a loan"
    } else {
      res = "Please work on your credit score."
      scoreColor = "#990033"
    }
    setResult(res)
    setScore(r)

    const styl = {
      width: "180px",
      height: "180px",
      borderRadius: 180 / 2,
      border: "6px solid " + scoreColor,
      display: "inline-block",
      fontSize: 110,
    }

    setScoreStyle(styl)
  }

  const resultStyle = {
    width: 44,
    height: 44,
    borderRadius: 44 / 2,
  }

  return (
    <div>
      {/* <pre>{text}</pre>
      <hr></hr>
      <pre>{approvedResult}</pre> <hr></hr>
      <pre>{graduate}</pre> */}
      <hr></hr>
      <table>
        <tbody>
          <tr>
            <td>annual income</td>
            <td>
              <input></input>
            </td>
          </tr>
          <tr>
            <td>credit score</td>
            <td>
              <input></input>
            </td>
          </tr>
          <tr>
            <td>education</td>
            <td>
              <input></input>
            </td>
          </tr>
          <tr>
            <td>dependents</td>
            <td>
              <input></input>
            </td>
          </tr>
        </tbody>
      </table>
      <hr></hr>
      <button onClick={() => analyze()}>Simulation</button>
      <button onClick={() => analyze()}>Send application</button>

      <hr></hr>

      <div> Simulation result</div>
      <div style={scoreStyle}>{score}</div>

      <h4>{result}</h4>
    </div>
  )
}

export default App
