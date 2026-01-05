import { loadAssignmentsBase } from "./base/assignments-base.js";

export function loadMyAssignments() {
  loadAssignmentsBase({
    pageType: "MY_ASSIGNMENTS",
  });
}
