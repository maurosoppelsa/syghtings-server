export interface Sight {
    id: string;
    province: string;
    condition: string;
    placeName: string;
    animal: string;
    picture: {
        uri: string;
        height: number;
        width: number;
    }
    location: {
        latitude: string;
        longitude: string;
    }
    description: string;
    createdAt: string;
    userId: string;
}
