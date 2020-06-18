import { serve } from "https://deno.land/std/http/server.ts";
// import base64 from "https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/socket.io/index.d.ts";

import {
  acceptWebSocket,
  isWebSocketCloseEvent,
  isWebSocketPingEvent,
} from "https://deno.land/std/ws/mod.ts";
/** websocket echo server */
const port = Deno.args[0] || "8080";
console.log(`websocket server is running on :${port}`);

export default async () => {
  const sockets: any = [];
  const channels: any = {};

  for await (const req of serve(`:${port}`)) {
    const { conn, r: bufReader, w: bufWriter, headers } = req;
    try {
      const sock: any = await acceptWebSocket({
        conn,
        bufReader,
        bufWriter,
        headers,
      });
      const id = req.url.replace("/?id=", "");
      sock.id = id;

      sockets.push(sock);

      try {
        for await (const ev of sock) {
          if (typeof ev === "string") {
            // text message
            console.log("ws:Text", ev);
            const data = JSON.parse(ev);
            if (data.subscribe) {
              if (!channels[data.subscribe]) {
                channels[data.subscribe] = [];
              }
              channels[data.subscribe].push(sock);
            }
            if (data.unsubscribe) {
              if (channels[data.unsubscribe]) {
                const idx = channels[data.ubsubscribe].findIndex((s: any) =>
                  s.id === sock.id
                );
                if (idx > -1) {
                  channels[data.unsubscribe].splice(idx, 1);
                }
              }
            }
            if (data.channel) {
              if (channels[data.channel]) {
                for await (const socket of channels[data.channel]) {
                  await socket.send(ev);
                }
              }
            }
            //   await sock.send(ev);
          } else if (ev instanceof Uint8Array) {
            // binary message
            console.log("ws:Binary", ev);
          } else if (isWebSocketPingEvent(ev)) {
            const [, body] = ev;
            // ping
            console.log("ws:Ping", body);
          } else if (isWebSocketCloseEvent(ev)) {
            // close
            const { code, reason } = ev;
            console.log("ws:Close", code, reason);
            const index = sockets.findIndex((s: any) => s.id === sock.id);
            if (index > -1) {
              sockets.splice(index, 1);
            }
            Object.keys(channels).forEach((channel) => {
              const idx = channels[channel].findIndex((s: any) =>
                s.id === sock.id
              );
              if (idx > -1) {
                channels[channel].splice(idx, 1);
              }
            });
          }
        }
      } catch (err) {
        console.error(`failed to receive frame: ${err}`);
        if (!sock.isClosed) {
          await sock.close(1000).catch(console.error);
        }
      }
    } catch (err) {
      console.error(`failed to accept websocket: ${err}`);
      await req.respond({ status: 400 });
    }
  }

  return { sockets, channels };
};
