import { Router } from "express";
import {
  getAllItemsAndConservationLimited,
  getConservationStatus,
  getItemByCodePat,
  getItemByCodePatAndConservation,
  getItemsQtyByWorker,
  getItemsQtyByDependece
} from "../controllers/getItems.controller.js";

import {
  searchGeneral,
  searchItemsByWorker,
  searchItemsByDependece,
  searchItemByPartialWorker,
  searchItemByPartialDependency
} from "../controllers/searchItems.controller.js";

import {
  addItem,
  addObservation,
  getItemByCodePatAndUpdate,
  updateItem,
  insertExcelData
} from "../controllers/handlerItems.controller.js";

import { authenticateToken} from "../middleware/tokenJWT.js";

const router = Router();

//GET REQUEST
router.get("/", getAllItemsAndConservationLimited); // Component "ShowItemsComp" , to get all features including conservation state
router.get("/search", searchGeneral); // Component "GeneralSearchComp", to search item that matches the query input
router.get("/partial/worker", searchItemByPartialWorker); // Module "CodeSearchMod1", search and show results of workers which is similar to the search input
router.get("/partial/dependency", searchItemByPartialDependency); // Module "CodeSearchMod1", search and show results of dependencies which is similar to the search input

router.get("/worker", authenticateToken, searchItemsByWorker); // Module "WorkerSearchMod1", to get info of all items from a single Worker by his data
router.get("/dependency", authenticateToken, searchItemsByDependece); // Module "DependencySearchMod1", to get info of all items from a single dependency by his data

router.get("/conservation", getConservationStatus); // Components "ADD-EDIT" to Get conservation state (Bueno,malo,regular)

router.get("/:id", authenticateToken, getItemByCodePatAndUpdate); // Module "CodeSearchMod1", * gets information from item by their CODIGO_PATRIMONIAL ~ if find then update the status to REGISTRADO

router.get("/status/:id", getItemByCodePat); // FE Service "item.service", to get items by their CODIGO_PATRIMONIAL (standar query *)
router.get("/conservation/:id", getItemByCodePatAndConservation); // Module "CodeSearchMod2", to get all data from a single item by their CODIGO_PATRIMONIAL

//GET QTY ITEMS REQUEST
router.get("/worker/qty", getItemsQtyByWorker); // Module "WorkerSearchMod2", to get qty of items by worker data
router.get("/dependency/qty", getItemsQtyByDependece); // Module "DependencySearchMod2", to get qty of items by dependency data

//PUT REQUEST
router.put("/edit/:id", authenticateToken, updateItem); // Component "EditItem" to update values from a single item by their CODIGO_PATRIMONIAL
router.put('/observation/:id', addObservation) /* Method to edit some observation (add or remove text) from a single item by their CODIGO_PATRIMONIAL */


//POST REQUEST
router.post("/imported", insertExcelData); // Component "GridTest" to send excel data to DB
router.post("/add", authenticateToken, addItem); //Component "AddItem" to send new data to DB

export default router;
