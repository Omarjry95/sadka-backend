interface IDonationItem {
  _id: string,
  user: string,
  amount: number,
  productAmount?: number,
  rounding?: string,
  association: string,
  store?: string,
  note?: string,
  success: boolean
}

export default IDonationItem;