/* A class that controls the behavior of the computer player */
import CardDeck from './сard_deck';
import { CardInfo } from './types';

class ComputerPlayer {
  public readonly playersName: string;

  private readonly cardsInHand: number[];

  constructor(name: string) {
    this.playersName = name;
    this.cardsInHand = [];
  }

  /* Chooses possible moves depending on the card lying on the table and the available cards */
  selectPossibleOptionsForMove(topCardId: number, currentColor?: string): number[] {
    const topCardInfo = CardDeck.getColorAndValue(topCardId);
    const optionsOfMove: number[] = [];
    for (let i = 0; i < this.cardsInHand.length; i++) {
      const cardInfo : CardInfo = CardDeck.getColorAndValue(this.cardsInHand[i]);
      if (topCardInfo.color === CardDeck.colors[4]) {
        if (cardInfo.color === currentColor || cardInfo.color === CardDeck.colors[4]) {
          optionsOfMove.push(this.cardsInHand[i]);
        }
      } else if (cardInfo.color === topCardInfo.color || cardInfo.value === topCardInfo.value || cardInfo.color === CardDeck.colors[4]) {
        optionsOfMove.push(this.cardsInHand[i]);
      }
    }
    return optionsOfMove;
  }

  /* Choose color */
  chooseColor(): string {
    const colorArr = ['blue', 'green', 'red', 'yellow'].sort(() => Math.random() - 0.5);
    return colorArr[0];
  }

  /* Adds cards to hand */
  takeCards(cards: number[]): void {
    this.cardsInHand.push(...cards);
  }

  /* Returns the number of cards in hand */
  getNumberOfCardsInHand(): number {
    return this.cardsInHand.length;
  }

  /* returns all player cards */
  getYourCards(): number[] {
    return this.cardsInHand;
  }

  clearDeck(): void {
    this.cardsInHand.length = 0;
  }

  /* Makes the first move */
  getFirstMove(): number {
    let randomCard: number = this.cardsInHand[Math.floor(Math.random() * this.cardsInHand.length)];
    while (CardDeck.getColorAndValue(randomCard).value > 9) {
      randomCard = this.cardsInHand[Math.floor(Math.random() * this.cardsInHand.length)];
    }
    this.cardsInHand.splice(this.cardsInHand.indexOf(randomCard), 1);
    return randomCard;
  }

  /* Makes a move on one of the possible options
  * returns 999 if there are no more cards to draw and the computer has no options  */
  getMove(deck: CardDeck, topCardId: number, currentColor?: string): number {
    const options: number[] = this.selectPossibleOptionsForMove(topCardId, currentColor);
    if (options.length > 0) {
      const randomCard: number = options[Math.floor(Math.random() * options.length)];
      this.cardsInHand.splice(this.cardsInHand.indexOf(randomCard), 1);
      return randomCard;
    } else {
      return 999;
    }
  }
}

export default ComputerPlayer;
