/* Declare namespace. */
var jafrajarvy292 = jafrajarvy292 || {};

jafrajarvy292.DavidModal = class {
    /**
     * Checks to see if the object passed in contains a "davidmodal-container" class. If so, returns it. If
     * not, returns the nearest ancestor that does or returns undefined it none found
     * @param {Element} element The element we are checking
     * @returns {Element|undefined} The element that was passed in or the nearest ancestor having
     * "davidmodal-container" class. If none found, returns undefined.
     */
    static privateFindNearestContainer(element)
    {
        //Checks to see if element passed in contains "davidmodal-container" class. If so, return it
        if (element.classList.contains('davidmodal-container')) {
            return element;
        //If element doesn't have "davidmodal-container" class, check its parent
        } else {
            while (element !== document.body) {
                element = element.parentNode;
                if (element.classList.contains('davidmodal-container')) {
                    return element;
                }
            }
            return undefined;
        }
    }

    /**
     * Returns the <body> element's computed background-color value. If it's transparent, returns
     * 'white'; otherwise, returns a value you can set another element's background-color to
     * @returns {String} Background color value
     */
    static privateGetBodyBgColor()
    {
        /* Browsers will vary in what value is used for when the background-color is transparent, so we create
        a test element and grab its background-color value. This value is what the current browser uses to
        indicate a transparent color. */
        let sampleElement = document.createElement('p');
        sampleElement.style.display = 'none';
        document.body.appendChild(sampleElement);
        
        /* Get background color of the test element, which should be transparent. We use this as a reference
        for comparing transparency */
        let transparent = window.getComputedStyle(sampleElement).getPropertyValue('background-color');
        
        //Get background color of the body
        let bodyBackground = window.getComputedStyle(document.body).getPropertyValue('background-color');

        //Remove sample element from DOM
        sampleElement.parentNode.removeChild(sampleElement);

        //If the body background is transparent, return white; otherwise, return the color
        if (bodyBackground === transparent) {
            return 'white';
        } else {
            return bodyBackground;
        }
    }
    
    /**
     * This will "swap" the given element with its modal equivalent. What we're actually doing is creating the
     * necessary containers for the modal, inserting that next to the given element as a sibling node,
     * then appending that given element under the modal group. The end result is a swap that preserves
     * event listeners that might have been attached to the given element.
     * @param {Element} element The element being swapped out. Specifically the one we want to display within
     * a modal container
     */
    static privateSwapWithModal(element)
    {
        //Create the modal container
        let modalContainer = document.createElement('div');
        modalContainer.classList.add('davidmodal-container');
        
        //Create the modal content container
        let modalContent = document.createElement('div');
        modalContent.classList.add('davidmodal-content');
        modalContent.style.backgroundColor = jafrajarvy292.DavidModal.iFrameBgColor;

        //Create the x button and attach event listener. Clicking the x hides the modal
        let modalX = document.createElement('div');
        modalX.classList.add('davidmodal-x');
        
        if (element.classList.contains('davidmodal-x-refresh')) {
            modalX.addEventListener('click', function() {
                jafrajarvy292.DavidModal.hideModal(modalContainer, function() {
                    window.location.reload()
                });
            });
        } else {
            modalX.addEventListener('click', function() {
                jafrajarvy292.DavidModal.hideModal(modalContainer);
            });
        }

        //Append the modal content container and close button to the modal container
        modalContainer.appendChild(modalContent);
        modalContainer.appendChild(modalX);

        //Append the modal container to the body as a sibling to the current element
        element.parentNode.insertBefore(modalContainer, element);

        //Append the current element to the content container. In other words, "move" it into there
        modalContent.appendChild(element);

        /* Finally, set the current element's display value to its default, just in case it was being hidden.
        This will ensure it can be seen when the modal container is faded in  */
        element.style.display = 'initial';
    }

    /**
     * This will create and append a new modal item to the body. The element being passed in must have an
     * href attribute value, which is used as the src value for the iframe.
     * @param {Element} element 
     * @returns {Element} The modal container that was appended to the body.
     */
    static privateAppendNewIframe(element)
    {
        //Create the modal container
        let modalContainer = document.createElement('div');
        modalContainer.classList.add('davidmodal-container');
        
        //Create the iframe
        let modalContent = document.createElement('iframe');
        modalContent.classList.add('davidmodal-content');
        modalContent.src = element.getAttribute('href');
        modalContent.style.backgroundColor = jafrajarvy292.DavidModal.iFrameBgColor;

        /* Create the x button for closing. Closing means we'll fade out and then remove the modal
        from the DOM */
        let modalX = document.createElement('div');
        modalX.classList.add('davidmodal-x');
        /* If the element has a class of 'davidmodal-x-refresh', then clicking the x will refresh the parent
        page after the removal. If it doesn't, then it will just remove */
        if (element.classList.contains('davidmodal-x-refresh')) {
            modalX.addEventListener('click', function() {
                jafrajarvy292.DavidModal.hideRemoveModal(modalContainer, function() {
                    parent.window.location.reload();
                });
            });
        } else {
            modalX.addEventListener('click', function() {
                jafrajarvy292.DavidModal.hideRemoveModal(modalContainer);
            });
        }
        

        //Append iframe and close button to the modal container
        modalContainer.appendChild(modalContent);
        modalContainer.appendChild(modalX);

        //Append the modal container to the body. This will also cause the iframe to begin loading
        document.body.appendChild(modalContainer);

        /* Return a reference to the container we've created, just in case the user needs to do something else
        with it. */
        return modalContainer;
    }

    /**
     * Looks for all elements with a "davidmodal" class and prepares them for use with our library. This
     * needs to be ran just aftr the DOM is loaded and ran on every page where our library is being used
     */
    static init() {
        //Loops through all elements that have a class of "davidmodal"
        let elements = document.getElementsByClassName('davidmodal');
        for (let i = 0; i < elements.length; i++) {
            /* If the element does not have an href attribute value, then user likely wants to display the
            container within a modal. We'll swap out the element with its modal equivalent.
            The user is still responsible for creating an event listener to fade in this modal */
            if (elements[i].getAttribute('href') === null || elements[i].getAttribute('href').trim() === '') {
                jafrajarvy292.DavidModal.privateSwapWithModal(elements[i]);
            /* If element has href attribute value, then the user wants to dispay this as an iframe. */
            } else {
                /* Add event listener to each of these elements. When element is clicked, the modal
                is created on-the-spot, then faded in */
                elements[i].addEventListener('click', function(e) {
                    e.preventDefault();
                    let modalContainer = jafrajarvy292.DavidModal.privateAppendNewIframe(elements[i]);
                    jafrajarvy292.DavidModal.showModal(modalContainer);
                });
            }
        }
    }

    /**
     * Fades in a modal container
     * @param {Element} object The modal container to fade in. This can be the element with the
     * "davidmodal-container" class or any element under it
     */
    static showModal(object)
    {
        /* Check that the element being passed in has a "davidmodal-container" class. If it doesn't, find the
        nearest ancestor that does. Then, fade it in */
        let currentObject = jafrajarvy292.DavidModal.privateFindNearestContainer(object);
        if (currentObject !== undefined) {
            currentObject.classList.remove('hidedavidmodal');
            currentObject.classList.add('showdavidmodal');
            currentObject.style.display = 'block';
        } else {
            console.log('Unable to fade in element', object, 'It does not posess a "davidmodal-container"' +
            'class, nor do any of its ancestors.');
            return;
        }
    }

    /**
     * This will fade out a modal container
     * @param {Element} [object] The modal container you want to fade out. If nothing is provided, the
     * code will attempt to locate it
     * @param {Function} [callback] The function to be ran after fade out is complete
     * @returns {Element} Returns the "davidmodal-container" element that was hidden
     */
    static hideModal(object = undefined, callback = undefined)
    {
        let currentObject = object;
        /* Make sure the element being passed in has a "davidmodal-container". If it doesn't, find the nearest
        ancestor that does */
        if (currentObject !== undefined) {
            currentObject = jafrajarvy292.DavidModal.privateFindNearestContainer(currentObject);
        }
        /* If object is still undefined at this point, look look for any element with class "showdavidmodal",
        since that class only appears on the modal being displayed */
        if (currentObject === undefined) {
            currentObject = document.getElementsByClassName('showdavidmodal')[0];
        }

        /* If the object is still undefined at this point, then we could not locate the davidmodal being
        shown */
        if (currentObject === undefined) {
            console.log('Unable to hide the davidmodal item currently being shown.');
            return;
        }

        //Toggle the element's classes to fade out the modal
        currentObject.classList.remove('showdavidmodal');
        currentObject.classList.add('hidedavidmodal');

        /* Calculate the delay for when the callback should be ran by seeing how long the animation is
        set for in the CSS. We run the callback function after the animation is done */
        let animationDuration = parseFloat(window.getComputedStyle(currentObject)['animationDuration']) * 1000;
        
        setTimeout(function()
        {
            //Hides the modal after the fade out has completed
            currentObject.style.display = 'none';
            
            //Runs the callback function
            if (callback !== undefined)
            {
                callback();
            }
        },animationDuration);

        //Return reference to the modal container that was faded out / hidden
        return currentObject;
    }

    /**
     * This immediately removes the modal container from the DOM with no fade out effect
     * @param {Element} [object] The modal container you want to remove. If nothing is provided, the
     * code will attempt to locate it
     */
    static removeModal(object = undefined)
    {
        let currentObject = object;
        /* Make sure the element being passed in has a "davidmodal-container". If it doesn't, find the nearest
        ancestor that does */
        if (currentObject !== undefined) {
            currentObject = privateFindNearestContainer(currentObject);
        }
        /* If no object is provided or the object passed in isn't part of a "davidmodal-container" set, look
        look for any element with class 'showdavidmodal', since that class only appears on the modal
        being shown */
        if (currentObject === undefined) {
            currentObject = document.getElementsByClassName('showdavidmodal')[0];
        }

        /* If the object is still undefined at this point, then we could not locate the davidmodal being shown */
        if (currentObject === undefined) {
            console.log('Unable to hide the davidmodal item currently being shown.');
            return;
        }
        currentObject.parentNode.removeChild(currentObject);
    }

    /**
     * This will fade out the modal container, then remove it from the DOM and run any callback function
     * @param {Element} [object] The modal container you want to fade out and remove. If nothing is
     * provided, the code will attempt to locate it
     * @param {Function} [callback] The callback function to be ran after fade out is complete
     */
    static hideRemoveModal(object = undefined, callback = undefined)
    {
        let currentObject = object;
        /* Make sure the element being passed in has a "davidmodal-container". If it doesn't, find the nearest
        ancestor that does */
        if (currentObject !== undefined) {
            currentObject = jafrajarvy292.DavidModal.privateFindNearestContainer(currentObject);
        }
        /* If object is still undefined at this point, look look for any element with class "showdavidmodal",
        since that class only appears on the modal being displayed */
        if (currentObject === undefined) {
            currentObject = document.getElementsByClassName('showdavidmodal')[0];
        }

        /* If the object is still undefined at this point, then we could not locate the davidmodal being
        shown */
        if (currentObject === undefined) {
            console.log('Unable to hide the davidmodal item currently being shown.');
            return;
        }

        //Toggle the element's classes to fade out the modal
        currentObject.classList.remove('showdavidmodal');
        currentObject.classList.add('hidedavidmodal');

        /* Calculate the delay for when the callback should be ran by seeing how long the animation is
        set for in the CSS. */
        let animationDuration = parseFloat(window.getComputedStyle(currentObject)['animationDuration']) * 1000;
        
        //Remove node from DOM and run callback, if any, after fade out animation is done
        setTimeout(function()
        {            
            //If not callback function is present, then just remove the modal from the DOM
            if (callback === undefined)
            {
                currentObject.parentNode.removeChild(currentObject);
            //If callback functions is present, run it, then remove modal from the DOM
            } else {
                callback();
                currentObject.parentNode.removeChild(currentObject);
            }
        },animationDuration);
    }
};

/**
 * As soon as the DOM is loaded, we'll run the init function to set up a few things
 */
(function() {
    //Run needed tasks as soon as DOM is loaded
    document.addEventListener('DOMContentLoaded', function() {
        /* Declare global variable to store the body's background color, since we'll be working with this 
        multiple times */
        jafrajarvy292.DavidModal.iFrameBgColor = jafrajarvy292.DavidModal.privateGetBodyBgColor();
        /* Initialize our plugin */
        jafrajarvy292.DavidModal.init()
    });
})();