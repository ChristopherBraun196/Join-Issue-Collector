/**
 * Measures the navbar logo position and sets CSS variables for the intro animation target.
 * Temporarily makes the hidden logo visible to read its coordinates via getBoundingClientRect.
 */
function setLogoAnimationTarget() {
  const logo = document.getElementById("navbar-logo");
  if (!logo) return;

  logo.style.visibility = "hidden";
  logo.classList.remove("login__logo--hidden");

  const rect = logo.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  const translateX = centerX - window.innerWidth / 2;
  const translateY = centerY - window.innerHeight / 2;

  document.documentElement.style.setProperty("--logo-x", `${translateX}px`);
  document.documentElement.style.setProperty("--logo-y", `${translateY}px`);

  // Zielgröße des echten Logos übernehmen
  document.documentElement.style.setProperty("--logo-w", `${rect.width}px`);
  document.documentElement.style.setProperty("--logo-h", `${rect.height}px`);

  logo.classList.add("login__logo--hidden");
  logo.style.visibility = "";
}

setLogoAnimationTarget();

/**
 * Registers the animation end event on the logo wrapper element.
 * Hides the wrapper and reveals the nav logo after the animation completes.
 */
function initLogoAnimation() {
  const animatedImgWrapper = document.getElementById("animated-img-wrapper");
  const navLogo = document.getElementById("navbar-logo");
  if (animatedImgWrapper) {
    animatedImgWrapper.addEventListener("animationend", (e) => {
      if (e.target === animatedImgWrapper) {
        animatedImgWrapper.style.display = "none";
        navLogo.classList.remove("login__logo--hidden");
      }
    });
  }
}

initLogoAnimation();
