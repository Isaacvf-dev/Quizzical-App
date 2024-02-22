import styles from './Quizz.module.css'
import React from 'react'
import he from 'he'
import { nanoid } from 'nanoid'


export function Quizz({onPlayAgain }) {
  const [quizz, setQuizz] = React.useState([])
  const [allAnswers, setAllanswers] = React.useState([])
  const [selectedAnswers, setSelectedAnswers] = React.useState([])  
  const [results, setResults] = React.useState({});

 
  const fetchData = async () => {
    try {      
      const response = await fetch('https://opentdb.com/api.php?amount=5');
      if (!response.ok) {
        if (response.status === 429) {          
          setTimeout(fetchData, 500)
          return
        }
        throw new Error('Failed to fetch data');
      }
      const data = await response.json();
      const quizzWithIds = data.results.map(quiz => ({
        ...quiz,
        id: nanoid()
      }));
      setQuizz(quizzWithIds);
    } catch (error) {
      console.error('Error fetching quiz data:', error);
    }
  }; 
  
  React.useEffect(() => {
    const timeOut = setTimeout(() => {
      fetchData()
    }, 1000)
    
    return () => {
      clearTimeout(timeOut)
    }
  }, [])

  React.useEffect(() => {
    if(quizz.length > 0) {
      const wrappingAnswers = quizz.map(quizz => (
        { id: quizz.id, answers: [quizz.correct_answer, ...quizz.incorrect_answers] }
      ))
      
      const shuffledWrappingAnswers = wrappingAnswers.map( answer => ({
        ...answer,
        answers: shuffle([...answer.answers])
      }))
      
      setAllanswers(shuffledWrappingAnswers)
    }
  }, [quizz])
  
  
  function shuffle(array) {
    for( let i = array.length - 1; i > 0; i --) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[array[i], array[j]] = [array[j], array[i]]
    }
    return array
  }  
  
  function handleAnswerClick(questionId, selectedAnswer) {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionId]: selectedAnswer
    })
    
  }

  function handleShowResults() {
    const updatedResults = {};

    quizz.forEach(item => {
      const isCorrect = selectedAnswers[item.id] === item.correct_answer;
      updatedResults[item.id] = isCorrect;
    });

    setResults(updatedResults);
  }

  const allQuestionsAnswered = Object.keys(selectedAnswers).length === 5
    
  function resetGame() {    
    setQuizz([]);
    setAllanswers([]);
    setSelectedAnswers([]);
    setResults({});
    fetchData();
    
    onPlayAgain();  
  }

  console.log(results)
  console.log(selectedAnswers)
  console.log(quizz)
  return (
    <main>      
      {quizz.map(item => (
        <div key={item.id} className={styles.questionsContainer}>
          <strong >{he.decode(item.question)}</strong>
          <div className={styles.buttonsContainer}>            
          { allAnswers.map(obj => {
            if(obj.id === item.id) {
              return obj.answers.map(answer => (                
                <button 
                  key={nanoid()} 
                  className={`${styles.buttonAnswer} 
                              ${selectedAnswers[item.id] === answer ? styles.selectedAnswer : ''}
                              ${results[item.id] !== undefined && selectedAnswers[item.id] === answer ? (results[item.id] ? styles.correctAnswer : styles.wrongAnswer) : ''}
                                                        
                              
                  `}
                  onClick={() => handleAnswerClick(item.id, answer)}
                  disabled={results[item.id] !== undefined}
                >
                  {he.decode(answer)}
                </button>
              ))
            }            
            
            return null
          })}
          </div>
        </div>
      ))}        
      { allQuestionsAnswered && !Object.keys(results).length &&
      <button 
        className={styles.buttonCheckAnswers}
        onClick={() => handleShowResults()}
      >
        Check answers
      </button>}
      {Object.keys(results).length > 0 && 
      <div className={styles.containerPlayAgain}>
        <span>
          You scored {Object.values(results).filter(result => result).length}/{quizz.length} correct answers       
        </span>
        <button 
          className={styles.buttonTryAgain}
          onClick={resetGame}
        >
          Play again
        </button>  
      </div>}
    </main>
    

  )


}