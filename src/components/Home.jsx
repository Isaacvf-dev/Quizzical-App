import styles from './Home.module.css'

export function Home(props) {
  
  return (
    <section className={styles.home}>
      <strong>Quizzical</strong>
      <span>Time to test your knowledge</span>
      <button onClick={props.displayQuizz}>Start quiz</button>
    </section>
  )
}