export type TranscriptContribution = {
    _id: string;
    index: number;
    circuitName: string;
    queueId: string;
    userId: string;
    hash: string;
    name: string;
    createdAt: number;
    uploadedAt: number | null;
}

export type CeremonyState = {
    activeContributor: string | null;
    completedCount: number;
    queueLength: number;
    circuitStats: {
        name: string;
        contributionCount: number;
    }[];
}

export type RegisterState = {
    _id: string | null;
    userId: string;
    token: string | null;
    createdAt: number;
}

export type JoinCeremonyState = {
    timeoutAt: number;
    active: boolean;
    queuePosition: number;
}

export type KeepAliveState = {
    queueLength: number;
    timeoutAt: number;
    queuePosition: number;
}

export type User = {
    _id: string;
    userId: string;
    timeoutAt: number;
    startedAt: number;
    index: number;
    completedAt: number | null;
}

export type UserInfo = {
    activeContributor: User;
    active: User;
    inQueue: boolean;
    latestContributions: {
        [key: string]: string;
    };
    queueLength: number;
    userId: string;
    queueEntry: User;
}