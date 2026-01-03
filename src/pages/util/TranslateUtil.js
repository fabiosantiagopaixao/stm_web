const country = localStorage.getItem("stm_country") ?? "BO";

const TRANSLATIONS = {
  BO: {
    Female: "Mujer",
    Male: "Hombre",
    ADULT: "Adulto",
    HOUSE_TO_HOUSE: "Casa en casa",
    PHONE: "Teléfono",
    CHILD: "Niño",
    YOUNG: "Joven",
    SENIOR: "Anciano",
    BIBLE_COURSE: "Curso Bíblico",
    PHONE_VISIT: "Visita Telefónica",
    VISIT: "Visita",
    VALID: "Válido",
    DRAFT: "Pendiente",
    VALIDATE: "Validar",
    INVALID: "Inválido",
    NAME: "Nombre",
    ERROR_SAVE_USER: "¡Se produjo un error al guardar el usuario!",
    USER_SAVE_SUCESSFULLY: "¡Usuario guardado exitosamente!",
  },

  BR: {
    Female: "Feminino",
    Male: "Masculino",
    ADULT: "Adulto",
    HOUSE_TO_HOUSE: "Casa em casa",
    PHONE: "Telefone",
    CHILD: "Criança",
    YOUNG: "Joven",
    SENIOR: "Idoso",
    BIBLE_COURSE: "Estudo",
    PHONE_VISIT: "Visita por Telefone",
    VISIT: "Visita",
    VALID: "Válido",
    DRAFT: "Pendente",
    VALIDATE: "Validar",
    INVALID: "Inválido",
    NAME: "Nome",
    ERROR_SAVE_USER: "Ocorreu um erro ao salvar usuário!",
    USER_SAVE_SUCESSFULLY: "Usuário salvo com sucesso!",
  },
};

export function translate(key) {
  return TRANSLATIONS[country]?.[key] ?? key ?? "ERROR";
}
