export function getPosition(ele, relativeDom?) {
  const scrollBarTop = document.body.scrollTop || document.documentElement.scrollTop;
  const scrollBarLeft = document.body.scrollLeft || document.documentElement.scrollLeft;

  if (relativeDom) {
    const currPo = ele.getBoundingClientRect()
    const targetPo = relativeDom.getBoundingClientRect()

    return {
      x: currPo.left - targetPo.left + scrollBarLeft,
      y: currPo.top - targetPo.top + scrollBarTop,
      w: ele.offsetWidth,
      h: ele.offsetHeight
    }
  } else {
    const po = ele.getBoundingClientRect()
    return {
      x: po.left + scrollBarLeft,
      y: po.top + scrollBarTop,
      w: ele.offsetWidth,
      h: ele.offsetHeight
    }
  }
}

export function dragable(e, dragingFn, options?) {
  const doc = options?.document || document

  const dom = e.currentTarget, w = dom.offsetWidth, h = dom.offsetHeight,
    relDom = arguments.length == 3 && options && options['relDom'],
    po = getPosition(dom, relDom),
    parentPo = relDom ? getPosition(relDom) : {x: 0, y: 0};

  const scrollBarTop = document.body.scrollTop || document.documentElement.scrollTop;
  const scrollBarLeft = document.body.scrollLeft || document.documentElement.scrollLeft;

  let odx = e.pageX - po.x, ody = e.pageY - po.y;
  let x, y, ex, ey;
  let state;

  if (dragingFn) {
    const handleMouseMove = e => {
      const adx = e.pageX - odx, ady = e.pageY - ody;
      const dx = adx - x, dy = ady - y;
      x = e.pageX - odx;
      y = e.pageY - ody;
      ex = e.pageX - parentPo.x - scrollBarLeft;
      ey = e.pageY - parentPo.y - scrollBarTop;
      if (state === 'finish') {
        dragingFn({
          po: {x, y}, epo: {ex, ey}, dpo: {dx: 0, dy: 0}, adpo: {adx, ady},
          targetStyle: {x: po.x, y: po.y, w, h}
        }, state, dom)
      } else {
        if (dx != 0 || dy != 0) {
          state = state ? 'ing' : 'start';

          dragingFn({
            po: {x, y}, epo: {ex, ey}, dpo: {dx, dy}, adpo: {adx, ady},
            targetStyle: {x: po.x, y: po.y, w, h}
          }, state, dom)
        }
      }
    }

    let moving = false
    doc.onmousemove = e => {
      if (!moving) {
        moving = true
      }
      try {
        handleMouseMove(e)
      } catch (ex) {
        console.error(ex)
      }
    }

    doc.onmouseup = e => {
      state = 'finish'
      handleMouseMove(e)

      doc.onmousemove = null;
      doc.onmouseup = null;
    }
  } else {
    return po;
  }
}
