import Question from "./Question";

interface QuizData {
    title: string;
}

export default interface QuizLesson {
    quiz: QuizData;
    questions: Question[];
}