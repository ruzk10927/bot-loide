export function rolarD20() {
  const valor = Math.floor(Math.random() * 20) + 1;

  let resultado = "Falha";
  if (valor >= 10 && valor <= 15) resultado = "Médio";
  if (valor >= 16) resultado = "Sucesso Total";

  return { valor, resultado };
}
