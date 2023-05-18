export default {
  // def: {},
  prompts: ``,
  '@create' (props) {
    const { def, data } = props
    console.log(props)
  },
  '@update'({ data, newData, slots }) {
    // console.log(data, newData)
  }
}