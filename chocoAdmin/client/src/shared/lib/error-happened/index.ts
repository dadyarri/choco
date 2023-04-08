import {Error} from "entities/error";

export const errorHappened = (data: unknown) => {
  return (<Error>data).error !== undefined;
};