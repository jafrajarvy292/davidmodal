# davidmodal
Yet another plugin for modal windows. I created this because I was having a hard time finding a library that didn't rely on jquery. This one uses plain javascript, so no jquery or other libraries needed. All the interesting names were already taken, so I just named this after myself and called it a day.

This library can do 2 things:
- Allow you to display a hyperlink within a modal window, as opposed to the default behavior of navigating the browser to that URL.
- Allow you to display a section of the page within a modal window.

## Setup
The stylesheet must be imported. The script file must be imported towards the end of the body.
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
When the page is loaded, the script will look for all elements with a class of ```davidmodal``` and apply the necessary preparations to them. This library uses a namespace of ```jafrajarvy292``` and a class name of ```DavidModal```. This library uses all static methods, so there will never be a need to create an instance of the class.  To call any of its methods, you'd use a syntax like the following:
```
jafrajarvy292.DavidModal.showModal(element);
```

## Displaying a Hyperlink Within a Modal Window
To display a link within a modal window, give the element a class of ```davidmodal``` and ensure it has an ```href``` attribute. The library will add a ```click``` event listener to that element. When it is clicked, the modal is created on-the-spot and faded in. When the x button that appears at the top-right of the modal is clicked, the modal is faded out and removed from the DOM. The library does not require that the link be contained with an ```<a href>``` element. Any element that has the ```davidmodal``` class and an ```href``` attribute will be processed into a modal. Sample below:
```
<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" href="davidmodal.css">
</head>
<body>
    <a href="https://www.verizon.com" class="davidmodal">Click here to bring up Verizon's website as a modal</a>
    <br />
    <br />
    <button href="/sample.html" class="davidmodal">Click here to bring up a page within your current site as a modal</button>
    <script src="davidmodal.js"></script>
</body>
</html>
```

## Display a Section of the Page Within a Modal Window
To display a section of the current page within a modal window, simply give the section that is to be displayed a class of ```davidmodal``` and call the function to display it. Example below:
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
Note that the ```showModal()``` method requires that you pass in an element that is either the modal container (the one with a ```davidmodal-container``` class or any element under the container. If you pass in an element that is under a modal container, the library will search for the ```davidmodal-container``` ancestor and apply the method to that.

## Closing the Modal
Every modal that is displayed can be closed via the "x" button that appears at the top-right of the window. With modals that display contents of a hyperlink, the "x" button will fade out and them remove that modal from the DOM. Clicking the hyperlink will create the modal again on-the-spot. With modals that display a section of the page, the "x" button will fade out the modal, but will not remove it.

The library comes with several methods that can be called to trigger these behaviors, as well. This allows you to trigger these methods without the user having to click the "x" button.

- ```jafrajarvy292.DavidModal.hideModal(object = undefined, callback = undefined)``` - This will fade out the target modal. If a callback function is passed in, it will run the callback after the fade effect is done.
- ```jafrajarvy292.DavidModal.hideRemoveModal(object = undefined, callback = undefined)``` - This will fade out the target modal, then remove it from the DOM. If a callback function is passed in, it will run the callback after the fade out animation is complete.
- ```jafrajarvy292.DavidModal.removeModal(object = undefined)``` - This will remove the target modal from the DOM immediately. There will no be any fade out effect.

Like the ```showModal()``` method, the elements pass into these methods does not need to be the modal container (the one with a ```davidmodal-container``` class). It could be any element that is contained within a modal container and, if so, the library will search for the nearest ```davidmodal-container``` ancestor. Finally, these methods don't even require that you tell it which modal you wish to appply the behavior to. Since only one modal window should be showing at a time, if you do not pass in a specific element, library will search for any modal container that has a class of ```showdavidmodal```, since that is present on any modal actively being displayed.

## Closing the Modal from the Child Window
In scenarios where a hyperlink is being displayed as a modal window, you may sometimes want to close the modal through an event listener attached to the child. To do that, you'll need to call the method through the parent window. Below is an example method you'd call from within the child window to force the parent window to run the method:
```
parent.jafrajarvy292.DavidModal.hideRemoveModal();
```

## Notes
I recommend you download the sample files to get a feel for how the library works. You may also read through the comments in the javascript file to see details of each method.
