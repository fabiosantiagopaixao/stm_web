import { translate } from "../../util/TranslateUtil.js";

export function territoryTypeToLabel(type) {
  const map = {
    HOUSE_TO_HOUSE: translate("HOUSE_TO_HOUSE"),
    PHONE: translate("PHONE"),
  };
  return map[type] || type;
}
