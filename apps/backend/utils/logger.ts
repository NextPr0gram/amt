export const enum logType {
    MODERATION = "[MODERATION]",
    HTTP = "[HTTP]",
    WEBSOCKET = "[WEBSOCKET]",
    ERROR = "[ERROR]",
    SERVER = "[SERVER]",
    BOX = "[BOX]",
}

export const logMsg = (type: logType, msg: string) => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");

    const time = `[${hours}:${minutes}:${seconds}]`;
    console.log(time, type, msg);
};
