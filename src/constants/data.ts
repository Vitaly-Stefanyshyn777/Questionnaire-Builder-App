export const defaultAnswer = {
 text: '',
};

export const defaultQuestion = {
 text: '',
 type: '',
 answers: undefined,
};

export const defaultQuiz = {
 title: '',
 description: '',
 questions: [defaultQuestion],
};

export const questionTypes = [
 { id: '1', value: 'text', name: 'Text' },
 { id: '2', value: 'single_choice', name: 'Single choice' },
 { id: '3', value: 'multiple_choice', name: 'Multiple Choice' },
];

export const defaultSort = [
 { id: '1', label: 'Title', value: 'title' },
 { id: '2', label: 'Questions', value: 'questions' },
 { id: '3', label: 'Completions', value: 'completions' },
];
