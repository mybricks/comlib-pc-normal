const getPluginDataset = (json)=>{
  return json.content["xg.desn.stageview"]["D"]["W"]["pluginDataset"]
}

//@mybricks/plugins/service
const getServicePlugins = (json)=>{
  return json.content["xg.desn.stageview"]["D"]["W"]["@mybricks/plugins/service"]
}

const getConnectors = (json)=>{
  return json.content["xg.desn.stageview"]["D"]["W"]["connectors"]
}

//content
const getContent = (json)=>{
  return json.content["xg.desn.stageview"]["D"]["W"]["content"]
}

//title
const getTitle = (json)=>{
  return json.content["xg.desn.stageview"]["D"]["W"]["title"]
}

//path
const getPath = (json)=>{
  return json.content["xg.desn.stageview"]["D"]["W"]["path"]
}

//method
const getMethod = (json)=>{
  return json.content["xg.desn.stageview"]["D"]["W"]["method"]
}


export const getServiceList = (dumpJSON)=>{
  const serviceJSON = dumpJSON.content["xg.desn.stageview"].refs["0"][getPluginDataset(dumpJSON)][getServicePlugins(dumpJSON)][getConnectors(dumpJSON)];
  let serviceList;
  serviceList = serviceJSON.map((item)=>{
    return {
      title: item[getContent(dumpJSON)][getTitle(dumpJSON)],
      path: item[getContent(dumpJSON)][getPath(dumpJSON)],
      method: item[getContent(dumpJSON)][getMethod(dumpJSON)],
    }
  })

  return serviceList;
}