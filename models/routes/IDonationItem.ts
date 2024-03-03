interface IDonationItem {
  _id: string,
  user: string,
  originalAmount: number,
  association: string,
  note?: string,
  success: boolean
}

export default IDonationItem;