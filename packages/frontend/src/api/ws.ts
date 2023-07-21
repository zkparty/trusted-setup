/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import EspecialClient from 'especial/client'
import { KeepAliveState, UserInfo } from '../types';

class APIWSClient {
    private ws: any;

    constructor() {
        this.ws = new EspecialClient(import.meta.env.VITE_WS_URL);
    }

    async connect(): Promise<void> {
        if (this.ws.connected) return;
        await this.ws.connect();
        // TODO: how do we use this?
        this.ws.listen('ceremonyState', ({ data }: any) => {
            console.log('ceremonyState: ', data);
        });
        this.ws.listen('activeContributor', ({ data }: any) => {
            console.log('activeContributor: ', data);
        });
    }

    async keepAlive(token: string): Promise<KeepAliveState> {
        await this.connect();
        const { data }: { data: KeepAliveState } = await this.ws.send('ceremony.keepalive', {
            token
        });
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return data;
    }

    async getUserInfo(token: string): Promise<UserInfo> {
        await this.connect();
        const { data }: { data: UserInfo } = await this.ws.send('user.info', {
            token
        });
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return data;
    }
}

const apiWSClient = new APIWSClient();
export default apiWSClient;