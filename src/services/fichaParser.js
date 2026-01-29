export function extrairAtributo(ficha, bloco, atributo) {
  // Busca o bloco completo de forma não-gulosa até o próximo bloco ou fim da ficha
  const blocoRegex = new RegExp(`\\*\\*${bloco}[\\s\\S]*?(?=\\*\\*|$)`, "i");
  const blocoMatch = ficha.match(blocoRegex);
  if (!blocoMatch) return 50; // fallback

  // Busca o atributo dentro do bloco
  const attrRegex = new RegExp(`${atributo}:\\s*(\\d+)`, "i");
  const attrMatch = blocoMatch[0].match(attrRegex);

  return attrMatch ? parseInt(attrMatch[1]) : 50;
}

export function possuiPlaystyle(ficha, nome) {
  // Faz match exato do playstyle, ignorando case
  const regex = new RegExp(`\\b${nome}\\b`, "i");
  return regex.test(ficha);
}
