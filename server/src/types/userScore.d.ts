type GameCategory = 'Tetris' | 'Pacman' | 'Skate'

type userScore = {
    username: string,
    score: number,
    game: GameCategory
}

export default userScore