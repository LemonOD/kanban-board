export interface Issue {
    id: string;
    title: string;
    description: string;
    status: string;
    assignee?: string;
    createdAt: string;
    updatedAt: string;
}

export async function loadIssues(): Promise<Issue[]> {
    return [];
}