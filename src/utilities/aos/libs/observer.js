let callback = () => {};

function containsAOSNode(nodes) {
  let i, currentNode, result;

  for (i = 0; i < nodes.length; i += 1) {
    currentNode = nodes[i];

    if (currentNode.dataset && currentNode.dataset.aos) {
      return true;
    }

    result = currentNode.children && containsAOSNode(currentNode.children);

    if (result) {
      return true;
    }
  }

  return false;
}

function check(mutations) {
  if (!mutations) return;

  mutations.forEach(mutation => {
    const addedNodes = Array.from(mutation.addedNodes);
    const removedNodes = Array.from(mutation.removedNodes);
    const allNodes = [...addedNodes, ...removedNodes];

    if (containsAOSNode(allNodes)) {
      return callback();
    }
  });
}

function isSupported() {
  return 'MutationObserver' in window;
}

function ready(selector, fn) {
  const doc = window.document;
  const observer = new MutationObserver(check);
  callback = fn;

  observer.observe(doc.documentElement, {
    childList: true,
    subtree: true,
    removedNodes: true
  });
}

export default { isSupported, ready };
