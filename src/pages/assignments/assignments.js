import { loadAssignmentsBase } from "./base/assignments-base.js";

export function loadAssignments() {
  loadAssignmentsBase({
    pageType: "ASSIGNMENTS",
  });
}
