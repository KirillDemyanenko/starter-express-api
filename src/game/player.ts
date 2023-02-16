import CardDeck from './сard_deck';
import { CardInfo } from './types';

class Player {
  public playersName: string;

  private readonly cardsInHand: number[];

  constructor(name: string) {
    this.playersName = name;
    this.cardsInHand = [];
  }

  clearDeck(): void {
    this.cardsInHand.length = 0;
  }

  takeCards(cards: number[]): void {
    this.cardsInHand.push(...cards);
  }

  getNumberOfCardsInHand(): number {
    return this.cardsInHand.length;
  }

  getYourCards(): number[] {
    return this.cardsInHand;
  }

  selectPossibleOptionsForMove(topCardId: number, currentColor?: string): boolean {
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
    return optionsOfMove.length > 0;
  }

  getMove(cardId: number): number {
    this.cardsInHand.splice(this.cardsInHand.indexOf(cardId), 1);
    return cardId;
  }
}

export default Player;
