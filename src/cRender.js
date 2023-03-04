import ReactReconciler from 'react-reconciler';

const suspenseAncestor = (fiber) => {
  let count = 0;
  while (fiber.return && count < 5) {
    fiber = fiber.return;
    count++;
    if (fiber.tag === 13) return true;
  }
  return false;
};

const reconciler = ReactReconciler({
  createInstance: (
    type,
    props,
    rootContainerInstance,
    hostContext,
    internalInstanceHandle
  ) => {
    //console.log(type, props);
    console.log('Fiber: ', internalInstanceHandle);
    
    // let lanes = []
    // let fiber = internalInstanceHandle; 
    // let count = 0
    // while (fiber && count < 10) {
    //   if (fiber.lanes !== null ) {
    //     lanes.push(fiber.lanes)
    //     if(fiber.lanes !== 0) console.log("We found a special lane: ", fiber.lanes)
    //   }
    //   fiber = fiber.return;
    //   count++;
    // }
    // console.log("Lanes: ", lanes)
    
    const element = document.createElement(type);

    //TODO: simplify this, using a loop over props (Object.keys(props)) or something
    element.className = props.className || '';

    // check if the prop has incline styles; if yes, add the style to element
    // element.style = props.style  //==> this does not work; the following does
    if (props.style) {
      Object.keys(props.style).forEach((key) => {
        element.style[key] = props.style[key];
        // element.style.setProperty(key, props.style[key])
      });
    }
    // console.log(props.style);
    // console.log(el.style);

    if (props.onClick) {
      element.addEventListener('click', props.onClick);
    }
    if (props.onChange) {
      element.addEventListener('keyup', props.onChange)
    }

    if (props.id) element.id = props.id; 

    if (props.src) element.src = props.src;
    if (type === 'button') element.style.borderColor = 'red';

    // check if has suspense ancestor
    if (suspenseAncestor(internalInstanceHandle))
      element.style.backgroundColor = '#E0FFFF';

    //test waiting before returning
    // setTimeout(() => {
    //   console.log("Delayed for 1 second.");
    // }, 3000)

    return element;
  },

  createTextInstance: (
    text,
    rootContainerInstance,
    hostContext,
    internalInstanceHandle
  ) => {
    return document.createTextNode(text);
  },
  appendChildToContainer: (container, child) => {
    container.appendChild(child);
  },
  appendChild: (parent, child) => {
    parent.appendChild(child);
  },
  appendInitialChild: (parent, child) => {
    parent.appendChild(child);
  },
  insertBefore: (parentInstance, child, beforeChild) => {
    parentInstance.insertBefore(child, beforeChild);
  },
  insertInContainerBefore: (container, child, beforeChild) => {
    container.insertBefore(child, beforeChild);
  },
  removeChild: (parentInstance, child) => {
    parentInstance.removeChild(child);
  },
  removeChildFromContainer: (container, child) => {
    container.removeChild(child);
  },
  //
  now: Date.now,
  getRootHostContext: () => {},
  prepareForCommit: () => {},
  resetAfterCommit: () => {},
  getChildHostContext: () => {},
  shouldSetTextContent: () => {},
  clearContainer: () => {},
  prepareUpdate: (
    instance,
    type,
    oldProps,
    newProps,
    rootContainer,
    hostContext
  ) => {},
  commitUpdate: (
    instance,
    updatePayload,
    type,
    prevProps,
    nextProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    internalHandle
  ) => {},
  commitTextUpdate: (textInstance, oldText, newText) => {
    textInstance.nodeValue = newText;
  },
  finalizeInitialChildren: () => {},
  //
  shouldDeprioritizeSubtree: (type, nextProps) => {
    return !nextProps.hidden;
  },
  detachDeletedInstance: () => {}, 
  supportsMutation: true,
});

const cRender = (element, container) => {
  // console.log("Container: ", container);
  const fiberRoot = reconciler.createContainer(container, false, false);
  console.log('Root: ', fiberRoot);
  reconciler.updateContainer(element, fiberRoot, null, null);
};

export default cRender;
