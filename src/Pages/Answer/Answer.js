import React, { useState, useContext, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import Axios from "../../Axios";
import AnswerDetail from "./AnswerDetail";
import "./Answer.css";

function Answer() {
  const { questionId } = useParams();
  // console.log(question_id);
  const [question, setQuestion] = useState({});
  const [userData] = useContext(UserContext);
  const [answers, setAnswers] = useState([]);
  const axios = Axios();

  const [form, setForm] = useState({});
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      //sending user data to database to be logged in
      const postRes = await axios.post(
				"/api/answers/newanswer",
				{
					answer: form.answer,
					question_id: questionId,
				},
				userData.config
			);
      setAnswers((answers) => [
				...answers,
				{
					answer: form.answer,
					time: new Date(),
					user_id: question.user_id,
					user_name: userData.user.display_name,
					answer_id: postRes.data.answer_id,
				},
			]);
      e.target.reset();
    } catch (err) {
      console.log("problem", err.response.data.msg);
      alert(err.response.data.msg);
    }
  };

  useEffect(() => {
    loadQuestion();
    loadAnswers();
  }, []);

  async function loadQuestion() {
    const response = await axios.get(
			`/api/questions/getquestionbyid?question_id=${questionId}`,
			userData.config
      
		);
    setQuestion(response.data?.data);
    console.log(question);
  }
  

  async function loadAnswers() {
    const response = await axios.get(
			`/api/answers/getanswer?question_id=${questionId}`,
			userData.config
		);
    setAnswers(response.data?.data);
  }
  return (
		<section className="container">
			<br />
			<br />
			<br />
			<br />
			<div>
				<h2>Questions</h2>
				<h4>{question ? question.question_title : "New Title"}</h4>
				<h5>{question ? question.question_description : "New Question"}</h5>
				{answers.length > 0 && (
					<h2 className="community_title">Answer From The Community</h2>
				)}
				<div>
					{answers?.map((value, index) => {
						return <AnswerDetail answer={value} key={index} />;
					})}
				</div>
				<div className="container" style={{ width: "90%" }}>
					<div
						className="container"
						style={{
							paddingTop: "50px",
							textAlign: "center",
							fontWeight: "bold",
						}}
					>
						<h2>Answer The Top Question</h2>
						<Link to="/">Go to Question Page</Link>
					</div>
					<form method="post" onSubmit={handleSubmit}>
						<div style={{ width: "100%" }}>
							<div>
								<textarea
									style={{
										marginTop: "15px",
										height: "200px",
										width: "100%",
										borderRadius: "10px",
										padding: "10px 15px",
									}}
									maxLength="200"
									type="text"
									name="new_answer"
									placeholder="Your Answer . . . "
									onChange={handleChange}
								/>
							</div>
							<div
								style={{
									marginTop: "10px",
									marginBottom: "10px",
								}}
							>
								<button
									style={{
										padding: "10px 25px",
										borderRadius: "5px",
									}}
									className="btn btn-lg btn-primary"
									type="submit"
								>
									Post Your Answer
								</button>
							</div>
						</div>
					</form>
				</div>
			</div>
		</section>
	);
}

export default Answer;
