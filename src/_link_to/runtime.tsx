export default function ({inputs}) {
  inputs['toUrl']((url: string) => {
    window.location.href=url
  })
}
