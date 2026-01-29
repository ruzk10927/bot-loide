import { roll } from "../utils/dice.js";

export function calcularTreino() {
  const resultado = roll(500);

  let nota = "F";
  let pontos = 0;

  if (resultado >= 1 && resultado <= 99) {
    nota = "F";
    pontos = 0;
  } else if (resultado >= 100 && resultado <= 179) {
    nota = "D";
    pontos = 3;
  } else if (resultado >= 180 && resultado <= 269) {
    nota = "C";
    pontos = 7;
  } else if (resultado >= 270 && resultado <= 379) {
    nota = "B";
    pontos = 12;
  } else if (resultado >= 380 && resultado <= 500) {
    nota = "A";
    pontos = 18;
  }

  return { resultado, nota, pontos };
}
