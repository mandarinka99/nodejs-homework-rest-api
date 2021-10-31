const { Router } = require("express");
const ContactController = require("./contact.controller");
const { validate } = require("../helpers/validate");
const {
  createContactSchema,
  updateContactSchema,
  updateFavoriteSchema,
} = require("./contacts.schema");
const { autorize } = require("../user/auth.middleware");

const router = Router();

router.get("/", autorize, ContactController.qetContacts);
router.get(
  "/:contactId",
  autorize,
  ContactController.validateId,
  ContactController.getContactById
);
router.post(
  "/",
  autorize,
  validate(createContactSchema),
  ContactController.addContact
);
router.put(
  "/:contactId",
  autorize,
  ContactController.validateId,
  validate(updateContactSchema),
  ContactController.updateContact
);
router.delete(
  "/:contactId",
  autorize,
  ContactController.validateId,
  ContactController.removeContact
);
router.patch(
  "/:contactId/favorite",
  autorize,
  ContactController.validateId,
  validate(updateFavoriteSchema),
  ContactController.updateStatusContact
);

module.exports = router;
