import { roll } from "../utils/dice.js";

export function calcularTreino() {
  const resultado = roll(500);

  let nota = "F";
  let pontos = 0;

  if (resultado >= 100 && resultado <= 179) { nota = "D"; pontos = 3; }
  else if (resultado <= 269) { nota = "C"; pontos = 7; }
  else if (resultado <= 379) { nota = "B"; pontos = 12; }
  else if (resultado <= 500) { nota = "A"; pontos = 18; }

  return { resultado, nota, pontos };
}
