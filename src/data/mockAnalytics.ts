export interface AnalyticsData {
    time: string;
    productivity: number;
    momentum: number;
    members: number;
}

export const fetchAnalyticsData = async (): Promise<AnalyticsData[]> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const data: AnalyticsData[] = [];
            for (let i = 0; i <= 24; i++) {
                const time = i.toString().padStart(2 , '0') + ':00';

                let productivity = Math.floor(Math.random() * 101);
                if (i >= 0 && i <= 8) productivity = Math.floor(Math.random() * 20);
                if (i >= 9 && i <= 17) productivity = Math.floor(Math.random() * 40) + 60;
                if (i >= 18 && i <= 23) productivity = Math.floor(Math.random() * 30)

                const momentum = Math.floor(Math.random() * 201) - 100;

                let members = Math.floor(Math.random() * 11);
                if (i >= 0 && i <= 8) members = Math.floor(Math.random() * 3);
                if (i >= 9 && i <= 17) members = Math.floor(Math.random() * 4) + 7;
                if (i >= 18 && i<= 23) members = Math.floor(Math.random() * 4)

                data.push({ time, productivity , momentum , members });
            }
            resolve(data)
        }, 800)
    })
}