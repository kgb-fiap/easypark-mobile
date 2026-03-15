export interface NominatimAddress {
    road?: string;
    house_number?: string;
    suburb?: string;
    city?: string;
    county?: string;
    state?: string;
    postcode?: string;
}

export interface NominatimResult {
    place_id: string;
    display_name: string;
    lat: string;
    lon: string;
    address: NominatimAddress;
}

export interface RecentSearchItem {
    id: string;
    line1: string;
    line2: string;
}

export type SearchListItem = RecentSearchItem | NominatimResult;