import { useEffect, useState } from "react"
import "./App.css"
import Papa from "papaparse"

function App() {
  const [text, setText] = useState()
  const [approvedResult, setApprovedResult] = useState()
  const [graduate, setGraduate] = useState()

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

  return (
    <div>
      <pre>{text}</pre>
      <hr></hr>
      <pre>{approvedResult}</pre> <hr></hr>
      <pre>{graduate}</pre>
    </div>
  )
}

export default App
