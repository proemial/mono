import { z } from "zod"

export type Paper = {
    id: string;
    title: string;
    date: string;
    publisher: string;
    type: string;
};

export type Article = {
    type: 'Summary' | 'Answer',
    model: string,
    headline?: string,
    text: string
}

export type Selector = {
    label: string,
    value: string
}

export type QAMessageAuthor = {
    name: string,
    avatar: string
}

export type QAMessage = {
    type: "question" | "answer"
    text: string,
    replies?: number
    likes?: number
    author: QAMessageAuthor
}

export const QuerySchema = z.object({
    query: z
        .string()
})

/**
 * Dummy content
 */

export const dummySummary: Article = {
    type: "Summary",
    model: "GPT-4-TURBO",
    headline: "Quantum theory may involve hidden variables but proving them logically consistent creates challenges in separated systems",
    text: "The statistical interpretation of quantum theory focuses on ensemble descriptions and hidden variables. The main purpose is to explain quantum phenomena statistically. Furthermore, a method for calculating wave functions in crystals is proposed. Statistical Interpretation of Quantum Mechanics Calculating Wave Functions in Crystals In quantum theory, statistical interpretations clarify quantum phenomena through ensembles and hidden variables. Additionally, a proposed method calculates wave functions effectively in crystals."
}

export const dummyAnswer: Article = {
    type: "Answer",
    model: "GPT-4-TURBO",
    text: "The statistical interpretation of quantum theory focuses on ensemble descriptions and hidden variables. The main purpose is to explain quantum phenomena statistically. Furthermore, a method for calculating wave functions in crystals is proposed. Statistical Interpretation of Quantum Mechanics Calculating Wave Functions in Crystals In quantum theory, statistical interpretations clarify quantum phenomena through ensembles and hidden variables. Additionally, a proposed method calculates wave functions effectively in crystals."
}

export const dummyPapers = [
    {
        id: "1",
        title: "The Role of the Brain in the Evolution of the Human Hand",
        date: "2021.10.10",
        publisher: "American Physical Society",
        type: "www",

    },
    {
        id: "2",
        title: "The Statistical Interpretation of Quantum Mechanics",
        date: "2021.10.10",
        publisher: "American Physical Society",
        type: "www",
    },
    {
        id: "3",
        title: "Calculating Wave Functions in Crystals",
        date: "2021.10.10",
        publisher: "American Physical Society",
        type: "www",
    },
    {
        id: "4",
        title: "The Role of the Brain in the Evolution of the Human Hand",
        date: "2021.10.10",
        publisher: "American Physical Society",
        type: "www",

    },
    {
        id: "5",
        title: "The Statistical Interpretation of Quantum Mechanics",
        date: "2021.10.10",
        publisher: "American Physical Society",
        type: "www",
    },
    {
        id: "6",
        title: "Calculating Wave Functions in Crystals",
        date: "2021.10.10",
        publisher: "American Physical Society",
        type: "www",
    }
]

export const qaSelectors: Selector[] = [
    { value: 'latest', label: 'Latest' },
    { value: 'popular', label: 'Popular' },
    { value: 'trending', label: 'Trending' },
    { value: 'unanswered', label: 'Unanswered' }
]

export const followupSelectors: Selector[] = [
    { value: 'popular', label: 'Popular' },
    { value: 'trending', label: 'Trending' },
    { value: 'curious', label: 'Curious' }
]