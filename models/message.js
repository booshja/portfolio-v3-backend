const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");

/** Message Model */
class Message {
  /**
   * Create a message, update db, return new message data
   * @static
   * @async
   * @function create
   * @memberof Message
   * @param {Object} message - The message object.
   * @param {String} message.name - The message sender's name.
   * @param {String} message.email - The message sender's email.
   * @param {String} message.message - The body of the message.
   *
   * @returns {Object} New Message data in an object: { name, email, message, received, is_archived }
   *
   * @throws {BadRequestError} Throws error if no data passed to function
   * @throws {BadRequestError} Throws error if missing data.
   */
  static async create(data) {
    // check for missing/incomplete data
    if (!data) throw new BadRequestError("No data.");
    if (!data.name || !data.email || !data.message)
      throw new BadRequestError("Missing data.");

    const result = await db.query(
      `INSERT INTO messages (name,
                              email,
                              message)
        VALUES ($1, $2, $3)
        RETURNING id,
                    name,
                    message,
                    received,
                    is_archived AS "isArchived`,
      [data.name, data.email, data.message]
    );
    const message = result.rows[0];

    return message;
  }

  /**
   * Get an array of all messages.
   *
   * @static
   * @async
   * @function getAll
   * @memberof Message
   *
   * @yields {Array} An array of message objects: [{ name, email, message, received, is_archived }, ...]
   */
  static async getAll() {
    const result = await db.query(
      `SELECT id,
              name,
              email,
              message,
              received,
              is_archived AS "isArchived"
        FROM messages`
    );

    return result.rows;
  }

  /**
   * Archive/Unarchive a message by id.
   *
   * @static
   * @async
   * @function archive
   * @memberof Message
   * @param {Number} - Message ID number
   * @param {Boolean} [archive=true] - True will archive the message, false with un-archive the message. Defaults to true.
   *
   * @returns {Object} Message object: { name, email, message, received, is_archived }
   *
   * @throws {BadRequestError} Throws error if no id provided.
   */
  static async toggleArchive(id, archive = true) {
    // check for missing input
    if (!id) throw new BadRequestError("No id provided.");

    const result = await db.query(
      `UPDATE messages
        SET is_archived = $1
        WHERE id = $2
        RETURNING id,
                  name,
                  email,
                  message,
                  received,
                  is_archived AS "isArchived"`,
      [archive, id]
    );
    const message = result.rows[0];

    if (!message) throw new NotFoundError(`No message: ${id}`);

    return message;
  }

  /**
   * Delete a message by id
   *
   * @static
   * @async
   * @function delete
   * @memberof Message
   * @param {Number} - Message ID number
   *
   * @returns {Object} - Response object: { msg: "Deleted." }
   *
   * @throws {BadRequestError} Throws error if no id provided.
   * @throws {NotFoundError} Throws error if record not found by id.
   */
  static async delete(id) {
    // check for missing input
    if (!id) throw new BadRequestError("No input.");

    const result = await db.query(
      `DELETE FROM messages
        WHERE id=$1
        RETURNING id`,
      [id]
    );
    const removed = result.rows[0];

    // no record returned - message not found
    if (!removed) throw new NotFoundError(`No message: ${id}`);

    return { msg: "Deleted." };
  }
}

module.exports = Message;
