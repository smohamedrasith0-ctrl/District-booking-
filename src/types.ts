export interface TicketData {
  movieTitle: string;
  language: string;
  format: string;
  certification: string;
  qrPayload: string;
  dateTimeText: string;
  startDate: string; // ISO
  endDate: string;
  screenName: string;
  ticketCount: number;
  seatInfo: string;
  theaterName: string;
  theaterAddress: string;
  mapsUrl: string;
  bookingCode: string;
  bookingId: string;
  orderId: string;
  totalBill: number;
  currency: string;
  billBreakdown: {
    baseTicketPrice: number;
    convenienceFee: number;
    cgst: number;
    sgst: number;
    discount?: number;
    paymentMethod: string;
    transactionId: string;
  };
}
