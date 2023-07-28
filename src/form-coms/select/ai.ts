export default {
  // def: {},
  prompts: ``,
  '@create' (props) {
    const { def, data } = props
    // console.log(def)
    if (Array.isArray(def?.options)) {
      data.config.options = def.options
    }
  },
  '@update'({ data, newData, slots }) {
    // console.log(data, newData)
  }
}