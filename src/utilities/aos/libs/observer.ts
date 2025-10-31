let callback: () => void = () => {};

function containsAOSNode(nodes: HTMLElement[] | HTMLCollection): boolean {
  let i: number, currentNode: HTMLElement, result: boolean;

  for (i = 0; i < nodes.length; i += 1) {
    currentNode = nodes[i] as HTMLElement;

    if (currentNode.dataset && currentNode.dataset.aos) {
      return true;
    }

    result = currentNode.children && containsAOSNode(currentNode.children as HTMLCollection);

    if (result) {
      return true;
    }
  }

  return false;
}

function check(mutations: MutationRecord[]): void {
  if (!mutations) return;

  mutations.forEach(mutation => {
    const addedNodes = Array.from(mutation.addedNodes) as HTMLElement[];
    const removedNodes = Array.from(mutation.removedNodes) as HTMLElement[];
    const allNodes = [...addedNodes, ...removedNodes];

    if (containsAOSNode(allNodes)) {
      return callback();
    }
  });
}

function isSupported(): boolean {
  return 'MutationObserver' in window;
}

function ready(selector: string, fn: () => void): void {
  const doc = window.document;
  const observer = new MutationObserver(check);
  callback = fn;

  observer.observe(doc.documentElement, {
    childList: true,
    subtree: true
  });
}

export default { isSupported, ready };
