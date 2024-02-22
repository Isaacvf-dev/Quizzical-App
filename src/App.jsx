
import React from 'react'
import { Home } from './components/Home'
import { Quizz } from './components/Quizz'

import './global.css'
import styles from './App.module.css'
import bottomImage from './assets/bottom-left.svg'
import topImage from './assets/top-right.svg'


function App() {  
  const [showQuizz, setShowQuizz] = React.useState(false)
  const [gameActive, setGameActive] = React.useState(false)

  function displayQuizz() {
    setShowQuizz(!showQuizz)
    setGameActive(true)
  }

  function handlePlayAgain() {
    setShowQuizz(false); 
    setGameActive(false); 
  }

  return (
    <>
      <img src={bottomImage} className={styles.bottomImage} alt='bottom blue style'/>
      <img src={topImage} className={styles.topImage} alt='top yellow style'/>
      
      {showQuizz ? <Quizz onPlayAgain={handlePlayAgain}/> : <Home displayQuizz={() => displayQuizz()}/> }
    </>
  )
}

export default App
