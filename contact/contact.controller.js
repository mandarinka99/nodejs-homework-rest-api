const Contact = require("./Contact");
const {
  Types: { ObjectId },
} = require("mongoose");

async function qetContacts(req, res) {
  const owner = req.user._id;
  const contacts = await Contact.find({ owner });
  res.json(contacts);
}

async function getContactById(req, res) {
  try {
    const {
      params: { contactId },
    } = req;
    const owner = req.user._id;
    const findedContact = await Contact.findOne({ _id: contactId, owner });
    if (!findedContact) {
      return res.status(400).send("Not found");
    }
    return res.status(201).send(findedContact);
  } catch (error) {
    res.status(400).send(error);
  }
}

async function addContact(req, res) {
  try {
    const { body, user } = req;

    const contact = await Contact.create({ ...body, owner: user._id });
    return res.status(201).send(contact);
  } catch (error) {
    res.status(400).send(error);
  }
}

async function updateContact(req, res) {
  try {
    const owner = req.user._id;
    const {
      params: { contactId },
    } = req;
    const updatedContact = await Contact.findOneAndUpdate(
      { _id: contactId, owner },
      req.body,
      {
        new: true,
      }
    );
    if (!updatedContact) {
      return res.status(400).send("Not found");
    }
    return res.status(200).send(updatedContact);
  } catch (error) {
    res.status(400).send(error);
  }
}

async function removeContact(req, res) {
  try {
    const {
      params: { contactId },
    } = req;
    const owner = req.user._id;
    const deletedContact = await Contact.findOneAndRemove({
      _id: contactId,
      owner,
    });
    if (!deletedContact) {
      return res.status(400).send("Not found");
    }
    return res.status(201).send({ message: "contact deleted" });
  } catch (error) {
    res.status(400).send(error);
  }
}

async function updateStatusContact(req, res) {
  try {
    const owner = req.user._id;
    const {
      params: { contactId },
    } = req;
    const updatedStatusContact = await Contact.findOneAndUpdate(
      { _id: contactId, owner },
      req.body,
      {
        new: true,
      }
    );
    if (!updatedStatusContact) {
      return res.status(400).send("Not found");
    }
    return res.status(200).send(updatedStatusContact);
  } catch (error) {
    res.status(400).send(error);
  }
}

function validateId(req, res, next) {
  const {
    params: { contactId },
  } = req;

  if (!ObjectId.isValid(contactId)) {
    return res.status(400).send("Your id is not valid");
  }
  next();
}

module.exports = {
  qetContacts,
  getContactById,
  addContact,
  updateContact,
  removeContact,
  validateId,
  updateStatusContact,
};
