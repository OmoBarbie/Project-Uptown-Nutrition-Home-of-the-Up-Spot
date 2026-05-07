import type * as Party from 'partykit/server'

export default class CartSyncServer implements Party.Server {
  constructor(readonly room: Party.Room) {}

  onConnect(conn: Party.Connection, _ctx: Party.ConnectionContext) {
    // Send current cart state to newly connected client
    console.log(
      `Client ${conn.id} connected to room ${this.room.id}`,
    )
  }

  onMessage(message: string | ArrayBuffer, sender: Party.Connection) {
    try {
      const data = JSON.parse(message as string)

      // Broadcast cart updates to all connected clients in the room
      // Room ID is the user ID or session ID
      this.room.broadcast(
        JSON.stringify({
          type: data.type,
          payload: data.payload,
          timestamp: Date.now(),
        }),
        [sender.id], // Exclude sender from broadcast
      )

      if (data.type === 'order_status_updated') {
        this.room.broadcast(message, [sender.id])
      }
    }
    catch (error) {
      console.error('Error processing message:', error)
    }
  }

  onClose(conn: Party.Connection) {
    console.log(`Client ${conn.id} disconnected from room ${this.room.id}`)
  }
}

CartSyncServer satisfies Party.Worker
