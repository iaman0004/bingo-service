export const generateRoomId = (rooms: Map<string, Set<string>>) => {
  const codes: Array<number> = [];
  let flag: boolean = true;
  while (flag) {
    for (let i = 0; i<8; i++) {
      const flag = Math.floor(Math.random()%10);
      if (flag%2 === 0) {
        const char = Math.floor(Math.random()*(90 - 65 + 1)) + 65;
        codes.push(char);
      }
      else {
        const num = Math.floor(Math.random()*(57 - 48 + 1)) + 48;
        codes.push(num);
      }
    }
    const roomId = String.fromCharCode(...codes);
    if (!rooms.has(roomId)) {
      flag = false;
    }
  }
  return String.fromCharCode(...codes);
};