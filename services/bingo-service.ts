/**
 * Gets the next player turn
 * 
 * @param players [socket_ids]
 * @returns 
 */
export const defineNextTurn = (players: Array<string>) => {
  const willplay = players[0];
  return {
    willplay,
    players: [...players.filter(p => p !== willplay), willplay]
  }
}