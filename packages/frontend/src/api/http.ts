import { CeremonyState, JoinCeremonyState, RegisterState, TranscriptContribution } from "../types";

class APIHTTPClient {
    getTranscript: () => Promise<TranscriptContribution[]> = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/transcript`);
            const data = await response.json() as TranscriptContribution[];
            return data;
        } catch (error) {
            // TODO: handle error in notification?
            console.error(error);
            return [];
        }
    };
    getCeremony: () => Promise<CeremonyState> = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/ceremony`);
            const data = await response.json() as CeremonyState;
            return data;
        } catch (error) {
            console.log(error);
            return {
                activeContributor: null,
                completedCount: 0,
                queueLength: 0,
                circuitStats: []
            } as CeremonyState;
        }
    };
    userRegister: () => Promise<RegisterState> = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/register`);
            const registeredUser = await response.json() as RegisterState;
            return registeredUser;
        } catch (error) {
            // TODO: handle error in notification?
            console.error(error);
            return {
                _id: null,
                userId: '',
                token: null,
                createdAt: 0,
            };
        }
    };
    joinCeremony: (token: string) => Promise<JoinCeremonyState> = async (token) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/join`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ token })
            })
            const data = await response.json() as JoinCeremonyState;
            return data;
        } catch (error) {
            // TODO: handle error in notification?
            console.error(error);
            return {
                timeoutAt: 0,
                active: false,
                queuePosition: 0
            }
        }
    };
    getCircuit: (token: string, name: string, id: string) => Promise<Uint8Array> = async (token, name, id) => {
        try {
            const url = new URL(`/contribution/${id}`, import.meta.env.VITE_API_URL);
            url.searchParams.set('circuitName', name);
            url.searchParams.set('token', token);
            const response = await fetch(url.toString());
            const bytes = await response.arrayBuffer();
            const data = new Uint8Array(bytes);
            return data;
        } catch (error) {
            // TODO: handle error in notification?
            console.error(error);
            return new Uint8Array();
        }
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    uploadContribution: (token: string, circuitName: string, data: any) => Promise<void> = async (token, circuitName, data) => {
        const url = new URL(`/contribution`, import.meta.env.VITE_API_URL);
        const formData = new FormData();
        formData.append('contribution', new Blob([data]))
        formData.append('token', token)
        formData.append('circuitName', circuitName)
        await fetch(url.toString(), {
        method: 'POST',
        body: formData,
        });
    };
}

const apiHTTPClient = new APIHTTPClient();
export default apiHTTPClient;