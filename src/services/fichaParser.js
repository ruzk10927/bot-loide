export function extrairAtributo(ficha, bloco, atributo) {
  const blocoRegex = new RegExp(`\\*\\*${bloco}[\\s\\S]*?\\*\\*`, "i");
  const blocoMatch = ficha.match(blocoRegex);
  if (!blocoMatch) return 50;

  const attrRegex = new RegExp(`${atributo}:\\s*(\\d+)`, "i");
  const attrMatch = blocoMatch[0].match(attrRegex);

  return attrMatch ? parseInt(attrMatch[1]) : 50;
}

export function possuiPlaystyle(ficha, nome) {
  const regex = new RegExp(nome, "i");
  return regex.test(ficha);
}
