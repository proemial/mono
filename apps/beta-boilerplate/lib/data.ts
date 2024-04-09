import { unstable_noStore as noStore } from 'next/cache';
import type { Paper } from './definitions';

export async function fetchPapers(query: string) {
    await new Promise((resolve) => setTimeout(resolve, 3000));
    const papers: Paper[] = [
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
    return papers
}