import { atom } from "recoil";

export const userChatState = atom({
  key: "userChatState",
  default: {},
});

export const selectedChatState = atom({
  key: "selectedChatState",
  default: "hi",
});
