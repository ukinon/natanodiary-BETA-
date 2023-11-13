import { atom } from "recoil";

export const modalState = atom({
  key: "modalState",
  default: false,
});

export const postIDState = atom({
  key: "postIDState",
  default: "id",
});
