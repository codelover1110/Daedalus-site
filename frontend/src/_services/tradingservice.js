import { callService } from "./callableFunction";

export const buy = async (data) => {
  let result = await callService("buy", data);
  return result;
};

export const sell = async (data) => {
  let result = await callService("sell", data);
  return result;
};
