const express = require("express");
const { requireSingIn } = require("../Middlewares/AuthMiddlewares");
const {
    SavePreparationAttempt,
    getPreparationAttempt,
    getPreparationAttemptByTopicSlug,
    checkAttempted,
    updateAttempt,
    saveTestAttempt,
    updateTestAttempt,
    checkTestAttempted,
    getTestAttempt,
    getTestAttemptByTestSlug,
    saveQuizAttempt,
    updateQuizAttempt,
    checkQuizAttempted,
    getQuizAttempt,
    getQuizAttemptByQuizSlug
} = require("../Controllers/AttemptsControllers");

//Route object
const route = express.Router();

route.post('/save', requireSingIn, SavePreparationAttempt);
route.put('/update/:attemptId', requireSingIn, updateAttempt);
route.get('/user/:userId', requireSingIn, getPreparationAttempt);
route.get('/result/:slug', requireSingIn, getPreparationAttemptByTopicSlug);
route.get('/check-attempted/:slug', requireSingIn, checkAttempted);


// Test Attempt Routes
route.post('/save-test-attempt', requireSingIn, saveTestAttempt);
route.put('/update-test-attempt/:attemptId', requireSingIn, updateTestAttempt);
route.get('/check-test-attempted/:slug', requireSingIn, checkTestAttempted);
route.get('/test-attempts/user/:userId', requireSingIn, getTestAttempt);
route.get('/test-attempts/result/:slug', requireSingIn, getTestAttemptByTestSlug);

// Quiz Attempt Routes
route.post('/save-quiz-attempt', requireSingIn, saveQuizAttempt);
route.put('/update-quiz-attempt/:attemptId', requireSingIn, updateQuizAttempt);
route.get('/attempted-quiz-check/:quizId', requireSingIn, checkQuizAttempted);
route.get('/quiz-attempts/user/:userId', requireSingIn, getQuizAttempt);
route.get('/quiz-attempts/result/:quizId', requireSingIn, getQuizAttemptByQuizSlug);

module.exports = route;

