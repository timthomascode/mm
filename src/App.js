// import logo from './logo.svg';
import './App.css';
import { useState } from 'react';

function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max-min+1) + min);
}

const secretCode = []

for (let i = 0; i < 4; i++) {
  secretCode.push(getRandomNumber(1,6))
}

console.log(secretCode)

function App() {
  const [history, setHistory] = useState([]);
  const [recentGuess, setRecentGuess] = useState(Array(4).fill(null));
  const [turnNumber, setTurnNumber] = useState(1);
  const [win, setWin] = useState(false);

  function handleSubmit() {
    const feedback = calculateFeedback(recentGuess);

    if (feedback[0] === 4) {
      setWin(true);
    }

    setHistory([...history, [...recentGuess, ...feedback]]);
    setRecentGuess([null,null,null,null])
    setTurnNumber(turnNumber + 1)
  }

  function calculateFeedback(currentGuess) {
    let code = secretCode.slice();
    let guess = currentGuess.slice();
    let correct = 0;
    let incorrect = 0;

    for (let i = code.length - 1; i >= 0; i--) {
      if (guess[i] === code[i]) {
        correct += 1;
        code.splice(i, 1);
        guess.splice(i, 1);
      }
    }

    for (let i = guess.length - 1; i >= 0; i--){
      if (code.includes(guess[i])) {
        incorrect += 1;
        const index = code.indexOf(guess[i]);
        code.splice(index, 1)
        guess.splice(i, 1)
      }
    }

    return [correct, incorrect]
  }

  function handlePinClick(index) {
    const currentGuess = recentGuess.slice();
    const pinValue = currentGuess[index]
    currentGuess[index] = !pinValue || pinValue === 6 ? 1 : pinValue + 1;
    setRecentGuess(currentGuess);
  }
  
  function bottomRow() {
    if (win) {
      return <div className='status'>You won!</div>
    } else if (turnNumber === 11) {
      return <div className='status'>Game over!</div>
    } else {
      return <ActiveRow recentGuess={recentGuess} onSubmitClick={handleSubmit} pinClick={handlePinClick} />
    }
  }

  return (
    <div className="App">
      <HistoryTable history={history}/>
      { bottomRow() }
    </div>
  );
}

function HistoryTable({ history }) {

  let rowList = history.map((hist, index)=> {
    return <HistoryRow key={index} historyRow={hist}/>
  });

  return (
    <div className='historyTable'>
      {rowList}
    </div>
  )
}

function Pin({value, onPinClick}) {
  return (
    <div className="pin circle" onClick={onPinClick}>{value}</div>
  )
}

function ActiveRow({ recentGuess, pinClick, onSubmitClick }) {

  return (
    <div className='active-row'>
      <Pin value={recentGuess[0]} onPinClick={() => pinClick(0)}/>
      <Pin value={recentGuess[1]} onPinClick={() => pinClick(1)}/>
      <Pin value={recentGuess[2]} onPinClick={() => pinClick(2)}/>
      <Pin value={recentGuess[3]} onPinClick={() => pinClick(3)}/>
      <SubmitButton onSubmit={onSubmitClick}/>
    </div>
  )
}

function HistoryPin({ value }) {
  return (
    <div className="pin circle">{value}</div>
  )
}

function HistoryRow({ historyRow }) {
  return (
    <div className='history-row'>
      <HistoryPin value={historyRow[0]} />
      <HistoryPin value={historyRow[1]} />
      <HistoryPin value={historyRow[2]} />
      <HistoryPin value={historyRow[3]} />
      <Feedback correct={historyRow[4]} incorrect={historyRow[5]}/>
    </div>
  )
}

function Feedback({ correct, incorrect }) {
  return (
    <div className='feedback'>
      <div className='correct circle'>
        {correct}
      </div>
      <div className='incorrect circle'>
        {incorrect}
      </div>
    </div>
  )
}

function SubmitButton({ onSubmit }) {
  return (
    <button className='submit-button' onClick={onSubmit}>Submit</button>
  )
}

export default App;