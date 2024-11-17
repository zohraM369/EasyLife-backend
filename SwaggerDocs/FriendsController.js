/**
 * @swagger
 * /friends/send_friend_request:
 *   post:
 *     summary: Send a friend request to another user.
 *     tags: [Friends]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fromUserId:
 *                 type: string
 *                 description: ID of the user sending the request.
 *               toUserId:
 *                 type: string
 *                 description: ID of the user receiving the request.
 *     responses:
 *       200:
 *         description: Friend request sent successfully.
 *       400:
 *         description: Bad request.
 */

/**
 * @swagger
 * /friends/get_friends_requests/{userId}:
 *   get:
 *     summary: Get all friend requests for a specific user.
 *     tags: [Friends]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user to get the friend requests.
 *     responses:
 *       200:
 *         description: List of friend requests.
 *       404:
 *         description: User not found.
 */

/**
 * @swagger
 * /friends/get_friends_list/{userId}:
 *   get:
 *     summary: Get a list of friends for a specific user.
 *     tags: [Friends]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user to get the friends list.
 *     responses:
 *       200:
 *         description: List of friends.
 *       404:
 *         description: User not found.
 */

/**
 * @swagger
 * /friends/handle_friend_request/accept:
 *   post:
 *     summary: Accept a friend request.
 *     tags: [Friends]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               requestId:
 *                 type: string
 *                 description: ID of the friend request to accept.
 *     responses:
 *       200:
 *         description: Friend request accepted successfully.
 *       404:
 *         description: Request not found.
 */

/**
 * @swagger
 * /friends/delete_friend:
 *   post:
 *     summary: Delete a friend from the friends list.
 *     tags: [Friends]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: ID of the user performing the deletion.
 *               friendId:
 *                 type: string
 *                 description: ID of the friend to be deleted.
 *     responses:
 *       200:
 *         description: Friend deleted successfully.
 *       404:
 *         description: User or friend not found.
 */
