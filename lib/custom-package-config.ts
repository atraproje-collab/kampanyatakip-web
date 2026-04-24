// Thin re-export shim — canonical source moved to lib/packages-data.ts.
// Kept so legacy imports (`@/lib/custom-package-config`) don't break.
export {
  CUSTOM_BASE as _CUSTOM_BASE,
  CUSTOM_MODULES as _CUSTOM_MODULES,
  calculateTotal,
  getSelectedModules,
  type CustomBase as BaseConfig,
  type CustomModule as ModuleOption,
  type ModuleType,
  type Selection,
} from "@/lib/packages-data";

import {
  CUSTOM_BASE,
  CUSTOM_MODULES,
  type CustomBase,
  type CustomModule,
} from "@/lib/packages-data";

/** @deprecated Import { CUSTOM_BASE, CUSTOM_MODULES } from "@/lib/packages-data" instead. */
export const customPackageConfig: {
  base: CustomBase;
  modules: CustomModule[];
} = {
  base: CUSTOM_BASE,
  modules: CUSTOM_MODULES,
};
