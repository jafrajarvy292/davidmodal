/**
 * This plugin serves 2 purposes:
 * 1. Converts hyperlinks to load the target as a modal window, intead of navigating the browser to it
 * 2. Allows you to toggle the display/hiding of a section of the page as a modal
 * 
 * In both use cases, the styling and fade in/out effects are all handled for you. The key is to
 * add a class of "davidmodal" to elements you want to to have this plugin handle. If the element contains
 * an "href" attribute, then those will be displayed as a modal when clicked. Any elements that have
 * "davidmodal" class, but not "href" attribute, then you will need to add the necessary event listener
 * to toggle the display/hiding of it.
 */

(function() {
    //Wait until content (i.e. the body) is loaded before looking for items to process
    document.addEventListener('DOMContentLoaded', processDavidModals);

    /* This looks for all elements with a class of "davidmodal" and processes them */
    function processDavidModals()
    {
        /* Set the background color of the modal to match that of the body element. We do this so that the
        modal's background isn't transparent */
        let iFrameBackground = getBodyBackgroundColor();
        if (iFrameBackground === 'transparent') {
            iFrameBackground = 'white';
        }

        //Loops through all elements that have a class of "davidmodal" and process them
        let elements = document.getElementsByClassName('davidmodal');
        for (i = 0; i < elements.length; i++) {
            /* If the element does not have an href value, then user probably wants to display the container
            within a modal. We'll create the necessary modal elements and append this item to those. What
            we are essentially doing is swapping out the user's element with our modal and then appending
            that element as a child to our modal */
            if (elements[i].getAttribute('href') === null || elements[i].getAttribute('href').trim() === '') {
                //Create the modal container
                let modalContainer = document.createElement('div');
                modalContainer.classList.add('davidmodal-container');
                
                //Create the modal content container
                let modalContent = document.createElement('div');
                modalContent.classList.add('davidmodal-content');
                modalContent.style.backgroundColor = iFrameBackground;
    
                //Create the x button for closing. Closing means we're just fading out the modal
                let modalX = document.createElement('div');
                modalX.classList.add('davidmodal-x');
                modalX.addEventListener('click', function() {
                    hideDavidModal(modalContainer);
                });

                //Append the content and close button to the container
                modalContainer.appendChild(modalContent);
                modalContainer.appendChild(modalX);

                //Append the container to the body as a sibling to the user's element
                elements[i].parentNode.insertBefore(modalContainer, elements[i]);

                //Append the user's element to the content container. In other words, "move" it into there
                modalContent.appendChild(elements[i]);
            /* If element has href value, then the user wants to dispay this as an iframe. */
            } else {
                /* Add event listener to each of these elements; when clicked, will create the modal
                and fade it in */
                elements[i].addEventListener('click', function(e) {
                    e.preventDefault();
                    
                    //Create the modal container
                    let modalContainer = document.createElement('div');
                    modalContainer.classList.add('davidmodal-container');
                    
                    //Create the iframe
                    let modalContent = document.createElement('iframe');
                    modalContent.classList.add('davidmodal-content');
                    modalContent.src = e.target.getAttribute('href');
                    modalContent.style.backgroundColor = iFrameBackground;
        
                    /* Create the x button for closing. Closing means we'll fade out and then remove the modal
                    from the DOM */
                    let modalX = document.createElement('div');
                    modalX.classList.add('davidmodal-x');
                    modalX.addEventListener('click', function() {
                        hideRemoveDavidModal(modalContainer);
                    });
        
                    //Append content and close button to the container
                    modalContainer.appendChild(modalContent);
                    modalContainer.appendChild(modalX);

                    //Append the container to the body
                    document.body.appendChild(modalContainer);
        
                    //Fade in the container
                    showDavidModal(modalContainer);
                });
            }
        }
    }

    /**
     * This function returns the computed background-color of the document's body element. If the
     * if it is transparent, then returns 'transparent', else returns the color.
     * @returns {string}
     */
    function getBodyBackgroundColor()
    {
        let sampleElement = document.createElement('p');
        sampleElement.style.display = 'none';
        document.body.appendChild(sampleElement);
        
        //Get background color of the test element, which should be transparent
        let transparent = window.getComputedStyle(sampleElement).getPropertyValue('background-color');
        
        //Get background color of the body
        let bodyBackground = window.getComputedStyle(document.body).getPropertyValue('background-color');

        //Remove sample element from DOM
        sampleElement.parentNode.removeChild(sampleElement);

        if (bodyBackground === transparent) {
            return 'transparent';
        } else {
            return bodyBackground;
        }
    }
})();

/**
 * Fades in a modal container
 * @param {Element} object The modal container to fade in
 */
function showDavidModal(object)
{
    /* Make sure the element being passed in has a "davidmodal-container". If it doesn't, find the nearest
    ancestor that does */
    currentObject = findNearestDavidModal(object);
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
 */
function hideDavidModal(object = undefined, callback = undefined)
{
    let currentObject = object;
    /* Make sure the element being passed in has a "davidmodal-container". If it doesn't, find the nearest
    ancestor that does */
    if (currentObject !== undefined) {
        currentObject = findNearestDavidModal(currentObject);
    }
    /* If no object is provided or the object passed in isn't part of a "davidmodal-container" set, look
    look for any element with class 'showdavidmodal', since that class only appears on the modal
    being displayed */
    if (currentObject === undefined) {
        currentObject = document.getElementsByClassName('showdavidmodal')[0];
    }

    /* If the object is still undefined at this point, then we could not locate the davidmodal being shown */
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
}

/**
 * This immediately removes the modal container from the DOM with no fade out effect
 * @param {Element} [object] The modal container you want to remove. If nothing is provided, the
 * code will attempt to locate it
 */
function removeDavidModal(object = undefined)
{
    let currentObject = object;
    /* Make sure the element being passed in has a "davidmodal-container". If it doesn't, find the nearest
    ancestor that does */
    if (currentObject !== undefined) {
        currentObject = findNearestDavidModal(currentObject);
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
 * This will fade out the modal container, then remove it from the DOM
 * @param {Element} [object] The modal container you want to fade out and remove. If nothing is
 * provided, the code will attempt to locate it
 * @param {Function} [callback] The function to be ran after fade out is complete
 */
function hideRemoveDavidModal(object = undefined, callback = undefined)
{
    let currentObject = object;
    /* Make sure the element being passed in has a "davidmodal-container". If it doesn't, find the nearest
    ancestor that does */
    if (currentObject !== undefined) {
        currentObject = findNearestDavidModal(currentObject);
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

    /* Fade out the modal, run the callback, then remove modal from DOM. Removal must come after the
    callback is ran, otherwise it won't work */
    hideDavidModal(currentObject, function() {
        if (callback !== undefined) {
            callback();
        }
        currentObject.parentNode.removeChild(currentObject);
    });
}

/**
 * Checks to see if the object passed in contains a "davidmodal-container" class. If so, returns it. If not,
 * returns the nearest ancestor that does or returns undefined it none found
 * @param {Element} object The element we are checking
 * @returns {Element|undefined} The element that was passed in or the nearest ancestor having
 * "davidmodal-container" class. If none found, returns undefined.
 */
function findNearestDavidModal(object)
{
    let containerFound = false;
    //Keep checking parent until we find one that has the needed class or until we get to the body element
    if (object.classList.contains('davidmodal-container')) {
        return object;
    } else {
        while (containerFound !== true && object !== document.body) {
            object = object.parentNode;
            if (object.classList.contains('davidmodal-container')) {
                return object;
            }
        }
        return undefined;
    }
}