export async function resolvePromisesOneByOne(
  elements: HTMLElement[],
  callBack: (e: HTMLElement) => Promise<void>,
) {
  for (const e of elements) {
    await callBack(e);
  }
}
