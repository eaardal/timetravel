// Hentet fra stack overflow: http://stackoverflow.com/a/34003331

if (!Element.prototype.scrollIntoViewIfNeeded) {
  Element.prototype.scrollIntoViewIfNeeded = function scrollIntoViewIfNeeded(centerIfNeeded) {
    let area = {};

    function withinBounds(value, min, max, extent) {
      if (centerIfNeeded === false || max <= value + extent && value <= min + extent) {
        return Math.min(max, Math.max(min, value));
      }
      return (min + max) / 2;
    }

    function makeArea(left, top, width, height) {
      return { left, top, width, height,
        right: left + width, bottom: top + height,
        translate(x, y) {
          return makeArea(x + left, y + top, width, height);
        },
        relativeFromTo(ilhs, irhs) {
          let newLeft = left;
          let newTop = top;
          let lhs = ilhs.offsetParent;
          let rhs = irhs.offsetParent;
          if (lhs === rhs) {
            return area;
          }
          for (; lhs; lhs = lhs.offsetParent) {
            newLeft += lhs.offsetLeft + lhs.clientLeft;
            newTop += lhs.offsetTop + lhs.clientTop;
          }
          for (; rhs; rhs = rhs.offsetParent) {
            newLeft -= rhs.offsetLeft + rhs.clientLeft;
            newTop -= rhs.offsetTop + rhs.clientTop;
          }
          return makeArea(newLeft, newTop, width, height);
        },
      };
    }

    let elem = this;
    let parent = elem.parentNode;
    area = makeArea(
      this.offsetLeft, this.offsetTop,
      this.offsetWidth, this.offsetHeight);

    while ((parent) instanceof HTMLElement) {
      const clientLeft = parent.offsetLeft + parent.clientLeft;
      const clientTop = parent.offsetTop + parent.clientTop;

      // Make area relative to parent's client area.
      area = area.
      relativeFromTo(elem, parent).
      translate(-clientLeft, -clientTop);

      parent.scrollLeft = withinBounds(
        parent.scrollLeft,
        area.right - parent.clientWidth, area.left,
        parent.clientWidth);

      parent.scrollTop = withinBounds(
        parent.scrollTop,
        area.bottom - parent.clientHeight, area.top,
        parent.clientHeight);

      // Determine actual scroll amount by reading back scroll properties.
      area = area.translate(clientLeft - parent.scrollLeft,
        clientTop - parent.scrollTop);

      elem = parent;
      parent = elem.parentNode;
    }
  };
}
