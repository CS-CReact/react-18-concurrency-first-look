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

const getLaneNum = (fiber) => {
    let count = 0; 
  //let lanes = []
  while (fiber && count < 5) {
    if (fiber.lanes !== null ) {
      const laneNum = Math.log2(fiber.lanes); 
      //lanes.push(fiber.lanes)
      //TODO: clean this logic; 
      //make the lanes more fine grained; a color for a type of lane; a shade for a specific lane of that type 
      //probably will need bitwise operatitions
      if(laneNum > -Infinity) {
        console.log(`We found a special lane: ${laneNum} in ancestor ${count}`); 
        return laneNum; 
      }
    }
    fiber = fiber.return;
    count++;
  }
  return 0; 

}

const isTransition = (laneNum) => {
    return laneNum >= 6 && laneNum <= 22
}


const setTransitionColor = (laneNum) => {
    switch(laneNum) {
        case 6: 
            return "#99e2b4"; 
        case 7: 
            return "#88d4dB"; 
        case 8: 
            return "#9ff7cb"; 
        case 9: 
            return "#67b99a"; 
        case 10: 
            return "#56ab91"; 
        case 11: 
            return "#469d89"; 
        case 12: 
            return "#358f80";
        case 13: 
            return "#248277"; 
        case 14: 
            return "#14746f";
        case 15: 
            return "#036666";
        case 16: 
            return "#40916c"; 
        case 17: 
            return "#25a244";
        case 18: 
            return "#208b3a";
        case 19: 
            return "#1a7431";
        case 20: 
            return "#155d27";
        case 21: 
            return "#10451d"; 
        case 22: 
            return "#2d6a4f"; 
        
        default: 
            return "#2d6a4f"; 
        
    }

}


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
    
   
    const element = document.createElement(type);

    //for fun now; maybe useful later (e.g., display some useful info)

    if (props.id === 'app') {
      const header = document.createElement('h1'); 
      const container = document.createElement('div'); 
      header.innerText = 'Rendered by C-React';
      header.style.color = "#0077B6"; 
      header.style.font = 'bold 25px impact,serif'
      container.style.backgroundColor = '#E9C46A'
      container.style.border = 'solid black';
      container.style.marginBottom = '20px'; 
      container.appendChild(header);
      element.prepend(container)
      
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
    const laneNum = getLaneNum(internalInstanceHandle); 
    if (isTransition(laneNum)) {
      element.style.backgroundColor = setTransitionColor(laneNum);
      element.classList.add('TransitionLane'+ (laneNum - 6));  
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
  ) => {
    // console.log("Prepare Update");
    // console.log("Old Props", oldProps); 
    // console.log("New Props", newProps)
    // console.log("rootContainer", rootContainer);
    // console.log("hostContext", hostContext); 
    return; 
  },
  commitUpdate: (
    instance,
    updatePayload,
    type,
    prevProps,
    nextProps,
    internalHandle
  ) => {
    console.log("Commit Update"); 
    console.log("instanceHandle", internalHandle); 
    if (isTransition(internalHandle)) {
      instance.style.backgroundColor = "#66ff99";
      instance.classList.add('c-Transition');  
    }
  },
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
    //current obsveration: the 3 values are different but remain constant through updates [1, 4, 16] 
    console.log([DiscreteEventPriority,
      ContinuousEventPriority,
      DefaultEventPriority]); 
    return DefaultEventPriority 
  },
  commitMount: (instace, type, props, internalInstanceHandle)=> {console.log("Commit Mount ", internalInstanceHandle)},
  supportsMutation: true,
});

const cRender = (element, container) => {
  // console.log("Container: ", container);
  const fiberRoot = reconciler.createContainer(container, 1, true, true);
  console.log('Root: ', fiberRoot);
  reconciler.updateContainer(element, fiberRoot, null, null);
};

export default cRender;
