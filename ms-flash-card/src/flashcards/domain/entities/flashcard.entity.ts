export class Flashcard {
  constructor(
    public readonly question: string,
    public readonly answer: string,
    public readonly difficulty: 'basic' | 'intermediate' | 'advanced',
    public readonly tag: string,
  ) {}
}
