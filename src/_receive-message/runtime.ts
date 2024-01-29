export default function (props) {
  const { env, outputs } = props;
  const { runtime } = env;

  if (runtime) {
    const receiveMessageFromIframePage = (event) => {
      outputs['getData'](event.data);
    };

    window.addEventListener('message', receiveMessageFromIframePage, false);
  }
}
