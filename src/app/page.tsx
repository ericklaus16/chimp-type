"use client";
import { useEffect, useState } from 'react';
import '../styles/main.css';

import { LoremIpsum } from 'lorem-ipsum';

export default function Home() {
  const [wpm, setWPM] = useState<number>(0);
  const [charactersTyped, setCharactersTyped] = useState<number>(0);
  const [hardcoreMode, setHardcoreMode] = useState<boolean>(false);
  const [timerPlaceholder, setTimePlaceholder] = useState<number>(15);
  const [isTimerRunning, setTimeRunning] = useState<boolean>(false);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [activeTimer, setActiveTimer] = useState(15);
  const [textToBeTyped, setTextToBeTyped] = useState("");
  const [textTyped, setTextTyped] = useState("");
  const lorem = new LoremIpsum();

  useEffect(() => {
    handleGenerateText();
    setTimePlaceholder(activeTimer);
  }, []);

  useEffect(() => {
    let timerInterval: NodeJS.Timeout;

    if (isTimerRunning) {
      timerInterval = setInterval(() => {
        setTimePlaceholder((prevTime) => {
          const newTime = prevTime - 1;

          if (newTime === 0) {
            clearInterval(timerInterval);
            setGameOver(true);
          }

          return newTime;
        });
        
      }, 1000);
    }

    return () => clearInterval(timerInterval);
  }, [isTimerRunning]);

  useEffect(() => {
    if(gameOver){
      let count = 0;

      for (let i = 0; i < textTyped.length; i++) {
        if (textTyped[i] === " ") {
          count++;
        }
      }
      
      setWPM((count + 1) * 4);
      setTextTyped("");
      setCharactersTyped(0);
    }
  }, [gameOver]);

  const handleTimerClick = (timer: number) => {
    setActiveTimer(timer);
    setTimePlaceholder(timer);
    handleGenerateText();
  };

  const handleGenerateText = () => {
    setTextToBeTyped(lorem.generateSentences(2 * (activeTimer / 15))); 
  }; 

  return (
    <div className="content">
      <div className='header'>
        <img src='chimp.jpg' className='chimpLogo'/>
        <h1>CHIMP-TYPE</h1>
      </div>
      {!gameOver && (
        <div className="game">
          {!isTimerRunning && (
          <div className="timers">
            <img src={"timer.png"} className="timerLogo"/>
            <div className="timings">
              <button onClick={() => handleTimerClick(15)} className={activeTimer === 15 ? "activeTimer" : "defaultTimer"}>15s</button>
              <button onClick={() => handleTimerClick(30)} className={activeTimer === 30 ? "activeTimer" : "defaultTimer"}>30s</button>
              <button onClick={() => handleTimerClick(60)} className={activeTimer === 60 ? "activeTimer" : "defaultTimer"}>60s</button>
            </div>
          </div>
          )}
          {isTimerRunning && (<p style={{color: "white", fontSize: 30}}>{timerPlaceholder}</p>)}
          <div className="typing">
            <div className="typingZone">
              <div style={{ position: 'relative', width: '90vw' }}>
                <p className='guideText'>{textToBeTyped || 'Texto de fundo'}</p>
                <textarea 
                className="gameInput" 
                onChange={(text) => {
                  const userInput = text.target.value;
                  setTextTyped(userInput);
                
                  if (!isTimerRunning) {
                    setTimeRunning(true);
                  }
                
                  if(hardcoreMode){
                    const currentTypedSubstring = textToBeTyped.substring(0, userInput.length);
                  
                    if (userInput !== currentTypedSubstring) {
                      setGameOver(true);
                    }
                  }

                  if(userInput === textToBeTyped){
                    setGameOver(true);
                  }
                
                  setCharactersTyped(userInput.length);
                }}
                autoFocus/>
              </div>
            </div>
          </div>
          <button onClick={() => setHardcoreMode(!hardcoreMode)}>{hardcoreMode ? "Normal Mode" : "Hardcore Mode"}</button>
        </div>
      )}
      {gameOver && (
        <div>
          <div className='wpmCounter'>
            <p>wpm:</p>
            <p>{wpm}</p>
          </div>
          <div className='accuracy'>
            <p>acc:</p>
            <p>100%</p>
          </div>
          <button 
            className="playAgainButton" 
            onClick={() => {
              setGameOver(false); 
              setTimePlaceholder(activeTimer); 
              setTimeRunning(false); 
              handleGenerateText();}}
            >
              Play Again!
            </button>
        </div>
      )}
    </div>
  );
}
