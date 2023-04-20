export const setStyles = (props, element) => {
    Object.keys(props.style).forEach((propKey) => {
        element.style[propKey.toLowerCase()] = props.style[propKey];
    });
}

export const isEvent = (key, element) => {
    return key.startsWith("on") && (key.toLowerCase() in element) ; 
}


export default function createDomElement(
    type,
    props,
    rootContainerInstance,
    hostContext,
    internalInstanceHandle
  ) {
   
    const element = document.createElement(type);

    for (const [propKey, propValue] of Object.entries(props)) { 
        if (propKey === "children") continue; 
        else if (propKey === "style") {
            setStyles(props, element);
        } else if (propKey === 'className') {
            element.setAttribute('class', propValue)
        } else if (isEvent(propKey, element)) {
            const eventName = propKey.toLowerCase().replace('on', '')
            element.addEventListener(eventName, propValue); 
            if (type === 'input' && propKey === "onChange") element.addEventListener('input', propValue)
        }
        else if (propKey in element) element.setAttribute(propKey, propValue); 
    }
    


    // //TODO: create a seperate function to create instance
    // //TODO: simplify this, using a loop over props (Object.keys(props)) or something
    // element.className = props.className || '';

    // // check if the prop has incline styles; if yes, add the style to element
    // // element.style = props.style  //==> this does not work; the following does
    // if (props.style) {
    //   Object.keys(props.style).forEach((key) => {
    //     element.style[key] = props.style[key];
    //     // element.style.setProperty(key, props.style[key])
    //   });
    // }

    // if (props.onClick) {
    //   element.addEventListener('click', props.onClick);
    // }
    // if (props.onChange) {
    //   element.addEventListener('input', props.onChange)
    // }

    // if (props.id) element.id = props.id; 
    // if (props.placeholder) element.placeholder = props.placeholder; 

    // if (props.src) element.src = props.src;


    // check if has suspense ancestor
    if (isSuspense(internalInstanceHandle)) {
        element.style.border = 'solid lightblue'; 
        element.classList.add('Suspense'); 
    //     //this is purely for fun; *may* be useful for future   
    //     const tooltip = document.createElement('span'); 
    //     tooltip.innerHTML = '&#128570 Phew! It took me 1223ms to load!';
    //     tooltip.className = 'SuspensePopup'; 
    //     element.appendChild(tooltip); 
    //    // console.log("Suspended fiber", internalInstanceHandle);
    }

    //check if has useTransition ancestor
    const laneNum = getLaneNum(internalInstanceHandle); 
    if (isTransition(laneNum)) {
      element.style.backgroundColor = setTransitionColor(laneNum);
      element.classList.add('TransitionLane'+ (laneNum));
    }

    return element;
  }


  //Helper functions:


const isSuspense = (fiber) => {
    let count = 0;
    while (fiber.return && count < 3) {
      fiber = fiber.return;
      count++;
      if (fiber.tag === 13) return true;
    }
    return false;
  };
  
  const getLaneNum = (fiber) => {
      let count = 0; 
    //let lanes = []
    while (fiber && count < 10) {
      if (fiber.lanes !== null ) {
        const laneNum = Math.log2(fiber.lanes); 
        //lanes.push(fiber.lanes)
        //TODO: clean this logic; 
        //make the lanes more fine grained; a color for a type of lane; a shade for a specific lane of that type 
        //probably will need bitwise operatitions
        if(laneNum > -Infinity) {
         // console.log(`We found a special lane: ${laneNum} in ancestor ${count}`); 
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
  
  