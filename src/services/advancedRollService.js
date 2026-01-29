import { rolarD20 } from "./rollService.js";

export function rolarComAtributo(baseAtributo, bonusPlaystyle = 0) {
  const base = rolarD20().valor;
  const modificador = Math.floor(baseAtributo / 10);
  let total = base + modificador + bonusPlaystyle;

  if (total > 20) total = 20;

  let resultado = "Falha";
  if (total >= 10 && total <= 15) resultado = "Médio";
  if (total >= 16) resultado = "Sucesso Total";

  return { base, total, resultado };
}
