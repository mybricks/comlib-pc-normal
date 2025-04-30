const isSameDomainInstanceAndService = (pre, cur) => {
  if (pre) {
    const { id, defId, service } = pre;
    if (defId === cur.defId && id === cur.id && service.name === cur.service.name) {
      // 同领域模型同实例同服务
      console.warn("[isSameDomainInstanceAndService] 重复选择当前实例下的服务", cur);
      return true;
    }
  }

  return false;
}

export {
  isSameDomainInstanceAndService
}
