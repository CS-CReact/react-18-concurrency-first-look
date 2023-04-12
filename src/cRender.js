import ReactReconciler from 'react-reconciler';
import {
  DiscreteEventPriority,
  ContinuousEventPriority,
  DefaultEventPriority,
} from 'react-reconciler/constants';
import createDOMElement,{setStyles,isEvent} from  './createDOMelement'

//shallow diff algorithm from react-tiny-dom

function shallowDiff(oldProps, newProps) {
  // Return a diff between the new and the old object
  const uniqueProps = new Set([...Object.keys(oldProps), ...Object.keys(newProps)]);
  const changedProps = Array.from(uniqueProps).filter(
    propKey => oldProps[propKey] !== newProps[propKey]
  );
  return changedProps;
}


const reconciler = ReactReconciler({
  createInstance: createDOMElement, 
  //   type,
  //   props,
  //   rootContainerInstance,
  //   hostContext,
  //   internalInstanceHandle
  // ) => {
   
  //   const element = document.createElement(type);

  //   //for fun now; maybe useful later (e.g., display some useful info)

  //   if (props.id === 'app') {
  //     const header = document.createElement('h1'); 
  //     const container = document.createElement('div'); 
  //     header.innerText = 'Rendered by C-React';
  //     header.style.color = "#0077B6"; 
  //     header.style.font = 'bold 25px impact,serif'
  //     container.style.backgroundColor = '#E9C46A'
  //     container.style.border = 'solid black';
  //     container.style.marginBottom = '20px'; 
  //     container.appendChild(header);
  //     element.prepend(container)      
  //   }


  //   //TODO: create a seperate function to create instance
  //   //TODO: simplify this, using a loop over props (Object.keys(props)) or something
  //   element.className = props.className || '';

  //   // check if the prop has incline styles; if yes, add the style to element
  //   // element.style = props.style  //==> this does not work; the following does
  //   if (props.style) {
  //     Object.keys(props.style).forEach((key) => {
  //       element.style[key] = props.style[key];
  //       // element.style.setProperty(key, props.style[key])
  //     });
  //   }

  //   if (props.onClick) {
  //     element.addEventListener('click', props.onClick);
  //   }
  //   if (props.onChange) {
  //     element.addEventListener('input', props.onChange)
  //   }

  //   if (props.id) element.id = props.id; 
  //   if (props.placeholder) element.placeholder = props.placeholder; 

  //   if (props.src) element.src = props.src;

  //   //for demo only. No use in production
  //   if (type === 'button') {
  //       element.style.borderColor = 'red'; 
  //       element.style.width = '160px'; 
  //       element.style.height = '100px';
  //       element.style.fontSize = 'xx-large'; 
  //   };

  //   // check if has suspense ancestor
  //   if (isSuspense(internalInstanceHandle)) {
  //       element.style.border = 'solid lightblue'; 
  //       element.classList.add('Suspense'); 
  //       //this is purely for fun; *may* be useful for future   
  //       const tooltip = document.createElement('span'); 
  //       tooltip.innerHTML = '&#128570 Phew! It took me 1223ms to load!';
  //       tooltip.className = 'SuspensePopup'; 
  //       element.appendChild(tooltip); 
  //      // console.log("Suspended fiber", internalInstanceHandle);
  //   }

  //   //check if has useTransition ancestor
  //   const laneNum = getLaneNum(internalInstanceHandle); 
  //   if (isTransition(laneNum)) {
  //     element.style.backgroundColor = setTransitionColor(laneNum);
  //     element.classList.add('TransitionLane'+ (laneNum - 6));
  //   }

  //   return element;
  // },

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
  //TODO: add prepare and commit logic 
  /* From React source code: ReactFiberConfigDOM.js
  export function prepareUpdate(
  domElement: Instance,
  type: string,
  oldProps: Props,
  newProps: Props,
  hostContext: HostContext,
): null | Array<mixed> {
  if (diffInCommitPhase) {
    // TODO: Figure out how to validateDOMNesting when children turn into a string.
    return null;
  }
  return diffProperties(domElement, type, oldProps, newProps);
}

  */
  prepareUpdate: (
    domElement,
    type,
    oldProps,
    newProps,
    rootContainer,
    hostContext
  ) => {
    //console.log("Prepare Update");
    // console.log("Old Props", oldProps); 
    // console.log("New Props", newProps)
    // console.log("rootContainer", rootContainer);==> the div with id "root"
    // console.log("hostContext", hostContext); ==> not sure; undefined 
    return //shallowDiff(oldProps, newProps); 
  },
  commitUpdate: (
    domElement,
    updatePayload,
    type,
    oldProps,
    newProps,
    internalHandle
  ) => {
    console.log("Commit Update"); 
    console.log(updatePayload);
    updatePayload.forEach(propKey => {
      // children changes is done by the other methods like `commitTextUpdate`
      if (propKey === 'children') {
        const propValue = newProps[propKey];
        if (typeof propValue === 'string' || typeof propValue === 'number') {
          domElement.textContent = propValue;
        }
        return;
      }

      if (propKey === 'style') {
        // Return a diff between the new and the old styles
        const styleDiffs = shallowDiff(oldProps.style, newProps.style);
        const finalStyles = styleDiffs.reduce((acc, styleName) => {
      
          if (!newProps.style[styleName]) acc[styleName] = '';
          else acc[styleName] = newProps.style[styleName];

          return acc;
        }, {});

        setStyles(domElement, finalStyles);
      } else if (newProps[propKey] || typeof newProps[propKey] === 'number') {
        
        if (isEvent(propKey, domElement)) {
          const eventName = propKey.toLowerCase().replace('on', '');
          domElement.removeEventListener(eventName, oldProps[propKey]);
          domElement.addEventListener(eventName, newProps[propKey]);
        } else {
          domElement.setAttribute(propKey, newProps[propKey]);
        }
      } else {
        if (isEvent(propKey, domElement)) {
          const eventName = propKey.toLowerCase().replace('on', '');
          domElement.removeEventListener(eventName, oldProps[propKey]);
        } else {
          domElement.removeAttribute(propKey);
        }
      }
    });
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
    // console.log([DiscreteEventPriority,
    //   ContinuousEventPriority,
    //   DefaultEventPriority]); 
    return DefaultEventPriority 
  },
  hideInstance: ()=> {},
  //This is needed for demo supsense; not sure why-- may have to with promise and simulated delay
  unhideInstance: ()=> {},
  
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
