import H from "@here/maps-api-for-javascript";

import { GeocodingResult } from "entities";

export const getRouteLink = async (address: string, latitude: number, longitude: number) => {
    const platform = new H.service.Platform({
        apikey: "TAYbIDK8GFikPYepbHQmunHMTJ-Bqcxy__auQNrYtQ0",
    });
    const service = platform.getSearchService();
    service.geocode(
        { q: address },
        (result) => {
            const { lat, lng } = (result as GeocodingResult).items[0].position;

            window.open(
                `https://yandex.ru/maps/?mode=routes&rtext=${latitude},${longitude}~${lat},${lng}`,
                "_blank",
            );
        },
        (error) => {
            throw error;
        },
    );
};
