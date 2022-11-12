
export interface User {
  id: number
  name: string
  description: string
  email: string
}

export interface TokenUserInfo {
  name: string
  email: string
  picture: string
}

export interface ItemOverview {
  id: number
  name: string
  description: string
  price: number
  publisherName: string
  publishDate: string
}


export interface DiscoverOverview{
  sellerName: string
  id: number
  turnover: number

  name: string
  Num_Item:number
}