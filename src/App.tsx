import "./App.css";
import { useInputform } from "./hooks/useInputform.ts";
import { useState, useRef, useEffect } from "react";

function App() {
  //const time = useInputform(0);
  const [value, handleChange, errorText] = useInputform(0);
  const [startTime, setStartTime] = useState(0);
  const [now, setNow] = useState(0);
  const [pause, setPause] = useState(false);
  const intervalElement = useRef(-1);

  const valueNumber = typeof value === "number" ? value : 0;
  const hasError = typeof errorText === "string" && errorText.length > 0;

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    //wird eine neue Zahl eingegeben, solange der TImer läuft, muss diese neu gesetzt werden
    const nowPoint = Date.now();
    setNow(nowPoint);
    setStartTime(nowPoint);
    if (isTimerRunning()) {
      handlePause(true);
    }
    handleChange(event);
  };

  function startNewInterval() {
    intervalElement.current = setInterval(() => {
      setNow(Date.now());
    }, 10);
  }

  function handleStart(nowPoint: number) {
    console.log("handleStart");
    if (hasError) {
      return;
    }
    if (pause) {
      const elapsed = now - startTime;
      setNow(nowPoint);
      setStartTime(nowPoint - elapsed);
      setPause(false);
      startNewInterval();
    } else if (!isTimerRunning()) {
      resetTimerAndStart();
    }
  }

  function handlePause(doSetPause: boolean = false) {
    clearInterval(intervalElement.current);
    intervalElement.current = -1; //infoTimer läuft nicht
    if (doSetPause) {
      setPause(true);
    }
  }

  function handleReset() {
    resetTimerAndStart();
  }

  function resetTimerAndStart() {
    handlePause(false);
    const nowPoint = Date.now();
    setStartTime(nowPoint);
    setNow(nowPoint);
    startNewInterval();
  }

  function isTimerRunning(): boolean {
    return intervalElement.current !== -1;
  }

  const secondsLeft = Math.max(0, valueNumber - (now - startTime) / 1000);

  useEffect(() => {
    if (secondsLeft <= 0) {
      clearInterval(intervalElement.current);
    }
  }, [secondsLeft]);

  useEffect(() => {
    if (isTimerRunning()) {
      handlePause(true);
    }
  }, [value]);

  return (
    <div className="App">
      <span className="t-4">Zeit festlegen</span>

      <input
        className={errorText ? "input-error" : ""}
        value={value}
        onChange={handleInputChange}
        placeholder="Zeit in Sekunden"
      />
      {/* type="number" rausgelassen, wollte etwas mit error spielen.... */}
      <span className={errorText ? "error-text" : "none-error-text"}>
        {errorText}
      </span>
      <br />
      <span className="t-1 bold">Time left:</span>
      <span className="t-1 bold displayTimer">{secondsLeft.toFixed(3)}</span>
      <br />
      <div className="button-row">
        <button onClick={() => handleStart(Date.now())}>Start</button>
        <button onClick={() => handlePause(true)}>Pause</button>
        <button onClick={() => handleReset()}>Reset</button>
      </div>
    </div>
  );
}

export default App;
