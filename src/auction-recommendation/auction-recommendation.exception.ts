export class AuctionRecommendationException extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuctionRecommendationException";
  }
}
