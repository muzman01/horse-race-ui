import { useState, useEffect } from "react";
import "./index.css";

const DiceComponent = ({ diceResult, rollDice }: any) => {
  const [reRoll, setReRoll] = useState(false); // Toggle for animation

  useEffect(() => {
    setReRoll(true); // Trigger re-roll animation when diceResult changes
    const timer = setTimeout(() => setReRoll(false), 1000); // Disable animation after 1 second
    return () => clearTimeout(timer);
  }, [diceResult]);

  return (
    <div
      id="dice"
      data-side={diceResult}
      className={reRoll ? "reRoll" : ""}
      onClick={rollDice}
    >
      <div className={`sides side-1 ${diceResult === 1 ? "visible" : ""}`}>
        <span className="dott dot-1"></span>
      </div>
      <div className={`sides side-2 ${diceResult === 2 ? "visible" : ""}`}>
        <span className="dott dot-1"></span>
        <span className="dott dot-2"></span>
      </div>
      <div className={`sides side-3 ${diceResult === 3 ? "visible" : ""}`}>
        <span className="dott dot-1"></span>
        <span className="dott dot-2"></span>
        <span className="dott dot-3"></span>
      </div>
      <div className={`sides side-4 ${diceResult === 4 ? "visible" : ""}`}>
        <span className="dott dot-1"></span>
        <span className="dott dot-2"></span>
        <span className="dott dot-3"></span>
        <span className="dott dot-4"></span>
      </div>
      <div className={`sides side-5 ${diceResult === 5 ? "visible" : ""}`}>
        <span className="dott dot-1"></span>
        <span className="dott dot-2"></span>
        <span className="dott dot-3"></span>
        <span className="dott dot-4"></span>
        <span className="dott dot-5"></span>
      </div>
      <div className={`sides side-6 ${diceResult === 6 ? "visible" : ""}`}>
        <span className="dott dot-1"></span>
        <span className="dott dot-2"></span>
        <span className="dott dot-3"></span>
        <span className="dott dot-4"></span>
        <span className="dott dot-5"></span>
        <span className="dott dot-6"></span>
      </div>
    </div>
  );
};

export default DiceComponent;
