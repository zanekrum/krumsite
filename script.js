gsap.registerPlugin(ScrollTrigger);

//Reset Webflow Data
function resetWebflow(data) {
  let parser = new DOMParser();
  let dom = parser.parseFromString(data.next.html, "text/html");
  let webflowPageId = $(dom).find("html").attr("data-wf-page");
  $("html").attr("data-wf-page", webflowPageId);
  window.Webflow && window.Webflow.destroy();
  window.Webflow && window.Webflow.ready();
  window.Webflow && window.Webflow.require("ix2").init();
}

//Home Marquee

function homeMarquee() {
  function attr(defaultVal, attrVal) {
    const defaultValType = typeof defaultVal;
    if (typeof attrVal !== "string" || attrVal.trim() === "") return defaultVal;
    if (attrVal === "true" && defaultValType === "boolean") return true;
    if (attrVal === "false" && defaultValType === "boolean") return false;
    if (isNaN(attrVal) && defaultValType === "string") return attrVal;
    if (!isNaN(attrVal) && defaultValType === "number") return +attrVal;
    return defaultVal;
  }
  // marquee component
  $("[tr-marquee-element='component']").each(function (index) {
    let componentEl = $(this),
      panelEl = componentEl.find("[tr-marquee-element='panel']"),
      triggerHoverEl = componentEl.find("[tr-marquee-element='triggerhover']"),
      triggerClickEl = componentEl.find("[tr-marquee-element='triggerclick']");
    let speedSetting = attr(100, componentEl.attr("tr-marquee-speed")),
      verticalSetting = attr(false, componentEl.attr("tr-marquee-vertical")),
      reverseSetting = attr(false, componentEl.attr("tr-marquee-reverse")),
      scrollDirectionSetting = attr(
        false,
        componentEl.attr("tr-marquee-scrolldirection")
      ),
      scrollScrubSetting = attr(
        false,
        componentEl.attr("tr-marquee-scrollscrub")
      ),
      moveDistanceSetting = -100,
      timeScaleSetting = 1,
      pausedStateSetting = false;
    if (reverseSetting) moveDistanceSetting = 100;
    let marqueeTimeline = gsap.timeline({
      repeat: -1,
      onReverseComplete: () => marqueeTimeline.progress(1)
    });
    if (verticalSetting) {
      speedSetting = panelEl.first().height() / speedSetting;
      marqueeTimeline.fromTo(
        panelEl,
        { yPercent: 0 },
        { yPercent: moveDistanceSetting, ease: "none", duration: speedSetting }
      );
    } else {
      speedSetting = panelEl.first().width() / speedSetting;
      marqueeTimeline.fromTo(
        panelEl,
        { xPercent: 0 },
        { xPercent: moveDistanceSetting, ease: "none", duration: speedSetting }
      );
    }
    let scrubObject = { value: 1 };
    ScrollTrigger.create({
      trigger: "body",
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        if (!pausedStateSetting) {
          if (scrollDirectionSetting && timeScaleSetting !== self.direction) {
            timeScaleSetting = self.direction;
            marqueeTimeline.timeScale(self.direction);
          }
          if (scrollScrubSetting) {
            let v = self.getVelocity() * 0.006;
            v = gsap.utils.clamp(-60, 60, v);
            let scrubTimeline = gsap.timeline({
              onUpdate: () => marqueeTimeline.timeScale(scrubObject.value)
            });
            scrubTimeline.fromTo(
              scrubObject,
              { value: v },
              { value: timeScaleSetting, duration: 0.5 }
            );
          }
        }
      }
    });
    function pauseMarquee(isPausing) {
      pausedStateSetting = isPausing;
      let pauseObject = { value: 1 };
      let pauseTimeline = gsap.timeline({
        onUpdate: () => marqueeTimeline.timeScale(pauseObject.value)
      });
      if (isPausing) {
        pauseTimeline.fromTo(
          pauseObject,
          { value: timeScaleSetting },
          { value: 0, duration: 0.5 }
        );
        triggerClickEl.addClass("is-paused");
      } else {
        pauseTimeline.fromTo(
          pauseObject,
          { value: 0 },
          { value: timeScaleSetting, duration: 0.5 }
        );
        triggerClickEl.removeClass("is-paused");
      }
    }
    if (window.matchMedia("(pointer: fine)").matches) {
      triggerHoverEl.on("mouseenter", () => pauseMarquee(true));
      triggerHoverEl.on("mouseleave", () => pauseMarquee(false));
    }
    triggerClickEl.on("click", function () {
      !$(this).hasClass("is-paused") ? pauseMarquee(true) : pauseMarquee(false);
    });
  });
}
homeMarquee();

function imageReveal() {
  $(".img_wrap").each(function (index) {
    let triggerElement = $(this);
    let targetElement = $(this);

    let tl = gsap.timeline({
      scrollTrigger: {
        trigger: $(this),
        start: "top 80%",
        toggleActions: "play none play reverse"
      }
    });
    // TOGGLE ACTIONS ORDER
    // element enters view from screen bottom
    // element exits view from screen top
    // element re-enters view from screen top
    // element re-exits view from screen bottom

    tl.fromTo(
      $(this),
      { clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)" },
      {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
        duration: 2,
        ease: "power2.out"
      }
    ).from(
      $(this).find(".img-move"),
      {
        duration: 2,
        y: 100
      },
      0
    );
  });
}
imageReveal();
// Page Loader
function createAnimation() {
  $(".line").each(function (index) {
    let tl = gsap.timeline({
      scrollTrigger: {
        trigger: $(this),
        // trigger element - viewport
        start: "top 70%",
        end: "bottom center",
        scrub: 1
      }
    });
    tl.to($(this).find(".line-mask"), {
      width: "0%",
      duration: 1
    });
  });
}
createAnimation();
// Image Animation
let tlGrow = gsap.timeline({
  scrollTrigger: {
    trigger: ".home-opener-content_wrap",
    start: "top bottom",
    end: "top top",
    scrub: true
  }
});

tlGrow.fromTo(
  ".home-opener-content_wrap",
  {
    clipPath: "polygon(40% 0%, 60% 0%, 40% 100%, 60% 100%)"
  },
  {
    clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)"
  }
);
tlGrow.to(
  ".home-opener-content",
  {
    scale: 1.1
  },
  0
);
// On Page Load
function pageLoad() {
  $(window).scrollTop(0);
  let typeSplit = new SplitType(".display", {
    types: "words",
    /* words, chars, lines */
    tagName: "span"
  });
  let typeSplitp = new SplitType(".h-p", {
    types: "lines",
    /* words, chars, lines */
    tagName: "span"
  });
  let tl = gsap.timeline();

  tl.to(".hero_wrap", { opacity: 1, duration: 0 });
  tl.from(
    ".display .word",
    {
      y: "100%",
      stagger: { each: 0.04 },
      ease: "power3.out",
      duration: 2,
      opacity: 0
    },
    0.1
  );

  tl.from(
    ".u-img-cover",
    {
      y: "-100%",
      ease: "power3.inOut",
      duration: 2,
      opacity: 0
    },
    0
  );
  tl.from(
    ".port_details-grid",
    {
      y: "100%",
      ease: "power3.inOut",
      duration: 2,
      opacity: 0
    },
    0
  );
  tl.from(
    ".kicker.h-k",
    {
      y: "100%",
      ease: "power3.out",
      duration: 2,
      opacity: 0
    },
    0
  );
  tl.from(
    ".home-hero_img",
    {
      y: "10%",
      ease: "power3.out",
      duration: 2,
      opacity: 0
    },
    0.2
  );
  tl.from(
    ".h-d",
    {
      ease: "power3.out",
      duration: 1,
      opacity: 0
    },
    0
  );
  tl.from(
    ".marquee-text_icon",
    {
      ease: "power3.out",
      y: "200%",
      duration: 2,
      opacity: 0
    },
    0.1
  );
  tl.from(
    ".h-p .line",
    {
      y: "100%",
      ease: "power3.out",
      stagger: 0.1,
      duration: 2,
      opacity: 0
    },
    0.2
  );
  tl.from(
    ".h-b",
    {
      y: "100%",
      ease: "power3.out",
      duration: 2,
      opacity: 0
    },
    0.5
  );
}

pageLoad();

function textLa() {
  $("[js-line-animation]").each(function (index) {
    gsap.set($(this), { autoAlpha: 1 });
    let textEl = $(this);
    let textContent = $(this).text();
    let tl;

    function splitText() {
      new SplitType(textEl, { types: "words, lines", tagName: "span" });
      textEl.find(".line .word").each(function (index) {
        let lineContent = $(this).html();
        $(this).html("");
        $(this).append(
          `<span class="line-inner" style="display: block;">${lineContent}</span>`
        );
      });
      tl = gsap.timeline({
        scrollTrigger: {
          trigger: textEl,
          start: "top bottom",
          end: "bottom bottom",
          toggleActions: "none play none reset"
        }
      });
      tl.fromTo(
        textEl.find(".line-inner"),
        { yPercent: 120 },
        {
          yPercent: 0,
          duration: 1,
          ease: "power2.out",
          stagger: { amount: 0.2, ease: "power2.out" }
        }
      );
    }
    splitText();

    let windowWidth = window.innerWidth;
    window.addEventListener("resize", function () {
      if (windowWidth !== window.innerWidth) {
        windowWidth = window.innerWidth;
        tl.kill();
        textEl.text(textContent);
        splitText();
      }
    });
  });
}

textLa();

function textCtaa() {
  $("[js-letter-animation]").each(function (index) {
    gsap.set($(this), { autoAlpha: 1 });
    let textEl = $(this);
    let textContent = $(this).text();
    let tl;

    function splitText() {
      new SplitType(textEl, { types: "chars, lines", tagName: "span" });
      textEl.find(".char, .line").each(function (index) {
        let lineContent = $(this).html();
        $(this).html("");
        $(this).append(
          `<span class="line-inner" style="display: block;">${lineContent}</span>`
        );
      });
      tl = gsap.timeline({
        scrollTrigger: {
          trigger: textEl,
          start: "top bottom",
          end: "bottom bottom",
          toggleActions: "none play none reset"
        }
      });
      tl.fromTo(
        textEl.find(".char"),
        { yPercent: 100 },
        {
          yPercent: 0,
          duration: 1.5,
          ease: "power3.out",
          stagger: 0.02
        }
      );
    }
    splitText();

    let windowWidth = window.innerWidth;
    window.addEventListener("resize", function () {
      if (windowWidth !== window.innerWidth) {
        windowWidth = window.innerWidth;
        tl.kill();
        textEl.text(textContent);
        splitText();
      }
    });
  });
}

textCtaa();

function textPa() {
  $("[js-p-animation]").each(function (index) {
    gsap.set($(this), { autoAlpha: 1 });
    let textEl = $(this);
    let textContent = $(this).text();
    let tl;

    function splitText() {
      new SplitType(textEl, { types: "lines", tagName: "span" });
      textEl.find(".line").each(function (index) {
        let lineContent = $(this).html();
        $(this).html("");
        $(this).append(
          `<span class="line-inner" style="display: block;">${lineContent}</span>`
        );
      });
      tl = gsap.timeline({
        scrollTrigger: {
          trigger: textEl,
          start: "top bottom",
          end: "bottom bottom",
          toggleActions: "none play none reset"
        }
      });
      tl.fromTo(
        textEl.find(".line-inner"),
        { yPercent: 100, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          ease: "power3.out",
          duration: 1.5,
          stagger: 0.1
        }
      );
    }
    splitText();

    let windowWidth = window.innerWidth;
    window.addEventListener("resize", function () {
      if (windowWidth !== window.innerWidth) {
        windowWidth = window.innerWidth;
        tl.kill();
        textEl.text(textContent);
        splitText();
      }
    });
  });
}

textPa();

//color transition
function colorPage() {
  function attr(defaultVal, attrVal) {
    const defaultValType = typeof defaultVal;
    if (typeof attrVal !== "string" || attrVal.trim() === "") return defaultVal;
    if (attrVal === "true" && defaultValType === "boolean") return true;
    if (attrVal === "false" && defaultValType === "boolean") return false;
    if (isNaN(attrVal) && defaultValType === "string") return attrVal;
    if (!isNaN(attrVal) && defaultValType === "number") return +attrVal;
    return defaultVal;
  }
  // pagecolor trigger
  $("[tr-pagecolor-element='trigger']").each(function (index) {
    // elements
    let triggerEl = $(this),
      targetEl = $("body");
    // settings
    let classSetting = attr("mode-2", triggerEl.attr("tr-pagecolor-class"));
    // result
    ScrollTrigger.create({
      trigger: triggerEl,
      start: "top center",
      end: "bottom center",
      onToggle: ({ self, isActive }) => {
        if (isActive) {
          targetEl.addClass(classSetting);
        } else {
          targetEl.removeClass(classSetting);
        }
      }
    });
  });
}
colorPage();

//slider
function sliderLoad() {
  $(".slider-main_component-sl2").each(function (index) {
    let loopMode = true;
    if ($(this).attr("loop-mode") === "true") {
      loopMode = true;
    }
    let sliderDuration = 600;
    if ($(this).attr("slider-duration") !== undefined) {
      sliderDuration = +$(this).attr("slider-duration");
    }
    const swiper = new Swiper($(this).find(".swiper")[0], {
      speed: sliderDuration,
      loop: loopMode,
      autoHeight: false,
      centeredSlides: loopMode,
      followFinger: true,
      freeMode: false,
      slideToClickedSlide: false,
      slidesPerView: 1,

      spaceBetween: "4%",
      rewind: false,
      mousewheel: {
        forceToAxis: true
      },
      keyboard: {
        enabled: true,
        onlyInViewport: true
      },
      breakpoints: {
        // mobile landscape
        480: {
          slidesPerView: 1,
          spaceBetween: "4%"
        },
        // tablet
        768: {
          slidesPerView: 2,
          spaceBetween: "4%"
        },
        // desktop
        992: {
          slidesPerView: 3,
          spaceBetween: "5%"
        }
      },
      pagination: {
        el: $(this).find(".swiper-bullet-wrapper")[0],
        bulletActiveClass: "is-active",
        bulletClass: "swiper-bullet",
        bulletElement: "button",
        clickable: true
      },
      navigation: {
        nextEl: $(this).find(".swiper-next")[0],
        prevEl: $(this).find(".swiper-prev")[0],
        disabledClass: "is-disabled"
      },
      scrollbar: {
        el: $(this).find(".swiper-drag-wrapper")[0],
        draggable: true,
        dragClass: "swiper-drag",
        snapOnRelease: true
      },
      slideActiveClass: "is-active",
      slideDuplicateActiveClass: "is-active"
    });
  });
}
sliderLoad();

// Page Color animation
// PAGE COLOR POWER-UP

// attribute value checker

barba.hooks.enter((data) => {
  console.log("Enter");
});
barba.hooks.after((data) => {
  pageLoad();
  textLa();
  textPa();
  createAnimation();
  sliderLoad();
  colorPage();
  homeMarquee();
  textCtaa();
  imageReveal();
  resetWebflow(data);
  //$(data).removeClass("fixed");
  //$(data).removeClass("fixed");
});
document.addEventListener("DOMContentLoaded", function () {
  // Initialize Barba.js
  barba.init({
    transitions: [
      {
        name: "fade",
        leave: ({ current }) => {
          console.log("leave transition");
          return gsap.to(current.container, {
            opacity: 0,
            duration: 0.5,
            ease: "power2.inOut"
          });
        },
        enter: ({ next }) => {
          console.log("enter transition");
          $(window).scrollTop(0);
          //  $(data.next.container).addClass("fixed");
          return gsap.from(next.container, {
            opacity: 0,
            duration: 0.5,
            ease: "power2.inOut"
          });
        }
      }
    ]
  });
});
