const { Op } = require("sequelize");
const sequelize = require("../config/database");
const Contact = require("../models/Contact");

/**
 * Returns the oldest primary contact.
 */
function getOldestPrimary(contacts) {
  const primaries = contacts.filter(
    (c) => c.linkPrecedence === "primary"
  );

  primaries.sort(
    (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
  );

  return primaries[0];
}

/**
 * Fetch complete contact family
 */
async function getContactFamily(primaryId, transaction) {
  return await Contact.findAll({
    where: {
      [Op.or]: [
        { id: primaryId },
        { linkedId: primaryId }
      ]
    },
    order: [["createdAt", "ASC"]],
    transaction
  });
}

/**
 * Merge all primary contacts into oldest primary
 */
async function mergePrimaryContacts(
  primaryContacts,
  oldestPrimary,
  transaction
) {

  for (const contact of primaryContacts) {

    if (contact.id === oldestPrimary.id) continue;

    await Contact.update(
      {
        linkedId: oldestPrimary.id,
        linkPrecedence: "secondary"
      },
      {
        where: {
          id: contact.id
        },
        transaction
      }
    );

    await Contact.update(
      {
        linkedId: oldestPrimary.id
      },
      {
        where: {
          linkedId: contact.id
        },
        transaction
      }
    );
  }
}

/**
 * Build API response
 */
function buildResponse(primaryId, contacts) {

  const emails = [
    ...new Set(
      contacts
        .map((c) => c.email)
        .filter(Boolean)
    )
  ];

  const phoneNumbers = [
    ...new Set(
      contacts
        .map((c) => c.phoneNumber)
        .filter(Boolean)
    )
  ];

  const secondaryContactIds = contacts
    .filter((c) => c.linkPrecedence === "secondary")
    .map((c) => c.id);

  return {

    contact: {

      primaryContactId: primaryId,

      emails,

      phoneNumbers,

      secondaryContactIds

    }

  };

}

/**
 * Main Identify Function
 */
const identify = async (email, phoneNumber) => {

  const transaction = await sequelize.transaction();

  try {

    if (!email && !phoneNumber) {

      throw new Error(
        "Either email or phoneNumber is required."
      );

    }

    let matchedContacts = await Contact.findAll({

      where: {

        [Op.or]: [
          email ? { email } : null,
          phoneNumber ? { phoneNumber } : null
        ].filter(Boolean)

      },

      order: [["createdAt", "ASC"]],

      transaction

    });

    /**
     * CASE 1
     * Completely New Contact
     */
    if (matchedContacts.length === 0) {

      const primary = await Contact.create(
        {

          email,

          phoneNumber,

          linkPrecedence: "primary"

        },
        {
          transaction
        }
      );

      await transaction.commit();

      return {

        contact: {

          primaryContactId: primary.id,

          emails: primary.email
            ? [primary.email]
            : [],

          phoneNumbers: primary.phoneNumber
            ? [primary.phoneNumber]
            : [],

          secondaryContactIds: []

        }

      };

    }

    // Continue in Part 2...
        /*
     * Find every related contact
     */

    const primaryIds = new Set();

    matchedContacts.forEach((contact) => {

      if (contact.linkPrecedence === "primary") {

        primaryIds.add(contact.id);

      } else {

        primaryIds.add(contact.linkedId);

      }

    });

    let allContacts = await Contact.findAll({

      where: {

        [Op.or]: [

          {
            id: [...primaryIds]
          },

          {
            linkedId: [...primaryIds]
          }

        ]

      },

      order: [["createdAt", "ASC"]],

      transaction

    });

    /*
     * Get all primary contacts
     */

    const primaryContacts = allContacts.filter(

      (contact) => contact.linkPrecedence === "primary"

    );

    /*
     * Oldest primary wins
     */

    const oldestPrimary = getOldestPrimary(allContacts);

    /*
     * Merge multiple primaries
     */

    if (primaryContacts.length > 1) {

      await mergePrimaryContacts(

        primaryContacts,

        oldestPrimary,

        transaction

      );

      allContacts = await getContactFamily(

        oldestPrimary.id,

        transaction

      );

    }

    /*
     * Check whether incoming information already exists
     */

    const emailExists = allContacts.some(

      (contact) => contact.email === email

    );

    const phoneExists = allContacts.some(

      (contact) => contact.phoneNumber === phoneNumber

    );

    /*
     * Create secondary only if new information is introduced
     */

    if (!emailExists || !phoneExists) {

      const duplicate = allContacts.find(

        (contact) =>

          contact.email === email &&

          contact.phoneNumber === phoneNumber

      );

      if (!duplicate) {

        await Contact.create(

          {

            email,

            phoneNumber,

            linkedId: oldestPrimary.id,

            linkPrecedence: "secondary"

          },

          {

            transaction

          }

        );

      }

      allContacts = await getContactFamily(

        oldestPrimary.id,

        transaction

      );

    }

    /*
     * Return consolidated response
     */

    const response = buildResponse(

      oldestPrimary.id,

      allContacts

    );

    await transaction.commit();

    return response;
  } catch (error) {

    await transaction.rollback();

    console.error("Identify Service Error:", error);

    throw error;

  }

};

module.exports = {
  identify
};