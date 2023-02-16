import { CardInfo } from './types';
/* Generates a deck of cards to play Uno.
   There are 108 cards in a deck, each card has its own serial number from 0 to 107.
    - cards of 4 colors: blue, yellow, red, green
      with numbers from "0" to "9" (2 cards from "1" to "9" for each color and 1 card "0". Total - 76 cards) ;
    - cards with actions (2 for each color): "Take two", "Move back", "Skip the move" (24 cards in total);
    - action cards (wild cards): "Choose a color", "Choose a color and take 4" (total - 8 cards); */
class CardDeck {
  private readonly deck: number[];

  private usersCards: number[];

  private discardedCards: number[];

  public static readonly colors:string[] = ['blue', 'green', 'red', 'yellow', 'black'];

  constructor() {
    this.deck = [...Array(108).keys()].map(i => i++);
    this.usersCards = [];
    this.discardedCards = [];
    this.shuffleDeck();
  }

  /* Shuffles a deck of cards */
  shuffleDeck(): void {
    this.deck.sort(() => Math.random() - 0.5).sort(() => Math.random() - 0.5);
  }

  /* returns an array with card numbers. If the deck runs out of cards,
  then he takes the cards and the discarded array, adds them to the
  deck and shuffles them. The discarded cards are left with 1 top card. */
  getCards(quantity = 1): number[] {
    if (this.deck.length === 0 && this.discardedCards.length !== 0) {
      return [];
    }
    const returnedCardArray: number[] = [];
    for (let i = 0; i < quantity; i++) {
      if (this.deck.length > 0) {
        returnedCardArray.push(this.deck.pop() as number);
      } else {
        if (this.discardedCards.length > 0) {
          const topCard = this.discardedCards.pop();
          this.deck.push(...this.discardedCards);
          this.discardedCards = [topCard as number];
          this.shuffleDeck();
        } else {
          console.log('No more cards!');
          break;
        }
      }
    }
    this.usersCards.push(...returnedCardArray);
    return returnedCardArray;
  }

  /* Places a card in the discard pile */
  discardCard(cardId: number): void {
    this.usersCards.splice(this.usersCards.indexOf(cardId), 1);
    this.discardedCards.push(cardId);
  }

  /* Returns the color and value of the card */
  static getColorAndValue(cardId: number): CardInfo {
    const cardInfo: CardInfo = { id: cardId, color: CardDeck.colors[Math.floor(cardId / 25)], value: 0 };
    if (cardId < 100) {
      if (cardId % 25 < 19) {
        cardInfo.value = cardId % 25 < 10 ? cardId % 25 : ((cardId % 25) % 10) + 1;
      } else {
        cardInfo.value = cardId % 25 < 21 ? 10 : cardId % 25 < 23 ? 11 : 12;
      }
    } else {
      cardInfo.value = cardId < 104 ? 13 : 14;
    }
    return cardInfo;
  }

  /* Checks if there are cards to issue
  * 'true' if there are cards,
  * 'false' if there are no cards */
  isNoMoreCards(): boolean {
    return this.discardedCards.length > 0 || this.deck.length > 0;
  }
}

export default CardDeck;
