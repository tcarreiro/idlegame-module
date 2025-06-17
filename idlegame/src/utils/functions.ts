import { Rectangle } from "@/models/generics.model";

export const newRectangle = (rect: Rectangle): Rectangle => {
  return new Rectangle(rect.x, rect.y, rect.width, rect.height);
};

export const addRectangle = (rect1: Rectangle, rect2: Rectangle): Rectangle => {
  return new Rectangle(
    rect1.x + rect2.x,
    rect1.y + rect2.y,
    rect1.width + rect2.width,
    rect1.height + rect2.height,
  );
};

export function getEnumKeyByValue<T extends object>(enumObj: T, value: T[keyof T]): keyof T | undefined {
  return (Object.keys(enumObj) as (keyof T)[]).find((key) => enumObj[key] === value);
}

export function getEnumValueByKey<T extends Record<string, string>>(
  enumType: T,
  key: string,
): T[keyof T] | undefined {
  return enumType[key as keyof T];
}
