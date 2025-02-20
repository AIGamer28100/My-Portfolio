var $ = jQuery.noConflict();

(function($) {
    "use strict";
    
    var width  =  $(window).width();
    var height  =  $(window).height();
    
    /*-------------------------------------------------*/
    /* =  Mobile Hover
    /*-------------------------------------------------*/
    var mobileHover = function () {
        $('*').on('touchstart', function () {
            $(this).trigger('hover');
        }).on('touchend', function () {
            $(this).trigger('hover');
        });
    };

    mobileHover();
    /*-------------------------------------------------*/
    /* =  loader
    /*-------------------------------------------------*/
    Pace.on("done", () => {
        $("#myloader .reveal-first").addClass("is-active");
        $("#myloader .reveal-second").addClass("is-active");
        setTimeout(() => { 
            $("#myloader .reveal-first").fadeOut(1000);
        }, 100);
        setTimeout(() => { 
            $("#grid .grid-line").addClass('loaded');
        }, 500);
        document.body.classList.remove("stop-scrolling");
        $(window).scrollTop(0);
    });
    
    /*-------------------------------------------------*/
    /* =  Sticky menu
    /*-------------------------------------------------*/
    $(window).resize(function () {
        var currentwidth  =  $(window).width();
        
        if(currentwidth < 992) {
            rellax.destroy();
        }
        if(currentwidth > 992 && currentwidth != 1024 && currentwidth != 1366) {
            location.reload();
        }
    });

    /*-------------------------------------------------*/
    /* =  Paralaax 
    /*-------------------------------------------------*/
    if(width<992){
        $(".moove").removeClass("moove");
        // var rellax = new Rellax('.moove-mobile');
    }
    if(width>991){
        var rellax = new Rellax('.moove');
        // $(".moove-mobile").removeClass("moove-mobile");
    }

    /*-------------------------------------------------*/
    /* =  Lazy Loading
    /*-------------------------------------------------*/

    // This event listener ensures that the code runs after the DOM content is fully loaded.
    document.addEventListener("DOMContentLoaded", function () {
        // Define the lazyLoad function, which checks if lazyload images are in the viewport and loads them.
        const lazyLoad = function () {
            // Select all elements with the "lazyload" class, which are images intended for lazy loading.
            const lazyImages = document.querySelectorAll(".lazyload");

            lazyImages.forEach(function (img) {
                // Check if the top and bottom of the image are in the viewport and if the image is visible.
                if (img.getBoundingClientRect().top <= window.innerHeight + 100 && img.getBoundingClientRect().bottom >= 0 && getComputedStyle(img).display !== "none") {
                    // If the conditions are met, set the image's src attribute to the value stored in its data-src attribute.
                    img.src = img.dataset.src;
                    // Remove the "lazyload" class to mark the image as loaded.
                    img.classList.remove("lazyload");
                }
                return;
            });
        };
    
        // Initially run the lazyLoad function to load images visible on page load.
        lazyLoad();
    
        // Add event listeners to call the lazyLoad function when the page is scrolled, resized, or the orientation changes.
        document.addEventListener("scroll", lazyLoad);
        window.addEventListener("resize", lazyLoad);
        window.addEventListener("orientationchange", lazyLoad);
    });


    /*-------------------------------------------------*/
    /* =  Remove wrap-social on bottom
    /*-------------------------------------------------*/
    document.addEventListener("DOMContentLoaded", function(){
        const hide_pointer = document.querySelector('footer').getBoundingClientRect().top
        const wrap_socials = document.querySelector('#wrap-social')
        const socials = () => {
            const right_margin = 100;
            const current_ratio = (window.scrollY / hide_pointer)
            const right = 85 - (current_ratio * right_margin)
            if (right < 2) {
                wrap_socials.style.right = `${right}vh`;
                wrap_socials.style.opacity = right;
            } else {
                wrap_socials.style.right = '2vh';
                wrap_socials.style.opacity = 1;
            }
        }

        // Initially run the socials function to be visible on page load.
        socials();

        // Add event listeners to call the socials function when the page is scrolled, resized, or the orientation changes.
        document.addEventListener("scroll", socials);
        window.addEventListener("resize", socials);
        window.addEventListener("orientationchange", socials);
        console.log((window.innerHeight))
    });

})(jQuery);