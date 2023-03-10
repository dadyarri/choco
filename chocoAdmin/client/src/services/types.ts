export type Product = {
    id: string
    deleted: boolean
    leftover: number
    name: string
    retailPrice: number
    wholesalePrice: number
    isByWeight: boolean
    marketId: number
    category: ProductCategory
}

export type ProductCategory = {
    id: string
    name: string
    deleted: boolean
}

export type Order = {
    id: string
    date: Date
    status: OrderStatus
    orderItems: OrderItem[]
    address: OrderAddress
    deleted: boolean

}

export type OrderStatus = {
    id: string
    name: string
}

export type OrderItem = {
    id: string
    product: Product
    amount: number
}

export type OrderAddress = {
    id: string
    city: OrderCity
    street: string
    building: string
}

export type OrderCity = {
    id: string
    name: string
}

export type StatBy = {
    name: string,
    value: number
}

export type StatsBy = StatBy[]

export type StatsCompareIncomes = IncomeInfo[]

export type IncomeInfo = {
    index: number
    dateInfo: string,
    total: number
}

export type StatsTopProducts = {
    name: string,
    value: number
}[]

export type Shipment = {
    id: string
    date: Date
    status: ShipmentStatus
    shipmentItems: ShipmentItem[]
    deleted: boolean

}

export type ShipmentStatus = {
    id: string
    name: string
}

export type ShipmentItem = {
    id: string
    product: Product
    amount: number
}

export type GeocodingResult = {
    items: GeocodingItem[]
}

export type GeocodingItem = {
    position: GeocodingPosition
}

export type GeocodingPosition = {
    lat: number,
    lng: number
}