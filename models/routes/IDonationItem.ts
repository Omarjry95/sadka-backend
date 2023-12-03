interface IDonationItem {
  _id: string,
  originalAmount: number,
  association: string,
  note?: string,
  success: boolean
}

export default IDonationItem;