// import React, { useState, useRef } from 'react'
// import './Quiz.css'
// import { data } from '../../assets/data'

// const Quiz = () => {
//   const[index, setIndex] = useState(0);
//   const[question, setQuestion] = useState(data[index]);
//   const[lock, setLock] = useState(false);
//   const[score, setScore] = useState(0);
//   const[result, setResult] = useState(false);

//   let Option1 = useRef(null);
//   let Option2 = useRef(null);
//   let Option3 = useRef(null);
//   let Option4 = useRef(null);

//   let option_array = [Option1,Option2,Option3,Option4];

//   const checkAns = (e,ans)=>{
//     if(lock === false){
//       if(question.ans===ans){
//         e.target.classList.add("correct");
//         setLock(true);
//         setScore(prev=>prev+1);
//       }else{
//         e.target.classList.add("wrong");
//         setLock(true);
//         option_array[question.ans-1].current.classList.add("correct");
//       }

//     }
    
//   };


// const next = () => {
//   if (lock === true) {
//     const newIndex = index + 1;

//     if (newIndex < data.length) {
//       option_array.forEach(option => {
//         option.current.classList.remove("wrong", "correct");
//       });

//       setQuestion(data[newIndex]);
//       setIndex(newIndex);
//       setLock(false);
//     } else {
//       // ✅ Show result
//       setResult(true);
//     }
//   } else {
//     alert("Please select an answer before continuing.");
//   }
// };


//   const reset = () =>{
//     setIndex(0);
//     setQuestion(data[0]);
//     setScore(0);
//     setLock(false);
//     setResult(false);
//   }
//   return (
//     <div className='container'>
//       <h1>Quiz App</h1>
//       <hr/>
//       {result?<></>:<>
//       <h2>{index+1}. {question.question}</h2>
//       <ul>
//         <li ref={Option1} onClick={(e)=>{checkAns(e,1)}}>{question.option1}</li>
//         <li ref={Option2} onClick={(e)=>{checkAns(e,2)}}>{question.option2}</li>
//         <li ref={Option3} onClick={(e)=>{checkAns(e,3)}}>{question.option3}</li>
//         <li ref={Option4} onClick={(e)=>{checkAns(e,4)}}>{question.option4}</li>
//       </ul>
//       <button onClick={next}>Next</button>
//       <div className='index'>{index+1} of {data.length} questions</div></>}
//       {result?<><h2>You Scored {score} out of {data.length} questions</h2>
//       <button onClick={reset}>Reset</button></>:<></>}
      

//     </div>
//   )
// }

// export default Quiz







// ✅ Updated Quiz.jsx (keep option1, option2 format)

import React, { useState, useRef, useEffect } from 'react';
import './Quiz.css';
import { data } from '../../assets/data';

const Quiz = () => {
  const [topic, setTopic] = useState("");
  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [lock, setLock] = useState(false);
  const [score, setScore] = useState(0);
  const [result, setResult] = useState(false);
  const [timer, setTimer] = useState(15);

  const Option1 = useRef(null);
  const Option2 = useRef(null);
  const Option3 = useRef(null);
  const Option4 = useRef(null);
  const option_array = [Option1, Option2, Option3, Option4];

  useEffect(() => {
    let countdown;
    if (!result && topic) {
      countdown = setInterval(() => {
        setTimer(prev => {
          if (prev === 1) {
            clearInterval(countdown);
            handleAutoNext();
            return 15;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(countdown);
  }, [index, result, topic]);

  const handleAutoNext = () => {
    if (!lock) {
      option_array[questions[index].ans - 1].current.classList.add("correct");
    }
    setLock(true);
    setTimeout(next, 1000);
  };

  const checkAns = (e, ans) => {
    if (!lock) {
      const correctAns = questions[index].ans;
      if (ans === correctAns) {
        e.target.classList.add("correct");
        setScore(prev => prev + 1);
      } else {
        e.target.classList.add("wrong");
        option_array[correctAns - 1].current.classList.add("correct");
      }
      setLock(true);
    }
  };

  const next = () => {
    if (lock) {
      if (index + 1 < questions.length) {
        option_array.forEach(option => {
          option.current.classList.remove("correct", "wrong");
        });
        setIndex(prev => prev + 1);
        setTimer(15);
        setLock(false);
      } else {
        setResult(true);
      }
    }
  };

  const reset = () => {
    setIndex(0);
    setLock(false);
    setScore(0);
    setResult(false);
    setTimer(15);
    setTopic("");
    setQuestions([]);
  };

  const handleTopicSelect = (topicName) => {
    const filtered = data.filter(q => q.category === topicName);
    setQuestions(filtered);
    setTopic(topicName);
    setIndex(0);
    setTimer(15);
  };

  if (!topic) {
    const uniqueTopics = [...new Set(data.map(q => q.category))];
    return (
      <div className="container">
        <h1>Select Quiz Topic</h1>
        {uniqueTopics.map((t, i) => (
          <button key={i} onClick={() => handleTopicSelect(t)}>{t}</button>
        ))}
      </div>
    );
  }

  return (
    <div className="container">
      <h1>Quiz - {topic}</h1>
      <hr />
      {result ? (
        <>
          <h2>You scored {score} out of {questions.length}</h2>
          <button onClick={reset}>Reset</button>
        </>
      ) : (
        <>
          <div className="timer">⏳ {timer}s</div>
          <div className="progress-bar">
            <div
              className="progress"
              style={{ width: `${((index + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
          <h2>{index + 1}. {questions[index].question}</h2>
          <ul>
            <li ref={Option1} onClick={(e) => checkAns(e, 1)}>{questions[index].option1}</li>
            <li ref={Option2} onClick={(e) => checkAns(e, 2)}>{questions[index].option2}</li>
            <li ref={Option3} onClick={(e) => checkAns(e, 3)}>{questions[index].option3}</li>
            <li ref={Option4} onClick={(e) => checkAns(e, 4)}>{questions[index].option4}</li>
          </ul>
          <button onClick={next}>Next</button>
          <button onClick={reset} className="exit-button">
            Exit
          </button>


          <div className="index">{index + 1} of {questions.length} questions</div>
        </>
      )}
    </div>
  );
};

export default Quiz;



