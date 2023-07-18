export interface Sight {
  id: string;
  province: string;
  condition: string;
  placeName: string;
  animal: string;
  imageId: string;
  location: {
    latitude: string;
    longitude: string;
  };
  description: string;
  createdAt: string;
  userId: string;
}
export interface SightFormData {
  photo: string;
  sight: string;
}
