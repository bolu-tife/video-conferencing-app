import { v4 as uuidv4 } from "uuid";

export function generateRoomId(): string {
  return uuidv4().substring(5, 17);
}

// export function isRoomIdValid(roomId : string) : boolean{
//     console.log(new String(roomId).length == 12 && /^(\w{0,3}\-\w{0,4}\-\w{0,3})$/.test(roomId)
// );
//     return new String(roomId).length == 12 && /^(\w{0,3}\-\w{0,4}\-\w{0,3})$/.test(roomId)
// }
