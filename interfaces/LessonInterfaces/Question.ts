interface Answer {
    text: string;
    correct: boolean;
}

export default interface Question {
    question: string;
    answers: Answer[];
}