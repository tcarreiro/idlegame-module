import type { BorderStyle } from '@/models/styles.model';
import { Rectangle, type Graphics } from 'pixi.js';

export function useBorderDrawer() {

  const handleBorder = (rectangle: Rectangle, graphics: Graphics, border: BorderStyle) => {
    if (rectangle) {
      if (border === 'simple' || border === 'simple-inverted') {
        drawSimpleBorder(rectangle, graphics, border.includes('inverted'));
      }
      if (border === 'double' || border === 'double-inverted') {
        drawDoubleBorder(rectangle, graphics, border.includes('inverted'));
      }
      if (border === 'doubleBeveled') {
        drawDoubleBevelBorder(rectangle, graphics);
      }
    }
  }

  const drawSimpleSquareBorder = (
    graphics: Graphics,
    sideSize: number,
    posx: number = 0,
    posy: number = 0,
    inverted?: boolean,
  ) => {
    drawSimpleBorder(new Rectangle(posx, posy, sideSize, sideSize), graphics, inverted)
  }

  const drawSimpleBorder = (rect: Rectangle, graphics: Graphics, inverted?: boolean) => {
    const topLeftColor = 0x727272
    const bottomRightColor = 0x181818
    // graphics.clear()
    graphics.lineStyle(1, inverted ? bottomRightColor : topLeftColor, 1)
    graphics.drawRect(rect.width, 0, 0, rect.height)
    graphics.drawRect(0, rect.height, rect.width, 0)
    graphics.lineStyle(1, !inverted ? bottomRightColor : topLeftColor, 1)
    graphics.drawRect(0, 0, 0, rect.height)
    graphics.drawRect(0, 0, rect.width, 0)
  }

  const drawDoubleSquareBorder = (
    graphics: Graphics,
    sideSize: number,
    posx: number = 0,
    posy: number = 0,
    inverted?: boolean,
  ) => {
    drawDoubleBorder(new Rectangle(posx, posy, sideSize, sideSize), graphics, inverted)
  }

  const drawDoubleBorder = (rect: Rectangle, graphics: Graphics, inverted?: boolean) => {
    const topLeftColor = 0x727272
    const bottomRightColor = 0x181818
    // graphics.clear()

    graphics.lineStyle(1, inverted ? bottomRightColor : topLeftColor, 1)
    graphics.drawRect(rect.width, 0, 0, rect.height)
    graphics.drawRect(rect.width-1, 1, 0, rect.height-2)

    graphics.drawRect(0, rect.height, rect.width, 0)
    graphics.drawRect(1, rect.height-1, rect.width-2, 0)

    graphics.lineStyle(1, !inverted ? bottomRightColor : topLeftColor, 1)
    graphics.drawRect(0, 0, 0, rect.height)
    graphics.drawRect(1, 1, 0, rect.height-2)

    graphics.drawRect(0, 0, rect.width, 0)
    graphics.drawRect(1, 1, rect.width-2, 0)
  }

  const drawDoubleBevelSquareBorder = (
    graphics: Graphics,
    sideSize: number,
    posx: number = 0,
    posy: number = 0,
  ) => {
    drawDoubleBevelBorder(new Rectangle(posx, posy, sideSize, sideSize), graphics);
  }

  const drawDoubleBevelBorder = (rect: Rectangle, graphics: Graphics) => {
    // graphics.clear()

    graphics.lineStyle(1, 0x727272, 1)
    // topo claro duplo
    graphics.drawRect(0, 0, 0, rect.height)
    graphics.drawRect(1, 1, 0, rect.height-2)

    // lateral esquerda claro duplo
    graphics.drawRect(0, 0, rect.width, 0)
    graphics.drawRect(1, 1, rect.width-2, 0)

    graphics.lineStyle(1, 0x303030, 1)
    // topo escuro duplo
    graphics.drawRect(2, 2, 0, rect.height-4)
    graphics.drawRect(2, 2, rect.width-4, 0)

    // lateral esquerda escuro duplo
    graphics.drawRect(3, 3, 0, rect.height-6)
    graphics.drawRect(3, 3, rect.width-6, 0)

    graphics.lineStyle(1, 0x727272, 1)
    // lateral direita claro duplo
    graphics.drawRect(rect.width - 2, 2, 0, rect.height - 4)
    graphics.drawRect(rect.width - 3, 3, 0, rect.height - 6)

    // fundo claro duplo
    graphics.drawRect(2, rect.height - 2, rect.width - 4, 0)
    graphics.drawRect(3, rect.height - 3, rect.width - 6, 0)

    graphics.lineStyle(1, 0x303030, 1)
    // lateral direita escuro duplo
    graphics.drawRect(rect.width, 0, 0, rect.height)
    graphics.drawRect(rect.width - 1, 1, 0, rect.height - 2)

    // fundo escuro duplo
    graphics.drawRect(0, rect.height, rect.width, 0)
    graphics.drawRect(1, rect.height - 1, rect.width - 2, 0)

  }

  return {
    drawSimpleSquareBorder,
    drawSimpleBorder,
    drawDoubleSquareBorder,
    drawDoubleBorder,
    drawDoubleBevelSquareBorder,
    drawDoubleBevelBorder,
    handleBorder,
  }
}
