import React, { useState, useEffect, useCallback, useRef } from "react";

import { useLocation } from "react-router-dom";



function Interview() {

    const navigate = useLocation();

    const queryParams = new URLSearchParams(navigate.search);

    const type = queryParams.get("type") || "General";



    // 1. ALL Hooks must be at the top level

    const [question, setQuestion] = useState("");

    const [answer, setAnswer] = useState("");

    const [feedback, setFeedback] = useState("");

    const [loading, setLoading] = useState(false);

    const [step, setStep] = useState(1);

    const [timeLeft, setTimeLeft] = useState(60);

    const timerRef = useRef(null);



    // 2. Define the submit function first so it's available for the timer

    const submitAnswer = useCallback(async (isAuto = false) => {

        if (timerRef.current) clearInterval(timerRef.current);



        if (!isAuto && !answer.trim()) {

            return alert("Please type your answer before submitting!");

        }

       

        setLoading(true);

        try {

            const res = await fetch("http://localhost:5000/api/evaluate-answer", {

                method: "POST",

                headers: { "Content-Type": "application/json" },

                body: JSON.stringify({

                    question: question,

                    answer: isAuto && !answer.trim() ? "USER RAN OUT OF TIME" : answer

                })

            });

            const data = await res.json();

            setFeedback(data.feedback);

        } catch (err) {

            console.error("Submission Error:", err);

            setFeedback("Error: Evaluation failed.");

        }

        setLoading(false);

    }, [question, answer]);



    // 3. Define the question generator

    const getNewQuestion = useCallback(async () => {

        setLoading(true);

        setQuestion("");

        setAnswer("");

        setFeedback("");

        setTimeLeft(60); // Reset timer

       

        try {

            const res = await fetch("http://localhost:5000/api/generate-question", {

                method: "POST",

                headers: { "Content-Type": "application/json" },

                body: JSON.stringify({ type })

            });

            const data = await res.json();

            setQuestion(data.question);

        } catch (err) {

            setQuestion("Error: Could not fetch a new question.");

        }

        setLoading(false);

    }, [type]);



    // 4. Trigger first question

    useEffect(() => {

        getNewQuestion();

    }, [getNewQuestion]);



    // 5. Timer Effect (Placed correctly at top level)

    useEffect(() => {

        if (question && !feedback && !loading) {

            timerRef.current = setInterval(() => {

                setTimeLeft((prev) => {

                    if (prev <= 1) {

                        clearInterval(timerRef.current);

                        submitAnswer(true); // Auto-submit

                        return 0;

                    }

                    return prev - 1;

                });

            }, 1000);

        }

        return () => {

            if (timerRef.current) clearInterval(timerRef.current);

        };

    }, [question, feedback, loading, submitAnswer]);



    return (

        <div className="center-card" style={{ padding: '40px', position: 'relative' }}>

           

            {/* Timer Display */}

            {!feedback && question && (

                <div style={{

                    position: 'absolute', top: '20px', right: '40px',

                    color: timeLeft <= 10 ? '#ff4444' : '#00ff88',

                    fontSize: '1.5rem', fontWeight: 'bold'

                }}>

                    ⏱ {timeLeft}s

                </div>

            )}



            <h2 className="neon">{type} Interview - Question {step}</h2>

           

            <div className="question-box" style={{ minHeight: '80px', margin: '20px 0' }}>

                {loading && !question ? "AI is thinking..." : question}

            </div>



            {!feedback ? (

                <>

                    <textarea

                        className="glass-input"

                        style={{ borderColor: timeLeft <= 10 ? '#ff4444' : 'rgba(0,255,136,0.2)' }}

                        value={answer}

                        onChange={(e) => setAnswer(e.target.value)}

                        placeholder="Type your response here..."

                        disabled={loading}

                    />

                    <button className="glow" onClick={() => submitAnswer(false)} disabled={loading}>

                        {loading ? "Evaluating..." : "Submit Answer"}

                    </button>

                </>

            ) : (

                <div className="feedback-section">

                    <div className="feedback-box" style={{ textAlign: 'left', marginBottom: '20px' }}>

                        <h4 style={{ color: '#00ff88' }}>AI Evaluation:</h4>

                        <p style={{ whiteSpace: 'pre-line' }}>{feedback}</p>

                    </div>

                    <button className="glow" onClick={() => { setStep(step + 1); getNewQuestion(); }}>

                        Next Question →

                    </button>

                </div>

            )}

        </div>

    );

}



export default Interview;