import mongoose from "mongoose";

const AttributeSchema = new mongoose.Schema({
  value: { type: Number, default: 0 }
});

const PlayerSchema = new mongoose.Schema({
  discordId: { type: String, unique: true },

  info: {
    nome: String,
    idade: Number,
    altura: Number,
    pernaBoa: String,
    posicao: String,
    nacionalidade: String
  },

  atributos: {
    ritmo: {
      aceleracao: AttributeSchema,
      sprint: AttributeSchema
    },
    finalizacao: {
      posicionamento: AttributeSchema,
      finalizacao: AttributeSchema,
      potencia: AttributeSchema,
      chutesLonge: AttributeSchema,
      voleios: AttributeSchema,
      penaltis: AttributeSchema
    },
    passe: {
      visao: AttributeSchema,
      cruzamento: AttributeSchema,
      falta: AttributeSchema,
      curto: AttributeSchema,
      longo: AttributeSchema,
      curva: AttributeSchema
    },
    drible: {
      agilidade: AttributeSchema,
      equilibrio: AttributeSchema,
      reacoes: AttributeSchema,
      controle: AttributeSchema,
      dribles: AttributeSchema,
      compostura: AttributeSchema
    },
    defesa: {
      interceptacoes: AttributeSchema,
      cabeca: AttributeSchema,
      consciencia: AttributeSchema,
      dividida: AttributeSchema,
      carrinho: AttributeSchema
    },
    fisico: {
      impulsao: AttributeSchema,
      folego: AttributeSchema,
      forca: AttributeSchema,
      agressividade: AttributeSchema
    }
  },

  pontos: {
    livres: { type: Number, default: 0 },
    acumulados: { type: Number, default: 0 }
  },

  playstyles: [String],

  banco: {
    BRL: { type: Number, default: 0 },
    EUR: { type: Number, default: 0 },
    GBP: { type: Number, default: 0 }
  },

  treinosSemana: { type: Number, default: 0 }
});

export default mongoose.model("Player", PlayerSchema);
