import { Position } from "@/models/generics.model";

export const getRendererFrameId = (timer: number, frameDuration: number, numOfFrames: number): number => {
    return Math.floor(timer / frameDuration) % numOfFrames;
}

export const drawSize = (size:number) => {
  return {
    width: `${size}px`,
    height: `${size}px`,
  };
};

export const getDrawFromAtlas = (spriteGroup:string, spriteName:string, atlasCols: number, size: number, col: number, row: number, offset?:Position) => {
  return {
    backgroundImage: `url('/sprites/${spriteGroup}/${spriteName}.png')`,
    backgroundSize: `${atlasCols * size}px auto`,
    backgroundPosition: `${-1 * (col * size + (offset?.x??0))}px ${-1 * (row * size + (offset?.y??0))}px`,
  };
};
