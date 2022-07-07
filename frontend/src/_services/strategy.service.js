import { callService } from "./callableFunction";

export const saveStrategy = async (data) => {
  let result = await callService("saveStrategy", data);
  return result;
};

export const updateStrategy = async (data) => {
  let result = await callService("updateStrategy", data);
  return result;
};

export const getStrategies = async () => {
  let result = await callService("getStrategies");
  return result;
};

export const getTemplateStrategies = async () => {
  let result = await callService("getTemplateStrategy");
  return result;
};
