/**
 * @swagger
 * /create_message:
 *  post:
 *      summary: Create a new Message
 *      description : Create a new Message with the provided details
 *      tags:
 *          - Message
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Message'
 *      responses:
 *          201:
 *              description: Message created successfully.
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Message'
 *          403:
 *              description: Not Authorized
 *          404:
 *              $ref: '#/components/responses/NotFound'
 *          405:
 *              $ref: '#/components/responses/ValidationError'
 *          500:
 *              description: Internal server error
 */


/**
 * @swagger
 * /get_user_messages/{userId}:
 *   get:
 *     summary: Get user_messages by User_ID
 *     description: Get user_messages by User_ID.
 *     tags:
 *       - Message
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Get user_messages by User_ID
 *     responses:
 *       200:
 *         description: A Message object.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Message'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       405:
 *         $ref: '#/components/responses/ValidationError'
 *       500:
 *         description: Internal server error.
 */

/**
 *
 * @swagger
 * /delete_message/{ID}:
 *  delete:
 *      summary: Delete one Message
 *      description : delete one Message by using ID
 *      security:
 *          - bearerAuth: []
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *            required: true
 *            description: Object ID of the Message to delete
 *      tags:
 *          - Message
 *      responses:
 *          200:
 *              description: Message deleted successfully.
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref : '#/components/schemas/Message'
 *          403:
 *              description: Not Authorized
 *          404:
 *              $ref: '#/components/responses/NotFound'
 *          405:
 *              $ref: '#/components/responses/ValidationError'
 *          500:
 *              description : Internal server error
 */
