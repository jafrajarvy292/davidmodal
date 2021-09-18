# davidmodal
Yet another plugin for modal windows. I created this because I was having a hard time finding a library that didn't rely on jquery. This one uses plain javascript, so no jquery or other libraries needed. All the interesting names were already taken, so I just named this after myself and called it a day.

This library can do 2 things:
- Allows you to display a hyperlink within a modal window when the user clicks it. This overrides the default browser behavior where clicking a hyperlink navigates the browser to the URL.
- Allows you to display a section of the page within a modal window. That is, when an event is triggered, it can unhide a portion of the page and display it within a modal.

## Setup
The stylesheet must be imported. The script file must be imported towards the end of the body. Example below:
```
<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" href="davidmodal.css">
</head>
<body>
    [...]
    <script src="davidmodal.js"></script>
</body>
</html>
```
The script is run when the page is fully loaded (i.e. DOMContentLoaded). The script will look for all elements with a class of `davidmodal` and apply the necessary preparations to them. Mainly, it will look for 2 types of elements:
1. Those elements containing a `davidmodal` class but no href attribute will be prepared such that you'll be able to unhide these elements and have them displayed within a modal window. Closing the modal simply hides them again.
2. Those elements containing a `davidmodal` class with an href attribute will have `click` event listeners added to them. When the user clicks these elements/links, an iframe will be created on-the-spot and the contents of the destination URL loaded into it. When the user closes the iframe, the iframe is removed entirely from the DOM. Clicking the element/link again will once again re-create the iframe and so on.

This library uses a namespace of `jafrajarvy292` and a class name of `DavidModal`. This library uses all static methods, so there will never be a need to create an instance of the class.  To call any of its methods, you'd use a syntax like the following:
`jafrajarvy292.DavidModal.showModal(element);`

## Displaying a Hyperlink's URL within a Modal Window (ie. iframe)
To display a link within a modal window, as opposed to having the browser navigate to the URL, give the element a class of `davidmodal` and ensure it has either an `href` or a `data-davidmodalhref` attribute with the value being the target URL. The library will add a `click` event listener to that element. When it is clicked, a modal is created on-the-spot and faded in with the target displayed within it. When the "x" button that appears at the top-right of the modal is clicked, the modal is faded out and removed from the DOM. The library does not require that the link be contained with an `<a>` element. Any element that has the `davidmodal` class and either an `href` or `data-davidmodalhref` attribute will be processed into a modal. Sample below of an `<a>` approach and one using a `<button>`:
```
<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" href="davidmodal.css">
</head>
<body>
    <a href="https://example.com/" class="davidmodal">Click here to display this website
    within a modal</a>
    <br />
    <br />
    <button href="child.html" class="davidmodal">Click here to bring up a page
    within your current site as a modal</button>
    <script src="davidmodal.js"></script>
</body>
</html>
```

## Display a Section of the Page Within a Modal Window
To display a section of the current page within a modal window, simply give the section a class of `davidmodal` and call the `showModal()` function on that element when you are ready to display it. In our example below, we added an event listener to a button. Upon clicking the button, we'll run the `showModal()` method against the element we gave the `davidmodal` class to. It's recommended that you set the element's initial display style to none (i.e. `display: none;`. This isn't required, as the script will hide these elements, but due to the short duration needed for the script to fully run upon page load, the user might momentarily see your element.
```
<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" href="davidmodal.css">
</head>
<body>
    <button id="my_button">Click to display a hidden section of the page</button>
    <div id="my_section" class="davidmodal" style="display: none;">
        <p>Testing</p>
        <p>Testing</p>
        <p>Testing</p>
        <p>Testing</p>
    </div>
    <script src="davidmodal.js"></script>
    <script>
        document.getElementById('my_button').addEventListener('click', function() {
            jafrajarvy292.DavidModal.showModal(document.getElementById('my_section'));
        });
    </script>
</body>
</html>
```
## Closing the Modal
Every modal that is displayed can be closed via the "x" button that appears at the top-right of the window. With modals that display contents of a hyperlink as an iframe, the "x" button will cause the modal to fade out and then remove that iframe from the DOM. Clicking the hyperlink will create the modal again on-the-spot. With modals that display a section of the page, the "x" button will fade out the modal and hide it, but will not remove it.

The library comes with several methods that can be called to trigger "close" behaviors. These allow you to close the modal on your own terms, instead of relying on the user to click the "x" button.

- `jafrajarvy292.DavidModal.hideModal(object = undefined, callback = undefined)` - This will fade out the target modal. If a callback function is passed in, it will run the callback after the fade effect is done. This method is intended to be used with modals that display a section of the current page. You may also pass in only a callback function without the target modal, treating the function like the following:  
`jafrajarvy292.DavidModal.hideModal(callback = undefined)`
In this use case, the script will attempt to locate the modal that is currently being displayed and hide that. Since only one modal should be displayed at a time, the script is almost guaranteed to target the correct modal.
- `jafrajarvy292.DavidModal.hideRemoveModal(object = undefined, callback = undefined)` - This will fade out the target modal, then remove it from the DOM. If a callback function is passed in, it will run the callback after the fade out animation is complete. This method is intended to be used with modals that display a URL as an iframe. You may also pass in only a callback function without the target modal, treating the function like the following:  
`jafrajarvy292.DavidModal.hideRemoveModal(callback = undefined)`
Like the prior method, if the modal element is not specified, the script is almost guaranteed to target the correct element.
- `jafrajarvy292.DavidModal.removeModal(object = undefined)` - This will remove the target modal from the DOM immediately. There will not be any fade out effect. This method is intended to be used with modals that display a URL as an iframe.

To reiterate, these methods don't require that you pass in an element. Since only one modal window can be displayed at a time, if you do not pass in an element, the library will search for the modal currently being displayed and apply the method to that.

## Closing the Modal from the Child Window
In scenarios where a hyperlink is being displayed as a modal window (i.e. via iframe), you may sometimes want to close the modal through an event listener attached to the child/iframe. To do that, you'll need to call the method through the parent window. Below is an example method you'd call from within the child window to force the parent window to run the `hideRemoveModal()` method:
`parent.jafrajarvy292.DavidModal.hideRemoveModal();`

## Extra Stuff
- `davidmodal-x-refresha` - Asynchronous refresh. Adding this class to the same element where `davidmodal` is placed will enhance the x button to also refresh the page. If the modal is an iframe, then then it will refresh the parent page. The refresh will occur at the same time the modal is fading out, giving the refresh process a head start.
- `davidmodal-x-refreshs` - Similar to the `davidmodal-x-refresha` class, but the refresh is done synchronously. That is, it triggers after the fade out animation is complete.
- The event listener this library creates to trigger the display of the modal is a `click` event. If you need an element that doesn't support a `click` event to trigger the modal, create a separate event listener to trigger the click event. For example:
```
document.getElementById('my_dropdown').addEventListener('change', function(e) {
    if (e.target.value === 'edit') {
        document.getElementById('my_modal').click();
    }
});
```

## Notes
- I recommend you download the sample files to get a feel for how the library works. You may also read through the comments in the javascript file to see details of each method.
- The classes found within the library's CSS file are intended to be used by the library only. They are not meant for you to apply directly to your elements. The only class you should be applying directly to your elements is `davidmodal` and any optional ones that have been specifically mentioned.
- If you need to override any of the library's default CSS values, you can consider adding a `<style>` section to the beginning of your HTML and redefining any of the class styles, such as opacity, animation duration, widths, etc.
- The `init()` function is responsible for processing all elements with a class of `davidmodal`. It normally only runs after the DOM is fully loaded and only that one time. Because the DOM can only fully load once, that also means the init() function only onces one per page load. If you happen to add any new elements containing the `davidmodal` class to the DOM after the initial page load, you can run the init() function again to process these new items. Use `jafrajarvy292.DavidModal.init()`.
