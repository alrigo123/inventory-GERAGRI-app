import { Router } from "express";

import {
  getItemsGeneralState,
  getItemsStateTrue,
  getItemsStateFalse,
  getItemsGeneralDisposition,
  getItemsDispositionTrue,
  getItemsDispositionFalse,
  getAllItemsToExport
} from "../controllers/exportReports.controller.js";

const router = Router();

//EXPORT DATA TO EXCEL
/* Module "ExportReportStateMod", to export in excel REGISTRADOS/NO REGISTRADOS */
router.get("/state", getItemsGeneralState); // General report
router.get("/state/true", getItemsStateTrue); // REGISTRADOS
router.get("/state/false", getItemsStateFalse); // NO REGISTRADOS

/* Module "ExportReportsDispoMod", to export specific in base of his state ACTIVO/DE BAJA */
router.get("/disposition", getItemsGeneralDisposition); // General Disposition
router.get("/disposition/true", getItemsDispositionTrue); // ACTIVOS
router.get("/disposition/false", getItemsDispositionFalse); // DE BAJA

/* Module "ExportReportsMod", to make a general export of all items */
router.get('/general',getAllItemsToExport)

export default router;
