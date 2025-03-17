const express = require('express');
const route = express.Router();
const quizController = require('../Controllers/QuizControllers');
const { requireSingIn } = require('../Middlewares/AuthMiddlewares');

route.post('/quizzes',  quizController.createQuiz);
route.get('/quizzes/:user', quizController.getStudentQuizzes);
route.get('/get-quiz/:quizId', requireSingIn, quizController.getQuiz);
route.get('/mcqs/:mcqIds', requireSingIn, quizController.getMcqs);

module.exports = route;