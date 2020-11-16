import Answer from "./AnswerInterface";

export default interface Question {
    question: string;
    answers: Answer[];
    lessonId: string;
}