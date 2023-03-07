import ReactReconciler from 'react-reconciler';
import {
  DiscreteEventPriority,
  ContinuousEventPriority,
  DefaultEventPriority,
} from 'react-reconciler/constants';

const isSuspense = (fiber) => {
  let count = 0;
  while (fiber.return && count < 5) {
    fiber = fiber.return;
    count++;
    if (fiber.tag === 13) return true;
  }
  return false;
};

const isTransition = (fiber) => {
  let count = 0; 
  let lanes = []
  while (fiber && count < 10) {
    if (fiber.lanes !== null ) {
      const laneNum = fiber.lanes; 
      lanes.push(fiber.lanes)
      //TODO: clean this logic; 
      //make the lanes more fine grained; a color for a type of lane; a shade for a specific lane of that type 
      //probably will need bitwise operatitions
      if(Math.log2(laneNum) >= 6 && Math.log2(laneNum) <= 22) {
        console.log(`We found a special lane: ${laneNum} in ancestor ${count}`); 
        return true; 
      }
    }
    fiber = fiber.return;
    count++;
  }
  //console.log("Lanes: ", lanes)
  return false; 
}

const reconciler = ReactReconciler({
  createInstance: (
    type,
    props,
    rootContainerInstance,
    hostContext,
    internalInstanceHandle
  ) => {
    console.log(type, props);
    //console.log('Fiber: ', internalInstanceHandle);
    
   
    const element = document.createElement(type);

    //for fun now; maybe useful later (e.g., display some useful info)

    if (props.id === 'app') {
      const header = document.createElement('h1'); 
      header.innerText = 'Boohaha C-renderer!';
      header.style.color = "yellow"; 
      element.prepend(header)
      
    }




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

    if (props.onClick) {
      element.addEventListener('click', props.onClick);
    }
    if (props.onChange) {
      element.addEventListener('input', props.onChange)
    }

    if (props.id) element.id = props.id; 

    if (props.src) element.src = props.src;
    if (type === 'button') element.style.borderColor = 'red';

    // check if has suspense ancestor
    if (isSuspense(internalInstanceHandle))
      element.style.backgroundColor = '#E0FFFF';

    //check if has useTransition ancestor
    if (isTransition(internalInstanceHandle)) {
      element.style.backgroundColor = "#66ff99";
      element.classList.add('c-Transition');  
    }

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
  getCurrentEventPriority: ()=> {
    //TODO:understand what these mean and if they are useful
    //obveration: the 3 values are different but remain constant through updates [1, 4, 16] 
    // console.log([DiscreteEventPriority,
    //   ContinuousEventPriority,
    //   DefaultEventPriority]); 
    return DefaultEventPriority 
  },
  supportsMutation: true,
});

const cRender = (element, container) => {
  // console.log("Container: ", container);
  const fiberRoot = reconciler.createContainer(container, 1, true, true);
  console.log('Root: ', fiberRoot);
  reconciler.updateContainer(element, fiberRoot, null, null);
};

export default cRender;
