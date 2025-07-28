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



// import { Router } from "express";
// import {
//   getAllItemsAndConservationLimited,
//   getConservationStatus,
//   getItemByCodePat,
//   getItemByCodePatAndConservation,
//   getItemsQtyByWorker,
//   getItemsQtyByDependece
// } from "../controllers/getItems.controller.js";

// import {
//   searchGeneral,
//   searchItemsByWorker,
//   searchItemsByDependece,
//   searchItemByPartialWorker,
//   searchItemByPartialDependency
// } from "../controllers/searchItems.controller.js";

// import {
//   addItem,
//   addObservation,
//   getItemByCodePatAndUpdate,
//   updateItem,
//   insertExcelData
// } from "../controllers/handlerItems.controller.js";

// import { authenticateToken } from "../middleware/tokenJWT.js";

// const router = Router();

// /**
//  * @openapi
//  * tags:
//  *   - name: Items
//  *     description: Operations on inventory items
//  */

// /**
//  * @openapi
//  * /items:
//  *   get:
//  *     summary: List all items (limited) with conservation state
//  *     tags:
//  *       - Items
//  *     responses:
//  *       200:
//  *         description: Array of items with conservation status
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: array
//  *               items:
//  *                 $ref: '#/components/schemas/Item'
//  */
// router.get("/", getAllItemsAndConservationLimited);

// /**
//  * @openapi
//  * /items/search:
//  *   get:
//  *     summary: General search across all items
//  *     tags:
//  *       - Items
//  *     parameters:
//  *       - in: query
//  *         name: q
//  *         schema:
//  *           type: string
//  *         required: true
//  *         description: Text to match against item fields
//  *     responses:
//  *       200:
//  *         description: Matching items
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: array
//  *               items:
//  *                 $ref: '#/components/schemas/Item'
//  */
// router.get("/search", searchGeneral);

// /**
//  * @openapi
//  * /items/partial/worker:
//  *   get:
//  *     summary: Search workers by partial match
//  *     tags:
//  *       - Items
//  *     parameters:
//  *       - in: query
//  *         name: q
//  *         schema:
//  *           type: string
//  *         required: true
//  *         description: Partial worker name or ID
//  *     responses:
//  *       200:
//  *         description: Worker suggestions
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: array
//  *               items:
//  *                 type: object
//  *                 properties:
//  *                   workerId:
//  *                     type: string
//  *                   name:
//  *                     type: string
//  */
// router.get("/partial/worker", searchItemByPartialWorker);

// /**
//  * @openapi
//  * /items/partial/dependency:
//  *   get:
//  *     summary: Search dependencies by partial match
//  *     tags:
//  *       - Items
//  *     parameters:
//  *       - in: query
//  *         name: q
//  *         schema:
//  *           type: string
//  *         required: true
//  *         description: Partial dependency name or code
//  *     responses:
//  *       200:
//  *         description: Dependency suggestions
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: array
//  *               items:
//  *                 type: object
//  *                 properties:
//  *                   dependencyId:
//  *                     type: string
//  *                   name:
//  *                     type: string
//  */
// router.get("/partial/dependency", searchItemByPartialDependency);

// /**
//  * @openapi
//  * /items/worker:
//  *   get:
//  *     summary: Get all items assigned to a worker
//  *     tags:
//  *       - Items
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - in: query
//  *         name: workerId
//  *         schema:
//  *           type: string
//  *         required: true
//  *         description: Worker identifier
//  *     responses:
//  *       200:
//  *         description: Items for specified worker
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: array
//  *               items:
//  *                 $ref: '#/components/schemas/Item'
//  */
// router.get("/worker", authenticateToken, searchItemsByWorker);

// /**
//  * @openapi
//  * /items/dependency:
//  *   get:
//  *     summary: Get all items in a dependency
//  *     tags:
//  *       - Items
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - in: query
//  *         name: dependencyId
//  *         schema:
//  *           type: string
//  *         required: true
//  *         description: Dependency identifier
//  *     responses:
//  *       200:
//  *         description: Items for specified dependency
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: array
//  *               items:
//  *                 $ref: '#/components/schemas/Item'
//  */
// router.get("/dependency", authenticateToken, searchItemsByDependece);

// /**
//  * @openapi
//  * /items/conservation:
//  *   get:
//  *     summary: List all possible conservation statuses
//  *     tags:
//  *       - Items
//  *     responses:
//  *       200:
//  *         description: Available conservation statuses
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: array
//  *               items:
//  *                 type: string
//  *                 example: Bueno
//  */
// router.get("/conservation", getConservationStatus);

// /**
//  * @openapi
//  * /items/{id}:
//  *   get:
//  *     summary: Get an item by its patrimonial code and mark as registered
//  *     tags:
//  *       - Items
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         schema:
//  *           type: string
//  *         required: true
//  *         description: Patrimonial code of the item
//  *     responses:
//  *       200:
//  *         description: Updated item record
//  *         content:
//  *           application/json:
//  *             schema:
//  *               $ref: '#/components/schemas/Item'
//  */
// router.get("/:id", authenticateToken, getItemByCodePatAndUpdate);

// /**
//  * @openapi
//  * /items/status/{id}:
//  *   get:
//  *     summary: Get item by patrimonial code
//  *     tags:
//  *       - Items
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         schema:
//  *           type: string
//  *         required: true
//  *         description: Patrimonial code of the item
//  *     responses:
//  *       200:
//  *         description: Item details
//  *         content:
//  *           application/json:
//  *             schema:
//  *               $ref: '#/components/schemas/Item'
//  */
// router.get("/status/:id", getItemByCodePat);

// /**
//  * @openapi
//  * /items/conservation/{id}:
//  *   get:
//  *     summary: Get item with its conservation status by patrimonial code
//  *     tags:
//  *       - Items
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         schema:
//  *           type: string
//  *         required: true
//  *         description: Patrimonial code of the item
//  *     responses:
//  *       200:
//  *         description: Item with conservation data
//  *         content:
//  *           application/json:
//  *             schema:
//  *               $ref: '#/components/schemas/ItemConservation'
//  */
// router.get("/conservation/:id", getItemByCodePatAndConservation);

// /**
//  * @openapi
//  * /items/worker/qty:
//  *   get:
//  *     summary: Get count of items per worker
//  *     tags:
//  *       - Items
//  *     responses:
//  *       200:
//  *         description: Worker item counts
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: array
//  *               items:
//  *                 type: object
//  *                 properties:
//  *                   workerId:
//  *                     type: string
//  *                   count:
//  *                     type: integer
//  */
// router.get("/worker/qty", getItemsQtyByWorker);

// /**
//  * @openapi
//  * /items/dependency/qty:
//  *   get:
//  *     summary: Get count of items per dependency
//  *     tags:
//  *       - Items
//  *     responses:
//  *       200:
//  *         description: Dependency item counts
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: array
//  *               items:
//  *                 type: object
//  *                 properties:
//  *                   dependencyId:
//  *                     type: string
//  *                   count:
//  *                     type: integer
//  */
// router.get("/dependency/qty", getItemsQtyByDependece);

// /**
//  * @openapi
//  * /items/edit/{id}:
//  *   put:
//  *     summary: Update an existing item
//  *     tags:
//  *       - Items
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         schema:
//  *           type: string
//  *         required: true
//  *         description: Patrimonial code of item to update
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             $ref: '#/components/schemas/ItemUpdate'
//  *     responses:
//  *       200:
//  *         description: Updated item
//  *         content:
//  *           application/json:
//  *             schema:
//  *               $ref: '#/components/schemas/Item'
//  */
// router.put("/edit/:id", authenticateToken, updateItem);

// /**
//  * @openapi
//  * /items/observation/{id}:
//  *   put:
//  *     summary: Add or remove an observation on an item
//  *     tags:
//  *       - Items
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         schema:
//  *           type: string
//  *         required: true
//  *         description: Patrimonial code of item
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               observation:
//  *                 type: string
//  *                 description: New observation text
//  *     responses:
//  *       200:
//  *         description: Item with updated observations
//  *         content:
//  *           application/json:
//  *             schema:
//  *               $ref: '#/components/schemas/Item'
//  */
// router.put("/observation/:id", addObservation);

// /**
//  * @openapi
//  * /items/imported:
//  *   post:
//  *     summary: Bulk import items from Excel
//  *     tags:
//  *       - Items
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         multipart/form-data:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               file:
//  *                 type: string
//  *                 format: binary
//  *                 description: Excel file to import
//  *     responses:
//  *       201:
//  *         description: Import results
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 inserted:
//  *                   type: integer
//  *                 errors:
//  *                   type: array
//  *                   items:
//  *                     type: string
//  */
// router.post("/imported", insertExcelData);

// /**
//  * @openapi
//  * /items/add:
//  *   post:
//  *     summary: Create a new inventory item
//  *     tags:
//  *       - Items
//  *     security:
//  *       - bearerAuth: []
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             $ref: '#/components/schemas/NewItem'
//  *     responses:
//  *       201:
//  *         description: Newly created item
//  *         content:
//  *           application/json:
//  *             schema:
//  *               $ref: '#/components/schemas/Item'
//  */
// router.post("/add", authenticateToken, addItem);

// export default router;
