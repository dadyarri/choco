import {Error} from "entities";

export const errorHappened = (data: unknown) => {
  return (<Error>data).error !== undefined;
};