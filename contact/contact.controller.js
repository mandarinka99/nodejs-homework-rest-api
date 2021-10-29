const Contact = require("./Contact");
const {
  Types: { ObjectId },
} = require("mongoose");

async function qetContacts(req, res) {
  const contacts = await Contact.aggregate([{
    $lookup: {
    from:
  }}]);
  res.json(contacts);
}

async function getContactById(req, res) {
  try {
    const {
      params: { contactId },
    } = req;
    const owner = req.user._id;
    const query = { contactId, owner };
    const findedContact = await Contact.findOne({ contactId, owner });
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

    const contact = await Contact.create({...body, owner: user._id});
    return res.status(201).send(contact);
  } catch (error) {
    res.status(400).send(error);
  }
}

async function updateContact(req, res) {
  try {
    const {
      params: { contactId },
    } = req;
    const updatedContact = await Contact.findByIdAndUpdate(
      contactId,
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
    const deletedContact = await Contact.findByIdAndDelete(contactId);
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
    const {
      params: { contactId },
    } = req;
    const updatedStatusContact = await Contact.findByIdAndUpdate(
      contactId,
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
