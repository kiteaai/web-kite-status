# Kite System Status

A front-end web app hosted on [GitHub Pages](https://pages.github.com) that displays the current status of Kite Suite applications for use as an iframe on ATS managed websites.

You can view the current deployment of this widget [here](https://kiteaai.github.io/web-kite-status/).

Currently in use on the following sites:

 - [https://ksassessments.org](https://ksassessments.org)
 - [https://dynamiclearningmaps.org](https://dynamiclearningmaps.org)

Status data is currently tracked manually via a JSON file hosted on [jsonbin.io](https://jsonbin.io) and is **not** connected to the actual Kite applications (yet?).

# How It Works ⚙️

This widget is entirely client-side and utilizes the native JavaScript [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) to obtain a JSON file on page load.

Once the resource fetch is resolved, the JSON is parsed for display (date calculations, uptime percentage, conditional display properties, etc.) and passed to a compiled and a [handlebars](https://handlebarsjs.com) template which is then added to the DOM.

In order to properly display the rendered page in an iframe on the destination site, [iframe-resizer](https://github.com/davidjbradshaw/iframe-resizer) is used to send information about the page size to the client from the hosted GitHub Pages page.

## Example

An example of how to include iframes for both applications on a website (with bootstrap).
```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/iframe-resizer/4.3.2/iframeResizer.min.js" integrity="sha512-dnvR4Aebv5bAtJxDunq3eE8puKAJrY9GBJYl9GC6lTOEC76s1dbDfJFcL9GyzpaDW4vlI/UjR8sKbc1j6Ynx6w==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>      

<div class="container p-5 mx-auto row">
    <div class="row mb-4">
        <div class="col-xl-6 mb-4">                            
            <iframe class="w-100 border" id="ep" onload="registerIFrame(this)" src="embed/app?name=Educator%20Portal&src=dev"></iframe>
        </div> 
        <div class="col-xl-6 mb-4">
            <iframe class="w-100 border" id="sp" onload="registerIFrame(this)" src="embed/app?name=Student%20Portal&src=dev"></iframe>
        </div>  
    </div>               
</div>     

<script>

    var options = {
        log: false,
        autoResize: true,
        onMessage: function (e) {

        }
    }

    function registerIFrame(iframe) {
        iFrameResize(options, `#${iframe.id}`)
        document.getElementById(iframe.id).classList.remove('d-none')
    }

</script>
```

## How To Update
See [Kite Status JSON](https://github.com/kiteaai/web-kite-status-json) for more information.